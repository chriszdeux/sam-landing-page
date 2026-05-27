"use client";

import { motion } from "framer-motion";
import { Box, Paper, CircularProgress, Typography, Button, Chip, Tooltip } from "@mui/material";
import { PowerSettingsNew, Bolt, WarningAmber } from "@mui/icons-material";

const MIN_INJECT_EP = 12; // powerRequired mínimo para que flushTransactionsQueue procese
import { MiningBackground } from "./MiningBackground";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { updateNetworkPower } from "../../lib/features/blockchain/reducer";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { LaboratorioInventory } from "./LaboratorioInventory";
import { CoreModulesSimulator } from "../core_modules/CoreModulesSimulator";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface LabBasicData {
  id: string;
  type?: string;
  powerMining?: number;
  energy?: number;
  maxEnergy?: number;
}

export function LaboratorioView() {
  const dispatch = useAppDispatch();
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const selectedNetwork = useAppSelector((state: any) => state.blockchain?.selectedNetwork);
  const [labData, setLabData] = useState<LabBasicData | null>(null);
  const [injecting, setInjecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const hasLab = userInfo?.idLabs && userInfo.idLabs.length > 0;
  const labId = userInfo?.idLabs?.[0];

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      setIsInitializing(false);
    }
    // Fail-safe timeout in case status stays idle for some reason
    const timer = setTimeout(() => setIsInitializing(false), 1);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (hasLab && labId) {
      api.get(`/labs/${labId}`)
        .then((res) => {
          const data = res.data.laboratory || res.data;
          setLabData({
            id: data.id,
            type: data.type || 'MINING', // Default to MINING for prototype if missing
            powerMining: data.powerMining || 1500,
            energy: data.energy || 0,
            maxEnergy: data.maxEnergy || 100
          });
        })
        .catch(() => {
          // Fallback mock for UI visualization if backend is offline or unlinked
          setLabData({ id: labId, type: 'MINING', powerMining: 5000, energy: 0, maxEnergy: 100 });
        });
    }
  }, [hasLab, labId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLabData(prev => {
        if (!prev) return prev;
        const currentEnergy = prev.energy || 0;
        const maxEnergy = prev.maxEnergy || 100;
        if (currentEnergy >= maxEnergy) {
          return prev;
        }
        return { ...prev, energy: currentEnergy + 1 };
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const currentEnergy = Math.floor(labData?.energy || 0);
  const canInject = currentEnergy >= MIN_INJECT_EP;

  const handleInjectPower = async () => {
    if (!labData || !selectedNetwork || !canInject) return;
    setInjecting(true);
    try {
      const res = await api.post(`/labs/${labData.id}/inject-power`, {
        blockchainId: selectedNetwork.id,
        energyAmount: currentEnergy
      });
      if (res.data?.labState) {
        setLabData(prev => prev ? { ...prev, energy: res.data.labState.energy } : prev);
      }
      const newPower = res.data?.totalPowerMining ?? res.data?.labState?.totalPowerMining ?? 0 ?? res.data?.networkPower ?? res.data?.data?.totalPowerMining;
      if (newPower !== undefined && newPower !== null) {
          dispatch(updateNetworkPower({ id: selectedNetwork.id, totalPowerMining: Number(newPower) }));
      }
    } catch (error) {
      console.error('Failed to inject power', error);
    } finally {
      setInjecting(false);
    }
  };

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
        {/* Helios-1 Mining Power UI */}
        {labData?.type === 'MINING' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2, px: 3,
                bgcolor: 'rgba(255, 215, 0, 0.05)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Bolt sx={{ color: '#ffd700', fontSize: 30 }} />
                <Box>
                  <Typography variant="overline" sx={{ color: '#ffd700', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>
                    HELIOS-1 NETWORK
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontFamily: 'monospace' }}>
                    Poder de Minado (n): <span style={{ color: '#ffd700' }}>{labData.powerMining}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Energía: {currentEnergy} / {labData.maxEnergy || 100} EP
                  </Typography>
                  {!canInject && (
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <WarningAmber sx={{ fontSize: 14, color: '#ff9800' }} />
                      <Typography variant="caption" sx={{ color: '#ff9800' }}>
                        Mínimo {MIN_INJECT_EP} EP para confirmar transacciones
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Tooltip title={!canInject ? `Necesitas al menos ${MIN_INJECT_EP} EP para procesar transacciones` : ''} arrow>
                <span>
                  <Button
                    variant="outlined"
                    disabled={injecting || !canInject}
                    onClick={handleInjectPower}
                    sx={{
                      color: canInject ? '#ffd700' : 'rgba(255,215,0,0.3)',
                      borderColor: canInject ? '#ffd700' : 'rgba(255,215,0,0.2)',
                      fontWeight: 'bold',
                      letterSpacing: 1,
                      transition: 'all 0.3s ease',
                      '&:not(:disabled):hover': {
                        bgcolor: 'rgba(255, 215, 0, 0.1)',
                        borderColor: '#ffd700',
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
                      }
                    }}
                  >
                    {injecting ? 'INJECTING...' : `INJECT POWER${!canInject ? ` (${MIN_INJECT_EP - currentEnergy} EP)` : ''}`}
                  </Button>
                </span>
              </Tooltip>
            </Paper>
          </motion.div>
        )}

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
