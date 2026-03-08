"use client";

import React, { useState } from 'react';
import { Grid, Paper, Box, Typography, IconButton } from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { PowerChart, TemperatureChart, EnergyCostChart } from "./LaboratorioCharts";

export function LaboratorioChartsSection() {
  const [pinnedChart, setPinnedChart] = useState<string | null>(null);

  const handlePin = (chartId: string) => {
    setPinnedChart(prev => prev === chartId ? null : chartId);
  };

  const getGridSize = (chartId: string) => {
    if (pinnedChart === chartId) return { xs: 12, lg: 12 };
    if (pinnedChart !== null) return { xs: 12, lg: 6 }; // If another chart is pinned, the remaining two stack side-by-side underneath
    return { xs: 12, lg: 4 }; // Default: 3 columns
  };

  const getChartHeight = (chartId: string) => {
    return pinnedChart === chartId ? 450 : 300;
  };

  return (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      {/* Power Chart */}
      <Grid size={getGridSize('power')} sx={{ transition: 'all 0.5s ease-in-out' }}>
        <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ height: '100%' }}>
          <Paper variant="outlined" sx={{ 
            p: 3, height: '100%', minHeight: getChartHeight('power'), 
            bgcolor: 'rgba(10, 15, 30, 0.8)', 
            backdropFilter: 'blur(20px)', 
            borderColor: 'rgba(0, 243, 255, 0.15)',
            borderRadius: 4,
            boxShadow: 'inset 0 0 20px rgba(0,243,255,0.02), 0 8px 32px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.5s ease-in-out'
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#00f3ff', opacity: 0.8 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#00f3ff', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.9rem' }}>
                Poder Energético
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handlePin('power')} 
                sx={{ 
                  color: pinnedChart === 'power' ? '#00f3ff' : 'rgba(255,255,255,0.3)',
                  '&:hover': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' }
                }}
              >
                {pinnedChart === 'power' ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
              </IconButton>
            </Box>

            <Box sx={{ position: 'absolute', top: 70, left: 24, right: 24, bottom: 24 }}>
              <PowerChart />
            </Box>
          </Paper>
        </motion.div>
      </Grid>

      {/* Temperature Chart */}
      <Grid size={getGridSize('temp')} sx={{ transition: 'all 0.5s ease-in-out' }}>
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ height: '100%' }}>
          <Paper variant="outlined" sx={{ 
            p: 3, height: '100%', minHeight: getChartHeight('temp'), 
            bgcolor: 'rgba(10, 15, 30, 0.8)', 
            backdropFilter: 'blur(20px)', 
            borderColor: 'rgba(255, 0, 85, 0.15)',
            borderRadius: 4,
            boxShadow: 'inset 0 0 20px rgba(255,0,85,0.02), 0 8px 32px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.5s ease-in-out'
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#ff0055', opacity: 0.8 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ff0055', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.9rem' }}>
                Temperatura Central
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handlePin('temp')} 
                sx={{ 
                  color: pinnedChart === 'temp' ? '#ff0055' : 'rgba(255,255,255,0.3)',
                  '&:hover': { color: '#ff0055', bgcolor: 'rgba(255, 0, 85, 0.1)' }
                }}
              >
                {pinnedChart === 'temp' ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
              </IconButton>
            </Box>

            <Box sx={{ position: 'absolute', top: 70, left: 24, right: 24, bottom: 24 }}>
              <TemperatureChart />
            </Box>
          </Paper>
        </motion.div>
      </Grid>

      {/* Energy Cost Chart */}
      <Grid size={getGridSize('cost')} sx={{ transition: 'all 0.5s ease-in-out' }}>
        <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ height: '100%' }}>
          <Paper variant="outlined" sx={{ 
            p: 3, height: '100%', minHeight: getChartHeight('cost'), 
            bgcolor: 'rgba(10, 15, 30, 0.8)', 
            backdropFilter: 'blur(20px)', 
            borderColor: 'rgba(0, 230, 118, 0.15)',
            borderRadius: 4,
            boxShadow: 'inset 0 0 20px rgba(0,230,118,0.02), 0 8px 32px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.5s ease-in-out'
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#00e676', opacity: 0.8 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#00e676', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.9rem' }}>
                Costo Energético
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handlePin('cost')} 
                sx={{ 
                  color: pinnedChart === 'cost' ? '#00e676' : 'rgba(255,255,255,0.3)',
                  '&:hover': { color: '#00e676', bgcolor: 'rgba(0, 230, 118, 0.1)' }
                }}
              >
                {pinnedChart === 'cost' ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
              </IconButton>
            </Box>

            <Box sx={{ position: 'absolute', top: 70, left: 24, right: 24, bottom: 24 }}>
              <EnergyCostChart />
            </Box>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );
}
