'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Grid, Paper, Stack, Tooltip, CircularProgress, Chip, Avatar, Tabs, Tab, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { 
    Layers, 
    Tag, 
    MonetizationOn, 
    CompareArrows, 
    Engineering, 
    Star, 
    Timer,
    CheckCircle,
    PlayCircle,
    Refresh
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { fetchBlocksHistory } from '../../../lib/features/blockchain/actions';
import { fetchTransactions } from '../../../lib/features/transactions/actions';
import { RootState } from '../../../lib/store';
import { CustomTable } from '../../ui/CustomTable';
import { transactionsPageColumns } from '../../market/transactionsPageColumns';
import { useRefreshCooldown } from '../../../lib/useRefreshCooldown';

export const BlocksModule = () => {
    const dispatch = useAppDispatch();
    const { selectedNetwork, blocksHistory, isLoading } = useAppSelector((state: RootState) => state.blockchain);

    const networkColor = selectedNetwork?.additionalInfo?.color || '#00f3ff';
    const blockchainId = selectedNetwork?.id;

    const [activeTab, setActiveTab] = React.useState<'blocks' | 'miner'>('blocks');
    const { transactions, isLoading: isTxLoading } = useAppSelector((state: RootState) => state.transactions);
    
    const { isCooldownActive, cooldownRemaining, triggerRefresh } = useRefreshCooldown();

    const storeId = selectedNetwork?.storeTransactions?.storeTransactionId || selectedNetwork?.storeTransactionId;

    useEffect(() => {
        if (blockchainId) {
            dispatch(fetchBlocksHistory({ blockchainId, thresholdMinutes: 2 }));
        }
    }, [dispatch, blockchainId]);

    useEffect(() => {
        if (activeTab === 'miner' && storeId) {
            dispatch(fetchTransactions({ storeId, filter: 'MINER', page: 1, limit: 50 }));
        }
    }, [activeTab, storeId, dispatch]);

    const handleRefresh = () => {
        if (triggerRefresh()) {
            if (activeTab === 'blocks' && blockchainId) {
                dispatch(fetchBlocksHistory({ blockchainId, thresholdMinutes: 2 }));
            } else if (activeTab === 'miner' && storeId) {
                dispatch(fetchTransactions({ storeId, filter: 'MINER', page: 1, limit: 50 }));
            }
        }
    };

    if (!selectedNetwork) {
        return (
            <Paper sx={{ p: 4, bgcolor: 'rgba(10,12,16,0.8)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#00f3ff', mb: 2 }} />
                <Typography color="text.secondary">Cargando red seleccionada...</Typography>
            </Paper>
        );
    }

    // Sort blocks by index descending (latest blocks first) for vertical auditing or timeline
    const sortedBlocks = [...blocksHistory].sort((a, b) => b.index - a.index);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Network Banner */}
            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    background: `linear-gradient(90deg, rgba(10,12,16,0.9) 0%, ${networkColor}15 100%)`,
                    border: `1px solid ${networkColor}20`,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 3
                }}
            >
                <Box display="flex" alignItems="center" gap={3}>
                    <Avatar 
                        src={selectedNetwork.identification.image} 
                        sx={{ width: 64, height: 64, border: `2px solid ${networkColor}` }}
                    >
                        {selectedNetwork.identification.symbol[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" color="white" fontWeight="bold">
                            Ledger de Red: {selectedNetwork.identification.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                            NETWORK ID: {selectedNetwork.id}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Chip 
                        label="EXPLORADOR DE BLOQUES" 
                        sx={{ 
                            bgcolor: `${networkColor}20`, 
                            color: networkColor, 
                            border: `1px solid ${networkColor}`,
                            fontWeight: 'bold',
                            letterSpacing: 1.5
                        }} 
                    />
                </Box>
            </Paper>

            {/* Tabs & Refresh */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, borderBottom: 1, borderColor: 'rgba(0, 243, 255, 0.2)' }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(_, val) => setActiveTab(val)} 
                    textColor="inherit"
                    sx={{
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
                        '& .Mui-selected': { color: networkColor },
                        '& .MuiTabs-indicator': { backgroundColor: networkColor }
                    }}
                >
                    <Tab label="Bloques" value="blocks" />
                    <Tab label="Transacciones Miner" value="miner" />
                </Tabs>
                
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    disabled={isCooldownActive || isLoading || isTxLoading}
                    startIcon={<Refresh />}
                    sx={{ borderColor: networkColor, color: networkColor }}
                    size="small"
                >
                    {isCooldownActive ? `${cooldownRemaining}s` : 'Refrescar'}
                </Button>
            </Box>

            {/* Content area */}
            <Box>
                {activeTab === 'blocks' ? (
                    isLoading && sortedBlocks.length === 0 ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress sx={{ color: networkColor }} />
                    </Box>
                ) : sortedBlocks.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                            No se encontraron bloques históricos registrados en esta red.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {sortedBlocks.map((block, i) => {
                            // Mined blocks are confirmed (not active). The latest block with nextBlock == null is the tip
                            const isActive = block.nextBlock === null;
                            
                            const buyCount = typeof block.buyCount === 'number'
                                ? block.buyCount
                                : (typeof block.transactionsBuyQueue === 'number' 
                                    ? block.transactionsBuyQueue 
                                    : Array.isArray(block.transactionsBuyQueue) ? block.transactionsBuyQueue.length : 0);
                            const sellCount = typeof block.sellCount === 'number'
                                ? block.sellCount
                                : (typeof block.transactionsSellQueue === 'number' 
                                    ? block.transactionsSellQueue 
                                    : Array.isArray(block.transactionsSellQueue) ? block.transactionsSellQueue.length : 0);
                            const transferCount = typeof block.transferCount === 'number'
                                ? block.transferCount
                                : (typeof block.transactionsTransferQueue === 'number' 
                                    ? block.transactionsTransferQueue 
                                    : Array.isArray(block.transactionsTransferQueue) ? block.transactionsTransferQueue.length : 0);

                            const totalTx = buyCount + sellCount + transferCount;

                            return (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={block.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(i * 0.05, 0.5) }}
                                    >
                                        <Paper 
                                            variant="outlined" 
                                            sx={{ 
                                                p: 3, 
                                                bgcolor: 'rgba(10,12,16,0.8)', 
                                                borderColor: isActive ? networkColor : 'rgba(255,255,255,0.08)',
                                                borderRadius: 3,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: isActive ? `0 0 20px ${networkColor}20` : 'none',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: networkColor,
                                                    boxShadow: `0 0 25px ${networkColor}15`,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            {/* Top Status */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Tag sx={{ fontSize: 18, color: networkColor }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 'black', fontFamily: 'monospace' }}>
                                                        BLOQUE {block.index}
                                                    </Typography>
                                                </Stack>

                                                {isActive ? (
                                                    <Chip 
                                                        icon={<PlayCircle style={{ color: networkColor }} />}
                                                        label="ACTIVO" 
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: `${networkColor}10`, 
                                                            color: networkColor,
                                                            borderColor: networkColor,
                                                            borderWidth: 1,
                                                            borderStyle: 'solid',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.65rem'
                                                        }} 
                                                    />
                                                ) : (
                                                    <Chip 
                                                        icon={<CheckCircle style={{ color: '#00e676' }} />}
                                                        label="CONFIRMADO" 
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: 'rgba(0, 230, 118, 0.05)', 
                                                            color: '#00e676',
                                                            borderColor: 'rgba(0, 230, 118, 0.3)',
                                                            borderWidth: 1,
                                                            borderStyle: 'solid',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.65rem'
                                                        }} 
                                                    />
                                                )}
                                            </Box>

                                            {/* Hashes & Difficulty */}
                                            <Stack spacing={1} sx={{ mb: 2.5, p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>HASH</Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'white' }}>
                                                        {block.id.slice(0, 12)}...{block.id.slice(-6)}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>PREVIO</Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>
                                                        {block.prevBlock ? `${block.prevBlock.slice(0, 8)}...` : 'GÉNESIS'}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>DIFICULTAD</Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: networkColor, fontWeight: 'bold' }}>
                                                        {block.difficulty}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            {/* Rewards and Metrics */}
                                            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 0.5 }}>RECOMPENSA</Typography>
                                                    <Typography variant="subtitle1" sx={{ color: '#00e676', fontWeight: 900, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <MonetizationOn sx={{ fontSize: 16 }} /> {(block.minerRewards || 0).toFixed(4)}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 0.5 }}>MINEROS</Typography>
                                                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Engineering sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} /> {block.miners?.length || 0}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            {/* Transaction Queue details */}
                                            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', pt: 2 }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', display: 'block', mb: 1 }}>
                                                    TRANSACCIONES ({totalTx})
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Box sx={{ p: 1, bgcolor: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.1)', borderRadius: 1.5, textAlign: 'center' }}>
                                                            <Typography variant="caption" display="block" color="rgba(0,255,136,0.6)" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>COMPRAS</Typography>
                                                            <Typography variant="body2" color="#00ff88" fontWeight="bold">{buyCount}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Box sx={{ p: 1, bgcolor: 'rgba(255, 0, 85, 0.05)', border: '1px solid rgba(255, 0, 85, 0.1)', borderRadius: 1.5, textAlign: 'center' }}>
                                                            <Typography variant="caption" display="block" color="rgba(255,0,85,0.6)" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>VENTAS</Typography>
                                                            <Typography variant="body2" color="#ff0055" fontWeight="bold">{sellCount}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Box sx={{ p: 1, bgcolor: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.1)', borderRadius: 1.5, textAlign: 'center' }}>
                                                            <Typography variant="caption" display="block" color="rgba(0,243,255,0.6)" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>TRANSF.</Typography>
                                                            <Typography variant="body2" color="#00f3ff" fontWeight="bold">{transferCount}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            );
                        })}
                    </Grid>
                    )
                ) : (
                    <CustomTable 
                        columns={transactionsPageColumns}
                        data={transactions || []}
                        loading={isTxLoading}
                        pageSize={10}
                    />
                )}
            </Box>
        </Box>
    );
};
