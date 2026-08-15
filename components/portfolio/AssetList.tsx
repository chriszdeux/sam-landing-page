// 1-Manejo de lógica de usuario para handleTransaction
// 2-Estructuración y renderizado visual del componente UI

import React from 'react';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TechFrame } from '../ui/TechFrame';
import { TaoIcon } from '../ui/TaoIcon';
import { Asset } from '../../lib/types/portfolio';

interface AssetListProps {
    assets: Asset[];
    totalValue: number;
}

export const AssetList: React.FC<AssetListProps> = ({ assets, totalValue }) => {
    const router = useRouter();



    //# 1-Manejo de lógica de usuario para handleTransaction
    const handleTransaction = (assetId: string, type: 'BUY' | 'SELL') => {
        router.push(`/market/${assetId}`);
    };



    //# 2-Estructuración y renderizado visual del componente UI
    return (
        <div className="flex flex-col gap-6">
            {assets.map((asset, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                >
                    <TechFrame color={asset.color} className="w-full">
                        <div className="flex flex-col items-start justify-between gap-6 p-6 transition-all duration-300 hover:bg-white/[0.02] md:flex-row md:items-center md:gap-0">
                            <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0 md:mr-8">
                            <div className="flex items-center gap-6">
                                <div
                                    className="flex h-14 w-14 items-center justify-center rounded-full font-bold"
                                    style={{ backgroundColor: `${asset.color}20`, color: asset.color, border: `1px solid ${asset.color}40` }}
                                >
                                    {asset.symbol ? asset.symbol[0] : asset.name[0]}
                                </div>
                                <div>
                                    <Typography variant="h6" className="font-bold text-white">
                                        {asset.name}
                                    </Typography>
                                    <Typography variant="body2" className="text-white/60">
                                        {asset.quantity.toLocaleString()} {asset.symbol}
                                    </Typography>
                                </div>
                            </div>

                            <div className="min-w-[120px] text-left sm:text-right">
                                    <Typography variant="h6" className="flex items-center justify-start gap-1 font-bold sm:justify-end" style={{ color: asset.color }}>
                                    {asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <TaoIcon size={12} color={asset.color} />
                                    </Typography>
                                    <div className="mt-1 flex items-center justify-start gap-2 sm:justify-end">
                                        <div className="h-1 w-20 overflow-hidden rounded-lg bg-white/10">
                                            <div
                                                className="h-full rounded-lg"
                                                style={{
                                                    width: `${totalValue > 0 ? (asset.value / totalValue) * 100 : 0}%`,
                                                    backgroundColor: asset.color,
                                                }}
                                            />
                                        </div>
                                        <Typography variant="caption" className="text-foreground-muted">
                                            {totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : '0.0'}%
                                        </Typography>
                                    </div>
                            </div>

                            </div>

                        <div className="flex w-full justify-between gap-4 border-t border-white/10 pt-4 md:w-auto md:justify-start md:border-l md:border-t-0 md:pl-8 md:pt-0">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTransaction(asset.id, 'BUY');
                                }}
                                sx={{
                                    borderColor: 'rgba(0, 230, 118, 0.3)',
                                    color: '#00e676',
                                    flex: { xs: 1, md: 'none' },
                                    minWidth: { xs: 'auto', md: 100 },
                                    '&:hover': { borderColor: '#00e676', bgcolor: 'rgba(0, 230, 118, 0.1)' }
                                }}
                            >
                                COMPRAR
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTransaction(asset.id, 'SELL');
                                }}
                                sx={{
                                    borderColor: 'rgba(255, 23, 68, 0.3)',
                                    color: '#ff1744',
                                    flex: { xs: 1, md: 'none' },
                                    minWidth: { xs: 'auto', md: 100 },
                                    '&:hover': { borderColor: '#ff1744', bgcolor: 'rgba(255, 23, 68, 0.1)' }
                                }}
                            >
                                VENDER
                            </Button>
                        </div>
                    </div>
                    </TechFrame>
                </motion.div>
            ))}
        </div>
    );
};
