'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from '../../hooks';
import { RootState } from '../../store';
import { updateSimulationData, updateLocalEnergy, addHistoryPoint, updateRound, updateLastInjectionTime } from './reducer';
import { injectPower } from './actions';
import { encryptData, decryptData } from '../../utils/crypto';
import { addNotification } from '../uiSlice';
import { processingFrequencies, getCBDivisor } from '../../constants/blockchainFrequencies';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'lyncore-default-secret-key-2024';

export const getTargetsForEfficiency = (eff: number, baseHash = 5.0, maxTemp = 80) => {
  const targetHash = baseHash * (eff / 100);

  // Piecewise temperature calculation based on 65°C default healthy temp
  let targetTemp = 65.0;
  if (eff > 80) {
    if (eff <= 90) {
      targetTemp = 65.0 + (eff - 80) * 1.0;
    } else {
      targetTemp = 75.0 + (eff - 90) * 1.08;
    }
  }
  targetTemp = Math.min(maxTemp, targetTemp);

  return { targetTemp, targetHash };
};

export const useLabSimulation = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  // Select only the minimal primitive controls to start/stop the timers.
  // This avoids re-rendering the host component when temperature/efficiency/energy update.
  const isPoweredOn = useAppSelector((state: RootState) => state.reducerLabs.isPoweredOn);
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
  const stressSecondsRef = useRef(0);

  // In-memory accumulator state
  const accumulatorStateRef = useRef({
    energyAccumulated: 0,
    secondsElapsed: 0,
    performanceHistory: [] as number[]
  });

  const randomBoostsRef = useRef({
    tempBoosts: [] as number[]
  });

  // Stores the random Overclock multiplier [1.4, 1.5] generated once per activation
  const overclockMultiplierRef = useRef<number | null>(null);

  // Stores the original base hash rate to prevent recursive decay when the state updates
  const baseHashRateRef = useRef<number | null>(null);

  // Clear accumulator local data on manual power on transition
  useEffect(() => {
    if (!currentLabId) return;
    if (isPoweredOn && prevPoweredOnRef.current === false) {
      accumulatorStateRef.current = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] };
      randomBoostsRef.current = { tempBoosts: [] };
      baseHashRateRef.current = null;
      performanceHistoryRef.current = [];
      dispatch(updateLocalEnergy(0));
      dispatch(updateRound(1));
    }
    prevPoweredOnRef.current = isPoweredOn;
  }, [isPoweredOn, currentLabId, dispatch, store]);

  // Reset when active lab changes (no persistence)
  useEffect(() => {
    accumulatorStateRef.current = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] };
    randomBoostsRef.current = { tempBoosts: [] };
    baseHashRateRef.current = null;
    performanceHistoryRef.current = [];
    dispatch(updateLocalEnergy(0));
    dispatch(updateRound(1));
  }, [currentLabId, dispatch]);

  // 1. Simulation Loop: Handles Global/Slot Temperature, Efficiency, Degradation (every 1000ms)
  useEffect(() => {
    const runSimulation = () => {
      const state = store.getState();
      const lab = state.reducerLabs.currentLab;
      const isPowered = state.reducerLabs.isPoweredOn;
      const isOverclock = state.reducerLabs.isOverclockActive;
      if (!lab) return;

      let globalTemp = lab.temperature !== undefined ? lab.temperature : 0;
      let efficiency = lab.efficiency !== undefined ? lab.efficiency : 0;
      let currentLife = lab.currentLife !== undefined ? lab.currentLife : 100;
      const { hashRate, maxTemperature: globalMaxTemp, slots } = lab;

      // Generate or reuse the Overclock multiplier (random in [1.4, 1.5], stable per session)
      if (isOverclock && overclockMultiplierRef.current === null) {
        overclockMultiplierRef.current = 1.4 + Math.random() * 0.1; // Range [1.4, 1.5]
      } else if (!isOverclock) {
        overclockMultiplierRef.current = null; // Reset when Overclock is turned off
      }

      if (baseHashRateRef.current === null) {
        // Fallback to 10.0 if not provided
        baseHashRateRef.current = hashRate || 10.0;
      }
      const stableBaseHash = baseHashRateRef.current;

      const overclockMult = isOverclock ? (overclockMultiplierRef.current ?? 1.4) : 1.0;
      const baseHash = stableBaseHash * overclockMult;
      let updatedHashRate = baseHash;
      let totalPower = 0;
      let updatedSlots = [...(slots || [])];
      let displayedTemp = globalTemp;
      let displayedEfficiency = efficiency;

      if (isPowered) {
        // Adjust efficiency based on Overclock state
        if (isOverclock) {
          // If Overclock is ON: efficiency rises freely towards 100%. Accelerated x2.
          const effIncrease = (2.0 + Math.random() * 2.0) * 2.0; // Range: 4.0 to 8.0
          efficiency = Math.min(100, efficiency + effIncrease);
        } else {
          // If Overclock is OFF: efficiency returns to standard 80% (3s tick -> ~15.0 or ~3.0 avg)
          if (efficiency < 80) {
            const effIncrease = 12.0 + Math.random() * 6.0; // Range: 12.0 to 18.0
            efficiency = Math.min(80, efficiency + effIncrease);
          } else if (efficiency > 80) {
            const effDecrease = 2.0 + Math.random() * 2.0; // Range: 2.0 to 4.0
            efficiency = Math.max(80, efficiency - effDecrease);
          }
        }

        // Determine step index based on current efficiency
        const currentStep = Math.floor(efficiency / 10);

        // Generate random boosts for newly crossed steps
        while (randomBoostsRef.current.tempBoosts.length < currentStep) {
          const k = randomBoostsRef.current.tempBoosts.length + 1;
          // Temp boost: [k + 2, k + 5] % of globalMaxTemp
          const tempBoostMin = (k + 2) / 100;
          const tempBoostMax = (k + 5) / 100;
          const randomTempBoost = tempBoostMin + Math.random() * (tempBoostMax - tempBoostMin);
          randomBoostsRef.current.tempBoosts.push(randomTempBoost);
        }

        // Calculate dynamic targets
        const startingTemp = state.reducerLabs.startingTemp;
        const baseTemp = startingTemp !== null && startingTemp !== undefined ? startingTemp : 0.0;
        let targetTemp = baseTemp;

        // Apply x2 multiplier to temperature boosts if Overclock is active
        const tempMultiplier = isOverclock ? 2.0 : 1.0;

        // Sum up boosts for completed steps
        for (let i = 0; i < currentStep; i++) {
          targetTemp += globalMaxTemp * randomBoostsRef.current.tempBoosts[i] * tempMultiplier;
        }

        // Interpolate for the remainder of the current step
        const remainder = efficiency % 10;
        if (remainder > 0) {
          const k = currentStep + 1;
          const avgTempBoost = ((k + 2) + (k + 5)) / 200;
          targetTemp += globalMaxTemp * avgTempBoost * (remainder / 10) * tempMultiplier;
        }

        // Unconditional hard clamp: targetTemp must NEVER exceed globalMaxTemp
        targetTemp = Math.min(globalMaxTemp, targetTemp);

        // Strictly proportional hash formula: Hash is % of efficiency applied to stableBaseHash * overclock multiplier
        const targetHash = stableBaseHash * (efficiency / 100) * overclockMult;
        updatedHashRate = targetHash;
        totalPower = targetHash;

        // Simulation for each slot (Dual Thermal Management)
        updatedSlots = updatedSlots.map(slot => {
          let slotTemp = slot.temperature !== undefined ? slot.temperature : 0;
          const increase = (slot.hashRate / 100) * 1.8; // tick increase (3s * 0.6)
          slotTemp = Math.min(slot.maxTemperature, slotTemp + increase);

          totalPower += slot.hashRate;
          return { ...slot, temperature: slotTemp };
        });

        // Heat up or cool down global temperature towards target temperature using floating decimals
        if (!isOverclock) {
          // Safe Mode: stabilize at targetTemp capped at 81.25% of maxTemperature (default: 65°C when max=80)
          const safeTarget = Math.min(globalMaxTemp * 0.8125, targetTemp);
          if (globalTemp < safeTarget) {
            const tempInc = 2.0 + Math.random() * 2.0; // Range: 2.0 to 4.0
            globalTemp = Math.min(safeTarget, globalTemp + tempInc);
          } else if (globalTemp > safeTarget) {
            const tempDec = 2.0 + Math.random() * 2.0; // Range: 2.0 to 4.0
            globalTemp = Math.max(safeTarget, globalTemp - tempDec);
          }
        } else {
          // Overclock Mode: temperature only rises towards targetTemp — it NEVER descends automatically.
          if (globalTemp < targetTemp) {
            const tempInc = 11.0 + Math.random() * 5.0; // Range: 11.0 to 16.0
            globalTemp = Math.min(targetTemp, globalTemp + tempInc);
          }
          // No else: globalTemp > targetTemp stays frozen; micro-fluctuations handle display variation.
        }

        // Apply micro-fluctuations (±2%) to efficiency and temperature when at limits/targets
        // Hard clamping prevents values from ever exceeding absolute business limits.
        displayedTemp = globalTemp;
        // safeTarget: cap at globalMaxTemp unconditionally — targetTemp from boosts must not overflow
        const clampedTarget = Math.min(globalMaxTemp, targetTemp);
        const safeTarget = !isOverclock ? Math.min(globalMaxTemp * 0.8125, clampedTarget) : clampedTarget;
        if (Math.abs(globalTemp - safeTarget) < 1.5) {
          // When at the ceiling, fluctuation is asymmetric: only downward [-0.02, 0]
          // This prevents any upward push that would break the maxTemperature hard limit.
          const atCeiling = safeTarget >= globalMaxTemp - 0.1;
          const tempVariation = atCeiling
            ? -(Math.random() * 0.02)          // Range [-0.02, 0] — downward only
            : (Math.random() * 0.04) - 0.02;   // Range [-0.02, +0.02] — normal
          // Final hard clamp as a safety net
          displayedTemp = Math.min(globalMaxTemp, safeTarget * (1 + tempVariation));
        }

        displayedEfficiency = efficiency;
        const effLimit = !isOverclock ? 80 : 100;
        if (efficiency >= effLimit - 0.5) {
          // Efficiency fluctuation: asymmetric downward at ceiling to avoid exceeding 100%
          const atEffCeiling = effLimit >= 100;
          const effVariation = atEffCeiling
            ? -(Math.random() * 0.02)          // Range [-0.02, 0] — downward only at 100%
            : (Math.random() * 0.04) - 0.02;   // Range [-0.02, +0.02] — normal
          // Final hard clamp as a safety net
          displayedEfficiency = Math.min(100, effLimit * (1 + effVariation));
        }

        // Redefined degradation of Vida Útil (health)
        // 1. Passive Constant degradation: 0.093 points per minute (0.00155 per second) => 0.00465 per 3s
        currentLife = Math.max(0, currentLife - 0.00465);

        // 2. Thermal Penalty degradation: 0.13 points every 30 seconds when displayedTemp >= 70°C
        if (displayedTemp >= 70.0) {
          stressSecondsRef.current += 3; // 3s tick
          if (stressSecondsRef.current >= 30) {
            currentLife = Math.max(0, currentLife - 0.13);
            stressSecondsRef.current -= 30;
          }
        } else {
          stressSecondsRef.current = 0;
        }

        // Efficiency degradation based on dynamic maxTemperature thresholds
        const alertThreshold = globalMaxTemp * 0.90;
        if (globalTemp >= globalMaxTemp) {
          efficiency = Math.max(0, parseFloat((efficiency - 0.1335).toFixed(4))); // 3s tick
        } else if (globalTemp > alertThreshold) {
          efficiency = Math.max(0, parseFloat((efficiency - 0.0665).toFixed(4))); // 3s tick
        }
      } else {
        // Off logic: efficiency drops to 0 instantly
        efficiency = 0;
        updatedHashRate = 0.0;
        stressSecondsRef.current = 0;

        // Clear random boosts when turned off
        randomBoostsRef.current = { tempBoosts: [] };

        // Dissipation: cools down by a random float between 3 and 5 points per tick (3s)
        const cooldownAmount = 3.0 + Math.random() * 2.0;
        globalTemp = Math.max(0, globalTemp - cooldownAmount);

        updatedSlots = updatedSlots.map(slot => {
          let slotTemp = slot.temperature !== undefined ? slot.temperature : 0;
          slotTemp = Math.max(0, slotTemp - cooldownAmount); // slot cools down at the same rate
          return { ...slot, temperature: slotTemp };
        });

        // Set display variables for OFF state
        displayedTemp = globalTemp;
        displayedEfficiency = efficiency;
      }

      // No auto-shutdown on overheating. The user is solely responsible for managing thermal stress.

      if (typeof window !== 'undefined') {
        // localStorage.setItem('lab_current_temperature', displayedTemp.toFixed(4));
        localStorage.setItem('lab_current_life', currentLife.toFixed(4));
      }

      dispatch(updateSimulationData({
        temperature: Number(displayedTemp.toFixed(4)),
        efficiency: Number(displayedEfficiency.toFixed(4)),
        currentLife: Number(currentLife.toFixed(4)),
        hashRate: Number(updatedHashRate.toFixed(4)),
        networkHash: Number(updatedHashRate.toFixed(4)),
        slots: updatedSlots
      }));

      // Paint dynamically to real-time performance monitor chart
      const labFrequency = lab.slots && lab.slots.length > 0
        ? lab.slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
        : processingFrequencies.MEGA_CB;

      const currentPower = isPowered ? (totalPower * labFrequency) * (1 - Math.random() * 0.15) : 0;
      dispatch(addHistoryPoint({
        timestamp: Date.now(),
        temperature: Number(globalTemp.toFixed(2)),
        power: Number(currentPower.toFixed(3))
      }));
    };

    simulationRef.current = setInterval(runSimulation, 3000);
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    };
  }, [isPoweredOn, hasLab]); // Restarts only when powered status changes


  // 3. Accumulator Loop: Every 5 seconds
  useEffect(() => {
    if (!isPoweredOn || !hasLab) {
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
      if (!isPowered || !lab) return;

      // Prevent accumulation if injection is in progress
      if (isInjectingRef.current) return;

      const localData = accumulatorStateRef.current;

      const hashRate = lab.hashRate || 0;
      const slots = lab.slots || [];
      const labFrequency = slots.length > 0
        ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
        : processingFrequencies.MEGA_CB;
      const totalPowerVal = hashRate * labFrequency;

      // Stochastic performance cycle calculation scaled by frequency multiplier
      const cyclePerformance = totalPowerVal * (1 - Math.random() * 0.15);
      const cyclePerformanceRounded = Number(cyclePerformance.toFixed(3));

      // Append to local array
      const performanceHistory = [...localData.performanceHistory, cyclePerformanceRounded];
      performanceHistoryRef.current = performanceHistory;

      // Update in-memory accumulator state
      const energyAccumulated = Number(performanceHistory.reduce((acc, val) => acc + val, 0).toFixed(3));
      const secondsElapsed = localData.secondsElapsed + 5;

      accumulatorStateRef.current = {
        energyAccumulated,
        secondsElapsed,
        performanceHistory
      };

      // Update Redux UI state
      dispatch(updateLocalEnergy(energyAccumulated));
      dispatch(updateRound(Math.min(10, Math.floor(secondsElapsed / 30) + 1)));
    };

    accumulatorRef.current = setInterval(runAccumulation, 5000);
    return () => {
      if (accumulatorRef.current) {
        clearInterval(accumulatorRef.current);
        accumulatorRef.current = null;
      }
    };
  }, [isPoweredOn, hasLab]); // Restarts only when powered status changes

  // 4. Injection Trigger: Isolated clock checks elapsed time and triggers injection strictly at 300s
  useEffect(() => {
    if (!isPoweredOn || !hasLab) {
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
      const network = state.blockchain.selectedNetwork;
      if (!isPowered || !lab) return;

      if (isInjectingRef.current) return;

      const localData = accumulatorStateRef.current;

      if (localData.secondsElapsed >= 300) {
        isInjectingRef.current = true;
        const blockchainId = network?.id || 'mainnet';

        // Hash to send is the exact neta sum of the local performance history, scaled to match the UI visual unit
        const rawHash = localData.performanceHistory.reduce((acc, val) => acc + val, 0);
        const divisor = getCBDivisor(rawHash);
        const hashToSend = rawHash / divisor;

        try {
          const result = await dispatch(injectPower({
            labId: lab.id,
            blockchainId,
            hashAmount: Number(hashToSend.toFixed(3)),
            currentLife: Math.round(lab.currentLife !== undefined ? lab.currentLife : 100)
          }));

          if (injectPower.fulfilled.match(result)) {
            // SUCCESS: Reset local state
            accumulatorStateRef.current = { energyAccumulated: 0, secondsElapsed: 0, performanceHistory: [] };
            performanceHistoryRef.current = [];
            dispatch(updateSimulationData({ efficiency: 100 }));
            dispatch(updateLastInjectionTime(Date.now()));
            dispatch(addNotification({
              message: '¡Inyección de hash realizada con éxito!',
              type: 'success',
              duration: 5000
            }));
          } else {
            console.error("[SIMULATION] Injection Rejected", result.payload);
            // Reset elapsed seconds on rejection to prevent flooding the backend every 5 seconds
            accumulatorStateRef.current.secondsElapsed = 0;
            dispatch(addNotification({
              message: (result.payload as string) || 'Error al inyectar hash (Rechazado)',
              type: 'error',
              duration: 5000
            }));
          }
        } catch (err) {
          console.error("[SIMULATION] Hash injection exception", err);
          // Reset elapsed seconds on error to prevent flooding the backend
          accumulatorStateRef.current.secondsElapsed = 0;
          const errMsg = err instanceof Error ? err.message : 'Error de red inesperado al inyectar hash';
          dispatch(addNotification({
            message: errMsg,
            type: 'error',
            duration: 5000
          }));
        }

        // Save reset/updated state and release injection lock
        try {
          dispatch(updateLocalEnergy(accumulatorStateRef.current.energyAccumulated));
          dispatch(updateRound(1));
        } catch (saveErr) {
          console.error("[SIMULATION] Failed to save reset state", saveErr);
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
  }, [isPoweredOn, hasLab]); // Restarts only when powered status changes
};
