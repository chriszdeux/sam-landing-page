'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';
import { RootState } from '../../lib/store';
import { animate } from 'framer-motion';

interface MeterProps {
    label: string;
    value: number;
    max: number;
    unit?: string;
    color: string;
    description: string;
}

const Meter = ({ label, value, max, unit = '', color, description }: MeterProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

    useEffect(() => {
        const controls = animate(displayValue, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(latest)
        });
        return () => controls.stop();
    }, [value]);
    
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', letterSpacing: 1 }}>
                    {label}
                </Typography>
                <Typography variant="h6" sx={{ color, fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {Math.round(displayValue)}{unit} <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>/ {max}{unit}</Typography>
                </Typography>
            </Box>
            
            <Box sx={{ 
                height: 12, 
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 1, 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: 0.5,
                p: '2px'
            }}>
                {Array.from({ length: 20 }).map((_, i) => {
                    const isActive = (i + 1) * 5 <= percentage;
                    return (
                        <Box 
                            key={i}
                            sx={{ 
                                flex: 1, 
                                height: '100%', 
                                bgcolor: isActive ? color : 'transparent',
                                borderRadius: '1px',
                                boxShadow: isActive ? `0 0 10px ${color}` : 'none',
                                opacity: isActive ? 1 : 0.1,
                                transition: 'all 0.3s ease'
                            }} 
                        />
                    );
                })}
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
                {description}
            </Typography>
        </Box>
    );
};

export const LabMetersPanel = () => {
    const { currentLab, isPoweredOn } = useAppSelector((state: RootState) => state.reducerLabs);
    
    // Values are 0 if powered off
    const temperature = isPoweredOn ? (currentLab?.temperature || 0) : 0;
    const maxTemp = currentLab?.maxTemperature || 80;
    const efficiency = isPoweredOn ? (currentLab?.efficiency || 0) : 0;
    const powerMining = isPoweredOn ? (currentLab?.powerMining || 0) : 0;

    // Determine colors based on limits
    const tempColor = temperature > maxTemp * 0.8 ? '#ff1744' : '#ffb700';
    const effColor = efficiency < 50 && isPoweredOn ? '#ffb700' : '#00f3ff';

    return (
        <TechFrame color={isPoweredOn ? "#ffb700" : "rgba(255,255,255,0.1)"}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: isPoweredOn ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 'bold', mb: 4, textTransform: 'uppercase', letterSpacing: 2 }}>
                    Estado del Laboratorio {!isPoweredOn && '(OFFLINE)'}
                </Typography>

                <Meter 
                    label="TEMPERATURA"
                    value={temperature}
                    max={maxTemp}
                    unit="°C"
                    color={tempColor}
                    description={!isPoweredOn ? "Hardware inactivo" : temperature > maxTemp * 0.8 ? "ALERTA: Temperatura elevada" : "Sistema dentro del rango térmico óptimo"}
                />

                <Meter 
                    label="EFICIENCIA"
                    value={efficiency}
                    max={100}
                    unit="%"
                    color={effColor}
                    description={!isPoweredOn ? "Protocolos de rendimiento pausados" : "Rendimiento operativo del hardware"}
                />

                <Meter 
                    label="POWER MINING"
                    value={powerMining}
                    max={100}
                    color="#b000ff"
                    description={!isPoweredOn ? "Potencia de cómputo en reserva" : "Potencia de cómputo actual"}
                />
            </Box>
        </TechFrame>
    );
};
