'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { formatHash } from '../../lib/utils/formatHash';

export const EnergyWidget = () => {
    const pathname = usePathname();
    
    // Solo realizar selección y suscripción si NO estamos en la vista de operaciones (/operaciones)
    const isDashboard = pathname === '/operaciones';
    const widgetData = useAppSelector((state: RootState) => {
        if (isDashboard) return null;
        const lab = state.reducerLabs.currentLab;
        return {
            localHash: lab?.energy ?? 0,
            temperature: lab?.temperature || 0,
            maxTemperature: lab?.maxTemperature || 80,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            chronoBurstFreqTypes: state.blockchain.chronoBurstFreqTypes
        };
    }, (prev, next) => {
        if (prev === null && next === null) return true;
        if (prev === null || next === null) return false;
        return (
            prev.localHash === next.localHash &&
            prev.temperature === next.temperature &&
            prev.maxTemperature === next.maxTemperature &&
            prev.isPoweredOn === next.isPoweredOn &&
            prev.chronoBurstFreqTypes === next.chronoBurstFreqTypes
        );
    });

    if (!widgetData) return null;

    const { localHash, temperature, maxTemperature, isPoweredOn, chronoBurstFreqTypes } = widgetData;
    const isOverheated = temperature >= maxTemperature;
    const formattedHash = formatHash(localHash, chronoBurstFreqTypes);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{ 
                    position: 'fixed', 
                    bottom: 20, 
                    right: 20, 
                    zIndex: 1000 
                }}
            >
                <Box sx={{ 
                    bgcolor: 'rgba(10, 10, 10, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isOverheated ? '#ff1744' : '#00f3ff'}50`,
                    borderRadius: 2,
                    p: 2,
                    width: 280,
                    boxShadow: `0 0 20px ${isOverheated ? '#ff1744' : '#00f3ff'}20`,
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {/* Background Glow */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: -50, 
                        right: -50, 
                        width: 100, 
                        height: 100, 
                        bgcolor: isOverheated ? '#ff1744' : '#00f3ff',
                        filter: 'blur(50px)',
                        opacity: 0.1,
                        zIndex: 0
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="caption" sx={{ 
                                color: isOverheated ? '#ff1744' : '#00f3ff', 
                                fontWeight: 'bold',
                                letterSpacing: 1
                            }}>
                                {isOverheated ? 'ALERTA: SOBRECALENTAMIENTO' : 'HASH ACUMULADO LOCAL'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#00f3ff', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                {formattedHash}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
                                TEMP: {temperature.toFixed(1)}°C / {maxTemperature}°C
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '50%', 
                                    bgcolor: isPoweredOn ? '#00e676' : '#ff1744',
                                    boxShadow: `0 0 5px ${isPoweredOn ? '#00e676' : '#ff1744'}`
                                }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem' }}>
                                    {isPoweredOn ? 'ON' : 'OFF'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </AnimatePresence>
    );
};
