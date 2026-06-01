"use client";

import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Stack,
    Divider
} from '@mui/material';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { TransactionStatus, TransactionType } from '../../lib/features/transactions/types';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface TransactionsTableProps {
    storeId: string;
    walletId?: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ storeId, walletId = '' }) => {
    const dispatch = useAppDispatch();
    const { byStoreBoxId, isLoading, error } = useAppSelector((state) => state.transactions);
    const transactionsData = byStoreBoxId[storeId]?.transactions || [];

    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId, page: 1, limit: 10 }));
        }
    }, [storeId, walletId, dispatch]);

    const getStatusInfo = (status: string) => {
        const s = status.toUpperCase();
        if (s === 'CONFIRMED') return { color: '#00ff88', label: 'CONFIRMADO' };
        if (s === 'PENDING') return { color: '#ffd700', label: 'PENDIENTE' };
        return { color: '#ff0055', label: 'FALLIDO' };
    };

    if (isLoading && transactionsData.length === 0) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#00f3ff' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center', color: '#ff0055' }}>
                <AlertCircle size={20} style={{ marginBottom: 8 }} />
                <Typography variant="caption" display="block">ERROR AL CARGAR TRANSACCIONES</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1 }}>
            <Stack spacing={1}>
                <AnimatePresence>
                    {transactionsData.map((tx: any, idx: number) => {
                        const isBuy = tx.transactionType === TransactionType.BUY || tx.transactionType === 'BUY';
                        const status = getStatusInfo(tx.status);
                        
                        return (
                            <motion.div
                                key={tx.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Box sx={{ 
                                    p: 2, 
                                    borderRadius: 2, 
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(0, 243, 255, 0.2)' },
                                    transition: 'all 0.2s'
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ 
                                                p: 1, borderRadius: 1.5, 
                                                bgcolor: isBuy ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                                                color: isBuy ? '#00ff88' : '#ff0055'
                                            }}>
                                                {isBuy ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: 'white' }}>
                                                    {isBuy ? 'COMPRA' : 'VENTA'} {tx.financialInfo?.symbol}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                                                    {tx.id?.substring(0, 8)}...
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 900, color: isBuy ? '#00ff88' : '#ff0055' }}>
                                                {isBuy ? '+' : '-'}{tx.financialInfo?.quantity.toLocaleString()}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: status.color, fontWeight: 'bold', fontSize: '0.6rem' }}>
                                                {status.label}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                
                {transactionsData.length === 0 && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', py: 4, display: 'block' }}>
                        NO SE DETECTARON TRANSACCIONES RECIENTES
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};
