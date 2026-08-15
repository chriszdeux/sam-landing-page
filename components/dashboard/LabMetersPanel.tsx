'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';
import { Typography } from '../ui/Typography';
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
        <div className={compact ? 'mb-4' : 'mb-8'}>
            <div className="mb-1 flex items-baseline justify-between">
                <Typography variant="caption" className={cn('font-bold tracking-[1px] text-white/50', compact ? 'text-[0.6rem]' : 'text-[0.75rem]')}>
                    {label}
                </Typography>
                <Typography variant={compact ? "body2" : "h6"} className="font-mono font-bold" style={{ color }}>
                    {(unit === '%' || unit === '°C') ? displayValue.toFixed(2) : Math.round(displayValue)}{unit} {!compact && <span className="text-white/30 text-xs">/ {max}{unit}</span>}
                </Typography>
            </div>

            <div className={cn('flex gap-1 overflow-hidden rounded border border-white/10 bg-white/5 p-0.5', compact ? 'h-1.5' : 'h-3')}>
                {Array.from({ length: compact ? 10 : 20 }).map((_, i) => {
                    const isActive = (i + 1) * (compact ? 10 : 5) <= percentage;
                    return (
                        <div
                            key={i}
                            className="h-full flex-1 rounded-[1px] transition-all duration-300"
                            style={{
                                backgroundColor: isActive ? color : 'transparent',
                                boxShadow: isActive ? `0 0 10px ${color}` : 'none',
                                opacity: isActive ? 1 : 0.1,
                            }}
                        />
                    );
                })}
            </div>
            {description && (
                <Typography variant="caption" className="mt-1 block text-[0.65rem] text-white/40">
                    {description}
                </Typography>
            )}
        </div>
    );
});
Meter.displayName = 'Meter';

export const LabMetersPanel = React.memo(() => {
    const labMetersData = useAppSelector((state: RootState) => {
        const lab = state.reducerLabs.currentLab;
        return {
            temperature: lab?.temperature || 0,
            maxTemperature: lab?.maxTemperature || 80,
            efficiency: lab?.efficiency || 0,
            currentLife: lab?.currentLife || 0,
            hashRate: lab?.hashRate || 0,
            networkHash: lab?.networkHash || lab?.hashRate || 5.0,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            isOverclockActive: state.reducerLabs.isOverclockActive || false,
            isOverheated: state.reducerLabs.isOverheated,
            slots: lab?.slots || []
        };
    }, (prev, next) => {
        if (
            prev.temperature !== next.temperature ||
            prev.maxTemperature !== next.maxTemperature ||
            prev.efficiency !== next.efficiency ||
            prev.currentLife !== next.currentLife ||
            prev.hashRate !== next.hashRate ||
            prev.networkHash !== next.networkHash ||
            prev.isPoweredOn !== next.isPoweredOn ||
            prev.isOverclockActive !== next.isOverclockActive ||
            prev.isOverheated !== next.isOverheated ||
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

    const { temperature, maxTemperature: maxTemp, efficiency, currentLife, networkHash, isPoweredOn, isOverheated, slots } = labMetersData;

    const [emergencyMode, setEmergencyMode] = useState<boolean>(false);

    useEffect(() => {
        if (temperature > maxTemp * 0.9 && isPoweredOn) {
            setEmergencyMode(true);
        } else {
            setEmergencyMode(false);
        }
    }, [temperature, maxTemp, isPoweredOn]);

    const labFrequency = slots.length > 0
        ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
        : processingFrequencies.MEGA_CB;
    const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
    const labUnit = getCBUnit(labFrequency);

    const tempColor = temperature > maxTemp * 0.9 ? '#ff1744' : temperature > maxTemp * 0.8 ? '#ffb700' : '#00e676';
    const effColor = efficiency < 50 && isPoweredOn ? '#ffb700' : '#00f3ff';
    const lifeColor = currentLife < 30 ? '#ff1744' : '#00e676';

    return (
        <div className="flex flex-col gap-8">
            {/* Global Telemetry */}
            <TechFrame color={emergencyMode ? "#ff1744" : isPoweredOn ? "rgba(0, 243, 255, 0.3)" : "rgba(255,255,255,0.08)"}>
                <div className="relative bg-[#18181b] p-6">
                    {emergencyMode && (
                        <div className="absolute inset-x-0 top-0 z-10 h-[3px] animate-[pulse_1s_infinite] bg-[#ff1744]" />
                    )}

                    <Typography
                        variant="h6"
                        className="mb-8 font-bold uppercase tracking-[2px]"
                        style={{ color: isPoweredOn ? '#fff' : 'rgba(255,255,255,0.3)' }}
                    >
                        Telemetría Global {isOverheated ? '(COOLDOWN)' : !isPoweredOn && '(OFFLINE)'}
                    </Typography>

                    <Meter
                        label="TEMPERATURA NÚCLEO"
                        value={temperature}
                        max={maxTemp}
                        unit="°C"
                        color={tempColor}
                        description={temperature >= maxTemp ? "CRÍTICO: Sobrecalentamiento extremo (-0.73 Vida/5s, -2.67% Rend/min)" : temperature > maxTemp * 0.9 ? "ALERTA: Modo de Caída activo (-0.33 Vida/5s, -1.33% Rend/min)" : "Estabilidad térmica controlada"}
                    />

                    <Meter
                        label="EFICIENCIA SISTEMA"
                        value={efficiency}
                        max={100}
                        unit="%"
                        color={effColor}
                        description={isPoweredOn ? "Optimización de ciclo activa" : "Sistema inactivo: rendimiento colapsado a 0%"}
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
                        label="HASH DEL LABORATORIO"
                        value={networkHash}
                        max={Math.max(10 * frequencyMultiplier, networkHash)}
                        unit={` ${labUnit}`}
                        color="#b000ff"
                        description="Métrica viva de procesamiento entregada por la red (networkHash)"
                    />


                </div>
            </TechFrame>

            {/* Slots Telemetry (Dual Thermal Management) */}
            {slots && slots.length > 0 && (
                <TechFrame color="rgba(0, 243, 255, 0.2)">
                    <div className="p-6">
                        <Typography variant="overline" className="mb-6 block font-bold tracking-[2px] text-[#00f3ff]">
                            Componentes de Hardware (Slots)
                        </Typography>

                        <div className="flex flex-col gap-6">
                            {slots.map((slot) => {
                                const sTemp = slot.temperature || 0;
                                const sColor = sTemp > slot.maxTemperature * 0.8 ? '#ff1744' : '#00f3ff';
                                return (
                                    <div key={slot.id} className="rounded border border-white/5 bg-white/[0.02] p-3">
                                        <Typography variant="caption" className="mb-2 block font-bold text-white">
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
                                        <div className="flex justify-between">
                                            <Typography variant="caption" className="text-[0.6rem] text-white/30">
                                                POTENCIA: ${(slot.hashRate / getCBDivisor(slot.hashRate)).toFixed(1)} ${getCBUnit(slot.hashRate)}
                                            </Typography>
                                            <Typography variant="caption" className="text-[0.6rem] text-white/30">
                                                USO: {slot.currentUsage}%
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TechFrame>
            )}

            <SimulationChart />
        </div>
    );
});
LabMetersPanel.displayName = 'LabMetersPanel';
