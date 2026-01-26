'use client';

import React from 'react';
import { Box, Typography, Grid, Container, Paper, Avatar, LinearProgress } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppSelector } from '../../lib/hooks';
import { motion, useAnimation } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Radar, PolarArea, Bar } from 'react-chartjs-2';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { TaoIcon } from '../../components/ui/TaoIcon';
import { WalletManager } from '../../components/portfolio/WalletManager';
import { TechFrame } from '../../components/ui/TechFrame';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';
import { PageHeader } from '../../components/ui/PageHeader';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface Asset {
    name: string;
    value: number;
    color: string;
    quantity: number;
    symbol: string;
}

export default function PortfolioPage() {
    const { walletsInfo } = useAppSelector((state) => state.auth);
    const { cryptos } = useAppSelector((state) => state.market);
    const { selectedNetwork } = useAppSelector((state) => state.blockchain);
    const dispatch = useDispatch<AppDispatch>();
    const [chartType, setChartType] = React.useState('doughnut');
    const controls = useAnimation();

    // Fetch cryptos if they are not loaded
    React.useEffect(() => {
        if (selectedNetwork?.id && cryptos.length === 0) {
            dispatch(fetchCryptos(selectedNetwork.id));
        }
    }, [dispatch, selectedNetwork?.id, cryptos.length]);

    // Trigger animation every 4-7 seconds
    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const animate = async () => {
            await controls.start({
                filter: [
                    'brightness(1) drop-shadow(0 0 0px rgba(0,243,255,0))', 
                    'brightness(1.3) drop-shadow(0 0 25px rgba(0,243,255,0.6))', 
                    'brightness(1) drop-shadow(0 0 0px rgba(0,243,255,0))'
                ],
                transition: { duration: 2, ease: "easeInOut" }
            });
            
            // Schedule next animation
            const delay = Math.random() * (7000 - 4000) + 4000;
            timeoutId = setTimeout(animate, delay);
        };

        // Start initial loop
        timeoutId = setTimeout(animate, 2000);

        return () => clearTimeout(timeoutId);
    }, [controls]);

    // Use store data or empty array
    let assets: Asset[] = [];
    
    // Only use default assets if strictly needed for demo (optional, but per request to show user info, we prefer real data)
    // For now, if no wallet info, we might show empty or defaults only if not logged in.
    // Let's rely on walletsInfo.
    
    if (walletsInfo?.store) {
        const store = walletsInfo.store;
        assets = store.map((item, i) => {
            // Find current price in market cryptos
            const marketCrypto = cryptos.find(c => c.id === item.id || c.identification.symbol === item.symbol); 
            const price = marketCrypto?.financial?.price || 0;
            const quantity = Number(item.quantity) || 0;
            const value = quantity * price;

            // Generate neon colors
            const colors = ['#00f3ff', '#ff0055', '#ffff00', '#00ff00', '#ff00ff', '#00ffff'];

            return {
                name: item.name,
                symbol: item.symbol, 
                value: value,
                quantity: quantity,
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

    const barChartOptions = {
        ...chartOptions,
        cutout: undefined,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: 'rgba(255,255,255,0.7)' }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.7)' }
            }
        }
    };

    const radarChartOptions = {
        ...chartOptions,
        cutout: undefined,
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: 'rgba(255,255,255,0.7)', font: { size: 12 } },
                ticks: { display: false, backdropColor: 'transparent' }
            }
        },
        elements: {
            line: {
                borderWidth: 2,
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.2)'
            }
        }
    };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <PageHeader 
                    title="INVENTARIO DE ACTIVOS" 
                    subtitle="Gestión y visualización de tu portafolio de activos digitales."
                    color="#00f3ff"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                    <TechFrame>
                        <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" color="text.secondary">Valor Total:</Typography>
                            <Typography variant="h4" sx={{ color: '#00f3ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TaoIcon size={32} /> 
                                {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </TechFrame>
                </Box>
            </motion.div>

            <WalletManager />

            {assets.length > 0 ? (
                <Grid container spacing={8} justifyContent="center" alignItems="center">
                    <Grid size={{ xs: 12, md: 5 }}>
                        <motion.div 
                            animate={controls}
                        >
                        <Box sx={{ position: 'relative', height: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ToggleButtonGroup
                                value={chartType}
                                exclusive
                                onChange={(e, newType) => { if(newType) setChartType(newType) }}
                                aria-label="chart type"
                                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                                size="small"
                            >
                                <ToggleButton value="doughnut" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                                    <DonutLargeIcon />
                                </ToggleButton>
                                <ToggleButton value="radar" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                                    <TrackChangesIcon />
                                </ToggleButton>
                                <ToggleButton value="polar" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                                    <DataUsageIcon />
                                </ToggleButton>
                                <ToggleButton value="bar" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' } }}>
                                    <BarChartIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <Box sx={{ position: 'relative', height: 350, width: '100%' }}>
                                {chartType === 'doughnut' && <Doughnut data={chartData} options={chartOptions} />}
                                {chartType === 'radar' && <Radar data={chartData} options={radarChartOptions} />}
                                {chartType === 'polar' && <PolarArea data={chartData} options={{ ...chartOptions, scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } } }} />}
                                {chartType === 'bar' && <Bar data={chartData} options={barChartOptions} />}
                                
                                {chartType === 'doughnut' && (
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
                                )}
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
                                    <TechFrame color={asset.color} className="w-full">
                                        <Box 
                                            sx={{ 
                                                p: 3, 
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.02)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Avatar sx={{ bgcolor: `${asset.color}20`, color: asset.color, width: 56, height: 56, fontWeight: 'bold', border: `1px solid ${asset.color}40` }}>
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
                                                 <Typography variant="h6" sx={{ color: asset.color, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    <TaoIcon size={20} /> {asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                 </Typography>
                                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
                                                     <LinearProgress 
                                                        variant="determinate" 
                                                        value={totalValue > 0 ? (asset.value / totalValue) * 100 : 0} 
                                                        sx={{ 
                                                            width: 80, 
                                                            height: 4, 
                                                            borderRadius: 2,
                                                            bgcolor: 'rgba(255,255,255,0.1)',
                                                            '& .MuiLinearProgress-bar': { bgcolor: asset.color }
                                                        }}
                                                     />
                                                     <Typography variant="caption" color="text.secondary">
                                                         {totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : '0.0'}%
                                                     </Typography>
                                                 </Box>
                                            </Box>
                                        </Box>
                                    </TechFrame>
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
