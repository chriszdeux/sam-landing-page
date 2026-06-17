'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Stack, Tooltip, Card, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { 
    Layers, 
    Engineering, 
    Tag, 
    CompareArrows, 
    MonetizationOn, 
    KeyboardDoubleArrowRight,
    Refresh
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchBlocksHistory } from '../../lib/features/blockchain/actions';
import { RootState } from '../../lib/store';

export const BlockchainBlocksHistory = () => {
    const dispatch = useAppDispatch();
    const { selectedNetwork, blocksHistory, isLoading } = useAppSelector((state: RootState) => state.blockchain);

    const networkColor = selectedNetwork?.additionalInfo?.color || '#00f3ff';
    const blockchainId = selectedNetwork?.id;

    const loadHistory = () => {
        if (blockchainId) {
            dispatch(fetchBlocksHistory(blockchainId));
        }
    };

    if (!selectedNetwork) return null;

    // Sort blocks by index descending or ascending? Let's display them ascending so it forms a chain from left to right, or latest first? Let's display latest first, or left-to-right (chronological). Left-to-right chronological is great for scrollable chain!
    const sortedBlocks = [...blocksHistory].sort((a, b) => a.index - b.index);

    return (
        <Card sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: 'rgba(10,12,16,0.6)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="overline" sx={{ color: networkColor, fontWeight: 'bold', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Layers sx={{ fontSize: 16 }} /> CADENA DE BLOQUES (BLOCKCHAIN LEDGER)
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                        Visualización en tiempo real de los bloques minados en la red interplanetaria de {selectedNetwork.identification.name}.
                    </Typography>
                </Box>
                <IconButton 
                    onClick={loadHistory} 
                    disabled={isLoading}
                    sx={{ 
                        color: networkColor, 
                        border: `1px solid ${networkColor}30`,
                        bgcolor: `${networkColor}10`,
                        '&:hover': { bgcolor: `${networkColor}20` }
                    }}
                >
                    <Refresh className={isLoading ? 'spin-animation' : ''} />
                </IconButton>
            </Box>

            {/* Horizontal chain container */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                overflowX: 'auto', 
                pb: 2, 
                pt: 1,
                px: 1,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    height: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    bgcolor: networkColor,
                }
            }}>
                {sortedBlocks.length === 0 ? (
                    <Box sx={{ py: 4, width: '100%', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            Esperando confirmación del bloque génesis en la red...
                        </Typography>
                    </Box>
                ) : (
                    sortedBlocks.map((block, i) => {
                        const buyCount = typeof block.buyCount === 'number'
                            ? block.buyCount
                            : typeof block.transactionsBuyQueue === 'number' 
                                ? block.transactionsBuyQueue 
                                : Array.isArray(block.transactionsBuyQueue) ? block.transactionsBuyQueue.length : 0;
                        const sellCount = typeof block.sellCount === 'number'
                            ? block.sellCount
                            : typeof block.transactionsSellQueue === 'number' 
                                ? block.transactionsSellQueue 
                                : Array.isArray(block.transactionsSellQueue) ? block.transactionsSellQueue.length : 0;
                        const transferCount = typeof block.transferCount === 'number'
                            ? block.transferCount
                            : typeof block.transactionsTransferQueue === 'number' 
                                ? block.transactionsTransferQueue 
                                : Array.isArray(block.transactionsTransferQueue) ? block.transactionsTransferQueue.length : 0;
                        
                        const totalTx = buyCount + sellCount + transferCount;

                        return (
                            <React.Fragment key={block.id}>
                                {/* Block Card */}
                                <Tooltip title={
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>Detalles del Bloque</Typography>
                                        <Typography variant="caption" display="block" color="rgba(255,255,255,0.7)">Hash: {block.id}</Typography>
                                        <Typography variant="caption" display="block" color="rgba(255,255,255,0.7)">Previo: {block.prevBlock || 'N/A'}</Typography>
                                        <Typography variant="caption" display="block" color="rgba(255,255,255,0.7)">Mineros: {block.miners?.length || 0}</Typography>
                                        <Typography variant="caption" display="block" color="rgba(255,255,255,0.7)">Dificultad: {block.difficulty}</Typography>
                                        {block.minedAt && <Typography variant="caption" display="block" color="rgba(255,255,255,0.7)">Minado: {new Date(block.minedAt).toLocaleTimeString()}</Typography>}
                                    </Box>
                                } arrow>
                                    <Box 
                                        component={motion.div}
                                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                                        whileHover={{ y: -5, boxShadow: `0 0 20px ${networkColor}30` }}
                                        sx={{
                                            minWidth: 200,
                                            maxWidth: 200,
                                            p: 2,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            border: `1px solid ${networkColor}20`,
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Block ID / Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Tag sx={{ fontSize: 16, color: networkColor }} />
                                                <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: '#white' }}>
                                                    BLOQUE {block.index}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="caption" sx={{ 
                                                fontFamily: 'monospace', 
                                                bgcolor: 'rgba(255,255,255,0.05)', 
                                                px: 1, 
                                                py: 0.2, 
                                                borderRadius: 1,
                                                fontSize: '0.65rem',
                                                color: 'rgba(255,255,255,0.5)'
                                            }}>
                                                {block.id.slice(0, 8)}
                                            </Typography>
                                        </Box>

                                        {/* Difficulty & Rewards */}
                                        <Stack spacing={1} sx={{ mb: 1.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>DIFICULTAD</Typography>
                                                <Typography variant="caption" sx={{ color: networkColor, fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                    {block.difficulty}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>RECOMPENSA</Typography>
                                                <Typography variant="caption" sx={{ color: '#00e676', fontWeight: 'bold', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <MonetizationOn sx={{ fontSize: 12 }} /> {(block.minerRewards || 0).toFixed(4)}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        {/* Queues / Counts */}
                                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 1, borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.03)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: '0.6rem', display: 'block', mb: 0.5 }}>
                                                COLAS ACTIVAS (TX QUEUES)
                                            </Typography>
                                            <Stack spacing={0.5}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Compras:</Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#00ff88' }}>{buyCount}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Ventas:</Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#ff0055' }}>{sellCount}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Transf.:</Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#00f3ff' }}>{transferCount}</Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Tooltip>

                                {/* Connector Line (except for the last block) */}
                                {i < sortedBlocks.length - 1 && (
                                    <Box 
                                        component={motion.div}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 + 0.1 }}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            minWidth: 40 
                                        }}
                                    >
                                        <KeyboardDoubleArrowRight sx={{ color: networkColor, opacity: 0.4 }} className="pulse-animation" />
                                    </Box>
                                )}
                            </React.Fragment>
                        );
                    })
                )}
            </Box>
            
            <style jsx global>{`
                @keyframes pulse-pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.3; }
                }
                .pulse-animation {
                    animation: pulse-pulse 2s infinite ease-in-out;
                }
                @keyframes rotation {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin-animation {
                    animation: rotation 1.5s infinite linear;
                }
            `}</style>
        </Card>
    );
};
