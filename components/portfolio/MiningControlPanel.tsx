"use client";

import React from 'react';
import { Box, Typography, Stack, Grid, CircularProgress, LinearProgress, Button as MuiButton } from '@mui/material';
import { Zap, Activity, Thermometer, Clock, Coins, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CircularGauge = ({ value, maxValue, label, color, icon }: any) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', mb: 1.5 }}>
                <CircularProgress variant="determinate" value={100} size={80} thickness={2} sx={{ color: 'rgba(255,255,255,0.05)' }} />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    <CircularProgress 
                        variant="determinate" 
                        value={percentage} 
                        size={80} 
                        thickness={3} 
                        sx={{ 
                            color: color, 
                            filter: 'drop-shadow(0 0 8px ' + color + '44)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} 
                    />
                </motion.div>
                <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, opacity: 0.8 }}>
                    {icon}
                </Box>
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, lineHeight: 1, mb: 0.5 }}>{Math.round(value)}%</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1 }}>{label.toUpperCase()}</Typography>
        </Box>
    );
};

export const MiningControlPanel = ({ 
    powerMining, 
    maxPower, 
    efficiency, 
    temperature, 
    uptime, 
    energyAvailable,
    maxEnergy,
    tokensEarned,
    confirmedTxCount,
    onInjectPower, 
    isInjecting 
}: any) => {
    const energyPercentage = (energyAvailable / maxEnergy) * 100;

    return (
        <Stack spacing={4}>
            {/* Panel de Rendimiento */}
            <Box sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: '1px solid rgba(0, 255, 136, 0.2)', 
                bgcolor: 'rgba(5, 10, 15, 0.6)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
            }}>
                <Typography variant="overline" sx={{ color: '#00ff88', letterSpacing: 3, fontWeight: 900, display: 'block', mb: 4, opacity: 0.8 }}>
                    MINERÍA // OPERACIONES
                </Typography>
                
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularGauge value={efficiency} maxValue={100} label="Vida" color="#00f3ff" icon={<Activity size={20} />} />
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularGauge value={temperature} maxValue={100} label="Temp" color="#ff0055" icon={<Thermometer size={20} />} />
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularGauge value={uptime} maxValue={100} label="Uptime" color="#ffaa00" icon={<Clock size={20} />} />
                    </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: 1 }}>POTENCIA ACTIVA</Typography>
                        <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 900 }}>{Math.round(powerMining)} / {maxPower} GH/s</Typography>
                    </Stack>
                    <LinearProgress 
                        variant="determinate" 
                        value={(powerMining / maxPower) * 100} 
                        sx={{ 
                            height: 6, 
                            borderRadius: 1, 
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#00ff88',
                                boxShadow: '0 0 15px #00ff8866',
                                transition: 'transform 0.5s linear'
                            }
                        }} 
                    />
                </Box>
            </Box>

            {/* Resultados de Última Operación */}
            <Box sx={{ 
                p: 2, 
                borderRadius: 4, 
                bgcolor: 'rgba(0, 243, 255, 0.05)', 
                border: '1px solid rgba(0, 243, 255, 0.1)' 
            }}>
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, mb: 2, display: 'block' }}>ÚLTIMA OPERACIÓN</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Coins size={16} color="#ffd700" />
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block' }}>GANADO</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#ffd700' }}>+{tokensEarned} SAM-G</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircle size={16} color="#00ff88" />
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block' }}>TX CONF.</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#00ff88' }}>{confirmedTxCount}</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            {/* Módulo de Energía e Inyección */}
            <Box sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: '1px solid rgba(255, 183, 0, 0.2)', 
                bgcolor: 'rgba(15, 10, 5, 0.4)',
                backdropFilter: 'blur(10px)'
            }}>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" sx={{ color: '#ffb700', fontWeight: 900, letterSpacing: 1 }}>ENERGÍA ACUMULADA</Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 900 }}>{Math.floor(energyAvailable)} / {maxEnergy} EP</Typography>
                    </Stack>
                    
                    <Box sx={{ position: 'relative', height: 40, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255, 183, 0, 0.1)' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: (energyAvailable / maxEnergy * 100) + '%' }}
                            style={{ 
                                height: '100%', 
                                background: 'linear-gradient(90deg, rgba(255, 183, 0, 0.2) 0%, rgba(255, 183, 0, 0.6) 100%)',
                                boxShadow: '0 0 20px rgba(255, 183, 0, 0.2)'
                            }}
                        />
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        <MuiButton 
                            fullWidth 
                            variant="contained"
                            onClick={onInjectPower}
                            disabled={isInjecting || energyAvailable < 10}
                            startIcon={isInjecting ? <CircularProgress size={20} color="inherit" /> : <Zap size={20} />}
                            sx={{ 
                                py: 2, 
                                fontSize: '1rem', 
                                fontWeight: 900, 
                                letterSpacing: 2,
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 183, 0, 0.9)',
                                color: 'black',
                                '&:hover': { bgcolor: '#ffb700', transform: 'translateY(-2px)' },
                                '&:disabled': { bgcolor: 'rgba(255, 183, 0, 0.3)', color: 'rgba(0,0,0,0.5)' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 0 20px rgba(255, 183, 0, 0.4)'
                            }}
                        >
                            {isInjecting ? 'INYECTANDO...' : energyAvailable < 10 ? 'CARGANDO...' : 'INYECTAR PODER'}
                        </MuiButton>
                        {!isInjecting && energyAvailable >= 10 && (
                            <Box 
                                component={motion.div}
                                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.02, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                sx={{ 
                                    position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, 
                                    borderRadius: 4, border: '2px solid #ffb700', pointerEvents: 'none',
                                    zIndex: -1
                                }}
                            />
                        )}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
};
