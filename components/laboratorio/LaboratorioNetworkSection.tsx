import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Paper, CircularProgress, LinearProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Hub, ElectricBolt, ReceiptLong, AccountTree } from "@mui/icons-material";
import { LabDataInterface } from "./LaboratorioMetersSection";

interface NetworkSectionProps {
  labData: LabDataInterface | null;
}

interface Transaction {
  id: string;
  hash: string;
  type: "BUY" | "SELL" | "TRANSFER";
  status: "CONFIRMING" | "CONFIRMED" | "QUEUED";
  amount: string;
  isPersonalWin?: boolean;
}

export function LaboratorioNetworkSection({ labData }: NetworkSectionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
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

  const blockProgress = 457; // Mocked
  const blockLimit = 1000;
  const networkPower = 1240.5; // Mocked
  const totalFees = labData?.powerMining ? (labData.powerMining * 0.12).toFixed(2) : 28.45;

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
          <Typography variant="caption" display="block" color="rgba(255,255,255,0.5)">Fees Ganados</Typography>
          <Typography variant="h6" color="#fff" fontWeight="bold">+{totalFees} SAMT</Typography>
        </Paper>
      </Stack>

      {/* Block Progress Monitor */}
      <Paper sx={{ 
        p: 3, 
        bgcolor: 'rgba(10,12,16,0.6)', 
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Hub sx={{ color: '#00f3ff', fontSize: 20 }} />
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
              bgcolor: '#00f3ff',
              boxShadow: '0 0 10px #00f3ff'
            }
          }}
        />
        
        <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          * El bloque se cerrará al alcanzar las {blockLimit} transacciones.
        </Typography>
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

        <Stack spacing={1.5} sx={{ overflow: 'hidden' }}>
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
      </Paper>
    </Box>
  );
}
