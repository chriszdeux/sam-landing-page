// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Gestión de estado local para candles
// 3-Efecto secundario para sincronización del ciclo de vida
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const MarketAnimation = ({ color }: { color: string }) => {
    
    
    //# 2-Gestión de estado local para candles
    const [candles, setCandles] = useState<number[]>([]);

    
    
    //# 3-Efecto secundario para sincronización del ciclo de vida
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
        
        
        //# 4-Estructuración y renderizado visual del componente UI
        return () => clearInterval(interval);
    }, []);

    
    
    //# 5-Estructuración y renderizado visual del componente UI
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
