// 1-Obtención del despachador para emitir acciones al store
// 2-Obtención del despachador para emitir acciones al store
// 3-Selección de datos desde el estado global de Redux
// 4-Efecto secundario para sincronización del ciclo de vida
// 5-Estructuración y renderizado visual del componente UI
// 6-Estructuración y renderizado visual del componente UI

'use client';

import React, { use } from 'react';
import { ParticleBackground } from '../../../../components/ui/ParticleBackground';
import { useRouter } from 'next/navigation';
import { Typography } from '../../../../components/ui/Typography';

//# 1-Obtención del despachador para emitir acciones al store
import { useAppSelector, useAppDispatch } from '../../../../lib/hooks';
import { setSelectedNetwork } from '../../../../lib/features/blockchain/reducer';

export default function NetworkConnectingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    //# 2-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();

    //# 3-Selección de datos desde el estado global de Redux
    const { networks } = useAppSelector((state) => state.blockchain);
    const network = networks.find(n => n.id === id);



    //# 4-Efecto secundario para sincronización del ciclo de vida
    React.useEffect(() => {
        if (network) {
            const timer = setTimeout(() => {
                dispatch(setSelectedNetwork(network));
                router.push('/');
            }, 6000);



            //# 5-Estructuración y renderizado visual del componente UI
            return () => clearTimeout(timer);
        }
    }, [network, dispatch, router, id]);

    if (!network) return null;

    const color = network.additionalInfo.color || '#00f3ff';



    //# 6-Estructuración y renderizado visual del componente UI
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
            <ParticleBackground />

            {}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at center, transparent 0%, #000 90%),
                        repeating-linear-gradient(0deg, transparent, transparent 19px, ${color}10 20px),
                        repeating-linear-gradient(90deg, transparent, transparent 19px, ${color}10 20px)
                    `,
                    backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                }}
            />

            <div className="relative z-10 flex flex-col items-center">

                {}
                <div className="relative mb-8 flex h-[300px] w-[300px] items-center justify-center">

                    {}
                    <div
                        className="absolute h-full w-full rounded-full border border-dashed [animation:spin_20s_linear_infinite]"
                        style={{ borderColor: `${color}40` }}
                    />

                    <div
                        className="absolute h-[85%] w-[85%] rounded-full border-l border-r border-transparent [animation:spinReverse_8s_linear_infinite]"
                        style={{
                            borderTop: `4px solid ${color}`,
                            borderBottom: `4px solid ${color}`,
                            boxShadow: `0 0 20px ${color}40`,
                        }}
                    />

                    <div
                        className="absolute h-[70%] w-[70%] rounded-full border-l-transparent border-r-transparent [animation:spin_4s_linear_infinite]"
                        style={{ border: `2px solid ${color}80`, borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                    />

                    {}
                    <div className="relative h-[100px] w-[100px] [animation:float_3s_ease-in-out_infinite] [transform-style:preserve-3d]">
                         {}
                         <div
                             className="absolute inset-0 rounded-full blur-[10px] [animation:pulse_1.5s_ease-in-out_infinite_alternate]"
                             style={{ background: `radial-gradient(circle at center, ${color}, transparent)` }}
                         />
                         {}
                         <Typography
                            variant="h2"
                            className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 font-bold text-white"
                            style={{ textShadow: `0 0 20px ${color}` }}
                         >
                             {network.identification.symbol[0]}
                         </Typography>
                    </div>

                     {}
                     <div
                         className="absolute top-0 h-0.5 w-[120%] [animation:scan_2s_linear_infinite]"
                         style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                     />

                </div>

                {}
                <Typography
                    variant="h4"
                    className="mb-4 font-black uppercase tracking-[4px] text-white"
                    style={{ textShadow: `0 0 30px ${color}80` }}
                >
                    ESTABLECIENDO ENLACE
                </Typography>

                <div className="mb-2 flex flex-row items-center gap-4">
                    <div
                        className="h-2.5 w-2.5 rounded-full [animation:blink_0.5s_infinite]"
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                    />
                    <Typography variant="h6" className="font-mono" style={{ color }}>
                         PROTOCOL: {network.identification.name.toUpperCase()}
                    </Typography>
                </div>

                <div className="mt-8 w-[300px]">
                    <Typography variant="caption" className="block font-mono text-white/50">
                        ENCRIPTANDO CANAL... [====================]
                    </Typography>
                </div>

            </div>

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spinReverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes pulse {
                    0% { opacity: 0.5; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1.1); }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
}
