"use client";

import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { RefreshCw, Sensors, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Hooks y Redux
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';

// Componentes
import { Background } from '../../components/layout/Background';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import SearchIcon from '@mui/icons-material/Search';
import { GenericTable } from '../../components/ui/GenericTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    // Selectores de Estado
    const { selectedNetwork, networks } = useAppSelector((state) => state.blockchain);
    const { byStoreBoxId, isLoading: loading, error } = useAppSelector((state) => state.transactions);

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    const storeId = selectedNetwork?.storeTransactionId || currentNetwork?.storeTransactionId;
    
    // Estado Local
    const [page, setPage] = useState(0);
    const [walletSearch, setWalletSearch] = useState('');
    const [appliedWalletFilter, setAppliedWalletFilter] = useState('');
    const pageSize = 10;

    const rawData = storeId ? byStoreBoxId[storeId] : null;
    const transactionData = rawData?.transactions || [];

    const handleSearch = () => {
        setAppliedWalletFilter(walletSearch);
        setPage(0);
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: walletSearch, page: 1, limit: pageSize }));
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (storeId && transactionData.length < (newPage + 1) * pageSize) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, page: newPage + 1, limit: pageSize }));
        }
    };
    
    const hasMoreStats = transactionData.length >= (page + 1) * pageSize;
    const totalRows = hasMoreStats ? transactionData.length + pageSize : transactionData.length;

    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, page: 1, limit: pageSize }));
        }
    }, [storeId, dispatch, appliedWalletFilter]);

    if (!selectedNetwork) {
         return (
            <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center">
                <Background />
                <div className="relative z-10 text-center px-4">
                     <Typography variant="h5" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>
                        POR FAVOR SELECCIONE UNA RED PARA VER LAS TRANSACCIONES
                     </Typography>
                     <Button variant="outlined" sx={{ mt: 4, color: '#00f3ff', borderColor: '#00f3ff' }} onClick={() => router.push('/portfolio')}>
                        VOLVER AL PORTAFOLIO
                     </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative w-full overflow-hidden pt-12 pb-10">
            <Background />
            
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => router.back()} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        <ArrowLeft />
                    </IconButton>
                    <PageHeader 
                        title="HISTORIAL DE TRANSACCIONES" 
                        subtitle={"Red: " + (selectedNetwork.identification.name) + " | Store: " + (storeId || 'N/A')}
                    />
                </Box>

                <TechFrame color="#00f3ff">
                    <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', borderBottom: '1px solid rgba(0, 243, 255, 0.1)' }}>
                        <Input 
                            placeholder="Buscar por Wallet Address..." 
                            value={walletSearch}
                            onChange={(e: any) => setWalletSearch(e.target.value)}
                            fullWidth
                            sx={{ mb: 0 }}
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleSearch}
                            startIcon={<SearchIcon />}
                            sx={{ height: 48, minWidth: 140, fontWeight: 900 }}
                        >
                            BUSCAR
                        </Button>
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                        {loading && transactionData.length === 0 ? (
                             <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                                 <CircularProgress color="primary" />
                             </Box>
                         ) : error ? (
                             <Box sx={{ py: 10, textAlign: 'center' }}>
                                 <Typography color="error">{error}</Typography>
                                 <Button onClick={handleSearch} sx={{ mt: 2 }}>REINTENTAR</Button>
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
                    </Box>
                </TechFrame>
            </Container>
        </main>
    );
}
