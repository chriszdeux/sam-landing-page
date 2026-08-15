'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Power, Gauge, Thermometer, Heart, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { updateSimulationData, setCooldownState, toggleLaboratoryPower } from '../../lib/features/labs/reducer';

const ProgressBar = ({ value, barColor }: { value: number; barColor: string }) => (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
            className="h-full rounded-full transition-[background-color,width] duration-300 ease-out"
            style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: barColor }}
        />
    </div>
);

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
        <div
            className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-md transition-all duration-300"
            style={{
                backgroundColor: 'rgba(10, 12, 16, 0.8)',
                border: `1px solid ${emergencyMode ? 'rgba(255, 23, 68, 0.5)' : 'rgba(0, 243, 255, 0.2)'}`,
                boxShadow: emergencyMode ? '0 0 30px rgba(255, 23, 68, 0.2)' : '0 0 30px rgba(0, 243, 255, 0.05)',
            }}
        >
            <AnimatePresence>
                {emergencyMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 z-0 bg-[rgba(255,23,68,0.05)]"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 animate-[labAlertPulse_1s_infinite] bg-[#ff1744]" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-[1]">
                <div className="mb-8 flex items-center justify-between">
                    <Typography variant="h5" className="flex items-center gap-2 font-bold text-white">
                        <Cpu className="text-[#00f3ff]" />
                        SIMULADOR DE LABORATORIO
                    </Typography>

                    <div className="flex items-center gap-4">
                        {emergencyMode && (
                            <span className="flex animate-[labAlertPulse_1s_infinite] items-center gap-1.5 rounded-full border border-error px-3 py-1 text-sm font-bold text-error">
                                <AlertTriangle size={16} />
                                MODO DE CAÍDA ACTIVO
                            </span>
                        )}
                        <span
                            className="rounded-full px-3 py-1 text-sm font-bold"
                            style={{
                                backgroundColor: isOverheated ? '#00f3ff20' : isPoweredOn ? '#00e67620' : '#424242',
                                color: isOverheated ? '#00f3ff' : isPoweredOn ? '#00e676' : '#9e9e9e',
                                border: `1px solid ${isOverheated ? '#00f3ff' : isPoweredOn ? '#00e676' : '#9e9e9e'}`,
                            }}
                        >
                            {isOverheated ? "ENFRIANDO..." : isPoweredOn ? "OPERATIVO" : "APAGADO"}
                        </span>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="h-full rounded-lg border border-white/5 bg-black/40 p-6">
                        <Typography variant="overline" className="flex items-center gap-1 text-foreground-muted">
                            <Gauge size={16} /> OUTPUT DE CÓMPUTO
                        </Typography>
                        <Typography variant="h2" className="mt-1 font-mono font-bold text-[#00f3ff]">
                            {hashrate.toFixed(2)} <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>H/s</span>
                        </Typography>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="mb-1 flex justify-between">
                                <Typography variant="caption" className="flex items-center gap-1 font-bold" style={{ color: getTempColor() }}>
                                    <Thermometer size={14} /> TEMPERATURA ({temperature.toFixed(1)}°C)
                                </Typography>
                                <Typography variant="caption" className="text-foreground-muted">Máx 80°C</Typography>
                            </div>
                            <ProgressBar value={(temperature / 80) * 100} barColor={getTempColor()} />
                        </div>

                        <div>
                            <div className="mb-1 flex justify-between">
                                <Typography variant="caption" className="flex items-center gap-1 font-bold text-[#b000ff]">
                                    <Gauge size={14} /> RENDIMIENTO ({performance.toFixed(2)}%)
                                </Typography>
                                <Typography variant="caption" className="text-foreground-muted">Tope 80%</Typography>
                            </div>
                            <ProgressBar value={performance} barColor="#b000ff" />
                        </div>

                        <div>
                            <div className="mb-1 flex justify-between">
                                <Typography variant="caption" className="flex items-center gap-1 font-bold" style={{ color: life > 30 ? '#00e676' : '#ff1744' }}>
                                    <Heart size={14} /> VIDA ÚTIL ({life.toFixed(2)}%)
                                </Typography>
                            </div>
                            <ProgressBar value={life} barColor={life > 30 ? '#00e676' : '#ff1744'} />
                        </div>
                    </div>
                </div>

                <hr className="mb-6 border-white/10" />

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-row gap-4">
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
                    </div>

                    <Button
                        variant="contained"
                        color={isPoweredOn ? "error" : "success"}
                        startIcon={<Power size={18} />}
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
                </div>
            </div>
        </div>
    );
};
