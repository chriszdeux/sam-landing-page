'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Layers,
    Tag,
    Coins,
    ChevronsRight,
    RefreshCw
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchBlocksHistory } from '../../lib/features/blockchain/actions';
import { RootState } from '../../lib/store';
import { Typography } from '../ui/Typography';
import { Tooltip } from '../ui/Tooltip';

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
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/5 bg-[rgba(10,12,16,0.6)] p-6 backdrop-blur-md">
            {/* Header info */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Typography variant="overline" className="flex items-center gap-2 font-bold tracking-wide" style={{ color: networkColor }}>
                        <Layers size={16} /> CADENA DE BLOQUES (BLOCKCHAIN LEDGER)
                    </Typography>
                    <Typography variant="body2" component="p" className="mt-1 text-white/50">
                        Visualización en tiempo real de los bloques minados en la red interplanetaria de {selectedNetwork.identification.name}.
                    </Typography>
                </div>
                <button
                    onClick={loadHistory}
                    disabled={isLoading}
                    className="rounded p-2"
                    style={{ color: networkColor, border: `1px solid ${networkColor}30`, backgroundColor: `${networkColor}10` }}
                >
                    <RefreshCw size={20} className={isLoading ? 'spin-animation' : ''} />
                </button>
            </div>

            {/* Horizontal chain container */}
            <div className="chain-scroll flex items-center gap-4 overflow-x-auto px-1 pb-4 pt-1">
                {sortedBlocks.length === 0 ? (
                    <div className="w-full py-8 text-center">
                        <Typography variant="caption" component="p" className="italic text-white/30">
                            Esperando confirmación del bloque génesis en la red...
                        </Typography>
                    </div>
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
                                <Tooltip content={
                                    <div className="p-1">
                                        <Typography variant="caption" component="p" className="mb-1 font-bold">Detalles del Bloque</Typography>
                                        <Typography variant="caption" component="p" className="text-white/70">Hash: {block.id}</Typography>
                                        <Typography variant="caption" component="p" className="text-white/70">Previo: {block.prevBlock || 'N/A'}</Typography>
                                        <Typography variant="caption" component="p" className="text-white/70">Mineros: {block.miners?.length || 0}</Typography>
                                        <Typography variant="caption" component="p" className="text-white/70">Dificultad: {block.difficulty}</Typography>
                                        {block.minedAt && <Typography variant="caption" component="p" className="text-white/70">Minado: {new Date(block.minedAt).toLocaleTimeString()}</Typography>}
                                    </div>
                                }>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                                        whileHover={{ y: -5, boxShadow: `0 0 20px ${networkColor}30` }}
                                        className="relative min-w-[200px] max-w-[200px] cursor-pointer rounded-xl bg-black/50 p-4 transition-all duration-300"
                                        style={{ border: `1px solid ${networkColor}20` }}
                                    >
                                        {/* Block ID / Header */}
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex flex-row items-center gap-1">
                                                <Tag size={16} style={{ color: networkColor }} />
                                                <Typography variant="body2" component="p" className="font-mono font-black text-white">
                                                    BLOQUE {block.index}
                                                </Typography>
                                            </div>
                                            <Typography variant="caption" component="p" className="rounded bg-white/5 px-2 py-0.5 font-mono text-[0.65rem] text-white/50">
                                                {block.id.slice(0, 8)}
                                            </Typography>
                                        </div>

                                        {/* Difficulty & Rewards */}
                                        <div className="mb-3 flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <Typography variant="caption" component="p" className="text-[0.65rem] text-white/40">DIFICULTAD</Typography>
                                                <Typography variant="caption" component="p" className="font-mono font-bold" style={{ color: networkColor }}>
                                                    {block.difficulty}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Typography variant="caption" component="p" className="text-[0.65rem] text-white/40">RECOMPENSA</Typography>
                                                <Typography variant="caption" component="p" className="flex items-center gap-1 font-mono font-bold text-[#00e676]">
                                                    <Coins size={12} /> {(block.minerRewards || 0).toFixed(4)}
                                                </Typography>
                                            </div>
                                        </div>

                                        {/* Queues / Counts */}
                                        <div className="rounded-md border border-white/[0.03] bg-white/[0.02] p-2">
                                            <Typography variant="caption" component="p" className="mb-1 block text-[0.6rem] font-bold text-white/50">
                                                COLAS ACTIVAS (TX QUEUES)
                                            </Typography>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <Typography variant="caption" component="p" className="text-[0.6rem] text-white/40">Compras:</Typography>
                                                    <Typography variant="caption" component="p" className="font-mono font-bold text-[#00ff88]">{buyCount}</Typography>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Typography variant="caption" component="p" className="text-[0.6rem] text-white/40">Ventas:</Typography>
                                                    <Typography variant="caption" component="p" className="font-mono font-bold text-[#ff0055]">{sellCount}</Typography>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Typography variant="caption" component="p" className="text-[0.6rem] text-white/40">Transf.:</Typography>
                                                    <Typography variant="caption" component="p" className="font-mono font-bold text-[#00f3ff]">{transferCount}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Tooltip>

                                {/* Connector Line (except for the last block) */}
                                {i < sortedBlocks.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 + 0.1 }}
                                        className="flex min-w-[40px] items-center justify-center"
                                    >
                                        <ChevronsRight style={{ color: networkColor, opacity: 0.4 }} className="pulse-animation" />
                                    </motion.div>
                                )}
                            </React.Fragment>
                        );
                    })
                )}
            </div>

            <style jsx global>{`
                .chain-scroll {
                    scrollbar-width: thin;
                }
                .chain-scroll::-webkit-scrollbar {
                    height: 6px;
                }
                .chain-scroll::-webkit-scrollbar-thumb {
                    background-color: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
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
        </div>
    );
};
