import React from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import { Bolt, Thermostat } from "@mui/icons-material";
import { motion } from "framer-motion";

export interface SlotMachine {
  id: string;
  name: string;
  hashRate: number; // Replaced powerMining
  maxTemperature: number;
  lifeLimit: number;
  currentUsage: number;
  temperature: number; // Individual component temperature
}

export interface LaboratoryInterface {
  id: string;
  type: "MINING";
  lifeLimit: number;
  currentLife: number;
  maxTemperature: number;
  slotsCapacity: number;
  hashRate: number; // Replaced powerBase
  energy: number;
  slots: SlotMachine[];
  createdAt: string | Date;
  
  // Client-side simulation properties
  temperature: number; // Global lab temperature
  efficiency: number;
  operationStatus: 'ACTIVE' | 'INACTIVE';
  pendingRewards: number;
}

interface Props {
  labData: LaboratoryInterface | null;
  currentEnergy?: number;
  isWinner?: boolean;
}

export function LaboratorioMetersSection({ labData, currentEnergy, isWinner }: Props) {
  // Use labData temperature or fallback
  const globalTemp = labData?.temperature || 0;
  const maxTemp = labData?.maxTemperature || 80;
  const tempPercent = (globalTemp / maxTemp) * 100;

  return (
    <Box 
      component={motion.div}
      animate={isWinner ? { 
        scale: [1, 1.02, 1],
        boxShadow: ["0 0 0px #ffb70000", "0 0 30px #ffb70060", "0 0 0px #ffb70000"]
      } : {}}
      transition={{ duration: 0.8, repeat: isWinner ? Infinity : 0 }}
      sx={{ 
        width: '100%', 
        maxWidth: 1000,
        p: 2,
        borderRadius: 4,
        position: 'relative',
        transition: 'all 0.5s',
        border: isWinner ? '1px solid #ffb700' : '1px solid transparent',
        bgcolor: isWinner ? 'rgba(255,183,0,0.05)' : 'transparent'
      }}
    >
      {isWinner && (
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
            bgcolor: '#ffb700', color: '#000', px: 2, py: 0.5, borderRadius: 10,
            fontWeight: 'bold', zIndex: 10, boxShadow: '0 0 10px #ffb700'
          }}
        >
          ¡COMISIÓN DE RED GANADA!
        </Typography>
      )}
      <Grid container spacing={4}>
      {/* System Load Meter */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>Carga del Sistema</Typography>
          <Typography variant="caption" sx={{ color: '#00f3ff', fontWeight: 600, letterSpacing: 1 }}>{labData ? `${(labData.efficiency !== undefined ? labData.efficiency : 78).toFixed(2)}% Estable` : '78.00% Estable'}</Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', gap: 1, p: 1.5, 
          bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, 
          border: '1px solid rgba(0, 243, 255, 0.2)',
          boxShadow: '0 0 20px rgba(0,243,255,0.05)'
        }}>
          {Array.from({ length: 10 }).map((_, index) => {
            const items = Math.round((labData?.efficiency || 78) / 10);
            const isActive = index < items;
            return (
              <Box 
                key={index}
                sx={{ 
                  flex: 1, height: 12, 
                  bgcolor: isActive ? '#00f3ff' : 'rgba(0, 243, 255, 0.1)',
                  borderRadius: 0.5,
                  transition: 'all 0.3s'
                }}
              />
            );
          })}
        </Box>
      </Grid>

      {/* Global Temperature Meter */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Thermostat sx={{ fontSize: 14, color: tempPercent > 80 ? '#ff0055' : 'rgba(255,255,255,0.5)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>
              Temp. Global Laboratorio
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: tempPercent > 80 ? '#ff0055' : '#00f3ff', fontWeight: 600, letterSpacing: 1 }}>
            {globalTemp.toFixed(1)}°C / {maxTemp}°C
          </Typography>
        </Box>
        <Box sx={{ 
          height: 12, width: '100%', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 10, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${tempPercent}%` }}
            style={{ 
              height: '100%', 
              background: tempPercent > 80 
                ? 'linear-gradient(90deg, #ff0055, #ff5500)' 
                : 'linear-gradient(90deg, #00f3ff, #0055ff)',
              boxShadow: tempPercent > 80 ? '0 0 10px #ff0055' : 'none'
            }}
          />
        </Box>
      </Grid>
      </Grid>
    </Box>
  );
}
