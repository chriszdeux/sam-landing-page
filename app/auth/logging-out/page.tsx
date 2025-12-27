'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../lib/hooks';
import { logout } from '../../../lib/features/auth';

export default function LoggingOut() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        dispatch(logout());
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router, dispatch]);

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

            ctx.fillStyle = '#ff3333';
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

        const interval = setInterval(draw, 40);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#000', 
            position: 'relative',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
           <canvas 
                ref={canvasRef} 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    opacity: 0.25
                }} 
            />

             <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                 <Box sx={{ 
                    position: 'relative', 
                    width: 120, 
                    height: 120, 
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
                        border: '1px dashed #ff3333',
                        borderRadius: '50%',
                        animation: 'spin 4s linear infinite'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        border: '2px solid #ff3333',
                        borderRadius: '50%',
                        borderLeftColor: 'transparent',
                        animation: 'spin 1s linear infinite'
                    }} />
                     <Typography variant="h3" sx={{ color: '#ff3333', fontWeight: 'bold' }}>X</Typography>
                </Box>

                 <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2, textShadow: '0 0 10px rgba(255,51,51,0.5)', letterSpacing: 3 }}>
                     CERRANDO SESIÓN
                 </Typography>
                 <Typography variant="body1" sx={{ color: '#ff3333', fontFamily: 'monospace' }}>
                     TERMINANDO PROCESOS SEGUROS...
                 </Typography>
             </Box>
             
             <style jsx global>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Box>
    );
}
