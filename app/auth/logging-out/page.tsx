// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Obtención del despachador para emitir acciones al store
// 4-Efecto secundario para sincronización del ciclo de vida
// 5-Estructuración y renderizado visual del componente UI
// 6-Efecto secundario para sincronización del ciclo de vida
// 7-Estructuración y renderizado visual del componente UI
// 8-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppDispatch } from '../../../lib/hooks';
import { logout } from '../../../lib/features/auth';
import { Background } from '../../../components/layout/Background';
import { TechFrame } from '../../../components/ui/TechFrame';
import { LogOut } from 'lucide-react';

export default function LoggingOut() {
    const router = useRouter();
    
    //# 3-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    
    
    //# 4-Efecto secundario para sincronización del ciclo de vida
    useEffect(() => {
        dispatch(logout());
        const timer = setTimeout(() => {
            router.push('/');
        }, 4000);
        
        
        //# 5-Estructuración y renderizado visual del componente UI
        return () => clearTimeout(timer);
    }, [router, dispatch]);

    
    
    //# 6-Efecto secundario para sincronización del ciclo de vida
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ff0055'; 
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        
        
        //# 7-Estructuración y renderizado visual del componente UI
        return () => clearInterval(interval);
    }, []);

    
    
    //# 8-Estructuración y renderizado visual del componente UI
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#000', position: 'relative', overflow: 'hidden' }}>
            <Background />
            <canvas 
                ref={canvasRef} 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    opacity: 0.15,
                    zIndex: 1
                }} 
            />

            <Container maxWidth="sm" sx={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2
            }}>
                <TechFrame color="#ff0055">
                    <Box sx={{ 
                        p: 6, 
                        bgcolor: 'rgba(10, 5, 15, 0.9)', 
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center'
                    }}>
                        <Box sx={{ 
                            position: 'relative', 
                            width: 100, 
                            height: 100, 
                            mx: 'auto', 
                            mb: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                             <Box sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: '1px dashed #ff0055',
                                borderRadius: '50%',
                                animation: 'spin 8s linear infinite'
                            }} />
                            <LogOut size={40} color="#ff0055" />
                        </Box>

                        <Typography variant="h4" sx={{ 
                            color: 'white', 
                            fontWeight: 'bold', 
                            mb: 2, 
                            letterSpacing: 4,
                            textShadow: '0 0 20px rgba(255, 0, 85, 0.5)'
                        }}>
                            DISCONNECTING
                        </Typography>
                        
                        <Typography variant="overline" sx={{ color: '#ff0055', letterSpacing: 6, display: 'block', mb: 3 }}>
                            {'// SECURE_TERMINATION_PROTOCOL'}
                        </Typography>

                        <Box sx={{ width: '100%', height: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                height: '100%', 
                                width: '30%', 
                                bgcolor: '#ff0055',
                                boxShadow: '0 0 10px #ff0055',
                                animation: 'loading 2s infinite ease-in-out'
                            }} />
                        </Box>

                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 4, display: 'block', fontFamily: 'monospace' }}>
                            Sincronizando estados locales... [DONE]
                            <br />
                            Cerrando túneles de encriptación... [DONE]
                            <br />
                            Liberando memoria volátil... [WAIT]
                        </Typography>
                    </Box>
                </TechFrame>
            </Container>

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes loading {
                    0% { left: -30%; }
                    100% { left: 100%; }
                }
            `}</style>
        </Box>
    );
}
