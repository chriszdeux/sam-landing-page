'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Switch, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { PowerSettingsNew, History, CardGiftcard, Bolt } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleLabStatus, injectPower, fetchLabData } from '../../lib/features/labs/actions';
import { toggleLaboratoryPower } from '../../lib/features/labs/reducer';
import { TechFrame } from '../ui/TechFrame';
import { RootState } from '../../lib/store';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { useRouter } from 'next/navigation';

export const ControlRewardsPanel = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { userInfo } = useAppSelector((state) => state.auth);
    const { currentLab, isPoweredOn } = useAppSelector((state: RootState) => state.reducerLabs);
    const { transactions } = useAppSelector((state: RootState) => state.transactions);
    const { selectedNetwork, networks } = useAppSelector((state: RootState) => state.blockchain);
    
    const isActive = isPoweredOn;
    const energy = currentLab?.energy || 0;
    const maxEnergy = currentLab?.maxEnergy || 100;
    const energyPercentage = (energy / maxEnergy) * 100;

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    const storeId = selectedNetwork?.storeTransactions?.storeTransactionId || selectedNetwork?.storeTransactionId || currentNetwork?.storeTransactionId;
    const walletId = userInfo?.wallets?.[0]?.walletAddress;

    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId, transactionIds: userInfo?.transactionsIDs, limit: 5 }));
        }
    }, [dispatch, storeId, walletId, userInfo?.transactionsIDs]);

    const recentTransactions = transactions.slice(0, 5);

    const handleToggle = () => {
        dispatch(toggleLaboratoryPower());
        if (currentLab?.id) {
            dispatch(toggleLabStatus({ 
                labId: currentLab.id, 
                status: !isPoweredOn ? 'ACTIVE' : 'INACTIVE' 
            }));
        }
    };

    const handleInjectPower = async () => {
        const labId = currentLab?.id || userInfo?.idLabs?.[0];
        const blockchainId = selectedNetwork?.id || networks[0]?.id;

        if (labId && blockchainId) {
            const result = await dispatch(injectPower({
                labId,
                blockchainId,
                energyAmount: 10
            }));
            
            if (injectPower.fulfilled.match(result)) {
                // Refresh lab data to show updated energy/temperature
                dispatch(fetchLabData(labId));
            }
        } else {
            console.warn("[ControlRewardsPanel] Missing IDs for power injection:", { labId, blockchainId });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Power Switch & Energy Block */}
            <TechFrame color={isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ 
                                p: 1, 
                                borderRadius: '50%', 
                                bgcolor: isActive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.05)',
                                color: isActive ? '#00e676' : 'rgba(255,255,255,0.3)',
                                border: `1px solid ${isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
                                display: 'flex'
                            }}>
                                <PowerSettingsNew />
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                    LABORATORIO
                                </Typography>
                                <Typography variant="caption" sx={{ color: isActive ? '#00e676' : 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
                                    {isActive ? 'ENCENDIDO' : 'APAGADO'}
                                </Typography>
                            </Box>
                        </Stack>
                        <Switch 
                            checked={isActive}
                            onChange={handleToggle}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#00e676' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00e676' },
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
                                RESERVA DE ENERGÍA
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                                {energy} / {maxEnergy} EP
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            height: 8, 
                            bgcolor: 'rgba(255,255,255,0.05)', 
                            borderRadius: 4, 
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${energyPercentage}%` }}
                                style={{ 
                                    height: '100%', 
                                    background: 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)',
                                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                                }}
                            />
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        startIcon={<Bolt />}
                        onClick={handleInjectPower}
                        disabled={energy < 10}
                        sx={{
                            color: '#ffd700',
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            '&:hover': {
                                borderColor: '#ffd700',
                                bgcolor: 'rgba(255, 215, 0, 0.05)'
                            }
                        }}
                    >
                        INYECTAR ENERGÍA (10 EP)
                    </Button>
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
};
