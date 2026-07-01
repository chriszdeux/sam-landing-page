'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Chip, Avatar } from '@mui/material';
import { CustomButton } from '../../ui/CustomButton';
import { 
    Tag, 
    MonetizationOn, 
    Engineering, 
    CheckCircle,
    PlayCircle,
    Refresh
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { fetchBlocksHistory } from '../../../lib/features/blockchain/actions';
import { RootState } from '../../../lib/store';
import { CustomTable } from '../../ui/CustomTable';
import { useRefreshCooldown } from '../../../lib/useRefreshCooldown';

export const BlocksModule = () => {
    const dispatch = useAppDispatch();
    const { selectedNetwork, blocksHistory, isLoading } = useAppSelector((state: RootState) => state.blockchain);

    const networkColor = selectedNetwork?.additionalInfo?.color || '#00f3ff';
    const blockchainId = selectedNetwork?.id;
    
    const { isCooldownActive, cooldownRemaining, triggerRefresh } = useRefreshCooldown();

    useEffect(() => {
        if (blockchainId) {
            dispatch(fetchBlocksHistory({ blockchainId, thresholdMinutes: 2 }));
        }
    }, [dispatch, blockchainId]);

    const handleRefresh = () => {
        if (triggerRefresh()) {
            if (blockchainId) {
                dispatch(fetchBlocksHistory({ blockchainId, thresholdMinutes: 2 }));
            }
        }
    };

    const blocksColumns = React.useMemo(() => [
        {
            label: 'Índice',
            key: (row: any) => row.index,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: networkColor }}>
                    #{value}
                </Typography>
            )
        },
        {
            label: 'Hash del Bloque',
            key: (row: any) => row.id,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.85)' }}>
                    {value.slice(0, 16)}...{value.slice(-8)}
                </Typography>
            )
        },
        {
            label: 'Dificultad',
            key: (row: any) => row.difficulty,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#ffb700', fontWeight: 'bold' }}>
                    {value}
                </Typography>
            )
        },
        {
            label: 'Mineros',
            key: (row: any) => row.miners?.length ?? 0,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'white', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Engineering sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} /> {value}
                </Typography>
            )
        },
        {
            label: 'Transacciones',
            key: (row: any) => {
                const buyCount = typeof row.buyCount === 'number'
                    ? row.buyCount
                    : (typeof row.transactionsBuyQueue === 'number' 
                        ? row.transactionsBuyQueue 
                        : Array.isArray(row.transactionsBuyQueue) ? row.transactionsBuyQueue.length : 0);
                const sellCount = typeof row.sellCount === 'number'
                    ? row.sellCount
                    : (typeof row.transactionsSellQueue === 'number' 
                        ? row.transactionsSellQueue 
                        : Array.isArray(row.transactionsSellQueue) ? row.transactionsSellQueue.length : 0);
                const transferCount = typeof row.transferCount === 'number'
                    ? row.transferCount
                    : (typeof row.transactionsTransferQueue === 'number' 
                        ? row.transactionsTransferQueue 
                        : Array.isArray(row.transactionsTransferQueue) ? row.transactionsTransferQueue.length : 0);

                return buyCount + sellCount + transferCount;
            },
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00f3ff', fontWeight: 'bold' }}>
                    {value} TXs
                </Typography>
            )
        },
        {
            label: 'Recompensa',
            key: (row: any) => row.minerRewards ?? 0,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00e676', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MonetizationOn sx={{ fontSize: 14 }} /> {Number(value).toFixed(4)}
                </Typography>
            )
        },
        {
            label: 'Estado',
            key: (row: any) => row.nextBlock === null,
            render: ({ value }: { value: any }) => value ? (
                <Chip 
                    icon={<PlayCircle style={{ color: networkColor, fontSize: 14 }} />}
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
                    icon={<CheckCircle style={{ color: '#00e676', fontSize: 14 }} />}
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
            )
        }
    ], [networkColor]);

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

            {/* Header & Refresh Action */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 1, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tag sx={{ color: networkColor }} /> HISTORIAL DE BLOQUES MINADOS
                </Typography>
                
                <CustomButton
                    variant="info"
                    onClick={handleRefresh}
                    disabled={isCooldownActive || isLoading}
                    startIcon={<Refresh />}
                    sx={{ color: networkColor, borderColor: `${networkColor}40`, '&:hover': { borderColor: networkColor } }}
                    glow
                >
                    {isCooldownActive ? `${cooldownRemaining}s` : 'Refrescar'}
                </CustomButton>
            </Box>

            {/* Blocks Table View */}
            <Box>
                <CustomTable 
                    columns={blocksColumns}
                    data={sortedBlocks}
                    loading={isLoading}
                    pageSize={10}
                />
            </Box>
        </Box>
    );
};
