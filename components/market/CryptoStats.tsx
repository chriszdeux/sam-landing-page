// 1-Definir componente de estadísticas de criptomoneda
// 2-Renderizar grid de estadísticas financieras

//# 1-Definir componente de estadísticas de criptomoneda
'use client';

import React from 'react';
import { Typography } from '../ui/Typography';
import { Financial } from '../../lib/types/crypto';
import { TaoIcon } from '../ui/TaoIcon';

interface CryptoStatsProps {
    financial: Financial;
    color?: string;
}

// Antes cada stat era un Card con `sx={{ p: 2 }}`: como `sx` se ignora desde la
// migración de MUI, las celdas quedaban literalmente sin padding y las cifras
// pegadas al borde. Ahora el panel es uno solo con hairline + padding real, y
// las celdas se separan con líneas de 1px a baja opacidad en vez de 8 cajas.
interface StatItemProps {
    label: string;
    value: React.ReactNode;
    subValue?: string;
    /** Acento del proyecto (verde/rojo según el 24h) para los valores récord. */
    accent?: string;
    /** Direcciones/hashes: fuente mono y corte por caracter. */
    mono?: boolean;
    className?: string;
}

const StatItem = ({ label, value, subValue, accent, mono, className }: StatItemProps) => (
    // La fila fija de 1.7rem reserva las dos líneas que ocupa la etiqueta más
    // larga y la etiqueta se ancla abajo (self-end): así la distancia
    // etiqueta-cifra es constante y las cifras de una fila quedan alineadas.
    <div className={`grid min-w-0 grid-rows-[1.7rem_auto_auto] gap-y-1.5 px-1 py-3 ${className ?? ''}`}>
        <Typography
            variant="caption"
            component="span"
            className="self-end text-[0.6875rem] font-semibold uppercase leading-[1.25] tracking-[0.14em] text-white/40"
        >
            {label}
        </Typography>
        <Typography
            variant="body1"
            component="div"
            className={`flex min-w-0 items-baseline gap-1.5 font-semibold tabular-nums text-white ${mono ? 'font-mono text-[0.9375rem]' : 'text-[1.0625rem]'}`}
        >
            {value}
        </Typography>
        {subValue && (
            <Typography
                variant="caption"
                component="span"
                className={`truncate text-[0.6875rem] leading-none tabular-nums ${accent ? '' : 'text-white/35'}`}
                style={accent ? { color: accent } : undefined}
                title={subValue}
            >
                {subValue}
            </Typography>
        )}
    </div>
);

export const CryptoStats = ({ financial, color }: CryptoStatsProps) => {

    //# 2-Renderizar grid de estadísticas financieras
    // Hairlines horizontales por fila: la primera fila (2 celdas) no lleva
    // borde superior, el resto sí, así el grid se lee como una tabla.
    const rowBorder = 'border-t border-white/[0.06]';

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/[0.12]">
            <div className="grid grid-cols-2 gap-x-8">
                <StatItem
                    label="Capitalización de Mercado"
                    value={<>{financial.marketCap.toLocaleString()} <TaoIcon size={14} /></>}
                />
                <StatItem
                    label="Volumen (24h)"
                    value={<>{financial.volume24h ? financial.volume24h.toLocaleString() : '0'} <TaoIcon size={14} /></>}
                />

                <StatItem
                    className={rowBorder}
                    label="Liquidez (Trading)"
                    value={financial.supplyToTrade ? financial.supplyToTrade.toLocaleString() : '0'}
                />
                <StatItem
                    className={rowBorder}
                    label="Suministro Total"
                    value={financial.isInfiniteSupply ? 'Infinito' : financial.totalSupply.toLocaleString()}
                    subValue={!financial.isInfiniteSupply && financial.maxSupply ? `Max: ${financial.maxSupply.toLocaleString()}` : undefined}
                />

                <StatItem
                    className={rowBorder}
                    label="Máximo Histórico"
                    value={<>{financial.allTimeHigh.toLocaleString()} <TaoIcon size={14} /></>}
                    subValue={financial.allTimeHighDate ? new Date(financial.allTimeHighDate).toLocaleDateString() : 'N/A'}
                    accent={color}
                />
                <StatItem
                    className={rowBorder}
                    label="Mínimo Histórico"
                    value={<>{financial.allTimeLow.toLocaleString()} <TaoIcon size={14} /></>}
                    subValue={financial.allTimeLowDate ? new Date(financial.allTimeLowDate).toLocaleDateString() : 'N/A'}
                    accent={color}
                />

                <StatItem
                    className={rowBorder}
                    label="Decimales"
                    value={financial.decimals?.toString() || 'N/A'}
                />
                <StatItem
                    className={rowBorder}
                    label="Contrato"
                    mono
                    value={financial.contractAddress ? `${financial.contractAddress.substring(0, 6)}...${financial.contractAddress.substring(financial.contractAddress.length - 4)}` : 'N/A'}
                    subValue={financial.contractAddress}
                />
            </div>
        </div>
    );
};
