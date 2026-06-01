"use client";

import React from 'react';
import { Box, Typography, Stack, Button as MuiButton, Divider } from '@mui/material';
import { TechFrame } from '../ui/TechFrame';
import { TaoIcon } from '../ui/TaoIcon';
import { ArrowUpRight, Wallet, Copy } from 'lucide-react';

interface BalancesPanelProps {
    thaoBalance: number;
    cryptoBalance: number;
    activeWallet?: {
        label: string;
        walletAddress: string;
    };
    onBuy?: () => void;
    onSell?: () => void;
}

export const BalancesPanel: React.FC<BalancesPanelProps> = ({ 
    thaoBalance, 
    cryptoBalance, 
    activeWallet,
    onBuy, 
    onSell 
}) => {
    const handleCopy = () => {
        if (activeWallet?.walletAddress) {
            navigator.clipboard.writeText(activeWallet.walletAddress);
        }
    };

    return (
        <Stack spacing={3}>
            {/* Balance Principal THAO */}
            <Box sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: '1px solid rgba(0, 243, 255, 0.3)',
                bgcolor: 'rgba(10, 15, 20, 0.7)',
                backdropFilter: 'blur(20px)',
                background: 'linear-gradient(145deg, rgba(15, 25, 35, 0.9) 0%, rgba(0, 243, 255, 0.05) 100%)',
                boxShadow: '0 0 30px rgba(0, 243, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    position: 'absolute', top: -40, right: -40, width: 120, height: 120, 
                    borderRadius: '50%', bgcolor: '#00f3ff', filter: 'blur(60px)', opacity: 0.1 
                }} />
                
                <Typography variant="overline" sx={{ color: '#00f3ff', letterSpacing: 2, fontWeight: 900, opacity: 0.8 }}>
                    ACTIVOS TOTALES // THAO
                </Typography>
                
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, textShadow: '0 0 15px rgba(0, 243, 255, 0.5)' }}>
                        {thaoBalance.toLocaleString()}
                    </Typography>
                    <TaoIcon size={24} color="#00f3ff" />
                </Stack>
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', px: 1, py: 0.5, borderRadius: 1, bgcolor: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                        <ArrowUpRight size={14} color="#00ff88" />
                        <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold', ml: 0.5 }}>+4.2%</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>SINCRO OK</Typography>
                </Box>
            </Box>

            {/* Wallet Info Section */}
            <Box sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                bgcolor: 'rgba(5, 10, 15, 0.4)',
                backdropFilter: 'blur(10px)'
            }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                        <Wallet size={18} />
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, display: 'block', lineHeight: 1 }}>
                            BILLETERA ACTIVA
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 900 }}>
                            {activeWallet?.label || 'SIN NOMBRE'}
                        </Typography>
                    </Box>
                </Stack>
                
                <Box 
                    onClick={handleCopy}
                    sx={{ 
                        p: 1.5, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.3)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                    }}
                >
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00f3ff', opacity: 0.7 }}>
                        {activeWallet?.walletAddress ? (activeWallet.walletAddress.substring(0, 12) + '...') : '0x000...'}
                    </Typography>
                    <Copy size={14} color="rgba(255,255,255,0.3)" />
                </Box>
            </Box>

            {/* Equivalente en THAOS */}
            <Box sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: '1px solid rgba(255, 215, 0, 0.2)',
                bgcolor: 'rgba(10, 15, 20, 0.7)',
                backdropFilter: 'blur(20px)',
                background: 'linear-gradient(145deg, rgba(15, 25, 35, 0.9) 0%, rgba(255, 215, 0, 0.05) 100%)',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Typography variant="overline" sx={{ color: '#ffd700', letterSpacing: 2, fontWeight: 900, opacity: 0.8 }}>
                    EQUIVALENTE EN THAOS
                </Typography>
                
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>
                        {cryptoBalance.toLocaleString()}
                    </Typography>
                    <TaoIcon size={20} color="#ffd700" />
                </Stack>
            </Box>

            {/* Módulo de Operaciones */}
            <Box sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'rgba(5, 5, 10, 0.4)' }}>
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: 2, fontWeight: 900, display: 'block', mb: 3 }}>
                    OPERACIONES // TERMINAL
                </Typography>
                
                <Stack spacing={2}>
                    <MuiButton 
                        fullWidth 
                        onClick={onBuy}
                        sx={{ 
                            py: 1.5, 
                            fontWeight: 900,
                            letterSpacing: 1,
                            borderRadius: 2,
                            color: '#00ff88',
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            background: 'rgba(0, 255, 136, 0.05)',
                            '&:hover': { background: 'rgba(0, 255, 136, 0.1)', borderColor: '#00ff88' },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        COMPRAR ACTIVOS
                    </MuiButton>
                    <MuiButton 
                        fullWidth 
                        onClick={onSell}
                        sx={{ 
                            py: 1.5, 
                            fontWeight: 900,
                            letterSpacing: 1,
                            borderRadius: 2,
                            color: '#ff0055',
                            border: '1px solid rgba(255, 0, 85, 0.3)',
                            background: 'rgba(255, 0, 85, 0.05)',
                            '&:hover': { background: 'rgba(255, 0, 85, 0.1)', borderColor: '#ff0055' },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        VENDER ACTIVOS
                    </MuiButton>
                </Stack>
            </Box>
        </Stack>
    );
};
