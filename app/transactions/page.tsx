'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Stack, Tabs, Tab } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

import { fetchTransactions } from '../../lib/features/transactions/actions';
import { fetchBlocksHistory } from '../../lib/features/blockchain/actions';
import { setTransactionsFromCache, clearTransactions } from '../../lib/features/transactions/reducer';
import { CustomTable } from '../../components/ui/CustomTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { RootState } from '../../lib/store';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { PageHeader } from '../../components/ui/PageHeader';
import { motion } from 'framer-motion';
import { BlockchainBlocksHistory } from '../../components/blockchain/BlockchainBlocksHistory';
import { formatHash } from '../../lib/utils/formatHash';
import { useRefreshCooldown } from '../../lib/useRefreshCooldown';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();

    const { selectedNetwork, networks, activeBlock, blocksHistory, chronoBurstFreqTypes } = useAppSelector((state: RootState) => state.blockchain);
    const { transactions: transactionData, isLoading: loading, total, cache } = useAppSelector((state: RootState) => state.transactions);

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    const storeId = selectedNetwork?.storeTransactions?.storeTransactionId || currentNetwork?.storeTransactionId;

    const [page, setPage] = useState(0);
    const [walletSearch, setWalletSearch] = useState('');
    const [appliedWalletFilter, setAppliedWalletFilter] = useState('');
    const [filterType, setFilterType] = useState(''); // '' for Market, 'MINER' for Mining
    const pageSize = 10;

    const { isCooldownActive, cooldownRemaining, triggerRefresh } = useRefreshCooldown();

    const handleRefresh = () => {
        if (triggerRefresh() && storeId) {
            dispatch(fetchTransactions({
                storeId,
                page,
                pageSize,
                walletId: appliedWalletFilter || undefined,
                filter: filterType || undefined
            }));
        }
    };

    // Get queues from activeBlock or fallback to the latest block from blocksHistory
    const latestBlock = activeBlock || [...blocksHistory].sort((a, b) => b.index - a.index)[0];
    
    const buyQueue = latestBlock 
        ? (typeof latestBlock.buyCount === 'number'
            ? latestBlock.buyCount
            : (typeof latestBlock.transactionsBuyQueue === 'number' 
                ? latestBlock.transactionsBuyQueue 
                : Array.isArray(latestBlock.transactionsBuyQueue) ? latestBlock.transactionsBuyQueue.length : 0))
        : 0;

    const sellQueue = latestBlock 
        ? (typeof latestBlock.sellCount === 'number'
            ? latestBlock.sellCount
            : (typeof latestBlock.transactionsSellQueue === 'number' 
                ? latestBlock.transactionsSellQueue 
                : Array.isArray(latestBlock.transactionsSellQueue) ? latestBlock.transactionsSellQueue.length : 0))
        : 0;

    const transferQueue = latestBlock 
        ? (typeof latestBlock.transferCount === 'number'
            ? latestBlock.transferCount
            : (typeof latestBlock.transactionsTransferQueue === 'number' 
                ? latestBlock.transactionsTransferQueue 
                : Array.isArray(latestBlock.transactionsTransferQueue) ? latestBlock.transactionsTransferQueue.length : 0))
        : 0;

    const handleSearch = () => {
        dispatch(clearTransactions());
        setAppliedWalletFilter(walletSearch);
        setPage(0);
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: walletSearch, filter: filterType, page: 1, limit: pageSize }));
        }
    };

    const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
        setFilterType(newValue);
        setPage(0);
        dispatch(clearTransactions());
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, filter: newValue, page: 1, limit: pageSize }));
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const pageToFetch = newPage + 1;
        if (cache[pageToFetch]) {
            dispatch(setTransactionsFromCache(pageToFetch));
        } else if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, filter: filterType, page: pageToFetch, limit: pageSize }));
        }
    };

    useEffect(() => {
        if (storeId && !cache[1]) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, filter: filterType, page: 1, limit: pageSize }));
        }
    }, [storeId, dispatch, appliedWalletFilter, filterType, cache]);

    useEffect(() => {
        if (selectedNetwork?.id) {
            dispatch(fetchBlocksHistory({ blockchainId: selectedNetwork.id, thresholdMinutes: 5 }));
        }
    }, [dispatch, selectedNetwork?.id]);

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

                    <BlockchainBlocksHistory />

                    {/* Blockchain Hash Metric Widget */}
                    <Box sx={{ 
                        mb: 4, 
                        p: 3, 
                        bgcolor: 'rgba(0, 243, 255, 0.03)', 
                        border: '1px solid rgba(0, 243, 255, 0.2)', 
                        borderRadius: 2,
                        boxShadow: '0 0 15px rgba(0, 243, 255, 0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box sx={{ 
                            position: 'absolute', 
                            top: -50, 
                            right: -50, 
                            width: 100, 
                            height: 100, 
                            bgcolor: '#00f3ff',
                            filter: 'blur(50px)',
                            opacity: 0.1,
                            zIndex: 0
                        }} />
                        <Box sx={{ position: 'relative', zIndex: 1, alignSelf: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase', mb: 0.5 }}>
                                Hash Total Disponible en Blockchain
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Auditoría macro consolidada del total de hash disponible para procesamiento en la red.
                            </Typography>
                        </Box>
                        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, fontFamily: 'monospace', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                                {formatHash(selectedNetwork?.hashAvailable || 0, chronoBurstFreqTypes)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Pending Queues Widget */}
                    <Box sx={{ 
                        mb: 4, 
                        p: 3, 
                        bgcolor: 'rgba(255, 170, 0, 0.03)', 
                        border: '1px solid rgba(255, 170, 0, 0.2)', 
                        borderRadius: 2,
                        boxShadow: '0 0 15px rgba(255, 170, 0, 0.05)',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 3
                    }}>
                        <Box sx={{ alignSelf: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ color: '#ffaa00', fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase', mb: 0.5 }}>
                                Colas de Transacciones Pendientes (Red)
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                Transacciones en espera de inyección de energía para su confirmación en el bloque actual.
                            </Typography>
                        </Box>
                        
                        <Stack direction="row" spacing={3}>
                            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                                <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold', display: 'block' }}>COMPRA</Typography>
                                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>{buyQueue}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                                <Typography variant="caption" sx={{ color: '#ff0055', fontWeight: 'bold', display: 'block' }}>VENTA</Typography>
                                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>{sellQueue}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                                <Typography variant="caption" sx={{ color: '#00f3ff', fontWeight: 'bold', display: 'block' }}>TRANSF.</Typography>
                                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>{transferQueue}</Typography>
                            </Box>
                        </Stack>
                    </Box>

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
                        <Button
                            variant='outlined'
                            onClick={handleRefresh}
                            disabled={isCooldownActive}
                            startIcon={<RefreshIcon />}
                            sx={{ minWidth: 150, borderColor: '#00f3ff', color: '#00f3ff' }}
                        >
                            {isCooldownActive ? `ESPERE ${cooldownRemaining}s` : 'ACTUALIZAR'}
                        </Button>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(0, 243, 255, 0.2)', mb: 3 }}>
                        <Tabs 
                            value={filterType} 
                            onChange={handleFilterChange} 
                            textColor="inherit"
                            sx={{
                                '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
                                '& .Mui-selected': { color: '#00f3ff' },
                                '& .MuiTabs-indicator': { backgroundColor: '#00f3ff' }
                            }}
                        >
                            <Tab label="Mercado (BUY/SELL)" value="" />
                            <Tab label="Minería (MINE)" value="MINER" />
                        </Tabs>
                    </Box>

                    <CustomTable 
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