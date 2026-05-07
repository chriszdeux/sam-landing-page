"use client";

import { motion } from "framer-motion";
import { Box, Paper, CircularProgress, Typography, Button, Chip } from "@mui/material";
import { PowerSettingsNew, Bolt } from "@mui/icons-material";
import { MiningBackground } from "./MiningBackground";
import { useAppSelector } from "../../lib/hooks";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { LaboratorioInventory } from "./LaboratorioInventory";
import { CoreModulesSimulator } from "../core_modules/CoreModulesSimulator";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface LabBasicData {
  id: string;
  type?: string;
  powerMining?: number;
}

export function LaboratorioView() {
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const [labData, setLabData] = useState<LabBasicData | null>(null);
  const [injecting, setInjecting] = useState(false);

  const hasLab = userInfo?.idLabs && userInfo.idLabs.length > 0;
  const labId = userInfo?.idLabs?.[0];

  useEffect(() => {
    if (hasLab && labId) {
      api.get(`/labs/${labId}`)
        .then((res) => {
          const data = res.data.laboratory || res.data;
          setLabData({
            id: data.id,
            type: data.type || 'MINNING', // Default to MINNING for prototype if missing
            powerMining: data.powerMining || 1500
          });
        })
        .catch(() => {
          // Fallback mock for UI visualization if backend is offline or unlinked
          setLabData({ id: labId, type: 'MINNING', powerMining: 5000 });
        });
    }
  }, [hasLab, labId]);

  const handleInjectPower = () => {
    setInjecting(true);
    setTimeout(() => setInjecting(false), 2000); // Simulate network/effect
  };

  if (status === 'loading') {
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
        {labData?.type === 'MINNING' && (
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
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                disabled={injecting}
                onClick={handleInjectPower}
                sx={{
                  color: '#ffd700',
                  borderColor: '#ffd700',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    borderColor: '#ffd700',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
                  }
                }}
              >
                {injecting ? 'INJECTING...' : 'INJECT POWER'}
              </Button>
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
