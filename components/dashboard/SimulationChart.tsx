'use client';

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { formatHash } from '../../lib/utils/formatHash';

export const SimulationChart = React.memo(() => {
    const chartData = useAppSelector((state: RootState) => {
        const lab = state.reducerLabs.currentLab;
        return {
            simulationHistory: state.reducerLabs.simulationHistory,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            isOverheated: state.reducerLabs.isOverheated,
            maxTemperature: lab?.maxTemperature || 80
        };
    }, (prev, next) => {
        return (
            prev.simulationHistory === next.simulationHistory &&
            prev.isPoweredOn === next.isPoweredOn &&
            prev.isOverheated === next.isOverheated &&
            prev.maxTemperature === next.maxTemperature
        );
    });

    const chronoBurstFreqTypes = useAppSelector((state: RootState) => state.blockchain.chronoBurstFreqTypes);

    const { simulationHistory, isPoweredOn, isOverheated, maxTemperature } = chartData;
    
    // Memoize the data transformation to avoid calling toLocaleTimeString on every render
    const data = useMemo(() => simulationHistory.map(point => ({
        ...point,
        time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    })), [simulationHistory]);

    return (
        <Box sx={{ 
            width: '100%', 
            height: 300, 
            bgcolor: 'rgba(0,0,0,0.3)', 
            borderRadius: 2, 
            p: 2,
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', letterSpacing: 1 }}>
                    MONITOR DE RENDIMIENTO EN TIEMPO REAL
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#00f3ff', borderRadius: '50%' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>HASH RATE</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#ff1744', borderRadius: '50%' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>TEMP</Typography>
                    </Box>
                </Box>
            </Box>
 
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data}>
                    <defs>
                        <filter id="glow-power" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="glow-temp" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="time" 
                        hide 
                    />
                    <YAxis 
                        yAxisId="power"
                        hide 
                        domain={[0, 'auto']} 
                    />
                    <YAxis 
                        yAxisId="temp"
                        hide 
                        domain={[0, maxTemperature]} 
                    />
                    <Tooltip 
                        formatter={(value: any, name: any) => {
                            const valNum = Number(value) || 0;
                            if (name === "Procesamiento (Hash Rate)") {
                                return [formatHash(valNum, chronoBurstFreqTypes), name];
                            }
                            return [`${valNum.toFixed(1)}°C`, name];
                        }}
                        contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            fontSize: '0.7rem'
                        }}
                        itemStyle={{ padding: '0px' }}
                    />
                    <Line 
                        yAxisId="power"
                        type="monotone" 
                        dataKey="power" 
                        name="Procesamiento (Hash Rate)"
                        stroke="#00f3ff" 
                        strokeWidth={2} 
                        filter="url(#glow-power)"
                        dot={({ cx, cy, index }) => {
                            if (index === data.length - 1) {
                                return (
                                    <g key="power-pulse">
                                        <circle cx={cx} cy={cy} r={4} fill="#00f3ff" />
                                        <circle cx={cx} cy={cy} r={4} fill="none" stroke="#00f3ff" strokeWidth={1.5}>
                                            <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                    </g>
                                );
                            }
                            return null;
                        }}
                        isAnimationActive={false}
                        animationDuration={300}
                    />
                    <Line 
                        yAxisId="temp"
                        type="monotone" 
                        dataKey="temperature" 
                        name="Temperatura"
                        stroke="#ff1744" 
                        strokeWidth={2} 
                        filter="url(#glow-temp)"
                        dot={({ cx, cy, index }) => {
                            if (index === data.length - 1) {
                                return (
                                    <g key="temp-pulse">
                                        <circle cx={cx} cy={cy} r={4} fill="#ff1744" />
                                        <circle cx={cx} cy={cy} r={4} fill="none" stroke="#ff1744" strokeWidth={1.5}>
                                            <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                    </g>
                                );
                            }
                            return null;
                        }}
                        isAnimationActive={false}
                        animationDuration={300}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Efecto de cuadrícula de fondo estilo Administrador de Tareas */}
            <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                pointerEvents: 'none',
                opacity: 0.03,
                backgroundSize: '20px 20px',
                backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)'
            }} />
            
            {(!isPoweredOn && !isOverheated) && (
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 2
                }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', letterSpacing: 2 }}>
                        SISTEMA EN ESPERA
                    </Typography>
                </Box>
            )}
        </Box>
    );
});
