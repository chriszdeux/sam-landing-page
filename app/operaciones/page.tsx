'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchLaboratoryInterface } from '../../lib/features/labs/actions';
import { fetchProcessingFrequencies } from '../../lib/features/blockchain/actions';
import { FinancialPanel } from '../../components/dashboard/FinancialPanel';
import { LabMetersPanel } from '../../components/dashboard/LabMetersPanel';
import { ControlRewardsPanel } from '../../components/dashboard/ControlRewardsPanel';
import { OperationsCanvasBg } from "../../components/dashboard/OperationsCanvasBg";
import { EmptyLabState } from '../../components/dashboard/EmptyLabState';
import { Background } from '../../components/layout/Background';
import { Typography } from '../../components/ui/Typography';
import { RootState } from '../../lib/store';

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.auth.userInfo);
    const authStatus = useAppSelector((state) => state.auth.status);
    const labStatus = useAppSelector((state: RootState) => state.reducerLabs.status);

    const labId = userInfo?.idLab;

    useEffect(() => {
        if (labId) {
            dispatch(fetchLaboratoryInterface(labId));
        }
        dispatch(fetchProcessingFrequencies());
    }, [labId]);

    if (authStatus === 'loading' || (labId && labStatus === 'loading')) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#00f3ff]" />
            </div>
        );
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
            <Background />
            <OperationsCanvasBg />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1536px] flex-col justify-center px-4 py-24 sm:px-6 md:py-16 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="mb-12 mt-8">
                        <Typography variant="h3" className="mb-1 font-black uppercase tracking-[4px] text-white">
                            Centro de <span className="text-[#00f3ff]">Operaciones</span>
                        </Typography>
                        <Typography variant="body1" className="tracking-wide text-white/50">
                            Gestión unificada de activos, laboratorio y protocolos de red.
                        </Typography>
                    </div>

                    {!labId ? (
                        <EmptyLabState />
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Column 1: Financial */}
                            <div className="order-2 lg:order-1">
                                <FinancialPanel />
                            </div>

                            {/* Column 2: Laboratory State */}
                            <div className="order-3 lg:order-2">
                                <LabMetersPanel />
                            </div>

                            {/* Column 3: Control & Rewards */}
                            <div className="order-1 lg:order-3">
                                <ControlRewardsPanel />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
