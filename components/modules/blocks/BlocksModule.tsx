'use client';

import React, { useEffect } from 'react';
import { Typography } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { Tooltip } from '../../ui/Tooltip';
import {
    Tag,
    Coins,
    HardHat,
    CheckCircle,
    PlayCircle,
    RefreshCw
} from 'lucide-react';
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
                <Typography variant="body2" className="font-mono font-bold" style={{ color: networkColor }}>
                    #{value}
                </Typography>
            )
        },
        {
            label: 'Hash del Bloque',
            key: (row: any) => row.id,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" className="font-mono text-white/85">
                    {value.slice(0, 16)}...{value.slice(-8)}
                </Typography>
            )
        },
        {
            label: 'Dificultad',
            key: (row: any) => row.difficulty,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" className="font-mono font-bold text-[#ffb700]">
                    {value}
                </Typography>
            )
        },
        {
            label: 'Mineros',
            key: (row: any) => row.miners?.length ?? 0,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" className="flex items-center gap-1 font-mono text-white">
                    <HardHat size={14} className="text-white/50" /> {value}
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
                <Typography variant="body2" className="font-mono font-bold text-[#00f3ff]">
                    {value} TXs
                </Typography>
            )
        },
        {
            label: 'Recompensa',
            key: (row: any) => row.minerRewards ?? 0,
            render: ({ value }: { value: any }) => (
                <Typography variant="body2" className="flex items-center gap-1 font-mono font-bold text-[#00e676]">
                    <Coins size={14} /> {Number(value).toFixed(4)}
                </Typography>
            )
        },
        {
            label: 'Estado',
            key: (row: any) => row.nextBlock === null,
            render: ({ value }: { value: any }) => value ? (
                <span
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-bold"
                    style={{ backgroundColor: `${networkColor}10`, color: networkColor, borderColor: networkColor }}
                >
                    <PlayCircle size={14} style={{ color: networkColor }} /> ACTIVO
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#00e676]/30 bg-[#00e676]/5 px-2 py-0.5 text-[0.65rem] font-bold text-[#00e676]">
                    <CheckCircle size={14} className="text-[#00e676]" /> CONFIRMADO
                </span>
            )
        }
    ], [networkColor]);

    if (!selectedNetwork) {
        return (
            <div className="rounded border border-white/10 bg-[rgba(10,12,16,0.8)] p-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#00f3ff]/20 border-t-[#00f3ff]" />
                <Typography className="text-foreground-muted">Cargando red seleccionada...</Typography>
            </div>
        );
    }

    // Sort blocks by index descending (latest blocks first) for vertical auditing or timeline
    const sortedBlocks = [...blocksHistory].sort((a, b) => b.index - a.index);

    return (
        <div className="flex flex-col gap-8">
            {/* Network Banner */}
            <div
                className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-6"
                style={{
                    background: `linear-gradient(90deg, rgba(10,12,16,0.9) 0%, ${networkColor}15 100%)`,
                    borderColor: `${networkColor}20`,
                }}
            >
                <div className="flex items-center gap-6">
                    <div
                        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 font-bold text-white"
                        style={{ borderColor: networkColor }}
                    >
                        <span className="absolute inset-0 flex items-center justify-center">
                            {selectedNetwork.identification.symbol[0]}
                        </span>
                        {selectedNetwork.identification.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={selectedNetwork.identification.image}
                                alt={selectedNetwork.identification.name}
                                className="relative h-full w-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                    </div>
                    <div>
                        <Typography variant="h4" className="font-bold text-white">
                            Ledger de Red: {selectedNetwork.identification.name}
                        </Typography>
                        <Typography variant="body2" className="font-mono text-white/50">
                            NETWORK ID: {selectedNetwork.id}
                        </Typography>
                    </div>
                </div>
                <div>
                    <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold tracking-[1.5px]"
                        style={{ backgroundColor: `${networkColor}20`, color: networkColor, borderColor: networkColor }}
                    >
                        EXPLORADOR DE BLOQUES
                    </span>
                </div>
            </div>

            {/* Header & Refresh Action */}
            <div className="mb-1 flex items-center justify-between border-b border-white/5 pb-2">
                <Typography variant="h6" className="flex items-center gap-2 font-bold text-white">
                    <Tag style={{ color: networkColor }} /> HISTORIAL DE BLOQUES MINADOS
                </Typography>

                <Tooltip content={isCooldownActive ? `Espero ${cooldownRemaining}s` : 'Actualizar historial de bloques'}>
                    {/* El span mantiene el tooltip activo aunque el botón esté
                        deshabilitado: un disabled no emite eventos de puntero y el
                        mensaje de cooldown es justo el que importa mostrar. */}
                    <span>
                        {/* El sx anterior pintaba el botón con networkColor; el Button
                            compartido trabaja con una paleta fija, así que el acento
                            queda en "info" (#00f3ff, el color por defecto de red). */}
                        <Button
                            color={isCooldownActive ? 'warning' : 'info'}
                            size="small"
                            onClick={handleRefresh}
                            disabled={isCooldownActive || isLoading}
                            startIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
                            aria-label="Actualizar historial de bloques"
                        >
                            {isCooldownActive ? (
                                <span className="tabular-nums">{cooldownRemaining}s</span>
                            ) : (
                                'Refrescar'
                            )}
                        </Button>
                    </span>
                </Tooltip>
            </div>

            {/* Blocks Table View */}
            <div>
                <CustomTable
                    columns={blocksColumns}
                    data={sortedBlocks}
                    loading={isLoading}
                    pageSize={10}
                />
            </div>
        </div>
    );
};
