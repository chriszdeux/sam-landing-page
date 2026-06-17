'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { PowerSettingsNew, History, CardGiftcard } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleLaboratoryPower, toggleOverclock } from '../../lib/features/labs/reducer';
import { TechFrame } from '../ui/TechFrame';
import { RootState } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { formatHash } from '../../lib/utils/formatHash';

export const ControlRewardsPanel = React.memo(() => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { userInfo } = useAppSelector((state) => state.auth);
    const { energy, hashAvailable, isPoweredOn, isOverheated, isOverclockActive, chronoBurstFreqTypes } = useAppSelector((state: RootState) => {
        const lab = state.reducerLabs.currentLab;
        const selectedNetwork = state.blockchain.selectedNetwork;
        return {
            energy: lab?.energy || 0,
            hashAvailable: selectedNetwork?.hashAvailable ?? 0,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            isOverheated: state.reducerLabs.isOverheated,
            isOverclockActive: state.reducerLabs.isOverclockActive,
            chronoBurstFreqTypes: state.blockchain.chronoBurstFreqTypes
        };
    }, (prev, next) => {
        return (
            prev.energy === next.energy &&
            prev.hashAvailable === next.hashAvailable &&
            prev.isPoweredOn === next.isPoweredOn &&
            prev.isOverheated === next.isOverheated &&
            prev.isOverclockActive === next.isOverclockActive &&
            prev.chronoBurstFreqTypes === next.chronoBurstFreqTypes
        );
    });
    const transactions = useAppSelector((state: RootState) => state.transactions.transactions);
    
    const isActive = isPoweredOn;

    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

    const handleToggle = () => {
        dispatch(toggleLaboratoryPower());
    };

    const handleOverclockToggle = () => {
        dispatch(toggleOverclock());
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Power Toggle & Energy Block */}
            <TechFrame color={isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <motion.div
                                animate={isActive ? { 
                                    boxShadow: ['0 0 0px #00e676', '0 0 20px #00e676', '0 0 0px #00e676'] 
                                } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ borderRadius: '50%' }}
                            >
                                <IconButton 
                                    onClick={handleToggle} disabled={isOverheated && !isActive}
                                    sx={{ 
                                        p: 1.5, 
                                        bgcolor: isActive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.05)',
                                        color: isActive ? '#00e676' : 'rgba(255,255,255,0.3)',
                                        border: `1px solid ${isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: isActive ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.1)',
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <PowerSettingsNew />
                                </IconButton>
                            </motion.div>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                    LABORATORIO
                                </Typography>
                                <Typography variant="caption" sx={{ color: isActive ? '#00e676' : isOverheated ? '#ff1744' : 'rgba(255,255,255,0.5)', fontWeight: 'bold', display: 'block' }}>
                                    {isOverheated ? 'SISTEMA BLOQUEADO (COOLDOWN)' : isActive ? 'SISTEMA ACTIVO' : 'SISTEMA EN PAUSA'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '0.7rem', mt: 0.5, fontFamily: 'monospace' }}>
                                    Acumulado: {formatHash(energy, chronoBurstFreqTypes)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
                                HASH ACUMULADO LOCAL
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#00f3ff', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                {formatHash(energy, chronoBurstFreqTypes)}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        disabled={!isPoweredOn || isOverheated}
                        onClick={handleOverclockToggle}
                        sx={{
                            mb: 2,
                            py: 1,
                            bgcolor: isOverclockActive ? 'rgba(255, 23, 68, 0.2)' : 'rgba(255, 183, 0, 0.05)',
                            color: isOverclockActive ? '#ff1744' : '#ffb700',
                            border: `1px solid ${isOverclockActive ? '#ff1744' : '#ffb700'}`,
                            fontWeight: 'bold',
                            letterSpacing: 1.5,
                            boxShadow: isOverclockActive ? '0 0 15px rgba(255, 23, 68, 0.3)' : 'none',
                            '&:hover': {
                                bgcolor: isOverclockActive ? 'rgba(255, 23, 68, 0.3)' : 'rgba(255, 183, 0, 0.1)',
                                borderColor: isOverclockActive ? '#ff1744' : '#ffb700'
                            },
                            '&.Mui-disabled': {
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.15)',
                                bgcolor: 'transparent'
                            }
                        }}
                    >
                        {isOverclockActive ? 'OVERCLOCK ACTIVO (3X TEMP)' : 'ACTIVAR OVERCLOCK'}
                    </Button>
                    
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', textAlign: 'center', fontStyle: 'italic' }}>
                        Inyección automática de Hash activa al consolidar Round 10
                    </Typography>
                </Box>
            </TechFrame>

            {/* Transactions History Block */}
            <TechFrame color="rgba(255,255,255,0.1)">
                <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <History sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
                            HISTORIAL RECIENTE
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx, i) => (
                                <Box key={tx.id || i} sx={{ 
                                    p: 1.5, 
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    borderRadius: 1,
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', display: 'block' }}>
                                            {tx.transactionType || 'TRANSACCIÓN'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                            {tx.dateCreated ? new Date(tx.dateCreated).toLocaleDateString() : 'Fecha desconocida'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ 
                                        color: tx.transactionType === 'BUY' ? '#00e676' : '#ff1744',
                                        fontWeight: 'bold',
                                        fontFamily: 'monospace'
                                    }}>
                                        {tx.transactionType === 'BUY' ? '+' : '-'}{tx.financialInfo?.amount || 0}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', py: 2 }}>
                                No hay transacciones recientes
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </TechFrame>

            {/* Rewards Button */}
            <Button
                variant="contained"
                fullWidth
                startIcon={<CardGiftcard />}
                onClick={() => router.push('/rewards')}
                sx={{
                    py: 2,
                    bgcolor: 'rgba(0, 243, 255, 0.1)',
                    color: '#00f3ff',
                    border: '1px solid #00f3ff',
                    fontWeight: 'bold',
                    letterSpacing: 2,
                    boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
                    '&:hover': { 
                        bgcolor: 'rgba(0, 243, 255, 0.2)', 
                        borderColor: '#00f3ff',
                        boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)'
                    }
                }}
            >
                VER RECOMPENSAS
            </Button>
        </Box>
    );
});
