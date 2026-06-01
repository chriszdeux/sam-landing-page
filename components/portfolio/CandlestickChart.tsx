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
    Cell,
    Line
} from 'recharts';
import { Box, Skeleton, Typography } from '@mui/material';

const CustomCandle = (props: any) => {
    const { x, y, width, height, low, high, open, close } = props;
    const isUp = close >= open;
    const candleColor = isUp ? '#00ff88' : '#ff0055';
    
    // Ratio calculations for relative positioning within the SVG g element
    const ratio = height / Math.abs(open - close || 1);
    
    return (
        <g>
            {/* Wick (High to Low) */}
            <line 
                x1={x + width / 2} 
                y1={y - (high - Math.max(open, close)) * ratio} 
                x2={x + width / 2} 
                y2={y + height + (Math.min(open, close) - low) * ratio} 
                stroke={candleColor} 
                strokeWidth={1} 
            />
            {/* Body (Open to Close) */}
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

export const CandlestickChart = ({ data, isLoading, color = '#00f3ff' }: any) => {
    const aggregatedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const bucketSize = Math.ceil(data.length / 24);
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

    if (isLoading) return (
        <Box sx={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            <Skeleton variant="rectangular" width="100%" height={350} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        </Box>
    );

    return (
        <Box sx={{ width: '100%', height: 450, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, display: 'flex', gap: 2 }}>
                 <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold' }}>Máx: {Math.max(...aggregatedData.map(d => d.high)).toLocaleString()}</Typography>
                 <Typography variant="caption" sx={{ color: '#ff0055', fontWeight: 'bold' }}>Mín: {Math.min(...aggregatedData.map(d => d.low)).toLocaleString()}</Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={aggregatedData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} orientation="right" />
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
