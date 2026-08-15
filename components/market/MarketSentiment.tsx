// 1-Definir componente de sentimiento de mercado
// 2-Obtener datos históricos y calcular sentimiento
// 3-Renderizar indicador visual de sentimiento y volumen

//# 1-Definir componente de sentimiento de mercado
import React from 'react';
import { Typography } from '../ui/Typography';
import { Tooltip } from '../ui/Tooltip';

import { useAppSelector } from '../../lib/hooks';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface MarketSentimentProps {
    cryptoId: string;
}

export const MarketSentiment = ({ cryptoId }: MarketSentimentProps) => {

    //# 2-Obtener datos históricos y calcular sentimiento
    const { historicalData } = useAppSelector((state) => state.market);
    const data = historicalData[cryptoId];

    if (!data || !data.currentBuyState || !data.currentSellState) {
        return null;
    }

    const buyCount = data.currentBuyState.counter;
    const sellCount = data.currentSellState.counter;
    const totalCount = buyCount + sellCount;

    const buyPercentage = totalCount > 0 ? (buyCount / totalCount) * 100 : 50;
    const sellPercentage = totalCount > 0 ? (sellCount / totalCount) * 100 : 50;

    let sentiment = 'NEUTRAL';
    let sentimentColor = '#cccccc';

    if (buyPercentage > 55) {
        sentiment = 'CODICIA (GREED)';
        sentimentColor = '#00ff9d';
    } else if (sellPercentage > 55) {
        sentiment = 'MIEDO (FEAR)';
        sentimentColor = '#ff0055';
    }

    //# 3-Renderizar indicador visual de sentimiento y volumen
    return (
        <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="mb-4 flex flex-row items-center justify-between">
                <Typography variant="h6" className="flex items-center gap-2 font-bold text-white">
                    Sentimiento de Mercado
                    <Tooltip content="Basado en el volumen de transacciones actuales de compra vs venta">
                        <Info size={16} className="cursor-help text-foreground-muted" />
                    </Tooltip>
                </Typography>
                <Typography variant="subtitle2" className="font-bold" style={{ color: sentimentColor }}>
                    {sentiment}
                </Typography>
            </div>

            <div className="relative mb-4 h-3 overflow-hidden rounded-full bg-[#333]">

                <div
                    className="absolute inset-y-0 left-0 shadow-[0_0_10px_rgba(0,255,157,0.5)] transition-[width] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ width: `${buyPercentage}%`, backgroundColor: '#00ff9d' }}
                />


                <div
                    className="absolute inset-y-0 right-0 shadow-[0_0_10px_rgba(255,0,85,0.5)] transition-[width] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ width: `${sellPercentage}%`, backgroundColor: '#ff0055' }}
                />
            </div>

            <div className="flex flex-row justify-between text-sm">
                <div className="text-left">
                    <Typography className="flex items-center gap-1 font-bold" style={{ color: '#00ff9d' }}>
                        <TrendingUp size={18} /> COMPRA
                    </Typography>
                    <Typography className="text-foreground-muted">
                        {buyCount.toLocaleString()} txs ({buyPercentage.toFixed(1)}%)
                    </Typography>
                </div>
                <div className="text-right">
                    <Typography className="flex items-center justify-end gap-1 font-bold" style={{ color: '#ff0055' }}>
                         VENTA <TrendingDown size={18} />
                    </Typography>
                    <Typography className="text-foreground-muted">
                        {sellCount.toLocaleString()} txs ({sellPercentage.toFixed(1)}%)
                    </Typography>
                </div>
            </div>
        </div>
    );
};
