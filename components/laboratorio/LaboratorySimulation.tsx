'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Stack, Chip, Grid, Divider } from '@mui/material';
import { Warning, PowerSettingsNew, Speed, Thermostat, Favorite, Memory } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { updateSimulationData, setCooldownState, toggleLaboratoryPower } from '../../lib/features/labs/reducer';

export const LaboratorySimulation = () => {
    const dispatch = useAppDispatch();
    const lab = useAppSelector((state: RootState) => state.reducerLabs.currentLab);
    const isPoweredOn = useAppSelector((state: RootState) => state.reducerLabs.isPoweredOn);
    const isOverheated = useAppSelector((state: RootState) => state.reducerLabs.isOverheated);

    const temperature = lab?.temperature || 0;
    const performance = lab?.efficiency || 0;
    const life = lab?.currentLife || 100;
    // Forzar el visualizador a iniciar en 5 H/s si viene muy bajo de base de datos
    const hashrate = (lab?.hashRate && lab.hashRate > 1) ? lab.hashRate : 5;

    // Estado local para animación de caída rápida (la caída de enfriamiento la maneja useLabSimulation en backend/redux)
    const [emergencyMode, setEmergencyMode] = useState<boolean>(false);

    useEffect(() => {
        if (temperature > 72 && isPoweredOn) {
            setEmergencyMode(true);
        } else if (temperature <= 72) {
            setEmergencyMode(false);
        }
    }, [temperature, isPoweredOn]);

    // Controles de Escalón
    const handleBoost10 = () => {
        if (!isPoweredOn || isOverheated) return;
        // Incremento de rendimiento de 10% (tope 100%)
        const newEff = Math.min(100, performance + 10);
        dispatch(updateSimulationData({ efficiency: Number(newEff.toFixed(4)) }));
    };

    const handleBoost20 = () => {
        if (!isPoweredOn || isOverheated) return;
        // Incremento de rendimiento de 20% (tope 100%)
        const newEff = Math.min(100, performance + 20);
        dispatch(updateSimulationData({ efficiency: Number(newEff.toFixed(4)) }));
    };

    const handlePowerOff = () => {
        if (isPoweredOn) {
            // El botón dice Apagado de Emergencia, dispara cooldown o togglePower
            dispatch(setCooldownState(true));
            // Forzar rendimiento a 0 como dice el prompt
            dispatch(updateSimulationData({ efficiency: 0 }));
        } else {
            // Iniciar sistema si está apagado y no sobrecalentado
            dispatch(toggleLaboratoryPower());
        }
    };

    // Funciones Auxiliares de Diseño
    const getTempColor = () => {
        if (temperature > 72) return '#ff1744'; // Rojo (Crítico)
        if (temperature > 60) return '#ffb700'; // Amarillo (Advertencia)
        return '#00e676'; // Verde (Normal)
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                bgcolor: 'rgba(10, 12, 16, 0.8)',
                border: `1px solid ${emergencyMode ? 'rgba(255, 23, 68, 0.5)' : 'rgba(0, 243, 255, 0.2)'}`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                boxShadow: emergencyMode ? '0 0 30px rgba(255, 23, 68, 0.2)' : '0 0 30px rgba(0, 243, 255, 0.05)',
                transition: 'all 0.3s ease'
            }}
        >
            <AnimatePresence>
                {emergencyMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            pointerEvents: 'none',
                            backgroundColor: 'rgba(255, 23, 68, 0.05)',
                            zIndex: 0
                        }}
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: '4px',
                            bgcolor: '#ff1744',
                            animation: 'pulse 1s infinite'
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Memory sx={{ color: '#00f3ff' }} />
                        SIMULADOR DE LABORATORIO
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                        {emergencyMode && (
                            <Chip 
                                icon={<Warning />} 
                                label="MODO DE CAÍDA ACTIVO" 
                                color="error" 
                                variant="outlined" 
                                sx={{ animation: 'pulse 1s infinite', fontWeight: 'bold' }}
                            />
                        )}
                        <Chip 
                            label={isOverheated ? "ENFRIANDO..." : isPoweredOn ? "OPERATIVO" : "APAGADO"} 
                            sx={{ 
                                bgcolor: isOverheated ? '#00f3ff20' : isPoweredOn ? '#00e67620' : '#424242',
                                color: isOverheated ? '#00f3ff' : isPoweredOn ? '#00e676' : '#9e9e9e',
                                fontWeight: 'bold',
                                border: `1px solid ${isOverheated ? '#00f3ff' : isPoweredOn ? '#00e676' : '#9e9e9e'}`
                            }} 
                        />
                    </Box>
                </Box>

                <Grid container spacing={4} mb={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                            <Typography variant="overline" color="text.secondary" display="flex" alignItems="center" gap={1}>
                                <Speed /> OUTPUT DE CÓMPUTO
                            </Typography>
                            <Typography variant="h2" sx={{ color: '#00f3ff', fontFamily: 'monospace', fontWeight: 'bold', mt: 1 }}>
                                {hashrate.toFixed(2)} <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>H/s</span>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="caption" sx={{ color: getTempColor(), fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Thermostat fontSize="small" /> TEMPERATURA ({temperature.toFixed(1)}°C)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Máx 80°C</Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(temperature / 80) * 100} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': { 
                                            bgcolor: getTempColor(),
                                            transition: 'background-color 0.3s ease'
                                        }
                                    }} 
                                />
                            </Box>

                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="caption" sx={{ color: '#b000ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Speed fontSize="small" /> RENDIMIENTO ({performance.toFixed(2)}%)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Tope 80%</Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={performance} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': { bgcolor: '#b000ff', transition: 'transform 0.3s ease' }
                                    }} 
                                />
                            </Box>

                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="caption" sx={{ color: life > 30 ? '#00e676' : '#ff1744', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Favorite fontSize="small" /> VIDA ÚTIL ({life.toFixed(2)}%)
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={life} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': { bgcolor: life > 30 ? '#00e676' : '#ff1744', transition: 'transform 0.3s ease' }
                                    }} 
                                />
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                <Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            disabled={!isPoweredOn || isOverheated || emergencyMode}
                            onClick={handleBoost10}
                            sx={{
                                bgcolor: 'rgba(0, 243, 255, 0.1)',
                                color: '#00f3ff',
                                border: '1px solid #00f3ff',
                                '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.2)' }
                            }}
                        >
                            ESCALÓN 10%
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!isPoweredOn || isOverheated || emergencyMode}
                            onClick={handleBoost20}
                            sx={{
                                bgcolor: 'rgba(176, 0, 255, 0.1)',
                                color: '#b000ff',
                                border: '1px solid #b000ff',
                                '&:hover': { bgcolor: 'rgba(176, 0, 255, 0.2)' }
                            }}
                        >
                            ESCALÓN 20%
                        </Button>
                    </Stack>

                    <Button
                        variant="contained"
                        color={isPoweredOn ? "error" : "success"}
                        startIcon={<PowerSettingsNew />}
                        onClick={handlePowerOff}
                        disabled={isOverheated}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            boxShadow: isPoweredOn ? '0 0 15px rgba(255,23,68,0.5)' : 'none'
                        }}
                    >
                        {isPoweredOn ? "APAGADO DE EMERGENCIA" : "INICIAR SISTEMA"}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};
