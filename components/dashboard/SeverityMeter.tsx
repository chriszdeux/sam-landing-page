'use client';

// Medidor con escalado de gravedad compartido por la telemetría del laboratorio.
// La severidad se comunica en cuatro canales a la vez (color, texto, ícono y ritmo)
// para que se lea de un vistazo y no dependa solo del color.

import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, PowerOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Typography } from '../ui/Typography';

export type Severity = 'offline' | 'normal' | 'warning' | 'critical';

// Misma convención de severidad térmica que components/dashboard/SimulationChart.tsx
// y components/laboratorio/LaboratorySimulation.tsx
export const NORMAL_COLOR = '#00f3ff';
export const WARNING_COLOR = '#ffb700';
export const CRITICAL_COLOR = '#ff1744';
export const OFFLINE_COLOR = 'rgba(255,255,255,0.25)';
export const WARNING_THRESHOLD = 60;
export const CRITICAL_THRESHOLD = 72;

/** Severidad térmica: umbrales absolutos ya establecidos en el repo (72 / 60). */
export const temperatureSeverity = (
    temperature: number,
    isOverheated: boolean,
    isPoweredOn = true
): Severity => {
    if (isOverheated || temperature > CRITICAL_THRESHOLD) return 'critical';
    if (temperature > WARNING_THRESHOLD) return 'warning';
    return isPoweredOn ? 'normal' : 'offline';
};

/** Vida útil: el repo ya trata <=30 como desgaste crítico; 50 es el escalón previo. */
export const lifeSeverity = (currentLife: number): Severity => {
    if (currentLife <= 30) return 'critical';
    if (currentLife <= 50) return 'warning';
    return 'normal';
};

/** Eficiencia: el repo ya marca <50 como advertencia; <20 es colapso de rendimiento. */
export const efficiencySeverity = (efficiency: number, isPoweredOn: boolean): Severity => {
    if (!isPoweredOn) return 'offline';
    if (efficiency < 20) return 'critical';
    if (efficiency < 50) return 'warning';
    return 'normal';
};

/** La peor severidad manda: es la que define el tono del panel completo. */
const SEVERITY_RANK: Record<Severity, number> = { offline: 0, normal: 1, warning: 2, critical: 3 };
export const worstSeverity = (...levels: Severity[]): Severity =>
    levels.reduce((worst, level) => (SEVERITY_RANK[level] > SEVERITY_RANK[worst] ? level : worst), 'offline');

interface SeveritySpec {
    color: string;
    label: string;
    /** Segundos por ciclo de pulso; null = quieto (estado normal debe estar calmo). */
    pulse: number | null;
    /** Temblor sutil, reservado al estado crítico. */
    shake: boolean;
    Icon: React.ComponentType<{ size?: number | string; className?: string }> | null;
}

export const SEVERITY_SPEC: Record<Severity, SeveritySpec> = {
    offline: { color: OFFLINE_COLOR, label: 'SIN SEÑAL', pulse: null, shake: false, Icon: PowerOff },
    normal: { color: NORMAL_COLOR, label: 'NOMINAL', pulse: null, shake: false, Icon: null },
    warning: { color: WARNING_COLOR, label: 'ADVERTENCIA', pulse: 2, shake: false, Icon: AlertTriangle },
    critical: { color: CRITICAL_COLOR, label: 'CRÍTICO', pulse: 0.7, shake: true, Icon: AlertOctagon },
};

/** Etiqueta de estado: el canal textual/icónico de la gravedad. */
export const SeverityBadge = ({ severity, className }: { severity: Severity; className?: string }) => {
    const spec = SEVERITY_SPEC[severity];
    const Icon = spec.Icon;
    const isAlert = severity === 'warning' || severity === 'critical';

    return (
        <span
            role="status"
            className={cn(
                'inline-flex items-center gap-1 border px-1.5 py-[1px] text-[0.55rem] font-bold uppercase leading-none tracking-[2px]',
                className
            )}
            style={{
                color: spec.color,
                borderColor: isAlert ? spec.color : 'rgba(255,255,255,0.1)',
                backgroundColor: isAlert ? `${spec.color}14` : 'transparent',
                opacity: isAlert ? 1 : 0.5,
            }}
        >
            {Icon && <Icon size={9} />}
            {spec.label}
        </span>
    );
};

interface SeverityMeterProps {
    label: string;
    value: number;
    max: number;
    unit?: string;
    severity: Severity;
    /** Color para el estado normal, si la métrica tiene su propio acento (ej. hash). */
    normalColor?: string;
    description?: string;
    compact?: boolean;
    /** Métricas informativas no muestran etiqueta de estado ni pulso. */
    silent?: boolean;
}

export const SeverityMeter = React.memo(({
    label,
    value,
    max,
    unit = '',
    severity,
    normalColor,
    description,
    compact,
    silent,
}: SeverityMeterProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const prevValueRef = useRef(0);
    const reduceMotion = useReducedMotion();
    const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

    const spec = SEVERITY_SPEC[severity];
    const color = severity === 'normal' && normalColor ? normalColor : spec.color;
    const isAlert = !silent && (severity === 'warning' || severity === 'critical');
    // Con reduced-motion la gravedad queda solo en color/texto: el pulso y el temblor se apagan.
    const pulse = isAlert && !reduceMotion ? spec.pulse : null;
    const shake = isAlert && !reduceMotion && spec.shake;

    useEffect(() => {
        const from = prevValueRef.current;
        prevValueRef.current = value;
        const controls = animate(from, value, {
            duration: 0.8,
            ease: 'easeOut',
            onUpdate: (latest) => setDisplayValue(latest),
        });
        return () => controls.stop();
    }, [value]);

    const formatted = (unit === '%' || unit === '°C') ? displayValue.toFixed(2) : Math.round(displayValue);

    return (
        <motion.div
            className={compact ? 'mb-4' : 'mb-8'}
            // El temblor es de 1px y con pausa entre sacudidas: alarma, no ruido.
            animate={shake ? { x: [0, -1, 1, -0.5, 0] } : { x: 0 }}
            transition={shake
                ? { duration: 0.4, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }
                : { duration: 0.3 }}
        >
            <div className="mb-1 flex items-baseline justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <Typography
                        variant="caption"
                        className={cn('font-bold uppercase tracking-[1px] text-white/50', compact ? 'text-[0.6rem]' : 'text-[0.75rem]')}
                    >
                        {label}
                    </Typography>
                    {!silent && !compact && <SeverityBadge severity={severity} />}
                </div>
                <Typography
                    variant={compact ? 'body2' : 'h6'}
                    className="font-mono font-bold tabular-nums transition-colors duration-500"
                    style={{ color }}
                >
                    {formatted}{unit} {!compact && <span className="text-xs text-white/30">/ {max}{unit}</span>}
                </Typography>
            </div>

            <motion.div
                // En compacto el relleno de 1px quedaba invisible: el track necesita alto real.
                className={cn('flex overflow-hidden rounded border bg-white/5', compact ? 'h-2 gap-0.5 p-[1px]' : 'h-3 gap-1 p-0.5')}
                role="meter"
                aria-label={`${label}: ${formatted}${unit} de ${max}${unit} — ${SEVERITY_SPEC[severity].label}`}
                aria-valuenow={Number(displayValue.toFixed(2))}
                aria-valuemin={0}
                aria-valuemax={max}
                // El halo late más rápido conforme escala la gravedad; en normal queda fijo.
                animate={pulse
                    ? { boxShadow: [`0 0 0px ${color}00`, `0 0 14px ${color}aa`, `0 0 0px ${color}00`], borderColor: [`${color}33`, `${color}cc`, `${color}33`] }
                    : { boxShadow: `0 0 0px ${color}00`, borderColor: isAlert ? `${color}99` : 'rgba(255,255,255,0.1)' }}
                transition={pulse ? { duration: pulse, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
            >
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
            </motion.div>

            {description && (
                <Typography
                    variant="caption"
                    className="mt-1 block text-[0.65rem] transition-colors duration-500"
                    style={{ color: isAlert ? color : 'rgba(255,255,255,0.4)' }}
                >
                    {description}
                </Typography>
            )}
        </motion.div>
    );
});
SeverityMeter.displayName = 'SeverityMeter';

/** Hairline superior que late al ritmo de la gravedad. Reemplaza el @keyframes de globals.css. */
export const SeverityHairline = ({ severity }: { severity: Severity }) => {
    const reduceMotion = useReducedMotion();
    const spec = SEVERITY_SPEC[severity];
    if (severity !== 'warning' && severity !== 'critical') return null;

    return (
        <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 z-10 h-px"
            style={{ backgroundColor: spec.color }}
            animate={reduceMotion
                ? { opacity: 1 }
                : { opacity: [0.35, 1, 0.35], boxShadow: [`0 0 2px ${spec.color}`, `0 0 10px ${spec.color}`, `0 0 2px ${spec.color}`] }}
            transition={reduceMotion ? { duration: 0 } : { duration: spec.pulse ?? 2, repeat: Infinity, ease: 'easeInOut' }}
        />
    );
};
