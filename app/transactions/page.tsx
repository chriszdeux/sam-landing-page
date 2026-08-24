'use client';

import React, { useEffect, useState } from 'react';
import { Background } from '../../components/layout/Background';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../components/ui/Typography';
import { cn } from '@/lib/utils/cn';
import { Tooltip } from '../../components/ui/Tooltip';
import { Search as SearchIcon, RefreshCw as RefreshIcon, ExternalLink as LaunchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { fetchTransactions } from '../../lib/features/transactions/actions';
import { setTransactionsFromCache, clearTransactions } from '../../lib/features/transactions/reducer';
import { CustomTable } from '../../components/ui/CustomTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { RootState } from '../../lib/store';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { PageHeader } from '../../components/ui/PageHeader';
import { Reveal } from '../../components/ui/TextReveal';
import { motion } from 'framer-motion';
import { formatHash } from '../../lib/utils/formatHash';
import { useRefreshCooldown } from '../../lib/useRefreshCooldown';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

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

    const baseHash = selectedNetwork?.hashAvailable || 0;
    const [fluctuatedHash, setFluctuatedHash] = useState(baseHash);
    const [hashVariation, setHashVariation] = useState(0.42);

    useEffect(() => {
        setFluctuatedHash(baseHash);
    }, [baseHash]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (baseHash > 0) {
                const variation = 1 + (Math.random() - 0.5) * 0.006;
                setFluctuatedHash(Math.round(baseHash * variation));
                
                setHashVariation(prev => {
                    const delta = (Math.random() - 0.5) * 0.05;
                    const nextVal = prev + delta;
                    return Math.max(0.1, Math.min(2.5, nextVal));
                });
            }
        }, 2500);
        return () => clearInterval(interval);
    }, [baseHash]);

    const handleRefresh = () => {
        if (triggerRefresh() && storeId) {
            dispatch(fetchTransactions({
                storeId,
                page,
                limit: pageSize,
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

    const handleFilterChange = (newValue: string) => {
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

    const syncedColumns = React.useMemo(() => {
        const cols = transactionsPageColumns.map(col => {
            if (col.label === 'Potencia CB') {
                return {
                    ...col,
                    render: ({ value }: { value: any }) => {
                        const raw = value as number;
                        if (!raw || raw === 0) return <Typography variant="caption" className="text-white/30">—</Typography>;
                        return (
                            <Typography variant="caption" className="font-mono font-bold text-[#00f3ff]">
                                {formatHash(raw * 1000000, chronoBurstFreqTypes)}
                            </Typography>
                        );
                    }
                };
            }
            return col;
        });

        const symbolMap: Record<string, string> = {
            'SAM': 'sam-token',
            'DTR': 'deuterium',
            'DKM': 'dark-matter',
            'SLR': 'solar-credits',
            'PLC': 'plasma-core',
            'NNO': 'nano-tech',
            'VDS': 'void-shards',
            'TRT': 'terra-token'
        };

        cols.push({
            label: "Acciones",
            key: (row) => 'acciones',
            render: ({ row }: { row: any }) => {
                const symbol = row.financialInfo?.symbol;
                const cryptoId = symbolMap[symbol] || row.blockchainId || row.financialInfo?.cryptoId || row.cryptoId;
                if (!cryptoId) return <Typography variant="caption" className="text-white/30">—</Typography>;
                return (
                    <Button
                        size="small"
                        color="info"
                        aria-label="Ver activo en el mercado"
                        onClick={() => router.push(`/market/${cryptoId}`)}
                        className="[&>div]:px-2 [&>div]:py-1.5"
                    >
                        <LaunchIcon size={14} />
                    </Button>
                );
            }
        });

        return cols;
    }, [chronoBurstFreqTypes, router]);

    return (
        <main className='min-h-screen relative pb-20'>
            <Background />

            <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
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

                    {/* Blockchain Hash Metric Widget */}
                    <div className="relative mb-8 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-lg border border-[#00f3ff]/20 bg-[#00f3ff]/[0.03] p-6 shadow-[0_0_15px_rgba(0,243,255,0.05)] sm:flex-row">
                        <div className="absolute -right-[50px] -top-[50px] z-0 h-[100px] w-[100px] bg-[#00f3ff] opacity-10 blur-[50px]" />
                        <Reveal className="relative z-[1] self-start">
                            <Typography variant="subtitle2" className="mb-1 font-bold uppercase tracking-[1.5px] text-[#00f3ff]">
                                Hash Total Disponible en Blockchain
                            </Typography>
                            <Typography variant="body2" className="text-white/60">
                                Auditoría macro consolidada del total de hash disponible para procesamiento en la red.
                            </Typography>
                        </Reveal>
                        <div className="relative z-[1] flex items-center gap-4">
                            <Typography variant="h3" className="font-mono font-black text-white [text-shadow:0_0_10px_rgba(255,255,255,0.2)]">
                                {formatHash(fluctuatedHash, chronoBurstFreqTypes)}
                            </Typography>
                            <div className="flex items-center gap-1 rounded border border-[#00ff88]/30 bg-[#00ff88]/[0.08] px-2 py-0.5">
                                <Typography variant="caption" className="flex items-center gap-0.5 text-xs font-bold text-[#00ff88]">
                                    <span style={{ fontSize: '10px' }}>▲</span> +{hashVariation.toFixed(2)}%
                                </Typography>
                            </div>
                        </div>
                    </div>

                    {/* Pending Queues Widget */}
                    <div className="mb-8 flex flex-col items-center justify-between gap-6 rounded-lg border border-[#ffaa00]/20 bg-[#ffaa00]/[0.03] p-6 shadow-[0_0_15px_rgba(255,170,0,0.05)] sm:flex-row">
                        <Reveal className="self-start">
                            <Typography variant="subtitle2" className="mb-1 font-bold uppercase tracking-[1.5px] text-[#ffaa00]">
                                Colas de Transacciones Pendientes (Red)
                            </Typography>
                            <Typography variant="body2" className="text-white/60">
                                Transacciones en espera de inyección de energía para su confirmación en el bloque actual.
                            </Typography>
                        </Reveal>

                        <div className="flex flex-row gap-6">
                            <div className="min-w-[80px] text-center">
                                <Typography variant="caption" className="block font-bold text-[#00ff88]">COMPRA</Typography>
                                <Typography variant="h5" className="font-mono font-black text-white">{buyQueue}</Typography>
                            </div>
                            <div className="min-w-[80px] text-center">
                                <Typography variant="caption" className="block font-bold text-[#ff0055]">VENTA</Typography>
                                <Typography variant="h5" className="font-mono font-black text-white">{sellQueue}</Typography>
                            </div>
                            <div className="min-w-[80px] text-center">
                                <Typography variant="caption" className="block font-bold text-[#00f3ff]">TRANSF.</Typography>
                                <Typography variant="h5" className="font-mono font-black text-white">{transferQueue}</Typography>
                            </div>
                        </div>
                    </div>

                    {/* items-center + mb-0: el margen propio del Input estiraba la
                        fila y dejaba los botones desalineados respecto al campo. */}
                    <div className="mb-8 flex items-center gap-3">
                        <Input
                            placeholder='Buscar por billetera...'
                            value={walletSearch}
                            onChange={(e) => setWalletSearch(e.target.value)}
                            containerClassName="mb-0 flex-1"
                        />
                        <Button
                            color="info"
                            size="large"
                            onClick={handleSearch}
                            startIcon={<SearchIcon size={15} />}
                            className="min-w-[150px]"
                        >
                            BUSCAR
                        </Button>
                        <Tooltip content={isCooldownActive ? `Espero ${cooldownRemaining}s` : "Actualizar Transacciones"}>
                            {/* El span mantiene el tooltip activo aunque el botón
                                esté deshabilitado durante el cooldown. */}
                            <span>
                                <Button
                                    color={isCooldownActive ? 'warning' : 'info'}
                                    size="large"
                                    onClick={handleRefresh}
                                    disabled={isCooldownActive}
                                    aria-label="Actualizar transacciones"
                                    className="[&>div]:px-3.5"
                                >
                                    {isCooldownActive ? (
                                        <span className="tabular-nums">{cooldownRemaining}s</span>
                                    ) : (
                                        <RefreshIcon size={16} className={loading ? 'animate-spin' : ''} />
                                    )}
                                </Button>
                            </span>
                        </Tooltip>
                    </div>

                    {/* Pestañas: mismo tratamiento fino que el navbar - el estado
                        activo lo lleva una hairline de 1px, no un subrayado grueso. */}
                    <div className="mb-6 flex gap-7 border-b border-white/[0.07]">
                        {[
                            { label: 'Mercado (BUY/SELL)', value: '' },
                            { label: 'Minería (MINE)', value: 'MINER' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                role="tab"
                                aria-selected={filterType === tab.value}
                                onClick={() => handleFilterChange(tab.value)}
                                className={cn(
                                    'relative pb-3 text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.14em]',
                                    'transition-colors duration-200 focus-visible:outline-none',
                                    filterType === tab.value
                                        ? 'text-[#00f3ff]'
                                        : 'text-white/55 hover:text-white focus-visible:text-white'
                                )}
                            >
                                {tab.label}
                                {filterType === tab.value && (
                                    <motion.div
                                        layoutId="transactions-tab-indicator"
                                        className="absolute inset-x-0 -bottom-px h-px bg-[#00f3ff]"
                                        style={{ boxShadow: '0 0 8px rgba(0,243,255,0.8)' }}
                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <CustomTable
                        columns={syncedColumns}
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
            </div>
        </main>
    );
}