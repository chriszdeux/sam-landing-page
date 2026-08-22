'use client';

import React, { useMemo } from 'react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../ui/TechFrame';
import { CryptoHoldings } from '../../lib/features/auth/types';
import { useAppDispatch } from '../../lib/hooks';
import { refreshUserInfo } from '../../lib/features/auth/actions';
import { useRefreshCooldown } from '../../lib/useRefreshCooldown';
import { RefreshCw } from 'lucide-react';
import { Typography } from '../ui/Typography';

export const FinancialPanel = React.memo(() => {
    const authData = useAppSelector((state) => {
        return {
            balance: state.auth.userInfo?.balance || 0,
            assets: state.auth.walletsInfo?.store || []
        };
    }, (prev, next) => {
        return prev.balance === next.balance && prev.assets === next.assets;
    });
    const { balance, assets } = authData;
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { isCooldownActive, cooldownRemaining, triggerRefresh } = useRefreshCooldown();

    const handleRefresh = () => {
        if (triggerRefresh()) {
            dispatch(refreshUserInfo());
        }
    };

    // Memoize sort + slice to avoid creating new arrays every render
    const topAssets = useMemo(() =>
        [...assets].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
        [assets]
    );

    const handleAction = (type: 'buy' | 'sell') => {
        router.push(`/market`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Balance Block */}
            <TechFrame color="#00f3ff">
                <div className="p-6">
                    <Typography variant="overline" className="font-bold text-white/50">
                        BALANCE TOTAL
                    </Typography>
                    <div className="mt-2 flex items-baseline gap-2">
                        <Typography variant="h3" className="font-mono font-black text-white">
                            {balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </Typography>
                        <Typography variant="h5" className="font-bold text-[#00f3ff]">
                            THAOS
                        </Typography>
                    </div>
                </div>
            </TechFrame>

            {/* Operations Block */}
            <Button
                color="info"
                size="large"
                fullWidth
                onClick={() => router.push('/market')}
            >
                Ir al Mercado
            </Button>

            {/* Assets List Block */}
            <TechFrame color="rgba(255,255,255,0.1)">
                <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <Typography variant="h6" className="font-bold text-white">
                            ACTIVOS PRINCIPALES
                        </Typography>
                        {/* items-center para que ambos botones queden alineados
                            entre sí y con el título de la sección. */}
                        <div className="flex items-center gap-2">
                            <Tooltip content={isCooldownActive ? `Espero ${cooldownRemaining}s` : 'Actualizar activos'}>
                                {/* El span mantiene el tooltip activo aunque el botón
                                    esté deshabilitado: un disabled no emite eventos de
                                    puntero y el cooldown es justo el mensaje que importa. */}
                                <span>
                                    <Button
                                        color={isCooldownActive ? 'warning' : 'info'}
                                        size="small"
                                        onClick={handleRefresh}
                                        disabled={isCooldownActive}
                                        startIcon={<RefreshCw size={14} />}
                                        aria-label="Actualizar activos"
                                    >
                                        {isCooldownActive ? (
                                            <span className="tabular-nums">{cooldownRemaining}s</span>
                                        ) : (
                                            'Refrescar'
                                        )}
                                    </Button>
                                </span>
                            </Tooltip>
                            {/* Acción secundaria: el blanco de `primary` reemplaza al
                                variant "neutral" del botón legacy. */}
                            <Button
                                color="primary"
                                size="small"
                                onClick={() => router.push('/operaciones/assets')}
                            >
                                Ver todo
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {topAssets.length > 0 ? (
                            topAssets.map((asset, index) => (
                                <motion.div
                                    key={asset.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div
                                        onClick={() => router.push(`/market/${asset.id}`)}
                                        className="flex cursor-pointer items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-all duration-200 hover:border-[#00f3ff]/30 hover:bg-white/[0.08]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-[24%] border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[0.8rem] text-[#00f3ff]">
                                                {asset.symbol[0]}
                                            </div>
                                            <div>
                                                <Typography variant="body2" component="p" className="font-bold text-white">
                                                    {asset.name}
                                                </Typography>
                                                <Typography variant="caption" component="p" className="text-white/50">
                                                    {asset.symbol}
                                                </Typography>
                                            </div>
                                        </div>
                                        <Typography variant="body2" component="p" className="font-mono font-bold text-[#00f3ff]">
                                            {asset.quantity.toLocaleString()}
                                        </Typography>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <Typography variant="body2" component="p" className="py-4 text-center text-white/30">
                                No se encontraron activos
                            </Typography>
                        )}
                    </div>
                </div>
            </TechFrame>
        </div>
    );
});
