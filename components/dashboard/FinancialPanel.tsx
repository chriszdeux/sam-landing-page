'use client';

import React from 'react';
import { Box, Typography, Stack, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';
import { CryptoHoldings } from '../../lib/features/auth/types';

export const FinancialPanel = () => {
    const { userInfo, walletsInfo } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const balance = userInfo?.balance || 0;
    const assets: CryptoHoldings[] = walletsInfo?.store || [];

    // Sort by quantity descending and take top 5
    const topAssets = [...assets]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const handleAction = (type: 'buy' | 'sell') => {
        router.push(`/market/trade?type=${type.toUpperCase()}`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Balance Block */}
            <TechFrame color="#00f3ff">
                <Box sx={{ p: 3 }}>
                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
                        BALANCE TOTAL
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>
                            {balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>
                            THAOS
                        </Typography>
                    </Box>
                </Box>
            </TechFrame>

            {/* Operations Block */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAction('buy')}
                    sx={{
                        py: 1.5,
                        bgcolor: 'rgba(0, 230, 118, 0.1)',
                        color: '#00e676',
                        border: '1px solid #00e676',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.2)', borderColor: '#00e676' }
                    }}
                >
                    COMPRAR
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAction('sell')}
                    sx={{
                        py: 1.5,
                        bgcolor: 'rgba(255, 23, 68, 0.1)',
                        color: '#ff1744',
                        border: '1px solid #ff1744',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'rgba(255, 23, 68, 0.2)', borderColor: '#ff1744' }
                    }}
                >
                    VENDER
                </Button>
            </Box>

            {/* Assets List Block */}
            <TechFrame color="rgba(255,255,255,0.1)">
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            ACTIVOS PRINCIPALES
                        </Typography>
                        <Button 
                            variant="text" 
                            size="small" 
                            onClick={() => router.push('/dashboard/assets')}
                            sx={{ color: '#00f3ff', '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.05)' } }}
                        >
                            Ver todo
                        </Button>
                    </Box>

                    <Stack spacing={2}>
                        {topAssets.length > 0 ? (
                            topAssets.map((asset, index) => (
                                <motion.div
                                    key={asset.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        p: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                fontSize: '0.8rem', 
                                                bgcolor: 'rgba(0, 243, 255, 0.1)', 
                                                color: '#00f3ff',
                                                border: '1px solid rgba(0, 243, 255, 0.3)'
                                            }}>
                                                {asset.symbol[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                    {asset.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {asset.symbol}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#00f3ff', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                            {asset.quantity.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', py: 2 }}>
                                No se encontraron activos
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </TechFrame>
        </Box>
    );
};
