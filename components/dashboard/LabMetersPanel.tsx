'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';
import { RootState } from '../../lib/store';
import { animate } from 'framer-motion';
import { SimulationChart } from './SimulationChart';
import { getCBUnit, getCBDivisor, processingFrequencies } from '../../lib/constants/blockchainFrequencies';

interface MeterProps {
    label: string;
    value: number;
    max: number;
    unit?: string;
    color: string;
    description?: string;
    compact?: boolean;
}

const Meter = React.memo(({ label, value, max, unit = '', color, description, compact }: MeterProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const prevValueRef = useRef(0);
    const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

    useEffect(() => {
        const from = prevValueRef.current;
        prevValueRef.current = value;
        const controls = animate(from, value, {
            duration: 0.8,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(latest)
        });
        return () => controls.stop();
    }, [value]);
    
    return (
        <Box sx={{ mb: compact ? 2 : 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', letterSpacing: 1, fontSize: compact ? '0.6rem' : '0.75rem' }}>
                    {label}
                </Typography>
                <Typography variant={compact ? "body2" : "h6"} sx={{ color, fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {(unit === '%' || unit === '°C') ? displayValue.toFixed(2) : Math.round(displayValue)}{unit} {!compact && <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>/ {max}{unit}</Typography>}
                </Typography>
            </Box>
            
            <Box sx={{ 
                height: compact ? 6 : 12, 
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 1, 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: 0.5,
                p: '2px'
            }}>
                {Array.from({ length: compact ? 10 : 20 }).map((_, i) => {
                    const isActive = (i + 1) * (compact ? 10 : 5) <= percentage;
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
            {description && (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block', fontSize: '0.65rem' }}>
                    {description}
                </Typography>
            )}
        </Box>
    );
});

export const LabMetersPanel = React.memo(() => {
    const labMetersData = useAppSelector((state: RootState) => {
        const lab = state.reducerLabs.currentLab;
        return {
            temperature: lab?.temperature || 0,
            maxTemperature: lab?.maxTemperature || 80,
            efficiency: lab?.efficiency || 0,
            currentLife: lab?.currentLife || 0,
            hashRate: lab?.hashRate || 0,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            slots: lab?.slots || []
        };
    }, (prev, next) => {
        if (
            prev.temperature !== next.temperature ||
            prev.maxTemperature !== next.maxTemperature ||
            prev.efficiency !== next.efficiency ||
            prev.currentLife !== next.currentLife ||
            prev.hashRate !== next.hashRate ||
            prev.isPoweredOn !== next.isPoweredOn ||
            prev.slots.length !== next.slots.length
        ) {
            return false;
        }
        for (let i = 0; i < prev.slots.length; i++) {
            if (
                prev.slots[i].id !== next.slots[i].id ||
                prev.slots[i].temperature !== next.slots[i].temperature ||
                prev.slots[i].hashRate !== next.slots[i].hashRate ||
                prev.slots[i].currentUsage !== next.slots[i].currentUsage
            ) {
                return false;
            }
        }
        return true;
    });

    const { temperature, maxTemperature: maxTemp, efficiency, currentLife, hashRate, isPoweredOn, slots } = labMetersData;
    
    const labFrequency = slots.length > 0
        ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
        : processingFrequencies.MEGA_CB;
    const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
    const totalPowerMiningVal = isPoweredOn ? (hashRate * frequencyMultiplier) : 0;
    const labUnit = getCBUnit(labFrequency);

    const tempColor = temperature > maxTemp * 0.8 ? '#ff1744' : '#ffb700';
    const effColor = efficiency < 50 && isPoweredOn ? '#ffb700' : '#00f3ff';
    const lifeColor = currentLife < 30 ? '#ff1744' : '#00e676';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Global Telemetry */}
            <TechFrame color={isPoweredOn ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}>
                <Box sx={{ p: 3, bgcolor: '#18181b' }}>
                    <Typography variant="h6" sx={{ color: isPoweredOn ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 'bold', mb: 4, textTransform: 'uppercase', letterSpacing: 2 }}>
                        Telemetría Global {!isPoweredOn && '(OFFLINE)'}
                    </Typography>

                    <Meter 
                        label="TEMPERATURA NÚCLEO"
                        value={temperature}
                        max={maxTemp}
                        unit="°C"
                        color={tempColor}
                        description={temperature > maxTemp * 0.8 ? "ALERTA: Temperatura crítica" : "Estabilidad térmica controlada"}
                    />

                    <Meter 
                        label="EFICIENCIA SISTEMA"
                        value={efficiency}
                        max={100}
                        unit="%"
                        color={effColor}
                        description={efficiency < 50 ? "Rendimiento bajo: requiere enfriamiento" : "Optimización de ciclo activa"}
                    />

                    <Meter 
                        label="VIDA ÚTIL ESTRUCTURAL"
                        value={currentLife}
                        max={100}
                        unit="%"
                        color={lifeColor}
                        description={currentLife < 30 ? "CRÍTICO: Desgaste avanzado detectado" : "Integridad estructural óptima"}
                    />

                    <Meter 
                        label="POTENCIA TOTAL"
                        value={totalPowerMiningVal}
                        max={10 * frequencyMultiplier}
                        unit={` ${labUnit}`}
                        color="#b000ff"
                        description="Capacidad de cómputo agregada (Base + Slots)"
                    />
                </Box>
            </TechFrame>
            
            {/* Slots Telemetry (Dual Thermal Management) */}
            {slots && slots.length > 0 && (
                <TechFrame color="rgba(0, 243, 255, 0.2)">
                    <Box sx={{ p: 3 }}>
                        <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', mb: 3, display: 'block', letterSpacing: 2 }}>
                            Componentes de Hardware (Slots)
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {slots.map((slot) => {
                                const sTemp = slot.temperature || 0;
                                const sColor = sTemp > slot.maxTemperature * 0.8 ? '#ff1744' : '#00f3ff';
                                return (
                                    <Grid size={{ xs: 12 }} key={slot.id}>
                                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', mb: 1, display: 'block' }}>
                                                {slot.name.toUpperCase()}
                                            </Typography>
                                            <Meter 
                                                label="TEMP. COMPONENTE"
                                                value={sTemp}
                                                max={slot.maxTemperature}
                                                unit="°C"
                                                color={sColor}
                                                compact
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
                                                    POTENCIA: ${(slot.hashRate / getCBDivisor(slot.hashRate)).toFixed(1)} ${getCBUnit(slot.hashRate)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
                                                    USO: {slot.currentUsage}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </TechFrame>
            )}

            <SimulationChart />
        </Box>
    );
});
