'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import SearchIcon from '@mui/icons-material/Search';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { setTransactionsFromCache, clearTransactions } from '../../lib/features/transactions/reducer';
import { GenericTable } from '../../components/ui/GenericTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { RootState } from '../../lib/store';
import { PageHeader } from '../../components/ui/PageHeader';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();

    const { selectedNetwork, networks } = useAppSelector((state: RootState) => state.blockchain);
    const { transactions: transactionData, isLoading: loading, total, cache } = useAppSelector((state: RootState) => state.transactions);

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    const storeId = selectedNetwork?.storeTransactions?.storeTransactionId || currentNetwork?.storeTransactionId;

    const [page, setPage] = useState(0);
    const [walletSearch, setWalletSearch] = useState('');
    const [appliedWalletFilter, setAppliedWalletFilter] = useState('');
    const pageSize = 10;

    const handleSearch = () => {
        dispatch(clearTransactions());
        setAppliedWalletFilter(walletSearch);
        setPage(0);
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: walletSearch, page: 1, limit: pageSize }));
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const pageToFetch = newPage + 1;
        if (cache[pageToFetch]) {
            dispatch(setTransactionsFromCache(pageToFetch));
        } else if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, page: pageToFetch, limit: pageSize }));
        }
    };

    useEffect(() => {
        if (storeId && !cache[1]) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, page: 1, limit: pageSize }));
        }
    }, [storeId, dispatch, appliedWalletFilter, cache]);

    return (
        <main className='min-h-screen relative pb-20'>
            <Background />
            
            <Container maxWidth='xl' sx={{ pt: { xs: 12, md: 16 }, position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <PageHeader 
                        title='Explorador de' 
                        highlight='Transacciones' 
                        subtitle='Historial técnico de operaciones en la red blockchain de LynCore.'
                    />

                    <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                        <Input 
                            placeholder='Buscar por billetera...' 
                            value={walletSearch}
                            onChange={(e) => setWalletSearch(e.target.value)}
                            fullWidth
                        />
                        <Button 
                            variant='contained' 
                            onClick={handleSearch}
                            startIcon={<SearchIcon />}
                            sx={{ minWidth: 150 }}
                        >
                            BUSCAR
                        </Button>
                    </Box>

                    <GenericTable 
                        columns={transactionsPageColumns}
                        data={transactionData}
                        loading={loading}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        enablePagination={true}
                        manualPagination={true}
                        totalRows={total}
                    />
                </motion.div>
            </Container>
        </main>
    );
}