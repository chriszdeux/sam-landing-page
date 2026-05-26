import { useState } from "react";
import { Box, Typography, Stack, Paper, CircularProgress, LinearProgress, Button, Snackbar, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Hub, ElectricBolt, ReceiptLong, AccountTree, Savings, Bolt } from "@mui/icons-material";
import { LabDataInterface } from "./LaboratorioMetersSection";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { updateNetworkPower } from "../../lib/features/blockchain/reducer";
import api from "../../lib/api";

interface NetworkSectionProps {
  labData: LabDataInterface | null;
  currentEnergy: number;
  onEnergyChange: (newEnergy: number) => void;
  onRefetch?: () => void;
}

interface Transaction {
  id: string;
  hash: string;
  type: "BUY" | "SELL" | "TRANSFER";
  status: "CONFIRMING" | "CONFIRMED" | "QUEUED";
  amount: string;
  isPersonalWin?: boolean;
}

export function LaboratorioNetworkSection({ labData, currentEnergy, onEnergyChange, onRefetch }: NetworkSectionProps) {
  const dispatch = useAppDispatch();
  const { selectedNetwork } = useAppSelector((state) => state.blockchain);
  const blockchainId = selectedNetwork?.id ?? null;
  const totalPowerMinning = selectedNetwork?.blockchainProps?.totalPowerMinning || 0;
  const [transactions] = useState<Transaction[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showClaimParticles, setShowClaimParticles] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [actionSnackbar, setActionSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [showGoldenPulse, setShowGoldenPulse] = useState(false);

  const effectivePower = labData?.effectivePower ?? labData?.powerMining ?? 10;
  const estimatedCost = Math.min(100, Math.ceil(currentEnergy * 0.05));
  const canInject = currentEnergy > 0;

  const handleInjectPower = async () => {
    if (!labData?.id || isInjecting) return;
    if (!blockchainId) {
      setActionSnackbar({ open: true, message: 'Red no disponible: blockchain no cargada', severity: 'warning' });
      return;
    }
    setIsInjecting(true);
    try {
      const res = await api.post(`/labs/${labData.id}/inject-power`, {
        blockchainId,
        energyAmount: currentEnergy,
      });
      const { tokensEarned, confirmedTxCount, labState } = res.data;

      if (labState) onEnergyChange(labState.energy);
      
      // Update blockchain store with new total power immediately
      const newPower = res.data?.totalPowerMinning ?? res.data?.labState?.totalPowerMinning ?? res.data?.blockchainProps?.totalPowerMinning ?? res.data?.networkPower ?? res.data?.data?.totalPowerMinning;
      if (newPower !== undefined && newPower !== null) {
          dispatch(updateNetworkPower({ id: blockchainId, totalPowerMinning: Number(newPower) }));
      }

      if (tokensEarned) {
        setShowGoldenPulse(true);
        setTimeout(() => setShowGoldenPulse(false), 3000);
        setActionSnackbar({ open: true, message: `¡Ganaste! +${tokensEarned} SAMT — ${confirmedTxCount} TX confirmadas`, severity: 'success' });
      } else {
        setActionSnackbar({ open: true, message: 'Poder inyectado a la red.', severity: 'info' });
      }
      onRefetch?.();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { available?: number; message?: string } } };
      if (axiosErr?.response?.status === 400) {
        const { available, message } = axiosErr.response.data ?? {};
        const msg = available !== undefined ? `Energía insuficiente (disponible: ${available} EP)` : (message ?? 'Sin energía disponible');
        setActionSnackbar({ open: true, message: msg, severity: 'warning' });
      } else {
        setActionSnackbar({ open: true, message: 'Error al inyectar poder a la red', severity: 'warning' });
      }
    } finally {
      setIsInjecting(false);
    }
  };

  const handleClaim = async () => {
    if (!labData?.id || (labData.pendingRewards ?? 0) <= 0) return;
    setIsClaiming(true);
    try {
      await api.post(`/labs/${labData.id}/claim`);
      setShowClaimParticles(true);
      setTimeout(() => setShowClaimParticles(false), 2000);
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const blockProgress = labData?.blockProgress ?? 0;
  const blockLimit = 1000;
  const networkPower = labData?.networkPower ?? 0;
  const totalFees = labData?.powerMining ? (labData.powerMining * 0.12).toFixed(2) : '0.00';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', opacity: labData ? 1 : 0.6 }}>

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
                        {(totalPowerMinning || 0).toLocaleString('en-US')}
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

      {/* Inject Power — below energy bar */}
      <Paper sx={{
        p: 2.5,
        bgcolor: showGoldenPulse ? 'rgba(255,183,0,0.06)' : 'rgba(10,12,16,0.6)',
        border: showGoldenPulse ? '1px solid rgba(255,183,0,0.4)' : '1px solid rgba(0,243,255,0.08)',
        borderRadius: 4,
        transition: 'all 0.3s ease',
        boxShadow: showGoldenPulse ? '0 0 25px rgba(255,183,0,0.15)' : 'none',
      }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
            Poder máx: <Box component="span" sx={{ color: 'rgba(255,255,255,0.6)' }}>{labData?.powerMining ?? 10} GH/s</Box>
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
            Poder actual:{' '}
            <Box component="span" sx={{ color: effectivePower < (labData?.powerMining ?? 10) ? '#ff9800' : '#00f3ff', fontWeight: 'bold' }}>
              {effectivePower} GH/s
            </Box>
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
            Energía disponible: <Box component="span" sx={{ color: '#ffd700', fontWeight: 'bold' }}>{currentEnergy} EP</Box>
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
            Costo: <Box component="span" sx={{ color: '#ff9800', fontWeight: 'bold' }}>-{estimatedCost} EP</Box>
          </Typography>
        </Stack>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          disabled={isInjecting || !blockchainId || !canInject}
          onClick={handleInjectPower}
          startIcon={isInjecting ? <CircularProgress size={14} color="inherit" /> : <Bolt />}
          title={!canInject ? 'Sin energía acumulada' : `Inyectar poder (costo: ${estimatedCost} EP)`}
          component={motion.button}
          whileHover={!isInjecting && canInject ? { scale: 1.02 } : {}}
          whileTap={!isInjecting && canInject ? { scale: 0.98 } : {}}
          sx={{
            borderColor: showGoldenPulse ? '#ffb700' : canInject ? 'rgba(0,243,255,0.3)' : 'rgba(255,255,255,0.1)',
            color: showGoldenPulse ? '#ffb700' : canInject ? '#00f3ff' : 'rgba(255,255,255,0.2)',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            borderRadius: 2,
            '&:hover': { borderColor: '#00f3ff', bgcolor: 'rgba(0,243,255,0.05)' },
            '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)' },
          }}
        >
          {isInjecting ? 'Inyectando...' : !canInject ? 'Sin energía acumulada' : `⚡ Inyectar Poder (${effectivePower} GH/s)`}
        </Button>
      </Paper>

      {/* Rewards Claim Section */}
      <Paper
        component={motion.div}
        whileHover={{ scale: 1.01 }}
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(40, 167, 69, 0.08)',
          border: '1px solid rgba(40, 167, 69, 0.2)',
          borderRadius: 4,
          boxShadow: (labData?.pendingRewards ?? 0) > 0 ? '0 0 20px rgba(40, 167, 69, 0.15)' : 'none'
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Savings sx={{ color: '#28a745', fontSize: 20 }} />
            <Typography variant="subtitle2" color="#fff" fontWeight="bold">RECOMPENSAS PENDIENTES</Typography>
          </Stack>
          <Typography variant="h5" color="#28a745" fontWeight="bold">
            {(labData?.pendingRewards ?? 0).toFixed(4)}{' '}
            <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>SAMT</Typography>
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          disabled={isClaiming || (labData?.pendingRewards ?? 0) <= 0}
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

      {/* Block Progress Monitor */}
      <Paper sx={{
        p: 3,
        bgcolor: 'rgba(10,12,16,0.6)',
        border: showGoldenPulse ? '1px solid rgba(255,183,0,0.5)' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        transition: 'border 0.3s ease',
        boxShadow: showGoldenPulse ? '0 0 25px rgba(255,183,0,0.2)' : 'none'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Hub sx={{ color: showGoldenPulse ? '#ffb700' : '#00f3ff', fontSize: 20, transition: 'color 0.3s' }} />
            <Typography variant="subtitle2" color="#fff" fontWeight="bold">BLOQUE ACTIVO</Typography>
          </Stack>
          <Typography variant="caption" color="rgba(0, 243, 255, 0.8)" fontWeight="bold">
            {blockProgress} / {blockLimit} TXs
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(blockProgress / blockLimit) * 100}
          sx={{
            height: 8, borderRadius: 4,
            bgcolor: 'rgba(0, 243, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: showGoldenPulse ? '#ffb700' : '#00f3ff',
              boxShadow: showGoldenPulse ? '0 0 10px #ffb700' : '0 0 10px #00f3ff',
              transition: 'all 0.3s ease'
            }
          }}
        />

        {(labData?.pendingTxCount ?? 0) > 0 && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} component={motion.div} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <Typography variant="caption" color="#ff9800" fontWeight="bold">
              {labData?.pendingTxCount} TXs en espera de procesamiento
            </Typography>
          </Stack>
        )}

        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          * El bloque se cerrará al alcanzar las {blockLimit} transacciones.
        </Typography>
      </Paper>

      {/* Network Activity Feed */}
      <Paper sx={{
        flex: 1, p: 2.5,
        bgcolor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        display: 'flex', flexDirection: 'column'
      }}>
        <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTree sx={{ fontSize: 18 }} /> ACTIVIDAD DE RED
        </Typography>

        <Box sx={{ flex: 1, minHeight: 120 }}>
          <Stack spacing={1.5} sx={{ overflow: 'hidden' }}>
            <AnimatePresence mode="popLayout">
              {transactions.map((tx) => (
                <motion.div key={tx.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                  <Box
                    component={motion.div}
                    animate={tx.isPersonalWin ? { boxShadow: ["0 0 0px #ffb70000", "0 0 15px #ffb70040", "0 0 0px #ffb70000"] } : {}}
                    transition={{ duration: 1, repeat: tx.isPersonalWin ? Infinity : 0 }}
                    sx={{
                      p: 1.5,
                      bgcolor: tx.isPersonalWin ? 'rgba(255, 183, 0, 0.05)' : 'rgba(255,255,255,0.03)',
                      borderRadius: 2,
                      borderLeft: `3px solid ${tx.isPersonalWin ? '#ffb700' : tx.status === 'CONFIRMED' ? '#00e676' : tx.status === 'QUEUED' ? '#ff5722' : '#00f3ff'}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: tx.isPersonalWin ? '1px solid rgba(255,183,0,0.2)' : '1px solid transparent',
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" sx={{ color: tx.isPersonalWin ? '#ffb700' : '#fff', display: 'block', mb: 0.5, fontFamily: 'monospace', fontWeight: tx.isPersonalWin ? 'bold' : 'normal' }}>
                          {tx.hash}
                        </Typography>
                        {tx.isPersonalWin && (
                          <Typography variant="caption" sx={{ bgcolor: '#ffb700', color: '#000', px: 0.5, borderRadius: 0.5, fontSize: '0.6rem', fontWeight: 'bold' }}>WIN!</Typography>
                        )}
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" sx={{ px: 0.8, py: 0.2, borderRadius: 0.5, bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 'bold' }}>
                          {tx.type}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.3)">{tx.amount} SAMT</Typography>
                      </Stack>
                    </Box>
                    {tx.status === 'QUEUED' ? (
                      <Typography variant="caption" color="#ff5722" fontWeight="bold" sx={{ fontSize: '0.6rem', textAlign: 'right' }}>ESPERANDO<br />ENERGÍA</Typography>
                    ) : tx.status === 'CONFIRMING' ? (
                      <CircularProgress size={16} sx={{ color: tx.isPersonalWin ? '#ffb700' : '#00f3ff' }} />
                    ) : (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tx.isPersonalWin ? '#ffb700' : '#00e676', boxShadow: `0 0 10px ${tx.isPersonalWin ? '#ffb700' : '#00e676'}` }} />
                    )}
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        </Box>

        {/* Claim Particles */}
        <AnimatePresence>
          {showClaimParticles && (
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ x: window.innerWidth / 2 + (Math.random() - 0.5) * 200, y: window.innerHeight / 2 + (Math.random() - 0.5) * 100, scale: 0, opacity: 1 }}
                  animate={{ x: window.innerWidth - 100, y: 50, scale: [0, 1.2, 0.8], opacity: [1, 1, 0] }}
                  transition={{ duration: 1.2 + Math.random() * 0.5, delay: i * 0.05, ease: "easeOut" }}
                  sx={{ position: 'absolute', width: 14, height: 14, bgcolor: '#28a745', borderRadius: '50%', boxShadow: '0 0 10px #28a745', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}
                >
                  $
                </Box>
              ))}
            </Box>
          )}
        </AnimatePresence>
      </Paper>

      {/* Action Snackbar */}
      <Snackbar
        open={actionSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setActionSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={actionSnackbar.severity}
          onClose={() => setActionSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ bgcolor: actionSnackbar.severity === 'success' ? 'rgba(0,230,118,0.15)' : undefined, border: '1px solid', borderColor: actionSnackbar.severity === 'success' ? '#00e676' : undefined }}
        >
          {actionSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
