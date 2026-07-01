// 1-Definir componente de fondo de partículas canvas
// 2-Inicializar y dibujar partículas y conexiones
// 3-Renderizar elemento canvas

//# 1-Definir componente de fondo de partículas canvas
'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface HexParticle {
  x: number;
  y: number;
  vy: number;
  text: string;
  size: number;
  opacity: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //# 2-Inicializar y dibujar partículas y conexiones
  useEffect(function initParticleSystem() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let hexParticles: HexParticle[] = [];
    const electricPaths: { path: Particle[]; life: number }[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const mouse = { x: -1000, y: -1000 };
    let time = 0;

    const connectionDistance = 150;
    const colors = ['#00f3ff', '#ff0055'];
    const hexChars = '0123456789ABCDEF';

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
      initHexParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const initHexParticles = () => {
      hexParticles = [];
      const count = Math.min(35, Math.floor(width / 45));
      for (let i = 0; i < count; i++) {
        const hexVal = '0x' + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
        hexParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -(Math.random() * 0.4 + 0.15),
          text: hexVal,
          size: Math.random() * 8 + 9, // 9px to 17px
          opacity: Math.random() * 0.05 + 0.02
        });
      }
    };

    const buildGrid = (cellSize: number) => {
      const grid: Map<string, number[]> = new Map();
      for (let i = 0; i < particles.length; i++) {
        const cx = Math.floor(particles[i].x / cellSize);
        const cy = Math.floor(particles[i].y / cellSize);
        const key = `${cx},${cy}`;
        let cell = grid.get(key);
        if (!cell) { cell = []; grid.set(key, cell); }
        cell.push(i);
      }
      return grid;
    };

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // 1. Inyección de Malla de Datos Dinámica (Grid pulsante)
      const gridSpacing = 120;
      const pulse = Math.sin(time * 0.015) * 0.008 + 0.015;
      ctx.strokeStyle = `rgba(0, 243, 255, ${pulse})`;
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Flujo de Micro-Código Atenuado (Partículas Hexadecimales)
      for (const hp of hexParticles) {
        hp.y += hp.vy;
        if (hp.y < -20) {
          hp.y = height + 20;
          hp.x = Math.random() * width;
          hp.text = '0x' + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
        }
        ctx.fillStyle = `rgba(0, 243, 255, ${hp.opacity})`;
        ctx.font = `bold ${hp.size}px monospace`;
        ctx.fillText(hp.text, hp.x, hp.y);
      }

      // Update particles positions
      for (const p of particles) {
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        
        if (distMouseSq < 40000) {
            const distMouse = Math.sqrt(distMouseSq);
            const force = (200 - distMouse) / 200;
            p.vx -= (dxMouse / distMouse) * force * 0.05;
            p.vy -= (dyMouse / distMouse) * force * 0.05;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Build spatial grid for connections
      const grid = buildGrid(connectionDistance);
      const drawnPairs = new Set<string>();

      // Draw particles and connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        const cx = Math.floor(p.x / connectionDistance);
        const cy = Math.floor(p.y / connectionDistance);
        for (let gx = cx - 1; gx <= cx + 1; gx++) {
          for (let gy = cy - 1; gy <= cy + 1; gy++) {
            const cell = grid.get(`${gx},${gy}`);
            if (!cell) continue;
            for (const j of cell) {
              if (j <= i) continue;
              const pairKey = i < j ? `${i}-${j}` : `${j}-${i}`;
              if (drawnPairs.has(pairKey)) continue;

              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const distSq = dx * dx + dy * dy;
              const connDistSq = connectionDistance * connectionDistance;

              if (distSq < connDistSq) {
                drawnPairs.add(pairKey);
                const distance = Math.sqrt(distSq);
                ctx.beginPath();
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = 1 - distance / connectionDistance;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
              }
            }
          }
        }
      }

      if (Math.random() < 0.05) {
        const startIdx = Math.floor(Math.random() * particles.length);
        const startParticle = particles[startIdx];
        const path: Particle[] = [startParticle];
        let current = startParticle;

        const chainLength = Math.floor(Math.random() * 3) + 2;
        for (let k = 0; k < chainLength; k++) {
          let closest = null;
          let minDst = connectionDistance;

          for (const p of particles) {
            if (path.includes(p)) continue;
            const dx = current.x - p.x;
            const dy = current.y - p.y;
            const dst = Math.sqrt(dx * dx + dy * dy);
            if (dst < minDst) {
              minDst = dst;
              closest = p;
            }
          }

          if (closest) {
            path.push(closest);
            current = closest;
          } else {
            break;
          }
        }

        if (path.length > 1) {
          electricPaths.push({ path, life: 1.0 });
        }
      }

      ctx.shadowBlur = 15;
      ctx.shadowColor = 'white';

      for (let i = electricPaths.length - 1; i >= 0; i--) {
        const bolt = electricPaths[i];
        bolt.life -= 0.1;

        if (bolt.life <= 0) {
          electricPaths.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.life})`;
        ctx.lineWidth = 2 * bolt.life;

        ctx.moveTo(bolt.path[0].x, bolt.path[0].y);
        for (let k = 1; k < bolt.path.length; k++) {
          const p1 = bolt.path[k - 1];
          const p2 = bolt.path[k];
          const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 10;
          const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 10;

          ctx.lineTo(midX, midY);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  //# 3-Renderizar elemento canvas
  return (
    <>
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        bgcolor: '#05050f',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    />
    <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          pointerEvents: 'none',
        }}
    />
    </>
  );
};
