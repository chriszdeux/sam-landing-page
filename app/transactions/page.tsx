'use client';

import React, { useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Paper } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { GenericTable } from '../../components/ui/GenericTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { TransactionsInterface } from '../../lib/features/transactions/types';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { selectedNetwork, networks } = useAppSelector((state) => state.blockchain);
    const { byStoreBoxId, isLoading: loading, error } = useAppSelector((state) => state.transactions);

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    
    // Get transactions for the current store
    const storeId = selectedNetwork?.storeTransactions?.transactionStoreID || currentNetwork?.storeTransactions?.transactionStoreID;
    const rawData = storeId ? byStoreBoxId[storeId] : null;
    let transactionData: TransactionsInterface[] = [];
    
    if (rawData) {
        if (Array.isArray(rawData)) {
            transactionData = rawData[0]?.transactions || [];
        } else if (rawData.transactions && Array.isArray(rawData.transactions)) {
            transactionData = rawData.transactions;
        }
    }

    const [page, setPage] = React.useState(0);
    const pageSize = 20; // Must match or be coordinated with GenericTable

    // Handle Page Change
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        
        // Calculate if we need to fetch more data.
        // Assuming we fetch 'pageSize' items per page (or 10 in API).
        // Since API defaults to 10 and we want 20? 
        // Let's stick to consistent pageSize for API and Table. 
        // The API defaults to limit=10. We set table to 20. This might be confusing.
        // Let's fetch with limit=20 to match.
        // If we have (newPage + 1) * pageSize items, we are good.
        // If transactionData.length < (newPage + 1) * pageSize, we need to fetch.
        
        if (storeId && transactionData.length < (newPage + 1) * pageSize) {
            // newPage is 0-indexed. API page is likely 1-indexed.
            // If we are on page 0 (0-19 items). We have 20.
            // User clicks next -> page 1. Need items 20-39.
            // We fetch page = newPage + 1.
            dispatch(fetchTransactions({ storeId, page: newPage + 1, limit: pageSize }));
        }
    };
    
    // We don't know total rows from backend for now, so we simulate "Next" availability
    // by checking if we have filled the current page. If we have full page of data, assume there's more.
    // Or set a high number.
    const hasMoreStats = transactionData.length >= (page + 1) * pageSize;
    // Trick: set totalRows to current length + 1 if we think there is more, to enable Next button.
    const totalRows = hasMoreStats ? transactionData.length + pageSize : transactionData.length;

    useEffect(() => {
        if (storeId) {
            // Initial fetch
            dispatch(fetchTransactions({ storeId, page: 1, limit: pageSize }));
        }
    }, [storeId]);
    // ... rest of the component ... (selectedNetwork check and return logic unchanged)

    if (!selectedNetwork) {
         return (
            <Box sx={{ minHeight: '100vh' }}>
                <Background />
                <Container sx={{ pt: 15, textAlign: 'center' }}>
                     <Typography variant="h5" color="text.secondary">Por favor seleccione una red para ver las transacciones.</Typography>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative' }}>
            <Background />
            
            <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" gutterBottom sx={{ mb: 6, color: 'primary.main', textShadow: '0 0 20px rgba(0,243,255,0.3)' }}>
                    Historial de Transacciones
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>
                     Red: <Box component="span" sx={{ color: 'white', fontWeight: 'bold' }}>{currentNetwork?.identification?.name || selectedNetwork?.identification?.name || selectedNetwork.id}</Box> | Store ID: {selectedNetwork?.storeTransactions?.transactionStoreID}
                </Typography>

                <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                     {loading && transactionData.length === 0 ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                             <CircularProgress color="primary" />
                         </Box>
                     ) : error ? (
                         <Box sx={{ p: 4, textAlign: 'center' }}>
                             <Typography color="error">{error}</Typography>
                         </Box>
                     ) : (
                         <GenericTable 
                            columns={transactionsPageColumns} 
                            data={transactionData} 
                            pageSize={pageSize} 
                            enablePagination={true}
                            manualPagination={true}
                            page={page}
                            onPageChange={handlePageChange}
                            totalRows={totalRows}
                         />
                     )}
                </Paper>
            </Container>
        </Box>
    );
}

