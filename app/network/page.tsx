// 1-Selección de datos desde el estado global de Redux
// 2-Selección de datos desde el estado global de Redux
// 3-Selección de ítem y actualización de network
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Background } from '../../components/layout/Background';

//# 1-Selección de datos desde el estado global de Redux
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NetworkSelectionPage() {
  const router = useRouter();
  
  //# 2-Selección de datos desde el estado global de Redux
  const { networks, selectedNetwork } = useAppSelector((state) => state.blockchain);

  
  
  //# 3-Selección de ítem y actualización de network
  const handleNetworkSelect = (networkId: string) => {
    
    router.push(`/network/${networkId}/connecting`);
  };

  
  
  //# 4-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
        <Background />

        <div className="relative z-[1] mx-auto w-full max-w-[1536px] px-4 pt-32 pb-20 sm:px-6 lg:px-8">
            <PageHeader
                title="SISTEMAS INTERPLANETARIOS"
                subtitle="Selecciona la red blockchain a la que deseas conectarte para sincronizar tus activos."
                color="#00f3ff"
            />

            <div className="grid grid-cols-1 justify-center gap-12 md:grid-cols-2 lg:grid-cols-3">
                {networks.map((network, index) => {
                    const isSelected = selectedNetwork?.id === network.id;
                    const color = network.additionalInfo?.color || '#00f3ff';
                    
                    
                    
                    //# 5-Estructuración y renderizado visual del componente UI
                    return (
                        <div key={network.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                style={{ height: '100%' }}
                            >
                                <TechFrame
                                    color={color}
                                    className="h-full cursor-pointer transition-transform duration-300 hover:-translate-y-2.5"
                                    onClick={() => handleNetworkSelect(network.id)}
                                >
                                    <div className="flex h-full flex-col gap-6 p-8">
                                        {}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Typography variant="overline" className="block tracking-[2px]" style={{ color }}>
                                                    {network.identification?.symbol || 'NET'} - PROTOCOL
                                                </Typography>
                                                <Typography variant="h4" className="mb-2 font-bold text-white">
                                                    {network.identification?.name}
                                                </Typography>
                                                {isSelected && (
                                                    <div className="inline-flex items-center gap-1 rounded border border-[#00ff00] bg-[#00ff00]/10 px-2 py-1">
                                                        <div className="h-2 w-2 rounded-full bg-[#00ff00] shadow-[0_0_5px_#00ff00]" />
                                                        <Typography variant="caption" className="font-bold text-[#00ff00]">CONECTADO</Typography>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="rounded-full border p-2 transition-colors"
                                                style={{ borderColor: color, color }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${color}20`; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>

                                        {}
                                        <div className="relative mb-4 flex h-[150px] w-full items-center justify-center">
                                             <div
                                                 className="relative z-[2] h-[100px] w-[100px] rounded-full"
                                                 style={{
                                                     background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
                                                     boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}80`,
                                                 }}
                                             >
                                                 {}
                                                 <div
                                                     className="absolute -inset-[10px] rounded-full border border-dashed [animation:spin_10s_linear_infinite]"
                                                     style={{ borderColor: `${color}40` }}
                                                 />
                                             </div>
                                             {}
                                             <div
                                                 className="absolute inset-0 z-[1] opacity-30"
                                                 style={{
                                                     backgroundImage: `radial-gradient(${color}20 1px, transparent 1px)`,
                                                     backgroundSize: '20px 20px',
                                                     maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                                                 }}
                                             />
                                        </div>

                                        {}
                                        <div className="mt-auto grid grid-cols-3 gap-4">
                                            <div className="rounded bg-white/[0.03] p-2 text-center">
                                                <Typography variant="caption" className="block text-[0.65rem] text-foreground-muted">MARKET CAP</Typography>
                                                <Typography variant="body2" className="font-bold text-white">
                                                    ${((network as any).blockchainProps?.marketCap || 0).toLocaleString()}
                                                </Typography>
                                            </div>
                                            <div className="rounded bg-white/[0.03] p-2 text-center">
                                                <Typography variant="caption" className="block text-[0.65rem] text-foreground-muted">SUPPLY</Typography>
                                                <Typography variant="body2" className="font-bold text-white">
                                                   {((network as any).blockchainProps?.circulatingSupply || 0).toLocaleString()}
                                                </Typography>
                                            </div>
                                            <div className="rounded bg-white/[0.03] p-2 text-center">
                                                <Typography variant="caption" className="block text-[0.65rem] text-foreground-muted">TOKENS</Typography>
                                                <Typography variant="body2" className="font-bold text-white">
                                                    {network.tokensSupported?.total || 0}
                                                </Typography>
                                            </div>
                                        </div>

                                        {}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                mt: 2,
                                                borderColor: color,
                                                color: color,
                                                '&:hover': {
                                                    bgcolor: `${color}10`,
                                                    borderColor: color,
                                                    boxShadow: `0 0 15px ${color}40`
                                                }
                                            }}
                                        >
                                            {isSelected ? 'RE-SINCRONIZAR' : 'INICIAR CONEXIÓN'}
                                        </Button>
                                    </div>
                                </TechFrame>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    </div>
  );
}
