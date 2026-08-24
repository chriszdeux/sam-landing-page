// 1-Selección de datos desde el estado global de Redux
// 2-Selección de datos desde el estado global de Redux
// 3-Estructuración y renderizado visual del componente UI
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { ParticleBackground } from '../../../components/ui/ParticleBackground';
import { ArrowLeft, ShieldCheck, Gauge, Database, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TaoIcon } from '../../../components/ui/TaoIcon';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';

//# 1-Selección de datos desde el estado global de Redux
import { useAppSelector } from '../../../lib/hooks';

export default function NetworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();

    //# 2-Selección de datos desde el estado global de Redux
    const { networks } = useAppSelector((state) => state.blockchain);


    const network = networks.find(n => n.id === id);



    if (!network && networks.length === 0) {


         //# 3-Estructuración y renderizado visual del componente UI
         return <div className="min-h-screen bg-black" />;
    }

    if (!network) {


         //# 4-Estructuración y renderizado visual del componente UI
         return (
             <div className="flex min-h-screen items-center justify-center bg-black">
                 <Typography className="text-error">Red no encontrada</Typography>
                 <Button onClick={() => router.push('/')}>Volver</Button>
             </div>
         );
    }



    //# 5-Estructuración y renderizado visual del componente UI
    const isActive = network.blockchainProps.status === 'Active';

    return (
        <div className="relative min-h-screen overflow-hidden pt-24 pb-20">
            <ParticleBackground />

            <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => router.back()}
                    sx={{ color: 'text.secondary', mb: 4, '&:hover': { color: 'primary.main' } }}
                >
                    Atrás
                </Button>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    {}
                    <div className="md:col-span-5">
                        <div
                            className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-xl"
                            style={{
                                border: `1px solid ${network.additionalInfo.color}`,
                                background: `linear-gradient(145deg, rgba(20,20,30,0.8) 0%, ${network.additionalInfo.color}10 100%)`,
                                boxShadow: `0 0 30px ${network.additionalInfo.color}20`,
                            }}
                        >
                             {}
                             <div
                                 className="absolute h-[150px] w-[150px] rounded-full opacity-30 blur-[50px]"
                                 style={{ top: -50, right: -50, backgroundColor: network.additionalInfo.color }}
                             />

                             <div className="flex flex-col gap-6">
                                 <div>
                                     <span
                                        className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold ${isActive ? 'bg-success/20 text-success' : 'bg-white/10 text-white/60'}`}
                                     >
                                        {network.blockchainProps.status || 'Active'}
                                     </span>
                                     <Typography variant="h3" className="font-bold leading-[1.2] text-white">
                                         {network.identification.name}
                                     </Typography>
                                     <Typography variant="h6" className="opacity-80" style={{ color: network.additionalInfo.color }}>
                                         {network.identification.symbol}
                                     </Typography>
                                 </div>

                                 <Typography variant="body1" className="leading-[1.7] text-foreground-muted">
                                     {network.additionalInfo.description?.[0] || 'A powerful decentralized network.'}
                                 </Typography>

                                 <hr className="border-t border-white/10" />

                                 <div className="flex flex-col gap-4">
                                     <div className="flex flex-row items-center gap-4">
                                         <Gauge style={{ color: network.additionalInfo.color }} />
                                         <div>
                                             <Typography variant="caption" className="text-foreground-muted">Circulating Supply</Typography>
                                             <Typography variant="body1" className="text-white">
                                                 {network.blockchainProps.circulatingSupply.toLocaleString()}
                                             </Typography>
                                         </div>
                                     </div>

                                     <div className="flex flex-row items-center gap-4">
                                         <Database style={{ color: network.additionalInfo.color }} />
                                         <div>
                                             <Typography variant="caption" className="text-foreground-muted">Market Cap</Typography>
                                             <Typography variant="body1" className="flex items-center gap-1 text-white">
                                                {network.blockchainProps.marketCap.toLocaleString()} <TaoIcon size={16} />
                                            </Typography>
                                         </div>
                                     </div>
                                     <div className="flex flex-row items-center gap-4">
                                         <ShieldCheck style={{ color: network.additionalInfo.color }} />
                                         <div>
                                             <Typography variant="caption" className="text-foreground-muted">Tokens Supported</Typography>
                                             <Typography variant="body1" className="text-white">
                                                 {network.tokensSupported?.total || 0}
                                             </Typography>
                                         </div>
                                     </div>
                                     {network.additionalInfo.developers && network.additionalInfo.developers.length > 0 && (
                                        <div>
                                            <Typography variant="caption" className="text-foreground-muted">Desarrolladores</Typography>
                                            <Typography variant="body2" className="text-white">
                                                {network.additionalInfo.developers.join(', ')}
                                            </Typography>
                                        </div>
                                     )}
                                 </div>

                                 <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Cpu size={18} />}
                                    onClick={() => router.push(`/network/${network.id}/connecting`)}
                                    sx={{
                                        mt: 2,
                                        bgcolor: network.additionalInfo.color,
                                        '&:hover': { bgcolor: network.additionalInfo.color, filter: 'brightness(1.2)' }
                                    }}
                                 >
                                     Conectar a esta Red
                                 </Button>
                             </div>
                        </div>
                    </div>

                    {}
                    <div className="md:col-span-7">
                        <Typography variant="h5" className="mb-6 text-white">Otras Redes Disponibles</Typography>
                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                             {networks
                                .filter(n => n.id !== network.id)
                                .map((otherNet) => (
                                 <div
                                    key={otherNet.id}
                                    onClick={() => router.push(`/network/${otherNet.id}`)}
                                    className="flex h-full cursor-pointer flex-col justify-between rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.08]"
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = otherNet.additionalInfo.color; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
                                 >
                                     <div className="mb-1 flex flex-row items-center justify-between">
                                          <Typography variant="h6" className="text-white">{otherNet.identification.name}</Typography>
                                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: otherNet.additionalInfo.color }} />
                                     </div>
                                     <Typography variant="body2" className="truncate text-foreground-muted">
                                         {otherNet.identification.symbol}
                                     </Typography>
                                 </div>
                             ))}
                             {networks.length <= 1 && (
                                 <Typography className="p-4 text-foreground-muted">No hay otras redes disponibles en este momento.</Typography>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
