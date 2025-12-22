'use client';

import React from 'react';
import { Box, Typography, Grid, Container, Paper, Avatar, LinearProgress } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppSelector } from '../../lib/hooks';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Dummy data for user assets if they are empty
const defaultAssets = [
  { name: 'Samium', value: 400, color: '#00f3ff', quantity: 1000, symbol: 'SAM' },
  { name: 'Bitcoin', value: 300, color: '#ffb700', quantity: 0.5, symbol: 'BTC' },
  { name: 'Credits', value: 300, color: '#ff0055', quantity: 300, symbol: 'CRED' },
];

export default function PortfolioPage() {
    const { walletsInfo } = useAppSelector((state) => state.auth);
    const { cryptos } = useAppSelector((state) => state.market);

    // If logged in and has wallet details, use them
    let assets = defaultAssets;
    
    if (walletsInfo?.store) {
        const store = walletsInfo.store;
        assets = store.map((item, i) => {
            // Find current price in market cryptos
            const marketCrypto = cryptos.find(c => c.id === item.id || c.identification.symbol === item.symbol); 
            const price = marketCrypto?.financial?.price || 0;
            const value = item.quantity * price;

            // Generate neon colors
            const colors = ['#00f3ff', '#ff0055', '#ffff00', '#00ff00', '#ff00ff', '#00ffff'];

            return {
                name: item.name,
                symbol: item.symbol, 
                value: value,
                quantity: item.quantity,
                color: colors[i % colors.length]
            };
        });
    }

    if (assets.length === 0 && walletsInfo) {
         assets = []; 
    }

    const totalValue = assets.reduce((acc, curr) => acc + curr.value, 0);

    const chartData = {
        labels: assets.map(a => a.name),
        datasets: [
            {
                data: assets.map(a => a.value),
                backgroundColor: assets.map(a => a.color),
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                hoverOffset: 10
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#00f3ff',
                bodyColor: '#fff',
                borderColor: 'rgba(0, 243, 255, 0.3)',
                borderWidth: 1,
            }
        },
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false
    };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Typography variant="h2" align="center" gutterBottom sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold', textShadow: '0 0 20px rgba(0,243,255,0.5)' }}>
                INVENTARIO DE ACTIVOS
                </Typography>
                <Typography variant="h5" align="center" sx={{ mb: 8, color: 'text.secondary' }}>
                    Valor Total: <span style={{ color: '#fff', fontWeight: 'bold' }}>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </Typography>
            </motion.div>

            {assets.length > 0 ? (
                <Grid container spacing={8} justifyContent="center" alignItems="center">
                    <Grid size={{ xs: 12, md: 5 }}>
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
                            <Doughnut data={chartData} options={chartOptions} />
                            <Box sx={{ 
                                position: 'absolute', 
                                top: '50%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)', 
                                textAlign: 'center',
                                pointerEvents: 'none'
                             }}>
                                <Typography variant="h6" color="primary.main">PORTAFOLIO</Typography>
                                <Typography variant="caption" color="text.secondary">DIVERSIFICACIÓN</Typography>
                            </Box>
                        </Box>
                        </motion.div>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {assets.map((asset, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ x: 50, opacity: 0 }} 
                                    animate={{ x: 0, opacity: 1 }} 
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            bgcolor: 'rgba(10, 10, 25, 0.6)', 
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderLeft: `4px solid ${asset.color}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.3s',
                                            cursor: 'default',
                                            '&:hover': {
                                                transform: 'translateX(10px)',
                                                bgcolor: 'rgba(10, 10, 25, 0.8)',
                                                boxShadow: `0 0 20px ${asset.color}20`
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Avatar sx={{ bgcolor: `${asset.color}20`, color: asset.color, width: 56, height: 56, fontWeight: 'bold' }}>
                                                {asset.symbol ? asset.symbol[0] : asset.name[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" color="white" fontWeight="bold">
                                                    {asset.name}
                                                </Typography>
                                                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                                    {asset.quantity.toLocaleString()} {asset.symbol}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                                             <Typography variant="h6" sx={{ color: asset.color, fontWeight: 'bold' }}>
                                                ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                             </Typography>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
                                                 <LinearProgress 
                                                    variant="determinate" 
                                                    value={(asset.value / totalValue) * 100} 
                                                    sx={{ 
                                                        width: 80, 
                                                        height: 4, 
                                                        borderRadius: 2,
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        '& .MuiLinearProgress-bar': { bgcolor: asset.color }
                                                    }}
                                                 />
                                                 <Typography variant="caption" color="text.secondary">
                                                     {((asset.value / totalValue) * 100).toFixed(1)}%
                                                 </Typography>
                                             </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            ) : (
                <Paper sx={{ p: 5, bgcolor: 'rgba(255,255,255,0.05)', textAlign: 'center', maxWidth: 500, mx: 'auto', mt: 10 }}>
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                        Inventario Vacío
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No posees activos actualmente. Visita el Mercado para adquirir tus primeros criptoactivos.
                    </Typography>
                </Paper>
            )}
        </Container>
    </Box>
  );
}
