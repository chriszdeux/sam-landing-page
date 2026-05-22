'use client';

import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Chip,
    Alert,
    ChipProps
} from '@mui/material';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { TransactionStatus } from '../../lib/features/transactions/types';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';

interface TransactionsTableProps {
    storeId: string;
    walletId?: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ storeId, walletId = '' }) => {
    const dispatch = useAppDispatch();
    const { byStoreBoxId, isLoading, error } = useAppSelector((state) => state.transactions);
    
    // Get transactions for this specific store from Redux state
    const transactionsData = byStoreBoxId[storeId]?.transactions || [];

    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId, page: 1, limit: 10 }));
        }
    }, [storeId, walletId]);

    const getStatusColor = (status: TransactionStatus): ChipProps['color'] => {
        switch (status) {
            case TransactionStatus.CONFIRMED: return 'success';
            case TransactionStatus.PENDING: return 'warning';
            case TransactionStatus.FAILED: return 'error';
            default: return 'default';
        }
    };

    if (!byStoreBoxId[storeId] && isLoading) {
        return (
            <TechFrame>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, bgcolor: 'rgba(0,0,0,0.2)' }}>
                    <CircularProgress sx={{ color: '#00f3ff' }} />
                </Box>
            </TechFrame>
        );
    }
    
    if (error) {
        return (
             <Alert severity="error" sx={{ bgcolor: 'rgba(255,0,0,0.1)', color: '#ff4444' }}>
                {error}
            </Alert>
        );
    }
    
    if (transactionsData.length === 0 && !isLoading) {
        return (
            <TechFrame>
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.2)' }}>
                    <Typography>No hay transacciones recientes.</Typography>
                </Box>
            </TechFrame>
        );
    }
    return (
        <React.Fragment>
             <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', mb: 2, display: 'block', letterSpacing: 4 }}>
                {'// ULTIMAS_TRANSACCIONES'}
            </Typography>
            <TechFrame>
                <TableContainer component={Box} sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 0 }}>
                    {/* Desktop View */}
                    <Table size="small" sx={{ display: { xs: 'none', md: 'table' } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'rgba(0, 243, 255, 0.7)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>FECHA</TableCell>
                                <TableCell sx={{ color: 'rgba(0, 243, 255, 0.7)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>TIPO</TableCell>
                                <TableCell sx={{ color: 'rgba(0, 243, 255, 0.7)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>ACTIVO</TableCell>
                                <TableCell align="right" sx={{ color: 'rgba(0, 243, 255, 0.7)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>CANTIDAD</TableCell>
                                <TableCell align="center" sx={{ color: 'rgba(0, 243, 255, 0.7)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>VALIDADO</TableCell>
                                <TableCell align="center" sx={{ color: 'rgba(0, 243, 255, 0.7)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>ESTADO</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionsData.slice(0, 10).map((tx) => (
                                <TableRow key={tx.id} hover sx={{ '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.05)' } }}>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {new Date(tx.dateCreated).toLocaleDateString()} {new Date(tx.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', borderColor: 'rgba(0, 243, 255, 0.1)' }}>
                                        <Chip 
                                            label={tx.transactionType} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: 'rgba(0, 243, 255, 0.05)', 
                                                color: '#00f3ff',
                                                border: '1px solid rgba(0, 243, 255, 0.2)',
                                                fontWeight: 'bold',
                                                fontSize: '0.65rem',
                                                height: 20
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(0, 243, 255, 0.1)', fontWeight: 'bold' }}>
                                        {tx.financialInfo.symbol}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: 'white', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace' }}>
                                        {tx.financialInfo.quantity}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(0, 243, 255, 0.1)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {tx.confirmedBy || '-'}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: 'white', borderColor: 'rgba(0, 243, 255, 0.1)' }}>
                                         <Chip 
                                            label={tx.status} 
                                            size="small" 
                                            color={getStatusColor(tx.status)}
                                            variant="outlined"
                                            sx={{ fontSize: '0.65rem', height: 20 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Mobile View */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, p: 2 }}>
                        {Array.isArray(transactionsData) && transactionsData.slice(0, 10).map((tx) => (
                            <Box 
                                key={tx.id} 
                                sx={{ 
                                    p: 2.5, 
                                    border: '1px solid rgba(0, 243, 255, 0.1)', 
                                    borderRadius: '8px',
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '4px',
                                        height: '100%',
                                        bgcolor: tx.status === 'CONFIRMED' ? '#00e676' : tx.status === 'PENDING' ? '#ff9100' : '#ff1744',
                                        opacity: 0.7
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
                                            {new Date(tx.dateCreated).toLocaleDateString()} {new Date(tx.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                                            {tx.financialInfo.symbol}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={tx.status} 
                                        size="small" 
                                        color={getStatusColor(tx.status)}
                                        variant="outlined"
                                        sx={{ 
                                            fontSize: '0.6rem', 
                                            height: 18,
                                            borderColor: 'currentColor',
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Chip 
                                            label={tx.transactionType} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: 'rgba(0, 243, 255, 0.1)', 
                                                color: '#00f3ff',
                                                border: '1px solid rgba(0, 243, 255, 0.3)',
                                                fontWeight: 'bold',
                                                fontSize: '0.65rem',
                                                height: 22,
                                                width: 'fit-content'
                                            }} 
                                        />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                            VAL: {tx.confirmedBy || '---'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: -0.5 }}>CANTIDAD</Typography>
                                        <Typography sx={{ color: '#00f3ff', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            {tx.financialInfo.quantity}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </TableContainer>
            </TechFrame>
        </React.Fragment>
    );
};
