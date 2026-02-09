import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const MarketAnimation = ({ color }: { color: string }) => {
    const [candles, setCandles] = useState<number[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setCandles(Array.from({ length: 20 }, () => Math.random() * 100));
        }, 0);
        const interval = setInterval(() => {
            setCandles(prev => {
                const newCandles = [...prev.slice(1), Math.random() * 100];
                return newCandles;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between',
            gap: 1,
            p: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            overflow: 'hidden'
        }}>
            {candles.map((height, i) => (
                <motion.div
                    key={i}
                    layout
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%`, backgroundColor: i === candles.length - 1 ? color : (height > 50 ? '#00ff00' : '#ff0000') }}
                    transition={{ type: 'tween', duration: 1.5, ease: "easeInOut" }}
                    style={{
                        width: '100%',
                        borderRadius: 2,
                        opacity: 0.7
                    }}
                />
            ))}
        </Box>
    );
};
