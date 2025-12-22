'use client';

import React from 'react';
import { Box, Typography, Container, Stack, Chip, Button, Divider, Grid } from '@mui/material';
import { ParticleBackground } from '../../../../components/ui/ParticleBackground';
import { ArrowBack, CheckCircle, Warning, VerifiedUser, Speed, Storage } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../../lib/hooks';
import { setSelectedNetwork } from '../../../../lib/features/blockchain/reducer';

export default function NetworkConnectingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { networks } = useAppSelector((state) => state.blockchain);
    const network = networks.find(n => n.id === id);

    React.useEffect(() => {
        if (network) {
            const timer = setTimeout(() => {
                dispatch(setSelectedNetwork({
                    id: network.id,
                    transactionStoreID: network.storeTransactions.transactionStoreID
                }));
                router.push('/');
            }, 8000); 

            return () => clearTimeout(timer);
        }
    }, [network, dispatch, router, id]);

    if (!network) return null;

    const color = network.additionalInfo.color;

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#050505',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            perspective: '1000px'
        }}>
            <ParticleBackground />
            
            <Box className="scene" sx={{ mb: 8, position: 'relative', zIndex: 10 }}>
                <div className="cube-wrapper">
                    <div className="cube">
                        <div className="face front"></div>
                        <div className="face back"></div>
                        <div className="face right"></div>
                        <div className="face left"></div>
                        <div className="face top"></div>
                        <div className="face bottom"></div>
                        
                        {/* Inner generic "core" */}
                        <div className="core"></div>
                    </div>
                </div>
                {/* Floating transaction cubes */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`trans-cube trans-${i}`}></div>
                ))}
            </Box>

            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 2, zIndex: 10, letterSpacing: 2 }}>
                Sincronizando Bloques
            </Typography>
            <Typography variant="body1" sx={{ color: color, zIndex: 10, fontFamily: 'monospace' }}>
                 Validando transacciones en la red {network.identification.name}...
            </Typography>

            <style jsx>{`
                .scene {
                    width: 120px;
                    height: 120px;
                    transform-style: preserve-3d;
                }
                .cube-wrapper {
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    animation: rotate 8s linear infinite;
                }
                .cube {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                }
                .face {
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    border: 2px solid ${color};
                    background: ${color}10;
                    box-shadow: 0 0 15px ${color}40 inset;
                    backdrop-filter: blur(2px);
                }
                .front  { transform: rotateY(0deg) translateZ(60px); }
                .right  { transform: rotateY(90deg) translateZ(60px); }
                .back   { transform: rotateY(180deg) translateZ(60px); }
                .left   { transform: rotateY(-90deg) translateZ(60px); }
                .top    { transform: rotateX(90deg) translateZ(60px); }
                .bottom { transform: rotateX(-90deg) translateZ(60px); }
                
                .core {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px; height: 40px;
                    background: ${color};
                    box-shadow: 0 0 30px ${color};
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite alternate;
                }

                .trans-cube {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: #fff;
                    border: 1px solid ${color};
                    opacity: 0.8;
                    box-shadow: 0 0 10px ${color};
                }
                .trans-0 { top: 0; left: -100px; animation: trans1 4s ease-in-out infinite; }
                .trans-1 { bottom: 0; right: -100px; animation: trans2 5s ease-in-out infinite 0.5s; }
                .trans-2 { top: -80px; right: 0; animation: trans3 6s ease-in-out infinite 1s; }
                .trans-3 { bottom: -80px; left: 0; animation: trans4 4.5s ease-in-out infinite 1.5s; }

                @keyframes rotate {
                    0% { transform: rotateX(0deg) rotateY(0deg); }
                    100% { transform: rotateX(360deg) rotateY(360deg); }
                }
                @keyframes pulse {
                    0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                }
                @keyframes trans1 {
                    0% { transform: translate(0, 0) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translate(160px, 60px) scale(1); opacity: 0; }
                }
                @keyframes trans2 {
                    0% { transform: translate(0, 0) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translate(-160px, -60px) scale(1); opacity: 0; }
                }
                @keyframes trans3 {
                    0% { transform: translate(0, 0) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translate(0, 200px) scale(1); opacity: 0; }
                }
                @keyframes trans4 {
                    0% { transform: translate(0, 0) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translate(0, -200px) scale(1); opacity: 0; }
                }
            `}</style>
        </Box>
    );
}

