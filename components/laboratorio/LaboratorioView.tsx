"use client";

import { motion } from "framer-motion";
import { Box, Paper, CircularProgress, Typography, Button, Tooltip, Chip } from "@mui/material";
import { PowerSettingsNew, Bolt, WarningAmber } from "@mui/icons-material";

const MIN_INJECT_EP = 12; 
import { MiningBackground } from "./MiningBackground";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { formatHash } from "../../lib/utils/formatHash";
import { LaboratorioInventory } from "./LaboratorioInventory";
import { CoreModulesSimulator } from "../core_modules/CoreModulesSimulator";
import { useEffect, useState } from "react";
import { RootState } from "../../lib/store";
import { fetchLaboratoryInterface } from "../../lib/features/labs/actions";
import { getCBUnit, processingFrequencies } from "../../lib/constants/blockchainFrequencies";

export function LaboratorioView() {
  const dispatch = useAppDispatch();
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const { currentLab, isPoweredOn, isOverheated } = useAppSelector((state: RootState) => state.reducerLabs);
  const chronoBurstFreqTypes = useAppSelector((state: RootState) => state.blockchain.chronoBurstFreqTypes);
  
  const [isInitializing, setIsInitializing] = useState(true);

  const hasLab = userInfo?.idLabs && userInfo.idLabs.length > 0;
  const labId = userInfo?.idLabs?.[0];

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
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0c10' }}>
        <CircularProgress sx={{ color: '#00f3ff' }} />
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box sx={{ minHeight: '100vh', pt: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0c10', position: 'relative' }}>
        <MiningBackground />
        <Paper
          elevation={0}
          sx={{
            p: 6,
            bgcolor: 'rgba(10,12,16,0.8)',
            border: '1px solid #ff0055',
            textAlign: 'center',
            zIndex: 1,
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 0 30px rgba(255, 0, 85, 0.2)'
          }}
        >
          <PowerSettingsNew sx={{ fontSize: 60, color: '#ff0055', mb: 2 }} />
          <Typography
            variant="h4"
            sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
          >
            ACCESO DENEGADO
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Inicia sesión para acceder al Laboratorio.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!hasLab) return <LaboratorioRegistration userInfo={userInfo} />;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 15,
        pb: 6,
        px: { xs: 2, sm: 3, lg: 4 },
        maxWidth: 1600,
        mx: 'auto',
        position: 'relative'
      }}
    >
      <MiningBackground />

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Network Power Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2, px: 3,
              bgcolor: isOverheated ? 'rgba(255, 23, 68, 0.05)' : 'rgba(0, 243, 255, 0.05)',
              border: `1px solid ${isOverheated ? 'rgba(255, 23, 68, 0.3)' : 'rgba(0, 243, 255, 0.3)'}`,
              borderRadius: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: isOverheated ? '0 0 20px rgba(255, 23, 68, 0.1)' : '0 0 20px rgba(0, 243, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Bolt sx={{ color: isOverheated ? '#ff1744' : '#00f3ff', fontSize: 30 }} />
              <Box>
                <Typography variant="overline" sx={{ color: isOverheated ? '#ff1744' : '#00f3ff', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>
                  {isOverheated ? 'SYSTEM OVERHEATED - EMERGENCY COOLDOWN' : 'LYNCORE NETWORK ACTIVE'}
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', fontFamily: 'monospace' }}>
                  Poder Total: <span style={{ color: isOverheated ? '#ff1744' : '#00f3ff' }}>{isPoweredOn ? totalPower.toFixed(1) : '0.0'} {labUnit}</span>
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Hash Acumulado: {formatHash(currentEnergyVal, chronoBurstFreqTypes)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                    ESTADO DE SIMULACIÓN
                </Typography>
                <Chip 
                    label={isOverheated ? "BLOQUEADO" : isPoweredOn ? "EJECUTANDO" : "STANDBY"} 
                    size="small"
                    sx={{ 
                        bgcolor: isOverheated ? '#ff1744' : isPoweredOn ? '#00e676' : 'rgba(255,255,255,0.1)',
                        color: '#000',
                        fontWeight: 'bold'
                    }}
                />
            </Box>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CoreModulesSimulator />
        </motion.div>

        <LaboratorioInventory />
      </Box>
    </Box>
  );
}
