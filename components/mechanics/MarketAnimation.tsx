// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Gestión de estado local para candles
// 3-Efecto secundario para sincronización del ciclo de vida
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useState } from 'react';
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
        <div className="flex h-full w-full items-end justify-between gap-2 overflow-hidden bg-black/50 p-4">
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
        </div>
    );
};
