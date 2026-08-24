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

interface RGB {
    r: number;
    g: number;
    b: number;
}

// Misma convención de severidad térmica que components/laboratorio/LaboratorySimulation.tsx
const NORMAL_RGB: RGB = { r: 0, g: 243, b: 255 };    // #00f3ff
const WARNING_RGB: RGB = { r: 255, g: 183, b: 0 };   // #ffb700
const CRITICAL_RGB: RGB = { r: 255, g: 23, b: 68 };  // #ff1744

const severityFor = (temperature: number, isOverheated: boolean): RGB => {
    if (isOverheated || temperature > 72) return CRITICAL_RGB;
    if (temperature > 60) return WARNING_RGB;
    return NORMAL_RGB;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (a: RGB, b: RGB, t: number): RGB => ({
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
});
const rgbCss = (c: RGB, alpha: number) => `rgba(${c.r | 0}, ${c.g | 0}, ${c.b | 0}, ${alpha})`;

export const OperationsCanvasBg = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isPoweredOn, isOverheated, lastInjectionTime, temperature, efficiency } = useAppSelector((state: RootState) => {
        return {
            isPoweredOn: state.reducerLabs.isPoweredOn,
            isOverheated: state.reducerLabs.isOverheated,
            lastInjectionTime: state.reducerLabs.lastInjectionTime,
            temperature: state.reducerLabs.currentLab?.temperature || 0,
            efficiency: state.reducerLabs.currentLab?.efficiency || 0,
        };
    }, (prev, next) => {
        return (
            prev.isPoweredOn === next.isPoweredOn &&
            prev.isOverheated === next.isOverheated &&
            prev.lastInjectionTime === next.lastInjectionTime &&
            prev.temperature === next.temperature &&
            prev.efficiency === next.efficiency
        );
    });

    // Mutable state for the animation loop
    const particles = useRef<Particle[]>([]);
    const backgroundThreads = useRef<{y: number, speed: number, alpha: number, width: number, jitter: number}[]>([]);
    const frameId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const currentSpeed = useRef<number>(0);
    const currentColor = useRef<RGB>(NORMAL_RGB);
    const lastInjectedTrigger = useRef<number>(0);

    // Initialize background threads (subtle energy flows)
    useEffect(() => {
        const threads = [];
        for (let i = 0; i < 20; i++) {
            threads.push({
                y: Math.random() * 100, // percentage
                speed: 0.1 + Math.random() * 0.2,
                alpha: 0.2 + Math.random() * 0.3, // Increased alpha
                width: 1.5 + Math.random() * 2, // Increased width
                jitter: Math.random() * Math.PI * 2, // fase individual para el temblor en estado crítico
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
    const shimmerColor = severityFor(temperature, isOverheated);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastInjectionTime]);

    const createExplosion = () => {
        const count = 150;
        const c = severityFor(temperature, isOverheated);
        const color = `rgb(${c.r}, ${c.g}, ${c.b})`;
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
            const deltaTime = time - lastTime.current;
            lastTime.current = time;

            // Update Speed (Inertia) - escala con la eficiencia real del laboratorio:
            // un lab a máxima eficiencia se ve más "vivo" que uno apenas encendido.
            const intensity = isPoweredOn ? 0.5 + Math.min(efficiency, 1) * 0.5 : 0;
            const targetSpeed = isOverheated ? intensity * 0.35 : intensity; // el sistema se frena al enfriarse
            const acceleration = isPoweredOn ? 0.02 : 0.01;
            if (currentSpeed.current < targetSpeed) {
                currentSpeed.current = Math.min(targetSpeed, currentSpeed.current + acceleration);
            } else if (currentSpeed.current > targetSpeed) {
                currentSpeed.current = Math.max(targetSpeed, currentSpeed.current - acceleration);
            }

            // Transición suave de color según severidad térmica (cian -> ámbar -> rojo)
            const targetColor = severityFor(temperature, isOverheated);
            currentColor.current = lerpColor(currentColor.current, targetColor, 0.03);
            const col = currentColor.current;

            // Clear
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Draw Background Threads
            if (currentSpeed.current > 0.001) {
                const isCritical = isOverheated || temperature > 72;
                backgroundThreads.current.forEach(thread => {
                    // Temblor/glitch cuando el sistema está en estado crítico
                    const jitterY = isCritical
                        ? Math.sin(time * 0.02 + thread.jitter) * 3
                        : 0;
                    const y = (thread.y / 100) * ctx.canvas.height + jitterY;
                    const xOffset = (time * thread.speed * currentSpeed.current) % (ctx.canvas.width + 800);

                    ctx.beginPath();
                    ctx.lineWidth = thread.width;
                    const gradient = ctx.createLinearGradient(xOffset - 400, y, xOffset, y);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(1, rgbCss(col, thread.alpha * currentSpeed.current));

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
    }, [isPoweredOn, isOverheated, temperature, efficiency]);

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
                            boxShadow: `inset 0 0 100px ${rgbCss(shimmerColor, 0.4)}`,
                            border: `4px solid ${rgbCss(shimmerColor, 0.6)}`,
                            animation: 'pulseShimmer 1.5s ease-out forwards',
                            // @ts-expect-error custom properties consumidas por el keyframe de abajo
                            '--shimmer-color': `${shimmerColor.r}, ${shimmerColor.g}, ${shimmerColor.b}`,
                        }}
                    />
                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes pulseShimmer {
                            0% {
                                opacity: 0;
                                box-shadow: inset 0 0 0px rgba(var(--shimmer-color), 0);
                                border-color: rgba(var(--shimmer-color), 0);
                            }
                            15% {
                                opacity: 1;
                                box-shadow: inset 0 0 120px rgba(var(--shimmer-color), 0.5);
                                border-color: rgba(var(--shimmer-color), 0.8);
                            }
                            100% {
                                opacity: 0;
                                box-shadow: inset 0 0 250px rgba(var(--shimmer-color), 0);
                                border-color: rgba(var(--shimmer-color), 0);
                            }
                        }
                    ` }} />
                </>
            )}
            {/* Alerta continua de sobrecalentamiento: vibrante y persistente mientras dura la emergencia */}
            {isOverheated && (
                <div
                    className="pointer-events-none fixed inset-0 z-[9998] animate-[criticalVignette_1.6s_ease-in-out_infinite]"
                    style={{ boxShadow: 'inset 0 0 140px rgba(255, 23, 68, 0.35)', border: '2px solid rgba(255, 23, 68, 0.5)' }}
                />
            )}
        </>
    );
});

OperationsCanvasBg.displayName = 'OperationsCanvasBg';
