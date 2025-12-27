'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoggingIn() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00f3ff';
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

        const interval = setInterval(draw, 33);
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
                    opacity: 0.3 
                }} 
            />
            
            <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
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
                        border: '2px solid #00f3ff',
                        borderRadius: '50%',
                        borderTopColor: 'transparent',
                        animation: 'spin 1s linear infinite'
                    }} />
                     <Box sx={{
                        position: 'absolute',
                        width: '70%',
                        height: '70%',
                        border: '2px solid #ff0055',
                        borderRadius: '50%',
                        borderBottomColor: 'transparent',
                        animation: 'spin-reverse 1.5s linear infinite'
                    }} />
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>S</Typography>
                </Box>

                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1, textShadow: '0 0 10px #00f3ff', letterSpacing: 2 }}>
                    ESTABLECIENDO ENLACE
                </Typography>
                <Typography variant="body1" sx={{ color: '#00f3ff', fontFamily: 'monospace' }}>
                    DESCIFRANDO CLAVES DE ACCESO...
                </Typography>
            </Box>

            <style jsx global>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
            `}</style>
        </Box>
    );
}
