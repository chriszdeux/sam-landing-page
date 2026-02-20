// 1-Manejo de lógica de usuario para handleTransaction
// 2-Estructuración y renderizado visual del componente UI

import React from 'react';
import { Box, Avatar, Typography, LinearProgress, Button } from '@mui/material';
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
        router.push(`/market/trade?type=${type}&cryptoId=${assetId}`);
    };

    
    
    //# 2-Estructuración y renderizado visual del componente UI
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {assets.map((asset, i) => (
                <motion.div 
                    key={i} 
                    initial={{ x: 50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: 0.3 + i * 0.1 }}
                >
                    <TechFrame color={asset.color} className="w-full">
                        <Box 
                            sx={{ 
                                p: 3, 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.3s',
                                "&:hover": {
                                    bgcolor: 'rgba(255,255,255,0.02)'
                                }
                            }}
                        >
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', mr: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar sx={{ bgcolor: `${asset.color}20`, color: asset.color, width: 56, height: 56, fontWeight: 'bold', border: `1px solid ${asset.color}40` }}>
                                    {asset.symbol ? asset.symbol[0] : asset.name[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="white" fontWeight="bold">
                                        {asset.name}
                                    </Typography>
                                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                        {asset.quantity.toLocaleString()} {asset.symbol}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                                    <Typography variant="h6" sx={{ color: asset.color, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                    {asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <TaoIcon size={12} color={asset.color} />
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
                                        <LinearProgress 
                                        variant="determinate" 
                                        value={totalValue > 0 ? (asset.value / totalValue) * 100 : 0} 
                                        sx={{ 
                                            width: 80, 
                                            height: 4, 
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            '& .MuiLinearProgress-bar': { bgcolor: asset.color }
                                        }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : '0.0'}%
                                        </Typography>
                                    </Box>
                            </Box>

                            </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, borderLeft: '1px solid rgba(255,255,255,0.1)', pl: 4 }}>
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
                                    minWidth: 100,
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
                                    minWidth: 100,
                                    '&:hover': { borderColor: '#ff1744', bgcolor: 'rgba(255, 23, 68, 0.1)' }
                                }}
                            >
                                VENDER
                            </Button>
                        </Box>                        
                    </Box>
                    </TechFrame>
                </motion.div>
            ))}
        </Box>
    );
};
