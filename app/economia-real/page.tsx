'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { MarketTable } from '../../components/economy/MarketTable';
import { TrendingUp, Activity, Globe } from 'lucide-react';

export default function RealEconomyPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 16, pb: 8 }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h1" align="center" sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            mb: 2,
            background: 'linear-gradient(45deg, #00f3ff, #ffb700)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ECONOMÍA REAL
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 8, color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
            Un mercado vivo y dinámico impulsado por la oferta y la demanda de los jugadores.
            Cada recurso tiene valor, cada transacción cuenta.
          </Typography>
        </motion.div>

        {/* Global Stats */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            { label: 'Capitalización de Mercado', value: '$1.2B', change: '+2.5%', icon: Globe },
            { label: 'Volumen 24h', value: '$450M', change: '+12.8%', icon: Activity },
            { label: 'Dominancia BTC', value: '42.5%', change: '-0.5%', icon: TrendingUp },
          ].map((stat, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Box sx={{
                  p: 3,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(0, 243, 255, 0.1)', borderRadius: 2, color: '#00f3ff' }}>
                    <stat.icon size={24} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Stack direction="row" alignItems="baseline" spacing={1}>
                      <Typography variant="h5" fontWeight="bold" color="white">
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: stat.change.startsWith('+') ? '#00ff88' : '#ff0055' }}>
                        {stat.change}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Market Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MarketTable />
        </motion.div>
      </Container>
    </Box>
  );
}
