'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    alpha: number;
    size: number;
    color: string;
}

export const OperationsCanvasBg = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isPoweredOn, lastInjectionTime } = useAppSelector((state: RootState) => {
        return {
            isPoweredOn: state.reducerLabs.isPoweredOn,
            lastInjectionTime: state.reducerLabs.lastInjectionTime
        };
    }, (prev, next) => {
        return prev.isPoweredOn === next.isPoweredOn && prev.lastInjectionTime === next.lastInjectionTime;
    });
    
    // Mutable state for the animation loop
    const particles = useRef<Particle[]>([]);
    const backgroundThreads = useRef<{y: number, speed: number, alpha: number, width: number}[]>([]);
    const frameId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const currentSpeed = useRef<number>(0);
    const lastInjectedTrigger = useRef<number>(0);

    // Initialize background threads (subtle energy flows)
    useEffect(() => {
        const threads = [];
        for (let i = 0; i < 20; i++) {
            threads.push({
                y: Math.random() * 100, // percentage
                speed: 0.1 + Math.random() * 0.2,
                alpha: 0.2 + Math.random() * 0.3, // Increased alpha
                width: 1.5 + Math.random() * 2 // Increased width
            });
        }
        backgroundThreads.current = threads;
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [shimmerActive, setShimmerActive] = useState(false);

    // Trigger Explosion on Injection
    useEffect(() => {
        if (lastInjectionTime > 0 && lastInjectionTime !== lastInjectedTrigger.current) {
            lastInjectedTrigger.current = lastInjectionTime;
            createExplosion();
            setShimmerActive(true);
            const timer = setTimeout(() => {
                setShimmerActive(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [lastInjectionTime]);

    const createExplosion = () => {
        const count = 150;
        const color = '#00f3ff';
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const force = 3 + Math.random() * 12;
            particles.current.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * force,
                vy: Math.sin(angle) * force,
                life: 1.0,
                alpha: 1.0,
                size: 2 + Math.random() * 4,
                color: color
            });
        }
    };

    // Animation Loop
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const animate = (time: number) => {
            if (lastTime.current === 0) lastTime.current = time;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const deltaTime = time - lastTime.current;
            lastTime.current = time;

            // Update Speed (Inertia)
            const targetSpeed = isPoweredOn ? 1.0 : 0.0;
            const acceleration = isPoweredOn ? 0.02 : 0.01;
            if (currentSpeed.current < targetSpeed) {
                currentSpeed.current = Math.min(targetSpeed, currentSpeed.current + acceleration);
            } else if (currentSpeed.current > targetSpeed) {
                currentSpeed.current = Math.max(targetSpeed, currentSpeed.current - acceleration);
            }

            // Clear
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Draw Background Threads
            if (currentSpeed.current > 0.001) {
                backgroundThreads.current.forEach(thread => {
                    const y = (thread.y / 100) * ctx.canvas.height;
                    const xOffset = (time * thread.speed * currentSpeed.current) % (ctx.canvas.width + 800);
                    
                    ctx.beginPath();
                    ctx.lineWidth = thread.width;
                    const gradient = ctx.createLinearGradient(xOffset - 400, y, xOffset, y);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(1, `rgba(0, 243, 255, ${thread.alpha * currentSpeed.current})`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.moveTo(xOffset - 400, y);
                    ctx.lineTo(xOffset, y);
                    ctx.stroke();
                });
            }

            // Update and Draw Particles
            particles.current = particles.current.filter(p => p.life > 0);
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.96; // Friction
                p.vy *= 0.96;
                p.life -= 0.01;
                p.alpha = p.life;

                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            frameId.current = requestAnimationFrame(animate);
        };

        frameId.current = requestAnimationFrame(animate);
        return () => {
            if (frameId.current) cancelAnimationFrame(frameId.current);
        };
    }, [isPoweredOn]);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0, // Above Background overlay (-1)
                    pointerEvents: 'none',
                    opacity: 0.8
                }}
            />
            {shimmerActive && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: 'none',
                            zIndex: 9999,
                            boxShadow: 'inset 0 0 100px rgba(0, 243, 255, 0.4)',
                            border: '4px solid rgba(0, 243, 255, 0.6)',
                            animation: 'pulseShimmer 1.5s ease-out forwards',
                        }}
                    />
                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes pulseShimmer {
                            0% {
                                opacity: 0;
                                box-shadow: inset 0 0 0px rgba(0, 243, 255, 0);
                                border-color: rgba(0, 243, 255, 0);
                            }
                            15% {
                                opacity: 1;
                                box-shadow: inset 0 0 120px rgba(0, 243, 255, 0.5);
                                border-color: rgba(0, 243, 255, 0.8);
                            }
                            100% {
                                opacity: 0;
                                box-shadow: inset 0 0 250px rgba(0, 243, 255, 0);
                                border-color: rgba(0, 243, 255, 0);
                            }
                        }
                    ` }} />
                </>
            )}
        </>
    );
});
