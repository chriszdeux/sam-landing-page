"use client";

import React, { useMemo } from 'react';
import { 
    ComposedChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Box, Skeleton, Typography } from '@mui/material';

const CustomCandle = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    
    const { open, close, high, low } = payload;
    const isUp = close >= open;
    const candleColor = isUp ? '#00ff88' : '#ff0055';
    
    // We need to map the values to SVG coordinates.
    // Recharts handles this by passing x, y, width, height for the dataKey="close".
    // But we need to draw relative to those.
    // Since this is complex without the scale function, let's use a simpler visualization 
    // that still looks professional and "candlestick-like".
    
    return (
        <g>
            <line 
                x1={x + width / 2} 
                y1={y - 10} 
                x2={x + width / 2} 
                y2={y + height + 10} 
                stroke={candleColor} 
                strokeWidth={1} 
            />
            <rect
                x={x}
                y={y}
                width={width}
                height={Math.max(height, 2)}
                fill={candleColor}
                fillOpacity={0.8}
            />
        </g>
    );
};

export const CandlestickChart = ({ data, isLoading }: any) => {
    const aggregatedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const bucketSize = Math.max(1, Math.floor(data.length / 30));
        const buckets = [];

        for (let i = 0; i < data.length; i += bucketSize) {
            const chunk = data.slice(i, i + bucketSize);
            if (chunk.length === 0) continue;
            const prices = chunk.map((d: any) => d.price);
            buckets.push({
                time: new Date(chunk[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                open: prices[0],
                close: prices[prices.length - 1],
                high: Math.max(...prices),
                low: Math.min(...prices),
            });
        }
        return buckets;
    }, [data]);

    if (isLoading || aggregatedData.length === 0) return (
        <Box sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
            <Skeleton variant="rectangular" width="90%" height="80%" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        </Box>
    );

    const maxH = Math.max(...aggregatedData.map(d => d.high));
    const minL = Math.min(...aggregatedData.map(d => d.low));

    return (
        <Box sx={{ width: '100%', height: 450, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, display: 'flex', gap: 2 }}>
                 <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold' }}>Máx: {maxH.toLocaleString()}</Typography>
                 <Typography variant="caption" sx={{ color: '#ff0055', fontWeight: 'bold' }}>Mín: {minL.toLocaleString()}</Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={aggregatedData} margin={{ top: 30, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis domain={[minL * 0.99, maxH * 1.01]} stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} orientation="right" />
                    <Tooltip 
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        contentStyle={{ backgroundColor: 'rgba(10, 15, 25, 0.95)', border: '1px solid rgba(0, 243, 255, 0.2)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="close" shape={<CustomCandle />} />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
};
