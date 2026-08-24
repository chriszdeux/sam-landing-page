"use client";

import { motion } from "framer-motion";
import { Power, Zap } from "lucide-react";

const MIN_INJECT_EP = 12;
import { MiningBackground } from "./MiningBackground";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { formatHash } from "../../lib/utils/formatHash";
import { LaboratorioInventory } from "./LaboratorioInventory";
import { CoreModulesSimulator } from "../core_modules/CoreModulesSimulator";
import { LaboratorySimulation } from "./LaboratorySimulation";
import { useEffect, useState } from "react";
import { RootState } from "../../lib/store";
import { fetchLaboratoryInterface } from "../../lib/features/labs/actions";
import { getCBUnit, processingFrequencies } from "../../lib/constants/blockchainFrequencies";
import { Typography } from "../ui/Typography";

export function LaboratorioView() {
  const dispatch = useAppDispatch();
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const { currentLab, isPoweredOn, isOverheated } = useAppSelector((state: RootState) => state.reducerLabs);
  const chronoBurstFreqTypes = useAppSelector((state: RootState) => state.blockchain.chronoBurstFreqTypes);

  const [isInitializing, setIsInitializing] = useState(true);

  const hasLab = !!userInfo?.idLab;
  const labId = userInfo?.idLab;

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      setIsInitializing(false);
    }
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (hasLab && labId && !currentLab) {
      dispatch(fetchLaboratoryInterface(labId));
    }
  }, [hasLab, labId, currentLab]);

  const currentEnergyVal = currentLab?.energy || 0;
  const currentEnergy = currentEnergyVal.toFixed(3);
  const canInject = currentEnergyVal >= MIN_INJECT_EP;

  const slots = currentLab?.slots || [];
  const labFrequency = slots.length > 0
    ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
    : processingFrequencies.MEGA_CB;
  const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
  const totalPower = (currentLab?.hashRate || 0) * frequencyMultiplier;
  const labUnit = getCBUnit(labFrequency);

  if (status === 'loading' || isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0c10]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#00f3ff]" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0a0c10] pt-24">
        <MiningBackground />
        <div className="relative z-[1] rounded-2xl border border-[#ff0055] bg-[rgba(10,12,16,0.8)] p-12 text-center shadow-[0_0_30px_rgba(255,0,85,0.2)] backdrop-blur-md">
          <Power size={60} className="mx-auto mb-4 text-[#ff0055]" />
          <Typography variant="h4" className="mb-2 font-bold text-white">
            ACCESO DENEGADO
          </Typography>
          <Typography variant="h6" className="text-white/60">
            Inicia sesión para acceder al Laboratorio.
          </Typography>
        </div>
      </div>
    );
  }

  if (!hasLab) return <LaboratorioRegistration userInfo={userInfo} />;

  return (
    <div className="relative mx-auto min-h-screen max-w-[1600px] px-4 pb-12 pt-32 sm:px-6 lg:px-8">
      <MiningBackground />

      <div className="flex flex-col gap-6">
        {/* Network Power Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div
            className="flex items-center justify-between rounded-xl p-4 px-6 backdrop-blur-md"
            style={{
              backgroundColor: isOverheated ? 'rgba(255, 23, 68, 0.05)' : 'rgba(0, 243, 255, 0.05)',
              border: `1px solid ${isOverheated ? 'rgba(255, 23, 68, 0.3)' : 'rgba(0, 243, 255, 0.3)'}`,
              boxShadow: isOverheated ? '0 0 20px rgba(255, 23, 68, 0.1)' : '0 0 20px rgba(0, 243, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-4">
              <Zap size={30} style={{ color: isOverheated ? '#ff1744' : '#00f3ff' }} />
              <div>
                <Typography variant="overline" component="p" className="block font-bold leading-none" style={{ color: isOverheated ? '#ff1744' : '#00f3ff' }}>
                  {isOverheated ? 'SYSTEM OVERHEATED - EMERGENCY COOLDOWN' : 'LYNCORE NETWORK ACTIVE'}
                </Typography>
                <Typography variant="h6" component="p" className="font-mono text-white">
                  Poder Total: <span style={{ color: isOverheated ? '#ff1744' : '#00f3ff' }}>{isPoweredOn ? totalPower.toFixed(1) : '0.0'} {labUnit}</span>
                </Typography>
                <Typography variant="body2" component="p" className="text-white/70">
                  Hash Acumulado: {formatHash(currentEnergyVal, chronoBurstFreqTypes)}
                </Typography>
              </div>
            </div>

            <div className="text-right">
                <Typography variant="caption" component="p" className="block text-white/40">
                    ESTADO DE SIMULACIÓN
                </Typography>
                <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold text-black"
                    style={{ backgroundColor: isOverheated ? '#ff1744' : isPoweredOn ? '#00e676' : 'rgba(255,255,255,0.1)' }}
                >
                    {isOverheated ? "BLOQUEADO" : isPoweredOn ? "EJECUTANDO" : "STANDBY"}
                </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LaboratorySimulation />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CoreModulesSimulator />
        </motion.div>

        <LaboratorioInventory />
      </div>
    </div>
  );
}
