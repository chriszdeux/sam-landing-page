import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Backpack, TrendingUp, LocalAtm } from '@mui/icons-material';

export const PortfolioAnimation = ({ color, variant = 'balance' }: { color: string, variant?: 'balance' | 'inventory' | 'stats' }) => {
    const [balance, setBalance] = useState(1000);
    const [assets, setAssets] = useState<{name: string, value: number, percentage: number}[]>([
        { name: 'SOL', value: 80, percentage: 80 },
        { name: 'ETH', value: 15, percentage: 15 },
        { name: 'BTC', value: 5, percentage: 5 }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBalance(prev => prev + Math.random() * 10 - 2);
            setAssets(prev => prev.map(asset => ({ ...asset, value: asset.value + Math.random() * 2 - 1 })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (variant === 'inventory') {
        const items = ['Engine V2', 'Shield Mk1', 'Laser Cannon', 'Mining Drone', 'Fuel Cell', 'Nav Module'];
        return (
             <Box sx={{ width: '100%', height: '100%', p: 4, bgcolor: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="overline" color={color} fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Backpack fontSize="small" /> Inventory Storage
                </Typography>
                <Grid container spacing={2}>
                    {items.map((item, i) => (
                        <Grid size={{ xs: 6 }} key={i}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    border: `1px solid ${color}40`,
                                    borderRadius: 8,
                                    padding: 16,
                                    background: `${color}10`,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <Box sx={{ width: 40, height: 40, bgcolor: color, borderRadius: 1 }} />
                                <Typography variant="caption" align="center">{item}</Typography>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
             </Box>
        );
    }

    if (variant === 'stats') {
        return (
            <Box sx={{ width: '100%', height: '100%', p: 4, bgcolor: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="overline" color={color} fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp fontSize="small" /> Performance Metrics
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 2 }}>
                    {[65, 40, 75, 50, 90, 85].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{
                                flex: 1,
                                background: `linear-gradient(to top, ${color}20, ${color})`,
                                borderRadius: '4px 4px 0 0',
                                position: 'relative'
                            }}
                        >
                            <Typography variant="caption" sx={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', color: color }}>
                                {h}%
                            </Typography>
                        </motion.div>
                    ))}
                </Box>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="caption" color="gray">Monthly ROI</Typography>
                        <Typography variant="h5" color={color}>+24.5%</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="gray">Staking APY</Typography>
                        <Typography variant="h5" color={color}>12.8%</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Default: Balance
    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%', 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.8)',
            color: 'white'
        }}>
            <Typography variant="overline" color={color} fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalAtm fontSize="small" /> Total Balance
            </Typography>
            <motion.h1
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                style={{ fontSize: '3rem', margin: '0 0 20px 0', textShadow: `0 0 20px ${color}80` }}
            >
                ${balance.toFixed(2)}
            </motion.h1>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {assets.map((asset, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: color, opacity: 0.2 + (i * 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {asset.name[0]}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">{asset.name}</Typography>
                                <Typography variant="body2" color={color}>{asset.value.toFixed(1)}%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${asset.value}%` }} 
                                    style={{ height: '100%', backgroundColor: color, borderRadius: 2 }} 
                                />
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
