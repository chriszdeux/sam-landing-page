'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { formatHash } from '../../lib/utils/formatHash';
import { Typography } from '../ui/Typography';
import { cn } from '@/lib/utils/cn';

// Misma convención de severidad térmica que components/laboratorio/LaboratorySimulation.tsx
const NORMAL_COLOR = '#00f3ff';
const WARNING_COLOR = '#ffb700';
const CRITICAL_COLOR = '#ff1744';
const WARNING_THRESHOLD = 60;
const CRITICAL_THRESHOLD = 72;

const severityColor = (temperature: number, isOverheated: boolean) => {
    if (isOverheated || temperature > CRITICAL_THRESHOLD) return CRITICAL_COLOR;
    if (temperature > WARNING_THRESHOLD) return WARNING_COLOR;
    return NORMAL_COLOR;
};

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

    const latest = data[data.length - 1];
    const currentTemp = latest?.temperature ?? 0;
    const currentPower = latest?.power ?? 0;
    const tempColor = severityColor(currentTemp, isOverheated);
    const isCritical = isOverheated || currentTemp > CRITICAL_THRESHOLD;

    return (
        <div
            className={cn(
                'relative h-[300px] w-full overflow-hidden rounded-lg border border-white/5 bg-black/30 p-4 transition-colors duration-500',
                isCritical && 'animate-[chartAlertBorder_1.6s_ease-in-out_infinite]'
            )}
        >
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <Typography variant="caption" className="block font-bold tracking-wide text-white/50">
                        MONITOR DE RENDIMIENTO EN TIEMPO REAL
                    </Typography>
                    {isCritical && (
                        <Typography variant="caption" className="mt-0.5 block text-[0.6rem] font-bold tracking-[2px] text-[#ff1744]">
                            ⚠ ALERTA: SOBRECALENTAMIENTO
                        </Typography>
                    )}
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-[#00f3ff]" />
                        <div className="flex flex-col leading-tight">
                            <Typography variant="caption" className="text-[0.6rem] text-white/40">HASH RATE</Typography>
                            <Typography variant="caption" className="text-[0.65rem] font-bold text-[#00f3ff]">
                                {formatHash(currentPower, chronoBurstFreqTypes)}
                            </Typography>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full transition-colors duration-500" style={{ backgroundColor: tempColor }} />
                        <div className="flex flex-col leading-tight">
                            <Typography variant="caption" className="text-[0.6rem] text-white/40">TEMP</Typography>
                            <Typography variant="caption" className="text-[0.65rem] font-bold transition-colors duration-500" style={{ color: tempColor }}>
                                {currentTemp.toFixed(1)}°C
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart data={data}>
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
                        <linearGradient id="fill-power" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fill-temp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={tempColor} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={tempColor} stopOpacity={0} />
                        </linearGradient>
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
                    <ReferenceLine
                        yAxisId="temp"
                        y={WARNING_THRESHOLD}
                        stroke={WARNING_COLOR}
                        strokeOpacity={0.35}
                        strokeDasharray="4 4"
                    />
                    <ReferenceLine
                        yAxisId="temp"
                        y={CRITICAL_THRESHOLD}
                        stroke={CRITICAL_COLOR}
                        strokeOpacity={0.4}
                        strokeDasharray="4 4"
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
                    <Area
                        yAxisId="power"
                        type="monotone"
                        dataKey="power"
                        name="Procesamiento (Hash Rate)"
                        stroke="none"
                        fill="url(#fill-power)"
                        isAnimationActive={false}
                        legendType="none"
                    />
                    <Area
                        yAxisId="temp"
                        type="monotone"
                        dataKey="temperature"
                        name="Temperatura"
                        stroke="none"
                        fill="url(#fill-temp)"
                        isAnimationActive={false}
                        legendType="none"
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
                        stroke={tempColor}
                        strokeWidth={2}
                        filter="url(#glow-temp)"
                        dot={({ cx, cy, index }) => {
                            if (index === data.length - 1) {
                                return (
                                    <g key="temp-pulse">
                                        <circle cx={cx} cy={cy} r={4} fill={tempColor} />
                                        <circle cx={cx} cy={cy} r={4} fill="none" stroke={tempColor} strokeWidth={1.5}>
                                            <animate attributeName="r" values={isCritical ? "4;16;4" : "4;12;4"} dur={isCritical ? "0.8s" : "2s"} repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="1;0;1" dur={isCritical ? "0.8s" : "2s"} repeatCount="indefinite" />
                                        </circle>
                                    </g>
                                );
                            }
                            return null;
                        }}
                        isAnimationActive={false}
                        animationDuration={300}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Efecto de cuadrícula de fondo estilo Administrador de Tareas */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundSize: '20px 20px',
                    backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)'
                }}
            />

            {(!isPoweredOn && !isOverheated) && (
                <div className="absolute inset-0 z-[2] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <Typography variant="caption" className="font-bold tracking-[2px] text-white/30">
                        SISTEMA EN ESPERA
                    </Typography>
                </div>
            )}
        </div>
    );
});

SimulationChart.displayName = 'SimulationChart';
