"use client";

import { Box, Container, Typography, IconButton, Grid, Paper } from "@mui/material";
import { ArrowBack, Analytics, TrendingUp, Group, Category } from "@mui/icons-material";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatsPage() {
  return (
    <Box sx={{ minHeight: '100vh', pt: 15, pb: 10, bgcolor: '#05050c' }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" gap={2} mb={6}>
          <Link href="/galactic-market">
            <IconButton sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
            MARKET <span style={{ color: '#ff0055' }}>ANALYTICS</span>
          </Typography>
        </Box>

        <Grid container spacing={3}>
           <StatItem icon={<TrendingUp />} title="Volumen 24h" value="1.2M THAO" color="#00f3ff" />
           <StatItem icon={<Group />} title="Traders Activos" value="2,450" color="#ffd700" />
           <StatItem icon={<Category />} title="Módulos en Circulación" value="12,800" color="#ff0055" />
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Paper sx={{ p: 6, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
             <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>Tendencia de Precios</Typography>
             <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>[ GRÁFICO EN TIEMPO REAL - PRÓXIMAMENTE ]</Typography>
             </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

function StatItem({ icon, title, value, color }: { icon: any, title: string, value: string, color: string }) {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          {React.cloneElement(icon, { sx: { color } })}
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>{value}</Typography>
      </Paper>
    </Grid>
  );
}

import React from 'react';
