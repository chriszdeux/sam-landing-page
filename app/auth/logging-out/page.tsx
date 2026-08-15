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
import { useRouter } from 'next/navigation';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppDispatch } from '../../../lib/hooks';
import { logout } from '../../../lib/features/auth';
import { Background } from '../../../components/layout/Background';
import { TechFrame } from '../../../components/ui/TechFrame';
import { Typography } from '../../../components/ui/Typography';
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
        <div className="relative min-h-screen overflow-hidden bg-black">
            <Background />
            <canvas
                ref={canvasRef}
                className="absolute left-0 top-0 z-[1] opacity-[0.15]"
            />

            <div className="relative z-[2] mx-auto flex h-screen w-full max-w-[600px] items-center justify-center px-4">
                <TechFrame color="#ff0055">
                    <div className="p-12 text-center backdrop-blur-md" style={{ backgroundColor: 'rgba(10, 5, 15, 0.9)' }}>
                        <div className="relative mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center">
                             <div className="absolute h-full w-full rounded-full border border-dashed border-[#ff0055] [animation:spin_8s_linear_infinite]" />
                            <LogOut size={40} color="#ff0055" />
                        </div>

                        <Typography variant="h4" className="mb-4 font-bold tracking-[4px] text-white [text-shadow:0_0_20px_rgba(255,0,85,0.5)]">
                            DISCONNECTING
                        </Typography>

                        <Typography variant="overline" component="p" className="mb-6 block tracking-[6px] text-[#ff0055]">
                            {'// SECURE_TERMINATION_PROTOCOL'}
                        </Typography>

                        <div className="relative h-0.5 w-full overflow-hidden bg-white/5">
                            <div className="absolute top-0 h-full w-[30%] bg-[#ff0055] shadow-[0_0_10px_#ff0055] [animation:loading_2s_infinite_ease-in-out]" style={{ left: '-30%' }} />
                        </div>

                        <Typography variant="caption" component="p" className="mt-8 block font-mono text-foreground-muted">
                            Sincronizando estados locales... [DONE]
                            <br />
                            Cerrando túneles de encriptación... [DONE]
                            <br />
                            Liberando memoria volátil... [WAIT]
                        </Typography>
                    </div>
                </TechFrame>
            </div>

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
        </div>
    );
}
