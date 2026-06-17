import { useState, useEffect } from "react";
import { Box, Typography, Stack, Paper, CircularProgress, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ElectricBolt, ReceiptLong, Savings, Bolt } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { updateNetworkPower } from "../../lib/features/blockchain/reducer";
import api from "../../lib/api";
import { RootState } from "../../lib/store";
import { getCBUnit, processingFrequencies } from "../../lib/constants/blockchainFrequencies";
import { formatHash } from "../../lib/utils/formatHash";

interface NetworkSectionProps {
  onRefetch?: () => void;
}

export function LaboratorioNetworkSection({ onRefetch }: NetworkSectionProps) {
  const dispatch = useAppDispatch();
  const { currentLab, isPoweredOn } = useAppSelector((state: RootState) => state.reducerLabs);
  const { selectedNetwork, chronoBurstFreqTypes } = useAppSelector((state: RootState) => state.blockchain);
  
  const blockchainId = selectedNetwork?.id ?? null;
  const totalPowerMining = selectedNetwork?.blockchainProps?.totalPowerMining || 0;
  
  const [isClaiming, setIsClaiming] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showGoldenPulse, setShowGoldenPulse] = useState(false);
  const [prevRewards, setPrevRewards] = useState(0);
  const [rewardsChanged, setRewardsChanged] = useState(false);
 
  const pendingRewards = currentLab?.pendingRewards || 0;
  const currentEnergy = (currentLab?.energy || 0).toFixed(3);
  
  const slots = currentLab?.slots || [];
  const labFrequency = slots.length > 0
    ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
    : processingFrequencies.MEGA_CB;
  const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
  const totalPower = isPoweredOn ? ((currentLab?.hashRate || 0) * frequencyMultiplier) : 0;
  const labUnit = getCBUnit(labFrequency);

  // Animation Trigger for Rewards
  useEffect(() => {
    if (pendingRewards > prevRewards) {
      setRewardsChanged(true);
      const timer = setTimeout(() => setRewardsChanged(false), 2000);
      setPrevRewards(pendingRewards);
      return () => clearTimeout(timer);
    }
    setPrevRewards(pendingRewards);
  }, [pendingRewards, prevRewards]);

  const handleClaim = async () => {
    if (!currentLab?.id || pendingRewards <= 0) return;
    setIsClaiming(true);
    try {
      await api.put(`/labs/${currentLab.id}/claim`);
      onRefetch?.();
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const totalFees = totalPower ? (totalPower * 0.12).toFixed(2) : '0.00';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', opacity: currentLab ? 1 : 0.6 }}>

      {/* Network Stats Cards */}
      <Stack direction="column" spacing={2}>
        <Paper sx={{
            p: 3,
            background: "rgba(0, 243, 255, 0.05)",
            border: "1px solid rgba(0, 243, 255, 0.2)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 30px rgba(0, 243, 255, 0.1)",
        }}>
            <Box sx={{ 
                p: 1.5, 
                bgcolor: "rgba(0, 243, 255, 0.1)", 
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0, 243, 255, 0.3)"
            }}>
                <ElectricBolt sx={{ color: "#00f3ff", fontSize: 32 }} className="pulse-animation" />
            </Box>
            <Box>
                <Typography variant="overline" sx={{ color: "#00f3ff", fontWeight: "bold", letterSpacing: 2, display: "block", lineHeight: 1, mb: 0.5 }}>
                    NETWORK MINING POWER
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900, letterSpacing: -1, textShadow: "0 0 20px rgba(0, 243, 255, 0.5)" }}>
                        {(totalPowerMining || 0).toLocaleString('en-US')}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#00f3ff", fontWeight: "bold", opacity: 0.8 }}>
                        GH/s
                    </Typography>
                </Box>
            </Box>
        </Paper>
        
        <Paper sx={{ p: 2, bgcolor: 'rgba(176, 0, 255, 0.05)', border: '1px solid rgba(176, 0, 255, 0.1)', borderRadius: 3, textAlign: 'center' }}>
          <ReceiptLong sx={{ color: '#b000ff', mb: 1 }} />
          <Typography variant="caption" display="block" color="rgba(255,255,255,0.5)">Fees Históricos</Typography>
          <Typography variant="h6" color="#fff" fontWeight="bold">+{totalFees} SAMT</Typography>
        </Paper>
      </Stack>

      {/* Power Info Section */}
      <Paper sx={{
        p: 2.5,
        bgcolor: 'rgba(10,12,16,0.6)',
        border: '1px solid rgba(0,243,255,0.08)',
        borderRadius: 4,
      }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
            Poder Total Lab: <Box component="span" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>{totalPower.toFixed(1)} {labUnit}</Box>
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
            Hash Acumulado: <Box component="span" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>{formatHash(currentLab?.energy || 0, chronoBurstFreqTypes)}</Box>
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', fontStyle: 'italic', textAlign: 'center', display: 'block' }}>
            Inyección automática cada 10 rounds de simulación activa.
        </Typography>
      </Paper>

      {/* Rewards Claim Section */}
      <Paper
        component={motion.div}
        animate={rewardsChanged ? { 
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0px #28a74500", "0 0 25px #28a74560", "0 0 0px #28a74500"]
        } : {}}
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(40, 167, 69, 0.08)',
          border: `1px solid ${rewardsChanged ? '#28a745' : 'rgba(40, 167, 69, 0.2)'}`,
          borderRadius: 4,
          transition: 'border 0.3s ease',
          boxShadow: pendingRewards > 0 ? '0 0 20px rgba(40, 167, 69, 0.15)' : 'none'
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Savings sx={{ color: '#28a745', fontSize: 20 }} />
            <Typography variant="subtitle2" color="#fff" fontWeight="bold">RECOMPENSAS PENDIENTES</Typography>
          </Stack>
          <AnimatePresence mode="wait">
            <motion.div
                key={pendingRewards}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                <Typography variant="h5" color="#28a745" fontWeight="bold">
                    {pendingRewards.toFixed(4)}{' '}
                    <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>SAMT</Typography>
                </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
        <Button
          variant="contained"
          size="large"
          disabled={isClaiming || pendingRewards <= 0}
          onClick={handleClaim}
          sx={{
            borderRadius: 3, px: 4,
            bgcolor: '#28a745',
            '&:hover': { bgcolor: '#218838' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' },
            textTransform: 'none', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
          }}
        >
          {isClaiming ? <CircularProgress size={24} color="inherit" /> : 'RECLAMAR (CLAIM)'}
        </Button>
      </Paper>
    </Box>
  );
}
