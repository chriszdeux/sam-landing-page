// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Efecto secundario para sincronización del ciclo de vida
// 3-Estructuración y renderizado visual del componente UI
// 4-Efecto secundario para sincronización del ciclo de vida
// 5-Estructuración y renderizado visual del componente UI
// 6-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '../../../components/ui/Typography';

export default function LoggingIn() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);



    //# 2-Efecto secundario para sincronización del ciclo de vida
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);


        //# 3-Estructuración y renderizado visual del componente UI
        return () => clearTimeout(timer);
    }, []);



    //# 4-Efecto secundario para sincronización del ciclo de vida
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


        //# 5-Estructuración y renderizado visual del componente UI
        return () => clearInterval(interval);
    }, []);



    //# 6-Estructuración y renderizado visual del componente UI
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
            <canvas
                ref={canvasRef}
                className="absolute left-0 top-0 opacity-30"
            />

            <div className="relative z-10 text-center">
                <div className="relative mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center">
                    <div className="absolute h-full w-full rounded-full border-2 border-[#00f3ff] [border-top-color:transparent] [animation:spin_1s_linear_infinite]" />
                    <div className="absolute h-[70%] w-[70%] rounded-full border-2 border-[#ff0055] [border-bottom-color:transparent] [animation:spin-reverse_1.5s_linear_infinite]" />
                    <Typography variant="h3" className="font-bold text-white">S</Typography>
                </div>

                <Typography variant="h4" className="mb-1 font-bold tracking-[2px] text-white [text-shadow:0_0_10px_#00f3ff]">
                    ESTABLECIENDO ENLACE
                </Typography>
                <Typography variant="body1" className="font-mono text-[#00f3ff]">
                    DESCIFRANDO CLAVES DE ACCESO...
                </Typography>
            </div>

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
        </div>
    );
}
