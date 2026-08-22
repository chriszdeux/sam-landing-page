'use client';

import React from 'react';
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';
import { Typography } from '../ui/Typography';
import { RootState } from '../../lib/store';
import { motion, useReducedMotion } from 'framer-motion';
import { SimulationChart } from './SimulationChart';
import { getCBUnit, getCBDivisor, processingFrequencies } from '../../lib/constants/blockchainFrequencies';
import {
    SeverityMeter,
    SeverityBadge,
    SeverityHairline,
    SEVERITY_SPEC,
    temperatureSeverity,
    efficiencySeverity,
    lifeSeverity,
    worstSeverity,
    CRITICAL_THRESHOLD,
    WARNING_THRESHOLD,
    type Severity,
} from './SeverityMeter';

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
    const reduceMotion = useReducedMotion();

    // Severidad por métrica; los umbrales viven en SeverityMeter (convención del repo).
    const tempSeverity = temperatureSeverity(temperature, isOverheated, isPoweredOn);
    const effSeverity = efficiencySeverity(efficiency, isPoweredOn);
    const lifeSev = lifeSeverity(currentLife);
    // El panel toma el tono de la peor métrica: una sola lectura de "qué tan grave está esto".
    // Apagado y sin cooldown no hay gravedad que comunicar: todo el panel queda en offline.
    const isDormant = !isPoweredOn && !isOverheated;
    const panelSeverity: Severity = isDormant ? 'offline' : worstSeverity(tempSeverity, effSeverity, lifeSev);
    const panelSpec = SEVERITY_SPEC[panelSeverity];
    const isPanelCritical = panelSeverity === 'critical';

    const labFrequency = slots.length > 0
        ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
        : processingFrequencies.MEGA_CB;
    const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
    const labUnit = getCBUnit(labFrequency);

    return (
        <div className="flex flex-col gap-8">
            {/* Global Telemetry */}
            <TechFrame color={isPoweredOn || isOverheated ? `${panelSpec.color}4d` : 'rgba(255,255,255,0.08)'}>
                {/* En crítico el panel entero respira: escala mínima y halo rojo, sin sacudir el layout. */}
                <motion.div
                    className="relative bg-[#18181b] p-6"
                    animate={isPanelCritical && !reduceMotion
                        ? { boxShadow: [`inset 0 0 0px ${panelSpec.color}00`, `inset 0 0 60px ${panelSpec.color}33`, `inset 0 0 0px ${panelSpec.color}00`] }
                        : { boxShadow: isPanelCritical ? `inset 0 0 40px ${panelSpec.color}33` : 'inset 0 0 0px transparent' }}
                    transition={isPanelCritical && !reduceMotion
                        ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.4 }}
                >
                    <SeverityHairline severity={panelSeverity} />

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
                        <Typography
                            variant="h6"
                            className="font-bold uppercase tracking-[2px]"
                            style={{ color: isPoweredOn ? '#fff' : 'rgba(255,255,255,0.3)' }}
                        >
                            Telemetría Global {isOverheated ? '(COOLDOWN)' : !isPoweredOn && '(OFFLINE)'}
                        </Typography>
                        {/* Estado global en texto: la gravedad no depende del color. */}
                        <SeverityBadge severity={panelSeverity} />
                    </div>

                    <SeverityMeter
                        label="Temperatura Núcleo"
                        value={temperature}
                        max={maxTemp}
                        unit="°C"
                        severity={tempSeverity}
                        description={
                            isDormant
                                ? 'Laboratorio apagado: sin lectura térmica'
                                : isOverheated || temperature > CRITICAL_THRESHOLD
                                ? 'CRÍTICO: Sobrecalentamiento extremo (-0.73 Vida/5s, -2.67% Rend/min)'
                                : temperature > WARNING_THRESHOLD
                                    ? 'ALERTA: Modo de Caída activo (-0.33 Vida/5s, -1.33% Rend/min)'
                                    : 'Estabilidad térmica controlada'
                        }
                    />

                    <SeverityMeter
                        label="Eficiencia Sistema"
                        value={efficiency}
                        max={100}
                        unit="%"
                        severity={effSeverity}
                        description={
                            !isPoweredOn
                                ? 'Sistema inactivo: rendimiento colapsado a 0%'
                                : effSeverity === 'critical'
                                    ? 'CRÍTICO: Rendimiento colapsando, el ciclo no sostiene carga'
                                    : effSeverity === 'warning'
                                        ? 'ALERTA: Optimización de ciclo degradada'
                                        : 'Optimización de ciclo activa'
                        }
                    />

                    <SeverityMeter
                        label="Vida Útil Estructural"
                        value={currentLife}
                        max={100}
                        unit="%"
                        severity={isDormant ? 'offline' : lifeSev}
                        description={
                            isDormant
                                ? 'Sin desgaste con el laboratorio apagado'
                                : lifeSev === 'critical'
                                ? 'CRÍTICO: Desgaste avanzado detectado'
                                : lifeSev === 'warning'
                                    ? 'ALERTA: Desgaste acumulado, integridad en descenso'
                                    : 'Integridad estructural óptima'
                        }
                    />

                    {/* Hash es informativo: sin umbrales en el repo, así que no grita ni pulsa. */}
                    <SeverityMeter
                        label="Hash del Laboratorio"
                        value={networkHash}
                        max={Math.max(10 * frequencyMultiplier, networkHash)}
                        unit={` ${labUnit}`}
                        severity={isPoweredOn ? 'normal' : 'offline'}
                        normalColor="#b000ff"
                        silent
                        description="Métrica viva de procesamiento entregada por la red (networkHash)"
                    />
                </motion.div>
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
                                // Los slots se miden contra su propio maxTemperature (varía por componente),
                                // manteniendo los cortes 0.9 / 0.8 que ya usaba este panel.
                                const slotSeverity: Severity = isDormant
                                    ? 'offline'
                                    : sTemp > slot.maxTemperature * 0.9
                                        ? 'critical'
                                        : sTemp > slot.maxTemperature * 0.8
                                            ? 'warning'
                                            : 'normal';
                                return (
                                    <div
                                        key={slot.id}
                                        className="rounded border p-3 transition-colors duration-500"
                                        style={{
                                            borderColor: slotSeverity === 'normal' ? 'rgba(255,255,255,0.05)' : `${SEVERITY_SPEC[slotSeverity].color}66`,
                                            backgroundColor: slotSeverity === 'critical' ? `${SEVERITY_SPEC[slotSeverity].color}0d` : 'rgba(255,255,255,0.02)',
                                        }}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <Typography variant="caption" className="block font-bold uppercase text-white">
                                                {slot.name.toUpperCase()}
                                            </Typography>
                                            <SeverityBadge severity={slotSeverity} />
                                        </div>
                                        <SeverityMeter
                                            label="Temp. Componente"
                                            value={sTemp}
                                            max={slot.maxTemperature}
                                            unit="°C"
                                            severity={slotSeverity}
                                            compact
                                        />
                                        <div className="flex justify-between">
                                            <Typography variant="caption" className="text-[0.6rem] tabular-nums text-white/30">
                                                POTENCIA: {(slot.hashRate / getCBDivisor(slot.hashRate)).toFixed(1)} {getCBUnit(slot.hashRate)}
                                            </Typography>
                                            <Typography variant="caption" className="text-[0.6rem] tabular-nums text-white/30">
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
