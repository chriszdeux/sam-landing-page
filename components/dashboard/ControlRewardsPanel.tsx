'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Power, History, Gift } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleLaboratoryPower, toggleOverclock } from '../../lib/features/labs/reducer';
import { TechFrame } from '../ui/TechFrame';
import { RootState } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { formatHash } from '../../lib/utils/formatHash';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

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
        <div className="flex flex-col gap-6">
            {/* Power Toggle & Energy Block */}
            <TechFrame color={isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}>
                <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex flex-row items-center gap-4">
                            <motion.div
                                animate={isActive ? {
                                    boxShadow: ['0 0 0px #00e676', '0 0 20px #00e676', '0 0 0px #00e676']
                                } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ borderRadius: '50%' }}
                            >
                                <button
                                    onClick={handleToggle} disabled={isOverheated && !isActive}
                                    className="rounded-full p-3 transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: isActive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.05)',
                                        color: isActive ? '#00e676' : 'rgba(255,255,255,0.3)',
                                        border: `1px solid ${isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
                                    }}
                                >
                                    <Power size={20} />
                                </button>
                            </motion.div>
                            <div>
                                <Typography variant="body1" className="font-bold text-white">
                                    LABORATORIO
                                </Typography>
                                <Typography variant="caption" component="p" className="font-bold" style={{ color: isActive ? '#00e676' : isOverheated ? '#ff1744' : 'rgba(255,255,255,0.5)' }}>
                                    {isOverheated ? 'SISTEMA BLOQUEADO (COOLDOWN)' : isActive ? 'SISTEMA ACTIVO' : 'SISTEMA EN PAUSA'}
                                </Typography>
                                <Typography variant="caption" component="p" className="mt-1 font-mono text-[0.7rem] text-white/40">
                                    Acumulado: {formatHash(energy, chronoBurstFreqTypes)}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <Typography variant="caption" className="font-bold text-white/50">
                                HASH ACUMULADO LOCAL
                            </Typography>
                            <Typography variant="h6" className="font-mono font-bold text-[#00f3ff]">
                                {formatHash(energy, chronoBurstFreqTypes)}
                            </Typography>
                        </div>
                    </div>

                    {/* Verde para activar; en marcha pasa a error porque el
                        overclock triplica la temperatura. */}
                    <Button
                        variant="contained"
                        fullWidth
                        color={isOverclockActive ? 'error' : 'success'}
                        disabled={!isPoweredOn || isOverheated}
                        onClick={handleOverclockToggle}
                        className="mb-4"
                    >
                        {isOverclockActive ? 'OVERCLOCK ACTIVO (3X TEMP)' : 'ACTIVAR OVERCLOCK'}
                    </Button>

                    <Typography variant="caption" component="p" className="text-center italic text-white/30">
                        Inyección automática de Hash activa al consolidar Round 10
                    </Typography>
                </div>
            </TechFrame>

            {/* Transactions History Block */}
            <TechFrame color="rgba(255,255,255,0.1)">
                <div className="p-6">
                    <div className="mb-4 flex flex-row items-center gap-2">
                        <History size={20} className="text-white/50" />
                        <Typography variant="h6" className="text-base font-bold text-white">
                            HISTORIAL RECIENTE
                        </Typography>
                    </div>

                    <div className="flex flex-col gap-2">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx, i) => (
                                <div key={tx.id || i} className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] p-3">
                                    <div>
                                        <Typography variant="caption" component="p" className="font-bold text-white">
                                            {tx.transactionType || 'TRANSACCIÓN'}
                                        </Typography>
                                        <Typography variant="caption" component="p" className="text-white/40">
                                            {tx.dateCreated ? new Date(tx.dateCreated).toLocaleDateString() : 'Fecha desconocida'}
                                        </Typography>
                                    </div>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        className="font-mono font-bold"
                                        style={{ color: tx.transactionType === 'BUY' ? '#00e676' : '#ff1744' }}
                                    >
                                        {tx.transactionType === 'BUY' ? '+' : '-'}{tx.financialInfo?.amount || 0}
                                    </Typography>
                                </div>
                            ))
                        ) : (
                            <Typography variant="caption" component="p" className="py-4 text-center text-white/20">
                                No hay transacciones recientes
                            </Typography>
                        )}
                    </div>
                </div>
            </TechFrame>

            {/* Rewards Button */}
            <Button
                variant="contained"
                fullWidth
                startIcon={<Gift size={18} />}
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
        </div>
    );
});
