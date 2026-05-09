"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Paper, Autocomplete, TextField, Fade, Button, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { ZoomIn, ZoomOut, ArrowBack, Explore, ErrorOutline, DeleteSweep, Menu } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchGalaxies, fetchSystemsByGalaxy, fetchPlanetsBySystem } from "@/lib/features/space/actions";
import { Galaxy, SolarSystem, Planet } from "@/lib/features/space/types";
import { keyframes } from '@mui/system';
import PlanetCanvas from "./PlanetCanvas";

const pulseGlow = keyframes`
  0% { border-color: rgba(0, 240, 255, 0.3); box-shadow: 0 0 5px rgba(0, 240, 255, 0.1); }
  50% { border-color: rgba(0, 240, 255, 0.8); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3); }
  100% { border-color: rgba(0, 240, 255, 0.3); box-shadow: 0 0 5px rgba(0, 240, 255, 0.1); }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 10px rgba(0, 240, 255, 0.5); }
  50% { text-shadow: 0 0 25px rgba(0, 240, 255, 0.9), 0 0 40px rgba(0, 240, 255, 0.4); }
  100% { text-shadow: 0 0 10px rgba(0, 240, 255, 0.5); }
`;

type ViewLevel = 'GALAXY' | 'SYSTEM' | 'PLANET';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'SPIRAL' | 'ATMOSPHERE' | 'ORBITAL';
  parentId: string;
}
interface BackgroundParticle {
  x: number;
  y: number;
  depth: number;
  size: number;
  color: string;
}

export default function GalacticExplorer() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dispatch = useAppDispatch();
  const { galaxies, systems, planets, loading, error } = useAppSelector((state) => state.space);

  const [viewLevel, setViewLevel] = useState<ViewLevel>('GALAXY');
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredObject, setHoveredObject] = useState<{ id: string; type: ViewLevel } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Cinematic movement
  const targetZoom = useRef(1);
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentZoom = useRef(1);
  const currentOffset = useRef({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const clickStart = useRef({ x: 0, y: 0 });
  const lastPinchDistance = useRef<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Parallax Galactic Particles
  const [particles] = useState<BackgroundParticle[]>(() => 
    Array.from({ length: isMobile ? 600 : 1200 }, () => ({
      x: (Math.random() - 0.5) * 6000,
      y: (Math.random() - 0.5) * 6000,
      depth: Math.random() * 0.8 + 0.2,
      size: Math.random() * 2 + 0.5,
      color: `rgba(${200 + Math.random() * 55}, ${220 + Math.random() * 35}, 255, ${Math.random() * 0.3 + 0.1})`
    }))
  );

  const dynamicParticles = useRef<Particle[]>([]);
  const lastSpawn = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = hoveredObject ? 'pointer' : 'default';
    }
  }, [hoveredObject]);

  useEffect(() => {
    dispatch(fetchGalaxies());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGalaxy) {
      dispatch(fetchSystemsByGalaxy(selectedGalaxy));
    }
  }, [selectedGalaxy, dispatch]);

  useEffect(() => {
    if (selectedSystem) {
      dispatch(fetchPlanetsBySystem(selectedSystem));
    }
  }, [selectedSystem, dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Deep space background
      ctx.fillStyle = "#050514";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Digital Grid ---
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 100 * currentZoom.current;
      const startX = (currentOffset.current.x * currentZoom.current) % gridSize;
      const startY = (currentOffset.current.y * currentZoom.current) % gridSize;

      for (let x = startX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = startY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();

      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.15;
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.15;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.15;

      const cw = canvas.width / 2;
      const ch = canvas.height / 2;

      ctx.save();
      ctx.translate(cw, ch);
      ctx.scale(currentZoom.current, currentZoom.current); 

      // Starfield parallax
      particles.forEach(p => {
         ctx.beginPath();
         const px = p.x + currentOffset.current.x * p.depth * 0.5;
         const py = (p.y + currentOffset.current.y * p.depth * 0.5) * 0.6;
         
         ctx.fillStyle = p.color;
         ctx.arc(px, py, p.size / currentZoom.current, 0, Math.PI * 2);
         ctx.fill();
      });

      ctx.translate(currentOffset.current.x, currentOffset.current.y);

      // Dynamic Particles (Galactic Dust/Atmosphere)
      dynamicParticles.current = dynamicParticles.current.filter(p => {
         p.x += p.vx;
         p.y += p.vy;
         p.life -= 0.01;
         
         const screenX = (p.x + currentOffset.current.x) * currentZoom.current + cw;
         const screenY = (p.y + currentOffset.current.y) * currentZoom.current + ch;
         if (screenX < -200 || screenX > canvas.width + 200 || screenY < -200 || screenY > canvas.height + 200) return false;

         if (p.life <= 0) return false;

         ctx.beginPath();
         ctx.globalAlpha = p.life * 0.8;
         ctx.fillStyle = p.color;
         ctx.arc(p.x, p.y, p.size / currentZoom.current, 0, Math.PI * 2);
         ctx.fill();
         ctx.globalAlpha = 1.0;
         return true;
      });

      if (viewLevel === 'GALAXY') {
        galaxies.forEach((g: Galaxy, index) => {
          const px = Math.sin(index * 13.5) * 800;
          const py = Math.cos(index * 21.2) * 800 * 0.6;
          
          const gid = g.id;
          const galaxyTiltAngle = Math.sin(index * 7.4) * 0.4;
          const cosT = Math.cos(galaxyTiltAngle);
          const sinT = Math.sin(galaxyTiltAngle);

          // Particle spawn
          if (!lastSpawn.current[gid] || Date.now() - lastSpawn.current[gid] > 160) {
            for (let i = 0; i < 2; i++) {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * 200;
              const swirl = dist * 0.02;
              
              const localX = Math.cos(angle) * dist;
              const localY = Math.sin(angle) * dist * 0.35; 
              
              const localVx = (Math.cos(angle + Math.PI / 2) * swirl + (Math.random() - 0.5)) * 0.08;
              const localVy = (Math.sin(angle + Math.PI / 2) * swirl * 0.35 + (Math.random() - 0.5)) * 0.08;

              const rotX = localX * cosT - localY * sinT;
              const rotY = localX * sinT + localY * cosT;
              const rotVx = localVx * cosT - localVy * sinT;
              const rotVy = localVx * sinT + localVy * cosT;

              dynamicParticles.current.push({
                id: Math.random().toString(36),
                x: px + rotX,
                y: py + rotY,
                vx: rotVx,
                vy: rotVy,
                life: 1.0 + Math.random() * 0.8,
                maxLife: 1.8,
                size: Math.random() * 2 + 1,
                color: `hsla(${index * 40}, 80%, 70%, 0.5)`,
                type: 'SPIRAL',
                parentId: gid
              });
            }
            lastSpawn.current[gid] = Date.now();
          }

          // --- Premium Pulsating Effect ---
          const isSelected = selectedGalaxy === g.id;
          const isHovered = hoveredObject?.id === g.id;
          if (isSelected || isHovered) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
            const intensity = (isSelected ? 1.0 : 0.6) * (0.6 + 0.4 * pulse);
            
            ctx.save();
            ctx.beginPath();
            // Outer soft glow
            ctx.strokeStyle = `rgba(0, 240, 255, ${intensity * 0.15})`;
            ctx.lineWidth = (isSelected ? 40 : 25) / currentZoom.current;
            ctx.shadowBlur = 50 * intensity;
            ctx.shadowColor = "#00F0FF";
            ctx.ellipse(px, py, 330, 330 * 0.35, galaxyTiltAngle, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner subtle core
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${intensity * 0.3})`;
            ctx.lineWidth = (isSelected ? 10 : 5) / currentZoom.current;
            ctx.ellipse(px, py, 330, 330 * 0.35, galaxyTiltAngle, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Galaxy render
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(galaxyTiltAngle);
          ctx.scale(1, 0.35); 
          
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 250);
          gradient.addColorStop(0, `hsla(${index * 40}, 90%, 80%, 0.5)`);
          gradient.addColorStop(0.2, `hsla(${index * 40}, 80%, 70%, 0.15)`);
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(0, 0, 250, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Enhanced Label - LARGE AND PROMINENT
          ctx.save();
          const labelY = py + 100 + (30 / currentZoom.current);
          const fontSize = ((isSelected || isHovered) ? 24 : 20) / currentZoom.current;
          ctx.font = `bold ${fontSize}px 'Geist Sans', sans-serif`;
          ctx.textAlign = "center";
          
          // Shadow/Glow behind text
          ctx.shadowBlur = 10 / currentZoom.current;
          ctx.shadowColor = "#00F0FF";
          
          ctx.fillStyle = (isSelected || isHovered) ? "#00F0FF" : "white";
          ctx.fillText(g.name, px, labelY);
          ctx.restore();
        });
      }

      const getStarColor = (type?: string) => {
        switch (type) {
          case "BLUE_GIANT": return "#4d4dff";
          case "RED_DWARF": return "#ff4d4d";
          case "WHITE_DWARF": return "#ffffff";
          case "NEUTRON_STAR": return "#00ffff";
          default: return "#ffcc00";
        }
      };

      if (viewLevel === 'SYSTEM' && selectedGalaxy) {
        const currentSystems = systems[selectedGalaxy] || [];
        currentSystems.forEach((s: SolarSystem) => {
          const px = (s.coordinates?.x || 0) * 10;
          const py = (s.coordinates?.y || 0) * 10 * 0.6;

          // Pulsating hover/selection effect
          const isSelected = selectedSystem === s.id;
          const isHovered = hoveredObject?.id === s.id;
          if (isSelected || isHovered) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
            const intensity = (isSelected ? 1.0 : 0.7) * (0.6 + 0.4 * pulse);
            
            ctx.save();
            ctx.beginPath();
            // Soft outer glow
            ctx.strokeStyle = `rgba(0, 240, 255, ${intensity * 0.15})`;
            ctx.lineWidth = (isSelected ? 30 : 20) / currentZoom.current;
            ctx.shadowBlur = 40 * intensity;
            ctx.shadowColor = "#00F0FF";
            ctx.arc(px, py, 55, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner subtle core
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${intensity * 0.3})`;
            ctx.lineWidth = (isSelected ? 8 : 4) / currentZoom.current;
            ctx.arc(px, py, 55, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.ellipse(px, py + 8, 20, 20 * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          const sColor = getStarColor(s.starType);
          const sid = s.id;
          if (!lastSpawn.current[sid] || Date.now() - lastSpawn.current[sid] > 300) {
            dynamicParticles.current.push({
              id: Math.random().toString(36),
              x: px + (Math.random() - 0.5) * 45,
              y: py + (Math.random() - 0.5) * 45,
              vx: (Math.random() - 0.5) * 0.2,
              vy: (Math.random() - 0.5) * 0.2,
              life: 1.0,
              maxLife: 1.0,
              size: Math.random() * 2 + 1,
              color: sColor,
              type: 'ATMOSPHERE',
              parentId: sid
            });
            lastSpawn.current[sid] = Date.now();
          }

          ctx.beginPath();
          ctx.fillStyle = sColor;
          ctx.arc(px, py, 20, 0, Math.PI * 2);
          ctx.shadowBlur = 30;
          ctx.shadowColor = sColor;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label for System - LARGE AND PROMINENT
          ctx.save();
          const labelY = py + 30 + (20 / currentZoom.current);
          const fontSize = ((isSelected || isHovered) ? 24 : 20) / currentZoom.current;
          ctx.font = `bold ${fontSize}px 'Geist Sans', sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowBlur = 10 / currentZoom.current;
          ctx.shadowColor = "#00F0FF";
          
          ctx.fillStyle = (isSelected || isHovered) ? "#00F0FF" : "white";
          ctx.fillText(s.name, px, labelY);
          ctx.restore();
        });
      }

      if (viewLevel === 'PLANET' && selectedSystem) {
        // Central Star render
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.ellipse(0, 15, 40, 40 * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        const currentSystemData = (systems[selectedGalaxy || ""] || []).find(s => s.id === selectedSystem);
        const centralStarColor = getStarColor(currentSystemData?.starType);

        const cid = "center_star_" + selectedSystem;
        if (!lastSpawn.current[cid] || Date.now() - lastSpawn.current[cid] > 150) {
            dynamicParticles.current.push({
              id: Math.random().toString(36),
              x: (Math.random() - 0.5) * 90,
              y: (Math.random() - 0.5) * 90,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              life: 1.0,
              maxLife: 1.0,
              size: Math.random() * 3 + 1.5,
              color: centralStarColor,
              type: 'ATMOSPHERE',
              parentId: cid
            });
            lastSpawn.current[cid] = Date.now();
        }

        ctx.beginPath();
        ctx.fillStyle = centralStarColor;
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.shadowBlur = 50;
        ctx.shadowColor = centralStarColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        const currentPlanets = planets[selectedSystem] || [];
        const time = Date.now() / 10000;

        currentPlanets.forEach((p: Planet, i: number) => {
          const orbitIndex = p.orbitIndex !== undefined ? p.orbitIndex : i + 1;
          const orbitDistance = p.orbitDistance !== undefined ? p.orbitDistance : 120 + orbitIndex * 100;
          const orbitAngle = p.orbitAngle !== undefined ? p.orbitAngle : (i * Math.PI) / 2;

          const currentAngle = orbitAngle + time * (1 / orbitIndex);
          const px = Math.cos(currentAngle) * orbitDistance;
          const py = Math.sin(currentAngle) * orbitDistance * 0.6;
          const visualRadio = 10 + (Math.log10(p.radius || 5) * 10);

          // Pulsating effect for Planet
          const isSelected = selectedPlanet?.id === p.id;
          const isHovered = hoveredObject?.id === p.id;
          if (isSelected || isHovered) {
             const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 250);
             const intensity = (isSelected ? 1.0 : 0.7) * (0.7 + 0.3 * pulse);
             
             ctx.save();
             ctx.beginPath();
             // Soft outer glow
             ctx.strokeStyle = `rgba(0, 240, 255, ${intensity * 0.15})`;
             ctx.lineWidth = (isSelected ? 20 : 15) / currentZoom.current;
             ctx.shadowBlur = 30 * intensity;
             ctx.shadowColor = "#00F0FF";
             ctx.arc(px, py, visualRadio + 25, 0, Math.PI * 2);
             ctx.stroke();
             
             // Inner subtle core
             ctx.beginPath();
             ctx.strokeStyle = `rgba(0, 240, 255, ${intensity * 0.3})`;
             ctx.lineWidth = (isSelected ? 6 : 3) / currentZoom.current;
             ctx.arc(px, py, visualRadio + 25, 0, Math.PI * 2);
             ctx.stroke();
             ctx.restore();
          }

          // Orbit path
          ctx.beginPath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 1 / currentZoom.current;
          ctx.ellipse(0, 0, orbitDistance, orbitDistance * 0.6, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Planet body
          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.ellipse(px, py + 8, 15, 15 * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          const pColor = `hsl(${p.terrainHue}, 80%, 50%)`;
          
          const halo = ctx.createRadialGradient(px, py, visualRadio * 0.8, px, py, visualRadio * 1.6);
          halo.addColorStop(0, pColor);
          halo.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = halo;
          ctx.globalAlpha = 0.3;
          ctx.arc(px, py, visualRadio * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;

          const pGradient = ctx.createRadialGradient(
            px - visualRadio * 0.3, py - visualRadio * 0.3, visualRadio * 0.1,
            px, py, visualRadio
          );
          pGradient.addColorStop(0, `hsl(${p.terrainHue}, 90%, 80%)`);
          pGradient.addColorStop(0.5, pColor);
          pGradient.addColorStop(1, `hsl(${p.terrainHue}, 80%, 20%)`);

          ctx.beginPath();
          ctx.fillStyle = pGradient;
          ctx.arc(px, py, visualRadio, 0, Math.PI * 2);
          ctx.fill();

          // Atmosphere ring
          if (p.atmosphere && p.atmosphere > 0) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.oceanHue || 200}, 100%, 80%, 0.3)`;
            ctx.lineWidth = 2 / currentZoom.current;
            ctx.arc(px, py, visualRadio, 0, Math.PI * 2);
            ctx.stroke();
          }

          const pid = p.id;
          if (!lastSpawn.current[pid] || Date.now() - lastSpawn.current[pid] > 400) {
            dynamicParticles.current.push({
              id: Math.random().toString(36),
              x: px + (Math.random() - 0.5) * 40,
              y: py + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 0.1,
              vy: (Math.random() - 0.5) * 0.1,
              life: 0.8,
              maxLife: 0.8,
              size: Math.random() * 1.5 + 0.5,
              color: pColor,
              type: 'ORBITAL',
              parentId: pid
            });
            lastSpawn.current[pid] = Date.now();
          }

          // Planet Label - LARGE AND PROMINENT
          ctx.save();
          const labelY = py + visualRadio + (20 / currentZoom.current);
          const fontSize = ((isSelected || isHovered) ? 22 : 18) / currentZoom.current;
          ctx.font = `bold ${fontSize}px 'Geist Sans', sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowBlur = 10 / currentZoom.current;
          ctx.shadowColor = "#00F0FF";
          
          ctx.fillStyle = (isSelected || isHovered) ? "#00F0FF" : "white";
          ctx.fillText(p.name, px, labelY);
          ctx.restore();
        });
      }

      // --- Scanline Overlay ---
      ctx.restore(); // Restore to screen space
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }
      
      // Subtle vignette
      const vignette = ctx.createRadialGradient(cw, ch, 0, cw, ch, Math.max(cw, ch));
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [viewLevel, selectedGalaxy, selectedSystem, selectedPlanet, galaxies, systems, planets, hoveredObject?.id, isMobile, particles]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.2;
    if (e.deltaY < 0) {
      targetZoom.current = Math.min(targetZoom.current + zoomFactor, 5);
    } else {
      targetZoom.current = Math.max(targetZoom.current - zoomFactor, 0.2);
    }
  };

  const getInteractionPoint = (e: React.MouseEvent | React.TouchEvent | Touch) => {
    if ('clientX' in e) return { x: e.clientX, y: e.clientY };
    const touch = (e as React.TouchEvent).touches[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 1) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      lastPinchDistance.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      return;
    }
    
    setIsDragging(true);
    const point = getInteractionPoint(e);
    if (!point) return;
    clickStart.current = point;
    setDragStart({ x: point.x - targetOffset.current.x, y: point.y - targetOffset.current.y });

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = point.x - rect.left;
      const mouseY = point.y - rect.top;
      const cw = canvas.width / 2;
      const ch = canvas.height / 2;
      const wrldX = (mouseX - cw) / currentZoom.current - currentOffset.current.x;
      const wrldY = (mouseY - ch) / currentZoom.current - currentOffset.current.y;

      let foundHover: { id: string; type: ViewLevel } | null = null;
      if (viewLevel === 'GALAXY') {
        for (let i = 0; i < galaxies.length; i++) {
          const px = Math.sin(i * 13.5) * 800;
          const py = Math.cos(i * 21.2) * 800 * 0.6;
          if (Math.hypot(wrldX - px, wrldY - py) < 200) {
            foundHover = { id: galaxies[i].id, type: 'GALAXY' };
            break;
          }
        }
      } else if (viewLevel === 'SYSTEM' && selectedGalaxy) {
        const currentSystems = systems[selectedGalaxy] || [];
        for (const s of currentSystems) {
          const px = (s.coordinates?.x || 0) * 10;
          const py = (s.coordinates?.y || 0) * 10 * 0.6;
          if (Math.hypot(wrldX - px, wrldY - py) < 40) {
            foundHover = { id: s.id, type: 'SYSTEM' };
            break;
          }
        }
      } else if (viewLevel === 'PLANET' && selectedSystem) {
        const currentPlanets = planets[selectedSystem] || [];
        const time = Date.now() / 10000;
        for (let i = 0; i < currentPlanets.length; i++) {
          const p = currentPlanets[i];
          const orbitIndex = p.orbitIndex !== undefined ? p.orbitIndex : i + 1;
          const orbitDistance = p.orbitDistance !== undefined ? p.orbitDistance : 120 + orbitIndex * 100;
          const orbitAngle = p.orbitAngle !== undefined ? p.orbitAngle : (i * Math.PI) / 2;
          const currentAngle = orbitAngle + time * (1 / orbitIndex);
          const px = Math.cos(currentAngle) * orbitDistance;
          const py = Math.sin(currentAngle) * orbitDistance * 0.6;
          const visualRadio = 10 + (Math.log10(p.radius || 5) * 10);
          if (Math.hypot(wrldX - px, wrldY - py) < visualRadio + 15) {
            foundHover = { id: p.id, type: 'PLANET' };
            break;
          }
        }
      }
      setHoveredObject(foundHover);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if ('touches' in e && e.touches.length > 1) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      
      if (lastPinchDistance.current !== null) {
        const delta = (dist - lastPinchDistance.current) * 0.01;
        targetZoom.current = Math.min(Math.max(targetZoom.current + delta, 0.2), 5);
      }
      lastPinchDistance.current = dist;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const point = getInteractionPoint(e);
    if (!point) return;
    const mouseX = point.x - rect.left;
    const mouseY = point.y - rect.top;

    const cw = canvas.width / 2;
    const ch = canvas.height / 2;

    const wrldX = (mouseX - cw) / currentZoom.current - currentOffset.current.x;
    const wrldY = (mouseY - ch) / currentZoom.current - currentOffset.current.y;

    // Hit detection for hover/touch selection preview
    let foundHover: { id: string; type: ViewLevel } | null = null;

    if (viewLevel === 'GALAXY') {
      for (let i = 0; i < galaxies.length; i++) {
        const px = Math.sin(i * 13.5) * 800;
        const py = Math.cos(i * 21.2) * 800 * 0.6;
        if (Math.hypot(wrldX - px, wrldY - py) < 200) {
          foundHover = { id: galaxies[i].id, type: 'GALAXY' };
          break;
        }
      }
    } else if (viewLevel === 'SYSTEM' && selectedGalaxy) {
      const currentSystems = systems[selectedGalaxy] || [];
      for (const s of currentSystems) {
        const px = (s.coordinates?.x || 0) * 10;
        const py = (s.coordinates?.y || 0) * 10 * 0.6;
        if (Math.hypot(wrldX - px, wrldY - py) < 40) {
          foundHover = { id: s.id, type: 'SYSTEM' };
          break;
        }
      }
    } else if (viewLevel === 'PLANET' && selectedSystem) {
      const currentPlanets = planets[selectedSystem] || [];
      const time = Date.now() / 10000;
      for (let i = 0; i < currentPlanets.length; i++) {
        const p = currentPlanets[i];
        const orbitIndex = p.orbitIndex !== undefined ? p.orbitIndex : i + 1;
        const orbitDistance = p.orbitDistance !== undefined ? p.orbitDistance : 120 + orbitIndex * 100;
        const orbitAngle = p.orbitAngle !== undefined ? p.orbitAngle : (i * Math.PI) / 2;
        const currentAngle = orbitAngle + time * (1 / orbitIndex);
        const px = Math.cos(currentAngle) * orbitDistance;
        const py = Math.sin(currentAngle) * orbitDistance * 0.6;
        const visualRadio = 10 + (Math.log10(p.radius || 5) * 10);

        if (Math.hypot(wrldX - px, wrldY - py) < visualRadio + 15) {
          foundHover = { id: p.id, type: 'PLANET' };
          break;
        }
      }
    }

    setHoveredObject(foundHover);

    if (isDragging && point) {
      targetOffset.current = {
        x: point.x - dragStart.x,
        y: point.y - dragStart.y,
      };
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(false);
    lastPinchDistance.current = null;
    
    const point = ('clientX' in e) ? { x: e.clientX, y: e.clientY } : 
                  (e.changedTouches.length > 0 ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : null);

    if (point && Math.abs(point.x - clickStart.current.x) < 5 && Math.abs(point.y - clickStart.current.y) < 5) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = point.x - rect.left;
      const mouseY = point.y - rect.top;

      const cw = canvas.width / 2;
      const ch = canvas.height / 2;

      const wrldX = (mouseX - cw) / currentZoom.current - currentOffset.current.x;
      const wrldY = (mouseY - ch) / currentZoom.current - currentOffset.current.y;

      if (viewLevel === 'GALAXY') {
        let hit = null;
        for (let i = 0; i < galaxies.length; i++) {
           const g = galaxies[i];
           const px = Math.sin(i * 13.5) * 800;
           const py = Math.cos(i * 21.2) * 800 * 0.6;
           if (Math.hypot(wrldX - px, wrldY - py) < 150) {
             hit = g.id;
             break;
           }
        }
        if (hit) {
           setSelectedGalaxy(hit);
           setViewLevel('SYSTEM');
           targetZoom.current = 1.2;
           targetOffset.current = { x: 0, y: 0 };
        }
      } 
      else if (viewLevel === 'SYSTEM' && selectedGalaxy) {
        let hit = null;
        const currentSystems = systems[selectedGalaxy] || [];
        for (const s of currentSystems) {
           const px = (s.coordinates?.x || 0) * 10;
           const py = (s.coordinates?.y || 0) * 10 * 0.6;
           if (Math.hypot(wrldX - px, wrldY - py) < 20) {
             hit = s.id;
             break;
           }
        }
        if (hit) {
           setSelectedSystem(hit);
           setViewLevel('PLANET');
           targetZoom.current = 1.5;
           targetOffset.current = { x: 0, y: 0 };
        }
      }
      else if (viewLevel === 'PLANET' && selectedSystem) {
        let hit = null;
        const currentPlanets = planets[selectedSystem] || [];
        const time = Date.now() / 10000;
        for (let i = 0; i < currentPlanets.length; i++) {
           const p = currentPlanets[i];
           const orbitIndex = p.orbitIndex !== undefined ? p.orbitIndex : i + 1;
           const orbitDistance = p.orbitDistance !== undefined ? p.orbitDistance : 120 + orbitIndex * 100;
           const orbitAngle = p.orbitAngle !== undefined ? p.orbitAngle : (i * Math.PI) / 2;
           const currentAngle = orbitAngle + time * (1 / orbitIndex);
           
           const px = Math.cos(currentAngle) * orbitDistance;
           const py = Math.sin(currentAngle) * orbitDistance * 0.6;

           if (Math.hypot(wrldX - px, wrldY - py) < 25) {
             hit = p;
             break;
           }
        }
        if (hit) {
           setSelectedPlanet(hit);
        } else {
           setSelectedPlanet(null);
        }
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#050514' }}>
      <canvas
        ref={canvasRef}
        style={{ cursor: isDragging ? 'grabbing' : (hoveredObject ? 'pointer' : 'grab'), width: '100%', height: '100%', touchAction: 'none' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />

      {/* TOP NAVIGATION BAR - Optimized for Mobile/Tablet */}
      <Box sx={{ 
        position: 'absolute', 
        top: isMobile ? 10 : 25, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        zIndex: 1000,
        px: isMobile ? 1.5 : 4,
        pointerEvents: 'none'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          mb: (isMobile && !showMobileMenu) ? 0 : 2,
          pointerEvents: 'auto'
        }}>
          {/* Action Buttons Group */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={() => router.back()}
              sx={{ 
                minWidth: isMobile ? '44px' : 'auto',
                borderRadius: '12px', 
                textTransform: 'lowercase', 
                borderColor: 'rgba(0, 240, 255, 0.4)',
                color: '#00F0FF',
                px: isMobile ? 1 : 3,
                py: 0.8,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                bgcolor: 'rgba(5, 5, 20, 0.85)',
                backdropFilter: 'blur(15px)',
                '&:hover': {
                  borderColor: '#00F0FF',
                  bgcolor: 'rgba(0, 240, 255, 0.1)'
                }
              }}
            >
              <ArrowBack fontSize="small" sx={{ mr: isMobile ? 0 : 1 }} />
              {!isMobile && 'regresar'}
            </Button>

            {viewLevel !== 'GALAXY' && (
              <Button 
                variant="outlined"
                onClick={() => {
                  if (viewLevel === 'PLANET') {
                    setSelectedPlanet(null);
                    setViewLevel('SYSTEM');
                  } else if (viewLevel === 'SYSTEM') {
                    setSelectedSystem(null);
                    setViewLevel('GALAXY');
                  }
                }}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'lowercase',
                  color: '#808191',
                  borderColor: 'rgba(128, 129, 145, 0.4)',
                  px: 2,
                  py: 0.5,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  bgcolor: 'rgba(5, 5, 20, 0.85)',
                  backdropFilter: 'blur(15px)',
                }}
              >
                subir nivel
              </Button>
            )}
          </Box>

          {/* Right Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isMobile && (
              <IconButton 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                sx={{ 
                  bgcolor: showMobileMenu ? 'rgba(0, 240, 255, 0.2)' : 'rgba(5, 5, 20, 0.85)',
                  border: `1px solid ${showMobileMenu ? '#00F0FF' : 'rgba(255,255,255,0.1)'}`,
                  color: showMobileMenu ? '#00F0FF' : 'white',
                  borderRadius: '12px',
                  backdropFilter: 'blur(15px)'
                }}
              >
                <Explore fontSize="small" />
              </IconButton>
            )}

            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                bgcolor: 'rgba(5, 5, 20, 0.85)', 
                p: 0.5, 
                borderRadius: '12px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)'
              }}>
                <IconButton size="small" onClick={() => { targetZoom.current = Math.max(targetZoom.current - 0.2, 0.2); }} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#00F0FF' } }}><ZoomOut fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => { targetZoom.current = Math.min(targetZoom.current + 0.2, 5); }} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#00F0FF' } }}><ZoomIn fontSize="small" /></IconButton>
              </Box>
            )}
          </Box>
        </Box>

        {/* SELECTORS BOX - Toggleable on Mobile */}
        <Fade in={!isMobile || showMobileMenu}>
          <Box sx={{ 
            display: (isMobile && !showMobileMenu) ? 'none' : 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 1.5, 
            bgcolor: 'rgba(5, 5, 20, 0.9)', 
            p: isMobile ? 2 : 1, 
            borderRadius: isMobile ? '24px' : '20px', 
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(0, 240, 255, 0.15)',
            width: isMobile ? '100%' : 'auto',
            maxWidth: '95vw',
            pointerEvents: 'auto',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            mt: isMobile ? 1 : 0
          }}>
            {/* Galaxy Selector */}
            <Autocomplete
              options={galaxies}
              getOptionLabel={(option: Galaxy) => option.name}
              value={galaxies.find(g => g.id === selectedGalaxy) || null}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedGalaxy(newValue.id);
                  setSelectedSystem(null);
                  setSelectedPlanet(null);
                  setViewLevel('SYSTEM');
                  targetZoom.current = 1.2;
                  targetOffset.current = { x: 0, y: 0 };
                  if (isMobile) setShowMobileMenu(false);
                } else {
                  setSelectedGalaxy(null);
                  setViewLevel('GALAXY');
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="seleccionar galaxia" 
                  variant="standard"
                  InputProps={{ 
                    ...params.InputProps, 
                    disableUnderline: true,
                    sx: { 
                      color: 'white', 
                      fontSize: isMobile ? '0.9rem' : '0.9rem',
                      fontFamily: "'Geist Mono', monospace",
                      px: 1.5,
                      py: isMobile ? 1 : 0.5
                    }
                  }}
                />
              )}
              sx={{
                width: isMobile ? '100%' : (isTablet ? 180 : 220),
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: '#00F0FF',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
                },
                '& .Mui-focused': {
                  animation: `${pulseGlow} 2s infinite ease-in-out`
                }
              }}
            />

            {/* System Selector */}
            <Autocomplete
              options={systems[selectedGalaxy || ''] || []}
              getOptionLabel={(option: SolarSystem) => option.name}
              value={(systems[selectedGalaxy || ''] || []).find(s => s.id === selectedSystem) || null}
              disabled={!selectedGalaxy}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedSystem(newValue.id);
                  setSelectedPlanet(null);
                  setViewLevel('PLANET');
                  targetZoom.current = 1.5;
                  targetOffset.current = { x: 0, y: 0 };
                  if (isMobile) setShowMobileMenu(false);
                } else {
                  setSelectedSystem(null);
                  setViewLevel('SYSTEM');
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="seleccionar sistema" 
                  variant="standard"
                  InputProps={{ 
                    ...params.InputProps, 
                    disableUnderline: true,
                    sx: { 
                      color: 'white', 
                      fontSize: isMobile ? '0.9rem' : '0.9rem',
                      fontFamily: "'Geist Mono', monospace",
                      px: 1.5,
                      py: isMobile ? 1 : 0.5
                    }
                  }}
                />
              )}
              sx={{
                width: isMobile ? '100%' : (isTablet ? 180 : 220),
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                opacity: selectedGalaxy ? 1 : 0.4,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: '#00F0FF',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
                },
                '& .Mui-focused': {
                  animation: `${pulseGlow} 2s infinite ease-in-out`
                }
              }}
            />

            {/* Planet Selector */}
            <Autocomplete
              options={planets[selectedSystem || ''] || []}
              getOptionLabel={(option: Planet) => option.name}
              value={selectedPlanet}
              disabled={!selectedSystem}
              onChange={(_, newValue) => {
                setSelectedPlanet(newValue as Planet);
                if (isMobile && newValue) setShowMobileMenu(false);
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="seleccionar planeta" 
                  variant="standard"
                  InputProps={{ 
                    ...params.InputProps, 
                    disableUnderline: true,
                    sx: { 
                      color: 'white', 
                      fontSize: isMobile ? '0.9rem' : '0.9rem',
                      fontFamily: "'Geist Mono', monospace",
                      px: 1.5,
                      py: isMobile ? 1 : 0.5
                    }
                  }}
                />
              )}
              sx={{
                width: isMobile ? '100%' : (isTablet ? 180 : 220),
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                opacity: selectedSystem ? 1 : 0.4,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: '#00F0FF',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
                },
                '& .Mui-focused': {
                  animation: `${pulseGlow} 2s infinite ease-in-out`
                }
              }}
            />

            {/* Reset Button */}
            <Box sx={{ display: 'flex', gap: 1, mt: isMobile ? 1 : 0 }}>
              <IconButton
                onClick={() => {
                  setSelectedGalaxy(null);
                  setSelectedSystem(null);
                  setSelectedPlanet(null);
                  setViewLevel('GALAXY');
                  targetZoom.current = 1;
                  targetOffset.current = { x: 0, y: 0 };
                  if (isMobile) setShowMobileMenu(false);
                }}
                sx={{ 
                  flex: isMobile ? 1 : 'none',
                  color: 'rgba(255,77,77,0.8)', 
                  bgcolor: 'rgba(255, 77, 77, 0.1)',
                  borderRadius: '14px',
                  p: isMobile ? 1.5 : 1,
                  '&:hover': { 
                    color: '#ff4d4d', 
                    bgcolor: 'rgba(255, 77, 77, 0.2)',
                  } 
                }}
              >
                <DeleteSweep fontSize={isMobile ? "medium" : "small"} />
              </IconButton>
              
              {isMobile && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setShowMobileMenu(false)}
                  sx={{
                    flex: 2,
                    borderRadius: '14px',
                    bgcolor: 'rgba(0, 240, 255, 0.2)',
                    color: '#00F0FF',
                    textTransform: 'lowercase',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: 'rgba(0, 240, 255, 0.3)' }
                  }}
                >
                  cerrar
                </Button>
              )}
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* PLANET DETAIL PANEL */}
      {selectedPlanet && (
        <Fade in={true}>
          <Paper sx={{ 
            position: 'absolute', 
            bottom: isMobile ? 0 : 30, 
            right: isMobile ? 0 : 30, 
            left: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : (isTablet ? 340 : 420),
            p: isMobile ? 4 : 4, 
            bgcolor: 'rgba(5, 5, 20, 0.98)', 
            backdropFilter: 'blur(40px)', 
            borderRadius: isMobile ? '35px 35px 0 0' : '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            border: '2px solid rgba(0, 240, 255, 0.4)',
            animation: `${pulseGlow} 4s infinite ease-in-out`,
            boxShadow: '0 -15px 50px rgba(0,0,0,0.7)',
            zIndex: 2000
          }}>
             <Typography variant="h5" sx={{ 
               color: '#00F0FF', 
               mb: 0.5, 
               fontSize: isMobile ? '2rem' : '2.4rem',
               fontWeight: '900',
               letterSpacing: '2px',
               fontFamily: "'Geist Mono', monospace",
               animation: `${textGlow} 3s infinite ease-in-out`,
               textAlign: 'center'
             }}>
               {selectedPlanet.name}
             </Typography>
             
             <Typography variant="caption" sx={{ color: '#808191', mb: 3, letterSpacing: '2px', textTransform: 'uppercase' }}>
               {selectedPlanet.type} // TRANSMISSION_STABLE
             </Typography>

             <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', mb: 3 }}>
                <PlanetCanvas 
                  animate 
                  seed={selectedPlanet.seed} 
                  size={isMobile ? 220 : 280} 
                  terrainHue={selectedPlanet.terrainHue} 
                  oceanHue={selectedPlanet.oceanHue}
                  faunaHue={selectedPlanet.faunaHue}
                  cloudHue={selectedPlanet.cloudHue}
                  radius={selectedPlanet.radius}
                  hasRings={selectedPlanet.hasRings}
                  biome={selectedPlanet.biome || "temperate"} 
                  type={selectedPlanet.type} 
                  atmosphere={selectedPlanet.atmosphere || 50}
                />
             </Box>

             <Box sx={{ width: '100%', mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                   <Typography variant="caption" sx={{ color: '#808191' }}>POBLACIÓN</Typography>
                   <Typography variant="caption" sx={{ color: '#00F0FF', fontWeight: 'bold' }}>{selectedPlanet.population.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                   <Typography variant="caption" sx={{ color: '#808191' }}>ATMÓSFERA</Typography>
                   <Typography variant="caption" sx={{ color: '#00F0FF', fontWeight: 'bold' }}>{selectedPlanet.atmosphere}%</Typography>
                </Box>
             </Box>

             <Button 
               fullWidth 
               variant="outlined" 
               onClick={() => setSelectedPlanet(null)}
               sx={{ 
                 borderRadius: '16px', 
                 color: 'rgba(255,255,255,0.7)', 
                 borderColor: 'rgba(255,255,255,0.1)',
                 py: 1.5,
                 textTransform: 'lowercase',
                 '&:hover': {
                   borderColor: '#ff4d4d',
                   color: '#ff4d4d',
                   bgcolor: 'rgba(255, 77, 77, 0.05)'
                 }
               }}
             >
               finalizar enlace
             </Button>
          </Paper>
        </Fade>
      )}
    </Box>
  );
}
