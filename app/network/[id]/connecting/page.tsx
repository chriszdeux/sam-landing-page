// 1-Obtención del despachador para emitir acciones al store
// 2-Obtención del despachador para emitir acciones al store
// 3-Selección de datos desde el estado global de Redux
// 4-Efecto secundario para sincronización del ciclo de vida
// 5-Estructuración y renderizado visual del componente UI
// 6-Estructuración y renderizado visual del componente UI

'use client';

import React, { use } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ParticleBackground } from '../../../../components/ui/ParticleBackground';
import { useRouter } from 'next/navigation';

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
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#000',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <ParticleBackground />
            
            {}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    radial-gradient(circle at center, transparent 0%, #000 90%),
                    repeating-linear-gradient(0deg, transparent, transparent 19px, ${color}10 20px),
                    repeating-linear-gradient(90deg, transparent, transparent 19px, ${color}10 20px)
                `,
                backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {}
                <Box sx={{ position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    
                    {}
                    <Box sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: `1px dashed ${color}40`,
                        borderRadius: '50%',
                        animation: 'spin 20s linear infinite'
                    }} />
                    
                    <Box sx={{
                        position: 'absolute',
                        width: '85%',
                        height: '85%',
                        borderTop: `4px solid ${color}`,
                        borderBottom: `4px solid ${color}`,
                        borderLeft: `1px solid transparent`,
                        borderRight: `1px solid transparent`,
                        borderRadius: '50%',
                        animation: 'spinReverse 8s linear infinite',
                        boxShadow: `0 0 20px ${color}40`
                    }} />

                    <Box sx={{
                        position: 'absolute',
                        width: '70%',
                        height: '70%',
                        border: `2px solid ${color}80`,
                        borderRadius: '50%',
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        animation: 'spin 4s linear infinite'
                    }} />

                    {}
                    <Box sx={{
                        width: 100,
                        height: 100,
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                         {}
                         <Box sx={{
                             position: 'absolute',
                             inset: 0,
                             borderRadius: '50%',
                             background: `radial-gradient(circle at center, ${color}, transparent)`,
                             filter: 'blur(10px)',
                             animation: 'pulse 1.5s ease-in-out infinite alternate'
                         }} />
                         {}
                         <Typography variant="h2" sx={{ 
                             position: 'absolute',
                             top: '50%',
                             left: '50%',
                             transform: 'translate(-50%, -50%)',
                             color: '#fff',
                             fontWeight: 'bold',
                             textShadow: `0 0 20px ${color}`,
                             zIndex: 2
                         }}>
                             {network.identification.symbol[0]}
                         </Typography>
                    </Box>

                     {}
                     <Box sx={{
                         position: 'absolute',
                         width: '120%',
                         height: 2,
                         background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                         animation: 'scan 2s linear infinite',
                         top: 0
                     }} />

                </Box>

                {}
                <Typography variant="h4" sx={{ 
                    color: '#fff', 
                    fontWeight: 900, 
                    mb: 2, 
                    letterSpacing: 4, 
                    textTransform: 'uppercase',
                    textShadow: `0 0 30px ${color}80` 
                }}>
                    ESTABLECIENDO ENLACE
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}`, animation: 'blink 0.5s infinite' }} />
                    <Typography variant="h6" sx={{ color: color, fontFamily: 'monospace' }}>
                         PROTOCOL: {network.identification.name.toUpperCase()}
                    </Typography>
                </Stack>
                
                <Box sx={{ width: 300, mt: 4 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1, fontFamily: 'monospace' }}>
                        ENCRIPTANDO CANAL... [====================]
                    </Typography>
                </Box>

            </Box>

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
        </Box>
    );
}
