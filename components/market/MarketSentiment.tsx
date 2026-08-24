// 1-Definir componente de sentimiento de mercado
// 2-Obtener datos históricos y calcular sentimiento
// 3-Renderizar indicador visual de sentimiento y volumen

//# 1-Definir componente de sentimiento de mercado
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Typography } from '../ui/Typography';
import { Tooltip } from '../ui/Tooltip';

import { useAppSelector } from '../../lib/hooks';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface MarketSentimentProps {
    cryptoId: string;
}

// Colores de dato (canales compra/venta) - se mantienen los de siempre.
const BUY_COLOR = '#00ff9d';
const SELL_COLOR = '#ff0055';

// Zonas de severidad ya usadas en dashboard/SimulationChart: el sentimiento
// neutral es "normal" (cyan), el desbalance moderado es advertencia (ámbar) y
// el extremo es crítico (rojo), que es justo el riesgo que comunica un
// índice de miedo/codicia.
const SEVERITY = {
    normal: '#00f3ff',
    warning: '#ffb700',
    critical: '#ff1744',
} as const;

const EXTREME_THRESHOLD = 70;

export const MarketSentiment = ({ cryptoId }: MarketSentimentProps) => {

    //# 2-Obtener datos históricos y calcular sentimiento
    const { historicalData } = useAppSelector((state) => state.market);
    const data = historicalData[cryptoId];
    // Hook antes de cualquier return: el early-exit de abajo no debe cambiar el
    // orden de hooks entre renders.
    const reduceMotion = useReducedMotion();

    if (!data || !data.currentBuyState || !data.currentSellState) {
        return null;
    }

    const buyCount = data.currentBuyState.counter;
    const sellCount = data.currentSellState.counter;
    const totalCount = buyCount + sellCount;

    const buyPercentage = totalCount > 0 ? (buyCount / totalCount) * 100 : 50;
    const sellPercentage = totalCount > 0 ? (sellCount / totalCount) * 100 : 50;

    const dominant = Math.max(buyPercentage, sellPercentage);
    const isExtreme = dominant >= EXTREME_THRESHOLD;

    let sentiment = 'NEUTRAL';
    let severityColor: string = SEVERITY.normal;

    if (buyPercentage > 55) {
        sentiment = isExtreme ? 'CODICIA EXTREMA' : 'CODICIA (GREED)';
        severityColor = isExtreme ? SEVERITY.critical : SEVERITY.warning;
    } else if (sellPercentage > 55) {
        sentiment = isExtreme ? 'MIEDO EXTREMO' : 'MIEDO (FEAR)';
        severityColor = isExtreme ? SEVERITY.critical : SEVERITY.warning;
    }

    // La animación comunica el dato: las barras y el marcador arrancan del 50/50
    // (equilibrio) y viajan hasta el valor real, así se "ve" el desbalance. Con
    // prefers-reduced-motion se pinta directo en su posición final.
    const settle = reduceMotion
        ? { duration: 0 }
        : { type: 'spring' as const, stiffness: 55, damping: 16, mass: 0.9 };

    return (
        <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/[0.12]">
            <div className="mb-5 flex flex-row items-center justify-between gap-4">
                <Typography variant="h6" className="flex items-center gap-2 font-bold text-white">
                    Sentimiento de Mercado
                    <Tooltip content="Basado en el volumen de transacciones actuales de compra vs venta">
                        <Info size={16} className="cursor-help text-foreground-muted" />
                    </Tooltip>
                </Typography>

                {/* El badge late solo si el sentimiento es extremo: estado vivo
                    como señal de riesgo, no como adorno permanente. */}
                <motion.span
                    className="shrink-0 rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] tabular-nums"
                    style={{ color: severityColor, borderColor: `${severityColor}55` }}
                    animate={
                        isExtreme && !reduceMotion
                            ? { boxShadow: [`0 0 0 ${severityColor}00`, `0 0 14px ${severityColor}66`, `0 0 0 ${severityColor}00`] }
                            : { boxShadow: `0 0 0 ${severityColor}00` }
                    }
                    transition={isExtreme && !reduceMotion ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                >
                    {sentiment}
                </motion.span>
            </div>

            <div className="relative mb-5 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: BUY_COLOR }}
                    initial={{ width: '50%' }}
                    animate={{ width: `${buyPercentage}%` }}
                    transition={settle}
                />
                <motion.div
                    className="absolute inset-y-0 right-0"
                    style={{ backgroundColor: SELL_COLOR }}
                    initial={{ width: '50%' }}
                    animate={{ width: `${sellPercentage}%` }}
                    transition={settle}
                />

                {/* Marcador del punto de equilibrio: viaja con el dato y lleva el
                    color de severidad, así la zona se lee sin mirar el badge. */}
                <motion.div
                    className="absolute inset-y-0 w-0.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: '#05050c', boxShadow: `0 0 8px ${severityColor}` }}
                    initial={{ left: '50%' }}
                    animate={{ left: `${buyPercentage}%` }}
                    transition={settle}
                />
            </div>

            <div className="flex flex-row items-start justify-between gap-4 text-sm">
                <div className="text-left">
                    <Typography className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]" style={{ color: BUY_COLOR }}>
                        <TrendingUp size={16} /> COMPRA
                    </Typography>
                    <Typography className="mt-1.5 tabular-nums text-foreground-muted">
                        {buyCount.toLocaleString()} txs ({buyPercentage.toFixed(1)}%)
                    </Typography>
                </div>
                <div className="text-right">
                    <Typography className="flex items-center justify-end gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]" style={{ color: SELL_COLOR }}>
                        VENTA <TrendingDown size={16} />
                    </Typography>
                    <Typography className="mt-1.5 tabular-nums text-foreground-muted">
                        {sellCount.toLocaleString()} txs ({sellPercentage.toFixed(1)}%)
                    </Typography>
                </div>
            </div>
        </div>
    );
};
