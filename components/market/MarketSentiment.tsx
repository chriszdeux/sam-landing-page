import React from 'react';
import { Box, Typography, Stack, Tooltip } from '@mui/material';
import { useAppSelector } from '../../lib/hooks';
import { TrendingUp, TrendingDown, InfoOutlined } from '@mui/icons-material';

interface MarketSentimentProps {
    cryptoId: string;
}

export const MarketSentiment = ({ cryptoId }: MarketSentimentProps) => {
    const { historicalData } = useAppSelector((state) => state.market);
    const data = historicalData[cryptoId];

    if (!data || !data.currentBuyState || !data.currentSellState) {
        return null;
    }

    const buyCount = data.currentBuyState.counter;
    const sellCount = data.currentSellState.counter;
    const totalCount = buyCount + sellCount;

    // Avoid division by zero
    const buyPercentage = totalCount > 0 ? (buyCount / totalCount) * 100 : 50;
    const sellPercentage = totalCount > 0 ? (sellCount / totalCount) * 100 : 50;

    // Determine Sentiment
    // > 55% Buy = Greeds
    // > 55% Sell = Fear
    // Else Neutral
    let sentiment = 'NEUTRAL';
    let sentimentColor = '#cccccc';
    
    if (buyPercentage > 55) {
        sentiment = 'CODICIA (GREED)';
        sentimentColor = '#00ff9d'; // Green
    } else if (sellPercentage > 55) {
        sentiment = 'MIEDO (FEAR)';
        sentimentColor = '#ff0055'; // Red
    }

    return (
        <Box sx={{ 
            bgcolor: 'rgba(255,255,255,0.02)', 
            borderRadius: 4, 
            p: 3, 
            border: '1px solid rgba(255,255,255,0.05)',
            mb: 3
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Sentimiento de Mercado
                    <Tooltip title="Basado en el volumen de transacciones actuales de compra vs venta">
                        <InfoOutlined sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                    </Tooltip>
                </Typography>
                <Typography variant="subtitle2" sx={{ color: sentimentColor, fontWeight: 'bold' }}>
                    {sentiment}
                </Typography>
            </Stack>

            {/* Gauge / Bar */}
            <Box sx={{ position: 'relative', height: 12, bgcolor: '#333', borderRadius: 6, overflow: 'hidden', mb: 2 }}>
                {/* Buy Bar */}
                <Box sx={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: 0, 
                    bottom: 0, 
                    width: `${buyPercentage}%`, 
                    bgcolor: '#00ff9d',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 10px rgba(0, 255, 157, 0.5)'
                }} />
                
                {/* Sell Bar (Background is effectively the rest, but let's make it explicit if needed or just use bg) */}
                {/* Because we want Red on the right, we can just set the container bg to red and let green cover it from left? 
                    Better for animation: Two divs.*/}
                 <Box sx={{ 
                    position: 'absolute', 
                    right: 0, 
                    top: 0, 
                    bottom: 0, 
                    width: `${sellPercentage}%`, 
                    bgcolor: '#ff0055',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 10px rgba(255, 0, 85, 0.5)'
                }} />
            </Box>

            {/* Stats */}
            <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.875rem' }}>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ color: '#00ff9d', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp fontSize="small" /> COMPRA
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {buyCount.toLocaleString()} txs ({buyPercentage.toFixed(1)}%)
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#ff0055', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                         VENTA <TrendingDown fontSize="small" />
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {sellCount.toLocaleString()} txs ({sellPercentage.toFixed(1)}%)
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};
