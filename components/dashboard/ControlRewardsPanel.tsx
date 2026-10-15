'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Power, History, Gift, Wrench, AlertOctagon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleLaboratoryPower, toggleOverclock } from '../../lib/features/labs/reducer';
import { TechFrame } from '../ui/TechFrame';
import { RootState } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { formatHash } from '../../lib/utils/formatHash';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { RepairEquipmentModal } from './RepairEquipmentModal';
import { EnvVariables } from '../../lib/constants/variables';

export const ControlRewardsPanel = React.memo(() => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
    const { userInfo } = useAppSelector((state) => state.auth);
    const { energy, hashAvailable, isPoweredOn, isOverheated, isOverclockActive, chronoBurstFreqTypes, currentLife } = useAppSelector((state: RootState) => {
        const lab = state.reducerLabs.currentLab;
        const selectedNetwork = state.blockchain.selectedNetwork;
        return {
            energy: lab?.energy || 0,
            hashAvailable: selectedNetwork?.hashAvailable ?? 0,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            isOverheated: state.reducerLabs.isOverheated,
            isOverclockActive: state.reducerLabs.isOverclockActive,
            chronoBurstFreqTypes: state.blockchain.chronoBurstFreqTypes,
            currentLife: lab?.currentLife !== undefined ? Number(lab.currentLife) : 100
        };
    }, (prev, next) => {
        return (
            prev.energy === next.energy &&
            prev.hashAvailable === next.hashAvailable &&
            prev.isPoweredOn === next.isPoweredOn &&
            prev.isOverheated === next.isOverheated &&
            prev.isOverclockActive === next.isOverclockActive &&
            prev.chronoBurstFreqTypes === next.chronoBurstFreqTypes &&
            prev.currentLife === next.currentLife
        );
    });
    const transactions = useAppSelector((state: RootState) => state.transactions.transactions);

    const isActive = isPoweredOn;
    const isCollapsed = currentLife <= 0;
    const isWarning = currentLife > 0 && currentLife <= 25;
    const frameColor = isCollapsed ? '#ff1744' : isActive ? '#00e676' : isWarning ? '#ffb700' : 'rgba(255,255,255,0.1)';

    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

    const handleToggle = () => {
        if (isCollapsed) return;
        dispatch(toggleLaboratoryPower());
    };

    const handleOverclockToggle = () => {
        if (isCollapsed) return;
        dispatch(toggleOverclock());
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Power Toggle & Energy Block */}
            <TechFrame color={frameColor}>
                <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex flex-row items-center gap-4">
                            <motion.div
                                animate={isCollapsed ? {
                                    boxShadow: ['0 0 0px #ff1744', '0 0 25px #ff1744', '0 0 0px #ff1744']
                                } : isActive ? {
                                    boxShadow: ['0 0 0px #00e676', '0 0 20px #00e676', '0 0 0px #00e676']
                                } : {}}
                                transition={{ repeat: Infinity, duration: isCollapsed ? 1.2 : 2 }}
                                style={{ borderRadius: '50%' }}
                            >
                                <button
                                    onClick={handleToggle}
                                    disabled={isCollapsed || (isOverheated && !isActive)}
                                    className="rounded-full p-3 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: isCollapsed
                                            ? 'rgba(255, 23, 68, 0.15)'
                                            : isActive
                                                ? 'rgba(0, 230, 118, 0.1)'
                                                : 'rgba(255,255,255,0.05)',
                                        color: isCollapsed
                                            ? '#ff1744'
                                            : isActive
                                                ? '#00e676'
                                                : 'rgba(255,255,255,0.3)',
                                        border: `1px solid ${isCollapsed ? '#ff1744' : isActive ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
                                    }}
                                >
                                    <Power size={20} />
                                </button>
                            </motion.div>
                            <div>
                                <Typography variant="body1" className="font-bold text-white">
                                    LABORATORIO
                                </Typography>
                                <Typography
                                    variant="caption"
                                    component="p"
                                    className="font-bold"
                                    style={{
                                        color: isCollapsed
                                            ? '#ff1744'
                                            : isOverheated
                                                ? '#ff1744'
                                                : isWarning && isActive
                                                    ? '#ffb700'
                                                    : isActive
                                                        ? '#00e676'
                                                        : 'rgba(255,255,255,0.5)'
                                    }}
                                >
                                    {isCollapsed
                                        ? '🔴 HARDWARE COLAPSADO (0.00% VIDA ÚTIL)'
                                        : isOverheated
                                            ? 'SISTEMA BLOQUEADO (COOLDOWN)'
                                            : isWarning && isActive
                                                ? 'OPERACIÓN EN RIESGO (DESGASTE SEVERO)'
                                                : isActive
                                                    ? 'SISTEMA ACTIVO'
                                                    : 'SISTEMA EN PAUSA'}
                                </Typography>
                                <Typography variant="caption" component="p" className="mt-1 font-mono text-[0.7rem] text-white/40">
                                    {isCollapsed ? 'Acumulado: 0.00 H/s (Detenido por avería)' : `Acumulado: ${formatHash(energy, chronoBurstFreqTypes)}`}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <Typography variant="caption" className="font-bold text-white/50">
                                HASH ACUMULADO LOCAL
                            </Typography>
                            <Typography variant="h6" className="font-mono font-bold text-[#00f3ff]">
                                {isCollapsed ? '0.00 H/s' : formatHash(energy, chronoBurstFreqTypes)}
                            </Typography>
                        </div>
                    </div>

                    {/* Verde para activar; en marcha pasa a error porque el
                        overclock triplica la temperatura; bloqueado en 0% vida. */}
                    <Button
                        variant="contained"
                        fullWidth
                        color={isCollapsed ? 'error' : isOverclockActive ? 'error' : 'success'}
                        disabled={isCollapsed || !isPoweredOn || isOverheated}
                        onClick={handleOverclockToggle}
                        className="mb-4"
                    >
                        {isCollapsed
                            ? 'OVERCLOCK BLOQUEADO (EQUIPO INSERVIBLE)'
                            : isOverclockActive
                                ? 'OVERCLOCK ACTIVO (3X TEMP)'
                                : 'ACTIVAR OVERCLOCK'}
                    </Button>

                    {/* Banner de Emergencia Crítica si currentLife <= 0 */}
                    {isCollapsed ? (
                        <div className="mb-4 rounded-xl border border-[#ff1744]/40 bg-[#ff1744]/10 p-4">
                            <div className="flex items-start gap-3">
                                <AlertOctagon size={22} className="shrink-0 text-[#ff1744] mt-0.5" />
                                <div>
                                    <Typography variant="body2" className="font-bold text-[#ff1744]">
                                        AVERÍA CRÍTICA: VIDA ÚTIL AL 0.00%
                                    </Typography>
                                    <Typography variant="caption" className="text-white/70 block mt-1">
                                        El hardware ha colapsado por desgaste estructural severo. La inyección de hash y el encendido del laboratorio están estrictamente suspendidos.
                                    </Typography>
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Wrench size={16} />}
                                onClick={() => setIsRepairModalOpen(true)}
                                sx={{
                                    mt: 3,
                                    bgcolor: '#ff1744',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    boxShadow: '0 0 20px rgba(255, 23, 68, 0.4)',
                                    '&:hover': { bgcolor: '#d50000', boxShadow: '0 0 30px rgba(255, 23, 68, 0.6)' }
                                }}
                            >
                                REPARAR EQUIPO (DESDE 1 {EnvVariables.coin1 || 'THAO'})
                            </Button>
                        </div>
                    ) : currentLife < 100 ? (
                        <button
                            type="button"
                            onClick={() => setIsRepairModalOpen(true)}
                            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-bold text-white/80 transition hover:border-[#00f3ff]/40 hover:bg-[#00f3ff]/10 hover:text-[#00f3ff]"
                        >
                            <Wrench size={14} />
                            <span>Mantenimiento Preventivo (Salud: {currentLife.toFixed(1)}%)</span>
                        </button>
                    ) : null}

                    <Typography variant="caption" component="p" className="text-center italic text-white/30">
                        {isCollapsed
                            ? 'INYECCIÓN SUSPENDIDA: Hardware inutilizado por desgaste crítico'
                            : 'Inyección automática de Hash activa al consolidar Round 10'}
                    </Typography>
                </div>
            </TechFrame>

            {/* Transactions History Block */}
            <TechFrame color="rgba(255,255,255,0.1)">
                <div className="p-6">
                    <div className="mb-4 flex flex-row items-center gap-2">
                        <History size={20} className="text-white/50" />
                        <Typography variant="h6" className="text-base font-bold text-white">
                            HISTORIAL RECIENTE
                        </Typography>
                    </div>

                    <div className="flex flex-col gap-2">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx, i) => (
                                <div key={tx.id || i} className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] p-3">
                                    <div>
                                        <Typography variant="caption" component="p" className="font-bold text-white">
                                            {tx.transactionType || 'TRANSACCIÓN'}
                                        </Typography>
                                        <Typography variant="caption" component="p" className="text-white/40">
                                            {tx.dateCreated ? new Date(tx.dateCreated).toLocaleDateString() : 'Fecha desconocida'}
                                        </Typography>
                                    </div>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        className="font-mono font-bold"
                                        style={{ color: tx.transactionType === 'BUY' ? '#00e676' : '#ff1744' }}
                                    >
                                        {tx.transactionType === 'BUY' ? '+' : '-'}{tx.financialInfo?.amount || 0}
                                    </Typography>
                                </div>
                            ))
                        ) : (
                            <Typography variant="caption" component="p" className="py-4 text-center text-white/20">
                                No hay transacciones recientes
                            </Typography>
                        )}
                    </div>
                </div>
            </TechFrame>

            {/* Rewards Button */}
            <Button
                variant="contained"
                fullWidth
                startIcon={<Gift size={18} />}
                onClick={() => router.push('/rewards')}
                sx={{
                    py: 2,
                    bgcolor: 'rgba(0, 243, 255, 0.1)',
                    color: '#00f3ff',
                    border: '1px solid #00f3ff',
                    fontWeight: 'bold',
                    letterSpacing: 2,
                    boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
                    '&:hover': {
                        bgcolor: 'rgba(0, 243, 255, 0.2)',
                        borderColor: '#00f3ff',
                        boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)'
                    }
                }}
            >
                VER RECOMPENSAS
            </Button>

            {/* Modal de Reparación de Equipo */}
            <RepairEquipmentModal
                open={isRepairModalOpen}
                onClose={() => setIsRepairModalOpen(false)}
            />
        </div>
    );
});
