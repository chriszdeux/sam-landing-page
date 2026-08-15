// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Gestión de estado local para balance
// 3-Gestión de estado local para assets
// 4-Efecto secundario para sincronización del ciclo de vida
// 5-Estructuración y renderizado visual del componente UI
// 6-Estructuración y renderizado visual del componente UI
// 7-Estructuración y renderizado visual del componente UI
// 8-Estructuración y renderizado visual del componente UI

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Backpack, TrendingUp, Landmark } from 'lucide-react';
import { Typography } from '../ui/Typography';

export const PortfolioAnimation = ({ color, variant = 'balance' }: { color: string, variant?: 'balance' | 'inventory' | 'stats' }) => {

    //# 2-Gestión de estado local para balance
    const [balance, setBalance] = useState(1000);

    //# 3-Gestión de estado local para assets
    const [assets, setAssets] = useState<{name: string, value: number, percentage: number}[]>([
        { name: 'LYN', value: 80, percentage: 80 },
        { name: 'SOL', value: 15, percentage: 15 },
        { name: 'IXNN', value: 5, percentage: 5 }
    ]);

    //# 4-Efecto secundario para sincronización del ciclo de vida
    useEffect(() => {
        const interval = setInterval(() => {
            setBalance(prev => prev + Math.random() * 10 - 2);
            setAssets(prev => prev.map(asset => ({ ...asset, value: asset.value + Math.random() * 2 - 1 })));
        }, 1000);

        //# 5-Estructuración y renderizado visual del componente UI
        return () => clearInterval(interval);
    }, []);

    if (variant === 'inventory') {
        const items = ['Engine V2', 'Shield Mk1', 'Laser Cannon', 'Mining Drone', 'Fuel Cell', 'Nav Module'];

        //# 6-Estructuración y renderizado visual del componente UI
        return (
             <div className="flex h-full w-full flex-col bg-black/80 p-8 text-white">
                <Typography variant="overline" component="p" className="mb-4 flex items-center gap-2 font-bold" style={{ color }}>
                    <Backpack size={16} /> Inventory Storage
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                    {items.map((item, i) => (
                        <div key={i}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    border: `1px solid ${color}40`,
                                    borderRadius: 8,
                                    padding: 16,
                                    background: `${color}10`,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <div className="h-10 w-10 rounded" style={{ backgroundColor: color }} />
                                <Typography variant="caption" component="p" className="text-center">{item}</Typography>
                            </motion.div>
                        </div>
                    ))}
                </div>
             </div>
        );
    }

    if (variant === 'stats') {

        //# 7-Estructuración y renderizado visual del componente UI
        return (
            <div className="flex h-full w-full flex-col justify-center bg-black/80 p-8 text-white">
                <Typography variant="overline" component="p" className="mb-8 flex items-center gap-2 font-bold" style={{ color }}>
                    <TrendingUp size={16} /> Performance Metrics
                </Typography>
                <div className="flex h-[200px] items-end gap-4">
                    {[65, 40, 75, 50, 90, 85].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{
                                flex: 1,
                                background: `linear-gradient(to top, ${color}20, ${color})`,
                                borderRadius: '4px 4px 0 0',
                                position: 'relative'
                            }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                className="absolute -top-5 left-1/2 -translate-x-1/2"
                                style={{ color }}
                            >
                                {h}%
                            </Typography>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 flex justify-between">
                    <div>
                        <Typography variant="caption" component="p" className="text-gray-400">Monthly ROI</Typography>
                        <Typography variant="h5" component="p" style={{ color }}>+24.5%</Typography>
                    </div>
                    <div>
                        <Typography variant="caption" component="p" className="text-gray-400">Staking APY</Typography>
                        <Typography variant="h5" component="p" style={{ color }}>12.8%</Typography>
                    </div>
                </div>
            </div>
        );
    }

    //# 8-Estructuración y renderizado visual del componente UI
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-black/80 p-8 text-white">
            <Typography variant="overline" component="p" className="flex items-center gap-2 font-bold" style={{ color }}>
                <Landmark size={16} /> Total Balance
            </Typography>
            <motion.h1
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                style={{ fontSize: '3rem', margin: '0 0 20px 0', textShadow: `0 0 20px ${color}80` }}
            >
                ${balance.toFixed(2)}
            </motion.h1>

            <div className="flex w-full flex-col gap-4">
                {assets.map((asset, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{ backgroundColor: color, opacity: 0.2 + (i * 0.2) }}
                        >
                            {asset.name[0]}
                        </div>
                        <div className="flex-1">
                            <div className="mb-1 flex justify-between">
                                <Typography variant="body2" component="p">{asset.name}</Typography>
                                <Typography variant="body2" component="p" style={{ color }}>{asset.value.toFixed(1)}%</Typography>
                            </div>
                            <div className="h-1 w-full rounded-lg bg-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${asset.value}%` }}
                                    style={{ height: '100%', backgroundColor: color, borderRadius: 2 }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
