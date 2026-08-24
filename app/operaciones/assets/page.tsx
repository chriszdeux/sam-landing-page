'use client';

import React from 'react';
import { ArrowLeft, Package, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../lib/hooks';
import { TechFrame } from '../../../components/ui/TechFrame';
import { Background } from '../../../components/layout/Background';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';

export default function AssetsPage() {
    const router = useRouter();
    const { walletsInfo } = useAppSelector((state) => state.auth);
    const assets = walletsInfo?.store || [];

    return (
        <main className="min-h-screen relative pb-20">
            <Background />

            <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
                <div className="mb-12 flex items-center justify-between">
                    <div className="flex flex-row items-center gap-6">
                        <button
                            onClick={() => router.back()}
                            className="rounded border border-[#00f3ff]/30 bg-[#00f3ff]/5 p-2 text-[#00f3ff] hover:bg-[#00f3ff]/10"
                        >
                            <ArrowLeft />
                        </button>
                        <div className="flex flex-row items-center gap-4">
                            <div className="flex rounded-lg border border-[#00f3ff]/30 bg-[#00f3ff]/10 p-3">
                                <Package size={32} className="text-[#00f3ff]" />
                            </div>
                            <div>
                                <Typography variant="h3" className="font-black uppercase tracking-[2px] text-white">
                                    Inventario de <span className="text-[#00f3ff]">Activos</span>
                                </Typography>
                                <Typography variant="body1" className="font-bold tracking-[2px] text-[#00f3ff]/60">
                                    {assets.length} PROTOCOLOS IDENTIFICADOS EN LA RED
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="mb-12 border-t border-white/5" />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {assets.length > 0 ? (
                        assets.map((asset, index) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <TechFrame color="rgba(0, 243, 255, 0.2)">
                                    <div className="p-8">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#00f3ff]/30 bg-[#00f3ff]/10 text-2xl font-bold text-[#00f3ff]">
                                                {asset.symbol[0]}
                                            </div>
                                            <div className="text-right">
                                                <Typography variant="caption" className="block font-bold text-white/30">
                                                    PROTOCOL_ID
                                                </Typography>
                                                <Typography variant="body2" className="font-mono text-[#00f3ff]">
                                                    {asset.id.slice(0, 8)}...
                                                </Typography>
                                            </div>
                                        </div>

                                        <Typography variant="h5" className="mb-1 font-bold text-white">
                                            {asset.name}
                                        </Typography>
                                        <Typography variant="overline" className="font-bold tracking-[2px] text-white/50">
                                            {asset.symbol}
                                        </Typography>

                                        <div className="mt-8 flex items-baseline justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4">
                                            <Typography variant="caption" className="font-bold text-white/40">
                                                BALANCE DISPONIBLE
                                            </Typography>
                                            <Typography variant="h5" className="font-mono font-bold text-[#00f3ff]">
                                                {asset.quantity.toLocaleString()}
                                            </Typography>
                                        </div>

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                mt: 3,
                                                borderColor: 'rgba(0, 243, 255, 0.3)',
                                                color: '#00f3ff',
                                                '&:hover': { borderColor: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.05)' }
                                            }}
                                            onClick={() => router.push(`/market/${asset.id}`)}
                                        >
                                            DETALLES DEL PROTOCOLO
                                        </Button>
                                    </div>
                                </TechFrame>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center">
                            <Coins size={80} className="mx-auto mb-6 text-white/5" />
                            <Typography variant="h5" className="font-bold text-white/20">
                                No se han detectado protocolos activos en su billetera.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 4, bgcolor: '#00f3ff', color: '#000', fontWeight: 'bold' }}
                                onClick={() => router.push('/market')}
                            >
                                ADQUIRIR ACTIVOS
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
