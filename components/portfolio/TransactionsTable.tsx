'use client';

import React, { useEffect } from 'react';
import { Typography } from '../ui/Typography';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { TransactionStatus } from '../../lib/features/transactions/types';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';

interface TransactionsTableProps {
    storeId: string;
    walletId?: string;
}

const statusColorClass: Record<string, string> = {
    [TransactionStatus.CONFIRMED]: 'border-[#00e676] text-[#00e676]',
    [TransactionStatus.PENDING]: 'border-[#ff9100] text-[#ff9100]',
    [TransactionStatus.FAILED]: 'border-[#ff1744] text-[#ff1744]',
};

const getStatusColorClass = (status: TransactionStatus): string =>
    statusColorClass[status] || 'border-white/40 text-white/40';

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ storeId, walletId = '' }) => {
    const dispatch = useAppDispatch();
    const { transactions, isLoading, error } = useAppSelector((state) => state.transactions);

    // Get transactions for this specific store from Redux state
    const transactionsData = transactions || [];

    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId, page: 1, limit: 10 }));
        }
    }, [storeId, walletId]);

    if (transactionsData.length === 0 && isLoading) {
        return (
            <TechFrame>
                <div className="flex justify-center bg-black/20 p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20" style={{ borderTopColor: '#00f3ff' }} />
                </div>
            </TechFrame>
        );
    }

    if (error) {
        return (
             <div className="rounded border-l-4 border-red-500 bg-red-500/10 p-3 text-[#ff4444]">
                {error}
            </div>
        );
    }

    if (transactionsData.length === 0 && !isLoading) {
        return (
            <TechFrame>
                <div className="bg-black/20 p-8 text-center text-foreground-muted">
                    <Typography>No hay transacciones recientes.</Typography>
                </div>
            </TechFrame>
        );
    }
    return (
        <React.Fragment>
             <Typography variant="overline" className="mb-2 block font-bold tracking-[4px] text-[#00f3ff]">
                {'// ULTIMAS_TRANSACCIONES'}
            </Typography>
            <TechFrame>
                <div className="bg-black/20">
                    {/* Desktop View */}
                    <table className="hidden w-full border-collapse text-sm md:table">
                        <thead>
                            <tr>
                                <th className="border-b border-[#00f3ff]/10 p-2 text-left font-mono font-normal text-[#00f3ff]/70">FECHA</th>
                                <th className="border-b border-[#00f3ff]/10 p-2 text-left font-mono font-normal text-[#00f3ff]/70">TIPO</th>
                                <th className="border-b border-[#00f3ff]/10 p-2 text-left font-mono font-normal text-[#00f3ff]/70">ACTIVO</th>
                                <th className="border-b border-[#00f3ff]/10 p-2 text-right font-mono font-normal text-[#00f3ff]/70">CANTIDAD</th>
                                <th className="border-b border-[#00f3ff]/10 p-2 text-center font-mono font-normal text-[#00f3ff]/70">VALIDADO</th>
                                <th className="border-b border-[#00f3ff]/10 p-2 text-center font-mono font-normal text-[#00f3ff]/70">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionsData.slice(0, 10).map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#00f3ff]/5">
                                    <td className="border-b border-[#00f3ff]/10 p-2 font-mono text-[0.85rem] text-white/80">
                                        {new Date(tx.dateCreated).toLocaleDateString()} {new Date(tx.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="border-b border-[#00f3ff]/10 p-2 text-white">
                                        <span className="inline-flex h-5 items-center rounded border border-[#00f3ff]/20 bg-[#00f3ff]/5 px-2 text-[0.65rem] font-bold text-[#00f3ff]">
                                            {tx.transactionType}
                                        </span>
                                    </td>
                                    <td className="border-b border-[#00f3ff]/10 p-2 font-bold text-white/80">
                                        {tx.financialInfo.symbol}
                                    </td>
                                    <td className="border-b border-[#00f3ff]/10 p-2 text-right font-mono text-white">
                                        {tx.financialInfo.quantity}
                                    </td>
                                    <td className="border-b border-[#00f3ff]/10 p-2 text-center font-mono text-[0.85rem] text-white/80">
                                        {tx.confirmedByLabId || '-'}
                                    </td>
                                    <td className="border-b border-[#00f3ff]/10 p-2 text-center text-white">
                                         <span className={`inline-flex h-5 items-center rounded border bg-transparent px-2 text-[0.65rem] ${getStatusColorClass(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="flex flex-col gap-4 p-4 md:hidden">
                        {Array.isArray(transactionsData) && transactionsData.slice(0, 10).map((tx) => (
                            <div
                                key={tx.id}
                                className="relative overflow-hidden rounded-lg border border-[#00f3ff]/10 bg-white/[0.03] p-5"
                            >
                                <span
                                    className="pointer-events-none absolute left-0 top-0 h-full w-1 opacity-70"
                                    style={{ backgroundColor: tx.status === 'CONFIRMED' ? '#00e676' : tx.status === 'PENDING' ? '#ff9100' : '#ff1744' }}
                                />
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <Typography variant="caption" className="mb-1 block font-mono text-white/40">
                                            {new Date(tx.dateCreated).toLocaleDateString()} {new Date(tx.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </Typography>
                                        <Typography variant="h6" className="text-[1rem] font-bold text-white">
                                            {tx.financialInfo.symbol}
                                        </Typography>
                                    </div>
                                    <span className={`inline-flex h-[18px] items-center rounded border bg-transparent px-2 text-[0.6rem] font-bold uppercase ${getStatusColorClass(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="inline-flex h-[22px] w-fit items-center rounded border border-[#00f3ff]/30 bg-[#00f3ff]/10 px-2 text-[0.65rem] font-bold text-[#00f3ff]">
                                            {tx.transactionType}
                                        </span>
                                        <Typography variant="caption" className="font-mono text-[0.7rem] text-white/30">
                                            VAL: {tx.confirmedByLabId || '---'}
                                        </Typography>
                                    </div>
                                    <div className="text-right">
                                        <Typography variant="caption" className="-mb-0.5 block text-white/40">CANTIDAD</Typography>
                                        <Typography className="font-mono text-[1.2rem] font-bold text-[#00f3ff]">
                                            {tx.financialInfo.quantity}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TechFrame>
        </React.Fragment>
    );
};
