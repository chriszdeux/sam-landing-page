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

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let electricPaths: { path: Particle[]; life: number }[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: -1000, y: -1000 }; // Start off-screen

    // Configuration
    const particleCount = Math.min(200, Math.floor((width * height) / 8000)); // Increased density
    const connectionDistance = 150;
    const mouseRadius = 300; // Radius of influence
    const colors = ['#00f3ff', '#ff0055']; // Cyan and Pink

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
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(200, Math.floor((width * height) / 8000));
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      // Update and draw particles
      particles.forEach((p) => {
        // Suspended floating movement
        // Add slight mouse interactions (gentle push)
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < 200) {
            const force = (200 - distMouse) / 200;
            // Gentle repulsion to feel "suspended" in fluid
            p.vx -= (dxMouse / distMouse) * force * 0.05;
            p.vy -= (dyMouse / distMouse) * force * 0.05;
        }

        // Friction
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 0;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Draw connections
        for (let j = 0; j < particles.length; j++) {
            // Optimization: only check some particles or use spatial partition (skip for now, just limiting count)
            const p2 = particles[j];
            if (p === p2) continue;

            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
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
      });

      // Electric Effects Logic
      // Spawn new bolt occasionally
      if (Math.random() < 0.05) { // 5% chance per frame
        const startIdx = Math.floor(Math.random() * particles.length);
        const startParticle = particles[startIdx];
        const path: Particle[] = [startParticle];
        let current = startParticle;

        // Chain 2-4 particles
        const chainLength = Math.floor(Math.random() * 3) + 2;
        for (let k = 0; k < chainLength; k++) {
          // Find closest neighbor not in path
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

      // Draw and update electric paths
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'white';

      for (let i = electricPaths.length - 1; i >= 0; i--) {
        const bolt = electricPaths[i];
        bolt.life -= 0.1; // Fade out speed

        if (bolt.life <= 0) {
          electricPaths.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.life})`;
        ctx.lineWidth = 2 * bolt.life;

        ctx.moveTo(bolt.path[0].x, bolt.path[0].y);
        for (let k = 1; k < bolt.path.length; k++) {
          // Add a little jitter for "electric" look
          const p1 = bolt.path[k - 1];
          const p2 = bolt.path[k];
          const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 10;
          const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 10;

          ctx.lineTo(midX, midY);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // Reset shadow

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
        zIndex: -2, // Moved further back to allow overlay to sit at -1
        bgcolor: '#0a0a1a', 
      }}
    />
    <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1, // On top of canvas
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darkened overlay
          pointerEvents: 'none',
        }}
    />
    </>
  );
};
