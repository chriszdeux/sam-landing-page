'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from '../../hooks';
import { RootState } from '../../store';
import { updateSimulationData, setCooldownState, updateLocalEnergy, addHistoryPoint, updateRound, updateLastInjectionTime } from './reducer';
import { injectPower } from './actions';
import { encryptData, decryptData } from '../../utils/crypto';
import { addNotification } from '../uiSlice';
import { processingFrequencies } from '../../constants/blockchainFrequencies';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'lyncore-default-secret-key-2024';

export const useLabSimulation = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  // Select only the minimal primitive controls to start/stop the timers.
  // This avoids re-rendering the host component when temperature/efficiency/energy update.
  const isPoweredOn = useAppSelector((state: RootState) => state.reducerLabs.isPoweredOn);
  const isOverheated = useAppSelector((state: RootState) => state.reducerLabs.isOverheated);
  const hasLab = useAppSelector((state: RootState) => !!state.reducerLabs.currentLab);
  
  // Track active lab ID to isolate storage key
  const currentLabId = useAppSelector((state: RootState) => state.reducerLabs.currentLab?.id || null);
  
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatorRef = useRef<NodeJS.Timeout | null>(null);
  const injectionRef = useRef<NodeJS.Timeout | null>(null);
  const efficiencyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInjectingRef = useRef(false);
  const performanceHistoryRef = useRef<number[]>([]);
  const prevPoweredOnRef = useRef<boolean | null>(null);

  // Clear accumulator local data on manual power on transition
  useEffect(() => {
    if (!currentLabId) return;
    if (isPoweredOn && prevPoweredOnRef.current === false) {
      const clearAccumulator = async () => {
        const localData = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] as number[] };
        const key = `lyncore_lab_accumulator_${currentLabId}`;
        const encrypted = await encryptData(localData, SECRET_KEY);
        localStorage.setItem(key, encrypted);
        performanceHistoryRef.current = [];
        dispatch(updateLocalEnergy(0));
        dispatch(updateRound(1));
      };
      clearAccumulator();
    }
    prevPoweredOnRef.current = isPoweredOn;
  }, [isPoweredOn, currentLabId, dispatch]);

  // Load saved history when active lab changes
  useEffect(() => {
    if (!currentLabId) return;
    const loadSavedHistory = async () => {
      const key = `lyncore_lab_accumulator_${currentLabId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const decrypted = await decryptData(stored, SECRET_KEY);
          if (decrypted && Array.isArray(decrypted.performanceHistory)) {
            performanceHistoryRef.current = decrypted.performanceHistory;
            dispatch(updateLocalEnergy(decrypted.energyAccumulated || 0));
            dispatch(updateRound(Math.min(10, Math.floor((decrypted.secondsElapsed || 0) / 30) + 1)));
            return;
          }
        } catch (e) {
          console.warn(`[SIMULATION] Could not decrypt saved history for lab ${currentLabId}`, e);
        }
      }
      // Reset if no saved history exists
      performanceHistoryRef.current = [];
      dispatch(updateLocalEnergy(0));
      dispatch(updateRound(1));
    };
    loadSavedHistory();
  }, [currentLabId, dispatch]);

  // 1. Simulation Loop: Handles Global/Slot Temperature, Efficiency, Degradation (every 870ms - 15% faster)
  useEffect(() => {
    const runSimulation = () => {
      const state = store.getState();
      const lab = state.reducerLabs.currentLab;
      const isPowered = state.reducerLabs.isPoweredOn;
      const isOver = state.reducerLabs.isOverheated;
      const isOverclock = state.reducerLabs.isOverclockActive;
      if (!lab) return;

      let globalTemp = lab.temperature !== undefined ? lab.temperature : 0;
      let efficiency = lab.efficiency !== undefined ? lab.efficiency : 0;
      let currentLife = lab.currentLife !== undefined ? lab.currentLife : 100;
      const { hashRate, maxTemperature: globalMaxTemp, slots } = lab;
      
      let totalPower = isPowered && !isOver ? hashRate : 0;
      let updatedSlots = [...(slots || [])];
      let anySlotOverheated = false;

      if (isPowered && !isOver) {
        // Simulation for each slot (Dual Thermal Management)
        updatedSlots = updatedSlots.map(slot => {
            let slotTemp = slot.temperature !== undefined ? slot.temperature : 0;
            const increase = (slot.hashRate / 100) * 0.6; // tick increase
            slotTemp = Math.min(slot.maxTemperature, slotTemp + increase);
            
            if (slotTemp >= slot.maxTemperature) anySlotOverheated = true;
            
            totalPower += slot.hashRate;
            return { ...slot, temperature: slotTemp };
        });

        // 15% speedup runs tick every 870ms. Overclock heats 3x faster.
        let globalIncrease = (totalPower / 100) * 0.25;
        if (isOverclock) {
          globalIncrease *= 3;
        }
        globalTemp = Math.min(globalMaxTemp, globalTemp + globalIncrease);

        // Keep current efficiency (managed by the progressive efficiency loop)
        efficiency = lab.efficiency !== undefined ? lab.efficiency : 0;
      } else {
        // Off or Overheated logic: inertia loss
        efficiency = Math.max(0, efficiency - 2.5); // tick decrease
        
        // Dissipation progressively by gradient until reaching natural ambient 0°C
        const coolingRate = 0.8; // 0.8°C per tick
        globalTemp = Math.max(0, globalTemp - coolingRate);
        
        updatedSlots = updatedSlots.map(slot => {
            let slotTemp = slot.temperature !== undefined ? slot.temperature : 0;
            slotTemp = Math.max(0, slotTemp - 1.2); // slot cools down at 1.2°C per tick
            return { ...slot, temperature: slotTemp };
        });
      }

      // Degradation logic: if temp crosses 80°C, apply 1.0% degradation per tick
      if (globalTemp >= 80) {
        currentLife = Math.max(0, parseFloat((currentLife - 1.0).toFixed(2)));
      }

      // Handle Overheating and Cooldown Release
      if ((globalTemp >= globalMaxTemp || anySlotOverheated) && isPowered && !isOver) {
        dispatch(setCooldownState(true));
      } else if (isOver && globalTemp <= 40 && !updatedSlots.some(s => s.temperature > 40)) {
        dispatch(setCooldownState(false));
      }

      dispatch(updateSimulationData({ 
        temperature: globalTemp, 
        efficiency, 
        currentLife,
        slots: updatedSlots 
      }));
    };

    simulationRef.current = setInterval(runSimulation, 870);
    return () => {
      if (simulationRef.current) {
          clearInterval(simulationRef.current);
          simulationRef.current = null;
      }
    };
  }, [isPoweredOn, isOverheated, hasLab]); // Restarts only when powered status changes

  // 2. Loop de Escalado de Eficiencia Progresiva: Cada 2.4 a 4 Segundos (25% más rápido)
  useEffect(() => {
    if (!isPoweredOn || isOverheated || !hasLab) {
      if (efficiencyTimerRef.current) {
        clearTimeout(efficiencyTimerRef.current);
        efficiencyTimerRef.current = null;
      }
      return;
    }

    const runEfficiencyTick = () => {
      const state = store.getState();
      const lab = state.reducerLabs.currentLab;
      const isPowered = state.reducerLabs.isPoweredOn;
      const isOver = state.reducerLabs.isOverheated;
      const isOverclock = state.reducerLabs.isOverclockActive;
      if (!lab || !isPowered || isOver) return;

      const globalTemp = lab.temperature !== undefined ? lab.temperature : 0;
      const maxTemp = lab.maxTemperature || 80;
      const currentEff = lab.efficiency !== undefined ? lab.efficiency : 0;
      const change = Math.random() * 3 + 1; // +1% to +4%

      let newEfficiency = currentEff;
      const maxAllowedEff = isOverclock ? 100 : 90;

      if (currentEff > maxAllowedEff) {
        newEfficiency = maxAllowedEff;
      } else if (globalTemp >= maxTemp * 0.70) {
        newEfficiency = Math.max(10, currentEff - change);
      } else {
        newEfficiency = Math.min(maxAllowedEff, currentEff + change);
      }

      dispatch(updateSimulationData({ efficiency: newEfficiency }));

      // Planificar el siguiente tick estocásticamente (25% más rápido)
      const nextDelay = (Math.random() * 2000 + 3000) / 1.25;
      efficiencyTimerRef.current = setTimeout(runEfficiencyTick, nextDelay);
    };

    const firstDelay = (Math.random() * 2000 + 3000) / 1.25;
    efficiencyTimerRef.current = setTimeout(runEfficiencyTick, firstDelay);

    return () => {
      if (efficiencyTimerRef.current) {
        clearTimeout(efficiencyTimerRef.current);
        efficiencyTimerRef.current = null;
      }
    };
  }, [isPoweredOn, isOverheated, hasLab]); // Restarts only when powered status changes

  // 3. Accumulator Loop: Every 5 seconds
  useEffect(() => {
    if (!isPoweredOn || isOverheated || !hasLab) {
      if (accumulatorRef.current) {
          clearInterval(accumulatorRef.current);
          accumulatorRef.current = null;
      }
      return;
    }

    const runAccumulation = async () => {
      const state = store.getState();
      const lab = state.reducerLabs.currentLab;
      const isPowered = state.reducerLabs.isPoweredOn;
      const isOver = state.reducerLabs.isOverheated;
      if (!isPowered || isOver || !lab) return;

      // Prevent accumulation if injection is in progress
      if (isInjectingRef.current) return;

      const key = `lyncore_lab_accumulator_${lab.id}`;
      let localData = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] as number[] };
      const stored = localStorage.getItem(key);
      
      if (stored) {
        try {
          const decrypted = await decryptData(stored, SECRET_KEY);
          localData = {
            energyAccumulated: decrypted.energyAccumulated || 0,
            secondsElapsed: decrypted.secondsElapsed !== undefined ? decrypted.secondsElapsed : 0,
            performanceHistory: decrypted.performanceHistory || []
          };
        } catch {
          localData = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] };
          localStorage.removeItem(key);
        }
      }

      const hashRate = lab.hashRate || 0;
      const slots = lab.slots || [];
      const labFrequency = slots.length > 0
        ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
        : processingFrequencies.MEGA_CB;
      const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
      const totalPowerVal = hashRate * frequencyMultiplier;
      
      // Stochastic performance cycle calculation scaled by frequency multiplier
      const cyclePerformance = totalPowerVal * (1 - Math.random() * 0.15);
      const cyclePerformanceRounded = Number(cyclePerformance.toFixed(3));

      // Append to local array
      const performanceHistory = [...localData.performanceHistory, cyclePerformanceRounded];
      localData.performanceHistory = performanceHistory;
      performanceHistoryRef.current = performanceHistory;

      // Set accumulated sum neta
      localData.energyAccumulated = Number(performanceHistory.reduce((acc, val) => acc + val, 0).toFixed(3));
      localData.secondsElapsed += 5; // exact 5s increment

      // Save encrypted state
      const encrypted = await encryptData(localData, SECRET_KEY);
      localStorage.setItem(key, encrypted);
      
      // Update Redux UI state
      dispatch(updateLocalEnergy(localData.energyAccumulated));
      dispatch(updateRound(Math.min(10, Math.floor(localData.secondsElapsed / 30) + 1)));

      // Paint dynamically to real-time performance monitor chart
      dispatch(addHistoryPoint({
        timestamp: Date.now(),
        temperature: lab.temperature || 0,
        power: cyclePerformanceRounded
      }));
    };

    accumulatorRef.current = setInterval(runAccumulation, 5000);
    return () => {
      if (accumulatorRef.current) {
          clearInterval(accumulatorRef.current);
          accumulatorRef.current = null;
      }
    };
  }, [isPoweredOn, isOverheated, hasLab]); // Restarts only when powered status changes

  // 4. Injection Trigger: Isolated clock checks elapsed time and triggers injection strictly at 300s
  useEffect(() => {
    if (!isPoweredOn || isOverheated || !hasLab) {
      if (injectionRef.current) {
          clearInterval(injectionRef.current);
          injectionRef.current = null;
      }
      return;
    }

    const runInjectionCheck = async () => {
      const state = store.getState();
      const lab = state.reducerLabs.currentLab;
      const isPowered = state.reducerLabs.isPoweredOn;
      const isOver = state.reducerLabs.isOverheated;
      const network = state.blockchain.selectedNetwork;
      if (!isPowered || isOver || !lab) return;

      if (isInjectingRef.current) return;

      const key = `lyncore_lab_accumulator_${lab.id}`;
      let localData = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] as number[] };
      const stored = localStorage.getItem(key);
      
      if (stored) {
        try {
          const decrypted = await decryptData(stored, SECRET_KEY);
          localData = {
            energyAccumulated: decrypted.energyAccumulated || 0,
            secondsElapsed: decrypted.secondsElapsed || 0,
            performanceHistory: decrypted.performanceHistory || []
          };
        } catch {
          return;
        }
      }

      if (localData.secondsElapsed >= 300) {
        isInjectingRef.current = true;
        const blockchainId = network?.id || 'mainnet';
        
        // Hash to send is the exact neta sum of the local performance history
        const hashToSend = localData.performanceHistory.reduce((acc, val) => acc + val, 0);

        try {
          console.log(`[SIMULATION] Triggering Minute 5 Injection: ${hashToSend.toFixed(3)} HASH`);
          const result = await dispatch(injectPower({ 
            labId: lab.id, 
            blockchainId, 
            hashAmount: Number(hashToSend.toFixed(3)) 
          }));
          
          if (injectPower.fulfilled.match(result)) {
            // SUCCESS: Reset local state
            localData = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] };
            performanceHistoryRef.current = [];
            dispatch(updateSimulationData({ efficiency: 100 }));
            dispatch(updateLastInjectionTime(Date.now()));
            console.log("[SIMULATION] Injection Successful. Local state reset and efficiency preserved at top.");
            dispatch(addNotification({
              message: '¡Inyección de hash realizada con éxito!',
              type: 'success',
              duration: 5000
            }));
          } else {
            console.error("[SIMULATION] Injection Rejected", result.payload);
            // Reset elapsed seconds on rejection to prevent flooding the backend every 5 seconds
            localData.secondsElapsed = 0;
            dispatch(addNotification({
              message: (result.payload as string) || 'Error al inyectar hash (Rechazado)',
              type: 'error',
              duration: 5000
            }));
          }
        } catch (err) {
          console.error("[SIMULATION] Hash injection exception", err);
          // Reset elapsed seconds on error to prevent flooding the backend
          localData.secondsElapsed = 0;
          const errMsg = err instanceof Error ? err.message : 'Error de red inesperado al inyectar hash';
          dispatch(addNotification({
            message: errMsg,
            type: 'error',
            duration: 5000
          }));
        }

        // Save reset/updated state and release injection lock only after it is saved
        try {
          const encrypted = await encryptData(localData, SECRET_KEY);
          localStorage.setItem(key, encrypted);
          dispatch(updateLocalEnergy(localData.energyAccumulated));
          dispatch(updateRound(1));
        } catch (saveErr) {
          console.error("[SIMULATION] Failed to save reset state to localStorage", saveErr);
        } finally {
          isInjectingRef.current = false;
        }
      }
    };

    injectionRef.current = setInterval(runInjectionCheck, 5000);
    return () => {
      if (injectionRef.current) {
          clearInterval(injectionRef.current);
          injectionRef.current = null;
      }
    };
  }, [isPoweredOn, isOverheated, hasLab]); // Restarts only when powered status changes
};
