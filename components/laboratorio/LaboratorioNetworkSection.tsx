import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Paper, CircularProgress, LinearProgress, Button, Snackbar, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Hub, ElectricBolt, ReceiptLong, AccountTree, Savings, FlashOn } from "@mui/icons-material";
import { LabDataInterface } from "./LaboratorioMetersSection";
import api from "../../lib/api";

interface NetworkSectionProps {
  labData: LabDataInterface | null;
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

export function LaboratorioNetworkSection({ labData, onRefetch }: NetworkSectionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showClaimParticles, setShowClaimParticles] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushSnackbar, setFlushSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [showGoldenPulse, setShowGoldenPulse] = useState(false);

  const handleFlush = async () => {
    if (!labData?.id || isFlushing) return;
    setIsFlushing(true);
    try {
      const res = await api.post(`/labs/${labData.id}/flush`);
      const { operationStatus, confirmedBy, tokensEarned, pendingTxCount } = res.data;

      if (operationStatus === 'low_energy') {
        setFlushSnackbar({ open: true, message: 'Red sin energía suficiente para procesar', severity: 'warning' });
      } else if (operationStatus === 'no_pending_txs') {
        setFlushSnackbar({ open: true, message: 'No hay transacciones pendientes en la cola', severity: 'info' });
      } else {
        const userWalletId = typeof window !== 'undefined' ? localStorage.getItem('walletId') : null;
        if (confirmedBy && userWalletId && confirmedBy === userWalletId) {
          setShowGoldenPulse(true);
          setTimeout(() => setShowGoldenPulse(false), 3000);
          setFlushSnackbar({ open: true, message: `¡Bloque confirmado! +${tokensEarned} SAMT`, severity: 'success' });
        } else {
          setFlushSnackbar({ open: true, message: `Bloque procesado. ${pendingTxCount} TXs restantes en cola`, severity: 'success' });
        }
        onRefetch?.();
      }
    } catch {
      setFlushSnackbar({ open: true, message: 'Error al procesar la cola de transacciones', severity: 'warning' });
    } finally {
      setIsFlushing(false);
    }
  };

  const handleClaim = async () => {
    if (!labData?.id || (labData.pendingRewards ?? 0) <= 0) return;
    
    setIsClaiming(true);
    try {
      await api.post(`/labs/${labData.id}/claim`);
      setShowClaimParticles(true);
      setTimeout(() => setShowClaimParticles(false), 2000);
      console.log("Claim successful");
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setIsClaiming(false);
    }
  };
  
  // Mocking real-time network activity including lottery
  useEffect(() => {
    const types: ("BUY" | "SELL" | "TRANSFER")[] = ["BUY", "SELL", "TRANSFER"];
    const interval = setInterval(() => {
      const isWinner = Math.random() > 0.8; // 20% chance to 'win' a confirmation
      const isQueue = labData?.powerMining === 0;

      const newTx: Transaction = {
        id: Math.random().toString(36).substring(7),
        hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        type: types[Math.floor(Math.random() * types.length)],
        status: isQueue ? "QUEUED" : "CONFIRMING",
        amount: (Math.random() * 500).toFixed(2),
        isPersonalWin: isWinner && !isQueue
      };
      
      setTransactions(prev => [newTx, ...prev].slice(0, 5));
      
      if (!isQueue) {
        // Mark as confirmed after 2 seconds
        setTimeout(() => {
          setTransactions(prev => prev.map(tx => tx.id === newTx.id ? { ...tx, status: "CONFIRMED" } : tx));
        }, 2000);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [labData?.powerMining]);

  // Real data from backend (with safe fallbacks while loading)
  const blockProgress = labData?.blockProgress ?? 0;
  const blockLimit = 1000;
  const networkPower = labData?.networkPower ?? 0;
  const totalFees = labData?.powerMining ? (labData.powerMining * 0.12).toFixed(2) : '0.00';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', opacity: labData ? 1 : 0.6 }}>
      
      {/* Network Stats Cards */}
      <Stack direction="row" spacing={2}>
        <Paper 
          component={motion.div}
          animate={{ 
            boxShadow: ["0 0 0px #00f3ff00", "0 0 20px #00f3ff40", "0 0 0px #00f3ff00"] 
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          sx={{ 
            flex: 1, p: 2, 
            bgcolor: 'rgba(0, 243, 255, 0.05)', 
            border: '1px solid rgba(0, 243, 255, 0.1)',
            borderRadius: 3,
            textAlign: 'center'
        }}>
          <ElectricBolt sx={{ color: '#00f3ff', mb: 1 }} />
          <Typography variant="caption" display="block" color="rgba(255,255,255,0.5)">Poder Global</Typography>
          <Typography variant="h6" color="#fff" fontWeight="bold">{networkPower} GH/s</Typography>
        </Paper>
        
        <Paper sx={{ 
          flex: 1, p: 2, 
          bgcolor: 'rgba(176, 0, 255, 0.05)', 
          border: '1px solid rgba(176, 0, 255, 0.1)',
          borderRadius: 3,
          textAlign: 'center'
        }}>
          <ReceiptLong sx={{ color: '#b000ff', mb: 1 }} />
          <Typography variant="caption" display="block" color="rgba(255,255,255,0.5)">Fees Históricos</Typography>
          <Typography variant="h6" color="#fff" fontWeight="bold">+{totalFees} SAMT</Typography>
        </Paper>
      </Stack>

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
            {(labData?.pendingRewards ?? 0).toFixed(4)} <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>SAMT</Typography>
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          disabled={isClaiming || (labData?.pendingRewards ?? 0) <= 0}
          onClick={handleClaim}
          sx={{ 
            borderRadius: 3,
            px: 4,
            bgcolor: '#28a745',
            '&:hover': { bgcolor: '#218838' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' },
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
          }}
        >
          {isClaiming ? <CircularProgress size={24} color="inherit" /> : 'RECLAMAR (CLAIM)'}
        </Button>
      </Paper>

      {/* Blockchain Energy Meter */}
      <Paper sx={{ 
        p: 3, 
        bgcolor: 'rgba(10,12,16,0.6)', 
        border: labData?.operationStatus === 'low_energy' ? '1px solid rgba(255, 23, 68, 0.4)' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s ease'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <motion.div
              animate={labData?.operationStatus === 'low_energy' ? { 
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ElectricBolt sx={{ 
                color: labData?.operationStatus === 'low_energy' ? '#ff1744' : '#ffeb3b', 
                fontSize: 20 
              }} />
            </motion.div>
            <Typography variant="subtitle2" color="#fff" fontWeight="bold">ENERGÍA DE RED</Typography>
          </Stack>
          <Typography 
            variant="caption" 
            color={labData?.operationStatus === 'low_energy' ? '#ff1744' : '#ffeb3b'} 
            fontWeight="bold"
          >
            {labData?.blockchainEnergy ?? 1000} / {labData?.blockchainMaxEnergy ?? 1000} EP
          </Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={((labData?.blockchainEnergy ?? 1000) / (labData?.blockchainMaxEnergy ?? 1000)) * 100} 
          sx={{ 
            height: 10, 
            borderRadius: 5, 
            bgcolor: 'rgba(255, 235, 59, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: labData?.operationStatus === 'low_energy' ? '#ff1744' : '#ffeb3b',
              boxShadow: labData?.operationStatus === 'low_energy' ? '0 0 15px #ff1744' : '0 0 10px #ffeb3b',
              transition: 'all 0.5s ease'
            }
          }}
        />

        {labData?.operationStatus === 'low_energy' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                color: '#ff1744', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.65rem'
              }}
            >
              <Box sx={{ width: 6, height: 6, bgcolor: '#ff1744', borderRadius: '50%' }} component={motion.div} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
              Red en estado Crítico: Baja Energía
            </Typography>
          </motion.div>
        )}
      </Paper>


      {/* Block Progress Monitor */}
      <Paper sx={{ 
        p: 3, 
        bgcolor: 'rgba(10,12,16,0.6)', 
        border: showGoldenPulse ? '1px solid rgba(255,183,0,0.5)' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
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
            height: 8, 
            borderRadius: 4, 
            bgcolor: 'rgba(0, 243, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: showGoldenPulse ? '#ffb700' : '#00f3ff',
              boxShadow: showGoldenPulse ? '0 0 10px #ffb700' : '0 0 10px #00f3ff',
              transition: 'all 0.3s ease'
            }
          }}
        />

        {/* Pending TX badge */}
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

        {/* Confirm Transactions Button */}
        <Button
          fullWidth
          variant="outlined"
          size="small"
          disabled={isFlushing || labData?.operationStatus === 'low_energy' || (labData?.pendingTxCount !== undefined && labData.pendingTxCount === 0)}
          onClick={handleFlush}
          startIcon={isFlushing ? <CircularProgress size={14} color="inherit" /> : <FlashOn />}
          component={motion.button}
          whileHover={!isFlushing ? { scale: 1.02 } : {}}
          whileTap={!isFlushing ? { scale: 0.98 } : {}}
          sx={{
            mt: 2,
            borderColor: showGoldenPulse ? '#ffb700' : 'rgba(0,243,255,0.3)',
            color: showGoldenPulse ? '#ffb700' : '#00f3ff',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            borderRadius: 2,
            '&:hover': { borderColor: '#00f3ff', bgcolor: 'rgba(0,243,255,0.05)' },
            '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)' },
          }}
        >
          {isFlushing
            ? 'Procesando...'
            : labData?.operationStatus === 'low_energy'
            ? 'Red sin energía'
            : (labData?.pendingTxCount !== undefined && labData.pendingTxCount === 0)
            ? 'Sin TXs Pendientes'
            : 'Confirmar Transacciones'}
        </Button>
      </Paper>

      {/* Modern Network Feed */}
      <Paper sx={{ 
        flex: 1, 
        p: 2.5, 
        bgcolor: 'rgba(0,0,0,0.3)', 
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTree sx={{ fontSize: 18 }} /> ACTIVIDAD DE RED
        </Typography>

        <Box sx={{ position: 'relative', flex: 1, minHeight: 200 }}>
          {labData?.blockchainEnergy === 0 && (
            <Box 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ 
                position: 'absolute', inset: -10, zIndex: 10,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column',
                bgcolor: 'rgba(10,12,16,0.85)',
                backdropFilter: 'blur(4px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 23, 68, 0.3)'
              }}
            >
              <ElectricBolt sx={{ color: '#ff1744', fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="#ff1744" fontWeight="bold" sx={{ letterSpacing: 1, textAlign: 'center' }}>
                NETWORK OFFLINE
              </Typography>
              <Typography variant="caption" color="rgba(255,23,68,0.7)" fontWeight="bold">
                RECHARGING ENERGY...
              </Typography>
            </Box>
          )}

          <Stack spacing={1.5} sx={{ overflow: 'hidden', opacity: labData?.blockchainEnergy === 0 ? 0.3 : 1 }}>
          <AnimatePresence mode="popLayout">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Box 
                  component={motion.div}
                  animate={tx.isPersonalWin ? { 
                    boxShadow: ["0 0 0px #ffb70000", "0 0 15px #ffb70040", "0 0 0px #ffb70000"] 
                  } : {}}
                  transition={{ duration: 1, repeat: tx.isPersonalWin ? Infinity : 0 }}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: tx.isPersonalWin ? 'rgba(255, 183, 0, 0.05)' : 'rgba(255,255,255,0.03)', 
                    borderRadius: 2,
                    borderLeft: `3px solid ${
                      tx.isPersonalWin ? '#ffb700' : 
                      tx.status === 'CONFIRMED' ? '#00e676' : 
                      tx.status === 'QUEUED' ? '#ff5722' : '#00f3ff'
                    }`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: tx.isPersonalWin ? '1px solid rgba(255,183,0,0.2)' : '1px solid transparent',
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" sx={{ color: tx.isPersonalWin ? '#ffb700' : '#fff', display: 'block', mb: 0.5, fontFamily: 'monospace', fontWeight: tx.isPersonalWin ? 'bold' : 'normal' }}>
                        {tx.hash}
                      </Typography>
                      {tx.isPersonalWin && (
                        <Typography variant="caption" sx={{ bgcolor: '#ffb700', color: '#000', px: 0.5, borderRadius: 0.5, fontSize: '0.6rem', fontWeight: 'bold' }}>
                          WIN!
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          px: 0.8, py: 0.2, borderRadius: 0.5, 
                          bgcolor: 'rgba(255,255,255,0.05)', 
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.65rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {tx.type}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.3)">
                        {tx.amount} SAMT
                      </Typography>
                    </Stack>
                  </Box>
                  
                  {tx.status === 'QUEUED' ? (
                    <Typography variant="caption" color="#ff5722" fontWeight="bold" sx={{ fontSize: '0.6rem', textAlign: 'right' }}>
                      ESPERANDO<br/>ENERGÍA
                    </Typography>
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

        {/* Claim Particles Animation */}
        <AnimatePresence>
          {showClaimParticles && (
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ 
                    x: window.innerWidth / 2 + (Math.random() - 0.5) * 200, 
                    y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    x: window.innerWidth - 100, 
                    y: 50, 
                    scale: [0, 1.2, 0.8],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2 + Math.random() * 0.5, 
                    delay: i * 0.05,
                    ease: "easeOut" 
                  }}
                  sx={{ 
                    position: 'absolute', 
                    width: 14, height: 14, 
                    bgcolor: '#28a745', 
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #28a745',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    color: '#fff', fontSize: 10, fontWeight: 'bold'
                  }}
                >
                  $
                </Box>
              ))}
            </Box>
          )}
        </AnimatePresence>
      </Paper>

      {/* Flush Snackbar */}
      <Snackbar
        open={flushSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setFlushSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={flushSnackbar.severity}
          onClose={() => setFlushSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ bgcolor: flushSnackbar.severity === 'success' ? 'rgba(0,230,118,0.15)' : undefined, border: '1px solid', borderColor: flushSnackbar.severity === 'success' ? '#00e676' : undefined }}
        >
          {flushSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
