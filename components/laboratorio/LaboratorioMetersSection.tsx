import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

// ... interfaces line 4-32

export interface SlotMachine {
  id?: string | number;
  name?: string;
  performance?: string;
  color?: string;
  currentLife?: number;
  lifeLimit?: number;
  temperature?: number;
  efficiency?: number;
  installedAt?: string;
}

export interface LabDataInterface {
  id?: string;
  userId?: string;
  type?: string;
  capacity?: number;
  extraCapacity?: number;
  powerMining?: number;
  storage?: number;
  temperature?: number;
  maxTemperature?: number;
  coolingLevel?: number;
  currentLife?: number;
  lifeLimit?: number;
  efficiency?: number;
  slots?: SlotMachine[];
  createdAt?: string;
}

interface Props {
  labData: LabDataInterface | null;
  isWinner?: boolean;
}

export function LaboratorioMetersSection({ labData, isWinner }: Props) {
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
          <Typography variant="caption" sx={{ color: '#00f3ff', fontWeight: 600, letterSpacing: 1 }}>{labData ? `${labData.efficiency || 78}% Estable` : '78% Estable'}</Typography>
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
                  borderRadius: 1, 
                  boxShadow: isActive ? '0 0 10px #00f3ff, inset 0 0 5px rgba(255,255,255,0.5)' : 'none',
                  opacity: isActive ? 1 : 0.4,
                  transition: 'all 0.3s ease'
                }} 
              />
            );
          })}
        </Box>
      </Grid>

      {/* Dynamics / Temperature Meter */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>Térmica: Temp / Máx</Typography>
          <Typography variant="caption" sx={{ color: '#ffb700', fontWeight: 600, letterSpacing: 1 }}>{labData ? `${labData.temperature || 30}°C / ${labData.maxTemperature || 80}°C` : '42°C / 80°C'}</Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', gap: 1, p: 1.5, 
          bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, 
          border: '1px solid rgba(255, 183, 0, 0.2)',
          boxShadow: '0 0 20px rgba(255, 183, 0, 0.05)'
        }}>
          {Array.from({ length: 10 }).map((_, index) => {
            const currentTemp = labData?.temperature || 42;
            const maxTemp = labData?.maxTemperature || 80;
            const items = Math.round((currentTemp / maxTemp) * 10);
            const isActive = index < items;
            return (
              <Box 
                key={index}
                sx={{ 
                  flex: 1, height: 12, 
                  bgcolor: isActive ? '#ffb700' : 'rgba(255, 183, 0, 0.1)', 
                  borderRadius: 1, 
                  boxShadow: isActive ? '0 0 10px #ffb700, inset 0 0 5px rgba(255,255,255,0.5)' : 'none',
                  opacity: isActive ? 1 : 0.4,
                  transition: 'all 0.3s ease'
                }} 
              />
            );
          })}
        </Box>
      </Grid>

      {/* Cooling Level Meter */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>Nivel de Enfriamiento</Typography>
          <Typography variant="caption" sx={{ color: '#00e676', fontWeight: 600, letterSpacing: 1 }}>{labData ? `${labData.coolingLevel || 100}%` : '85%'}</Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', gap: 1, p: 1.5, 
          bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, 
          border: '1px solid rgba(0, 230, 118, 0.2)',
          boxShadow: '0 0 20px rgba(0, 230, 118, 0.05)'
        }}>
          {Array.from({ length: 10 }).map((_, index) => {
            const items = Math.round((labData?.coolingLevel || 85) / 10);
            const isActive = index < items;
            return (
              <Box 
                key={index}
                sx={{ 
                  flex: 1, height: 12, 
                  bgcolor: isActive ? '#00e676' : 'rgba(0, 230, 118, 0.1)', 
                  borderRadius: 1, 
                  boxShadow: isActive ? '0 0 10px #00e676, inset 0 0 5px rgba(255,255,255,0.5)' : 'none',
                  opacity: isActive ? 1 : 0.4,
                  transition: 'all 0.3s ease'
                }} 
              />
            );
          })}
        </Box>
      </Grid>
      
      {/* Storage and Power Meter */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>Hardware Life / Storage</Typography>
          <Typography variant="caption" sx={{ color: '#b000ff', fontWeight: 600, letterSpacing: 1 }}>{labData ? `${labData.currentLife || 100}/${labData.lifeLimit || 100} Ciclos | ${labData.storage || 0}TB` : '90/100 Ciclos | 5TB'}</Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', gap: 1, p: 1.5, 
          bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, 
          border: '1px solid rgba(176, 0, 255, 0.2)',
          boxShadow: '0 0 20px rgba(176, 0, 255, 0.05)'
        }}>
          {Array.from({ length: 10 }).map((_, index) => {
            const life = labData?.currentLife || 90;
            const limit = labData?.lifeLimit || 100;
            const items = Math.round((life / limit) * 10);
            const isActive = index < items;
            return (
              <Box 
                key={index}
                sx={{ 
                  flex: 1, height: 12, 
                  bgcolor: isActive ? '#b000ff' : 'rgba(176, 0, 255, 0.1)', 
                  borderRadius: 1, 
                  boxShadow: isActive ? '0 0 10px #b000ff, inset 0 0 5px rgba(255,255,255,0.5)' : 'none',
                  opacity: isActive ? 1 : 0.4,
                  transition: 'all 0.3s ease'
                }} 
              />
            );
          })}
        </Box>
      </Grid>

      </Grid>
    </Box>
  );
}
