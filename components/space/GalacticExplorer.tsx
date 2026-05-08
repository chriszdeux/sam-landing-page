"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Paper, Autocomplete, TextField, Fade, Button, CircularProgress } from "@mui/material";
import { ZoomIn, ZoomOut, ArrowBack, Explore, ErrorOutline, DeleteSweep } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchGalaxies, fetchSystemsByGalaxy, fetchPlanetsBySystem } from "@/lib/features/space/actions";
import PlanetCanvas from "./PlanetCanvas";

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

export default function GalacticExplorer() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const { galaxies, systems, planets, loading, error } = useAppSelector((state) => state.space);

  const [viewLevel, setViewLevel] = useState<ViewLevel>('GALAXY');
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<any | null>(null);
  const [hoveredObject, setHoveredObject] = useState<{ id: string; type: ViewLevel } | null>(null);

  // Cinematic movement
  const [targetZoom, setTargetZoom] = useState(1);
  const [targetOffset, setTargetOffset] = useState({ x: 0, y: 0 });
  const currentZoom = useRef(1);
  const currentOffset = useRef({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const clickStart = useRef({ x: 0, y: 0 });

  // Parallax Galactic Particles
  const particles = useRef(
    Array.from({ length: 1200 }, () => ({
      x: (Math.random() - 0.5) * 6000,
      y: (Math.random() - 0.5) * 6000,
      depth: Math.random() * 0.8 + 0.2,
      size: Math.random() * 2 + 0.5,
      color: `rgba(${200 + Math.random() * 55}, ${220 + Math.random() * 35}, 255, ${Math.random() * 0.3 + 0.1})`
    }))
  ).current;

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

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#050514";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      currentZoom.current += (targetZoom - currentZoom.current) * 0.08;
      currentOffset.current.x += (targetOffset.x - currentOffset.current.x) * 0.08;
      currentOffset.current.y += (targetOffset.y - currentOffset.current.y) * 0.08;

      const cw = canvas.width / 2;
      const ch = canvas.height / 2;

      ctx.save();
      ctx.translate(cw, ch);
      ctx.scale(currentZoom.current, currentZoom.current); 

      particles.forEach(p => {
         ctx.beginPath();
         const px = p.x + currentOffset.current.x * p.depth * 0.5;
         const py = (p.y + currentOffset.current.y * p.depth * 0.5) * 0.6;
         
         ctx.fillStyle = p.color;
         ctx.arc(px, py, p.size / currentZoom.current, 0, Math.PI * 2);
         ctx.fill();
      });

      ctx.translate(currentOffset.current.x, currentOffset.current.y);

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
        galaxies.forEach((g, index) => {
          const px = Math.sin(index * 13.5) * 800;
          const py = Math.cos(index * 21.2) * 800 * 0.6;
          
          const gid = g.id;
          const galaxyTiltAngle = Math.sin(index * 7.4) * 0.4;
          const cosT = Math.cos(galaxyTiltAngle);
          const sinT = Math.sin(galaxyTiltAngle);

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

          // Pulsating hover/selection effect - DRAWN BEHIND
          if (hoveredObject?.id === g.id || selectedGalaxy === g.id) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
            const intensity = 0.5 + 0.5 * pulse;
            
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${intensity})`;
            ctx.lineWidth = 8 / currentZoom.current;
            ctx.shadowBlur = 40 * intensity;
            ctx.shadowColor = "#00F0FF";
            // Slightly larger than the galaxy gradient to be visible behind
            ctx.ellipse(px, py, 310, 310 * 0.35, galaxyTiltAngle, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

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

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.font = `bold ${26 / currentZoom.current}px 'Geist Sans', sans-serif`;
          ctx.textAlign = "center";
          // Multi-layer shadow for maximum visibility
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(0,0,0,1)";
          ctx.strokeStyle = "rgba(0,0,0,0.9)";
          ctx.lineWidth = 6 / currentZoom.current;
          ctx.strokeText(g.name, px, py + 230 / currentZoom.current);
          ctx.fillText(g.name, px, py + 230 / currentZoom.current);
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
        currentSystems.forEach((s) => {
          const px = (s.coordinates?.x || 0) * 10;
          const py = (s.coordinates?.y || 0) * 10 * 0.6;

          // Pulsating hover/selection effect - DRAWN BEHIND
          if (hoveredObject?.id === s.id || selectedSystem === s.id) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
            const intensity = 0.6 + 0.4 * pulse;
            
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${intensity})`;
            ctx.lineWidth = 6 / currentZoom.current;
            ctx.shadowBlur = 35 * intensity;
            ctx.shadowColor = "#00F0FF";
            ctx.arc(px, py, 40, 0, Math.PI * 2);
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

          ctx.save();
          ctx.fillStyle = "white";
          ctx.font = `bold ${24 / currentZoom.current}px 'Geist Sans', sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(0,0,0,1)";
          ctx.strokeStyle = "rgba(0,0,0,0.9)";
          ctx.lineWidth = 5 / currentZoom.current;
          ctx.strokeText(s.name, px, py + 65 / currentZoom.current);
          ctx.fillText(s.name, px, py + 65 / currentZoom.current);
          ctx.restore();
        });
      }

      if (viewLevel === 'PLANET' && selectedSystem) {
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

        currentPlanets.forEach((p: any, i) => {
          const orbitIndex = p.orbitIndex !== undefined ? p.orbitIndex : i + 1;
          const orbitDistance = p.orbitDistance !== undefined ? p.orbitDistance : 120 + orbitIndex * 100;
          const orbitAngle = p.orbitAngle !== undefined ? p.orbitAngle : (i * Math.PI) / 2;

          const currentAngle = orbitAngle + time * (1 / orbitIndex);
          const px = Math.cos(currentAngle) * orbitDistance;
          const py = Math.sin(currentAngle) * orbitDistance * 0.6;
          const visualRadio = 10 + (Math.log10(p.radius || 5) * 10);

          // Pulsating hover/selection effect - DRAWN BEHIND
          if (selectedPlanet?.id === p.id || hoveredObject?.id === p.id) {
             const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 250);
             const intensity = 0.7 + 0.3 * pulse;
             
             ctx.save();
             ctx.beginPath();
             ctx.strokeStyle = selectedPlanet?.id === p.id ? "rgba(0, 240, 255, 1)" : `rgba(0, 240, 255, ${intensity})`;
             ctx.lineWidth = 7 / currentZoom.current;
             ctx.shadowBlur = 30 * intensity;
             ctx.shadowColor = "#00F0FF";
             ctx.arc(px, py, visualRadio + 15, 0, Math.PI * 2);
             ctx.stroke();
             ctx.restore();
          }

          ctx.beginPath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1 / currentZoom.current;
          ctx.ellipse(0, 0, orbitDistance, orbitDistance * 0.6, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.ellipse(px, py + 8, 15, 15 * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          const pColor = `hsl(${p.terrainHue}, 80%, 50%)`;
          
          // Selection Halo [RESTORED]
          const halo = ctx.createRadialGradient(px, py, visualRadio * 0.8, px, py, visualRadio * 1.6);
          halo.addColorStop(0, pColor);
          halo.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = halo;
          ctx.globalAlpha = 0.3;
          ctx.arc(px, py, visualRadio * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Planet Sphere with basic shading [RESTORED SHADING]
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

          // Rim lighting for small planets
          if (p.atmosphere > 0) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.oceanHue || 200}, 100%, 80%, 0.3)`;
            ctx.lineWidth = 2 / currentZoom.current;
            ctx.arc(px, py, visualRadio, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Orbital Particles [RESTORED]
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

          ctx.save();
          ctx.fillStyle = "white";
          ctx.font = `bold ${22 / currentZoom.current}px 'Geist Sans', sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(0,0,0,1)";
          ctx.strokeStyle = "rgba(0,0,0,0.9)";
          ctx.lineWidth = 4 / currentZoom.current;
          const textY = py + (visualRadio + 30) / currentZoom.current;
          ctx.strokeText(p.name, px, textY);
          ctx.fillText(p.name, px, textY);
          ctx.restore();
        });
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewLevel, galaxies, systems, planets, selectedGalaxy, selectedSystem, selectedPlanet, targetZoom, targetOffset]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.2;
    if (e.deltaY < 0) {
      setTargetZoom((z) => Math.min(z + zoomFactor, 5));
    } else {
      setTargetZoom((z) => Math.max(z - zoomFactor, 0.2));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    clickStart.current = { x: e.clientX, y: e.clientY };
    setDragStart({ x: e.clientX - targetOffset.x, y: e.clientY - targetOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cw = canvas.width / 2;
    const ch = canvas.height / 2;

    const wrldX = (mouseX - cw) / currentZoom.current - currentOffset.current.x;
    const wrldY = (mouseY - ch) / currentZoom.current - currentOffset.current.y;

    // Hit detection for hover
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
      for (let s of currentSystems) {
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

    if (isDragging) {
      setTargetOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    
    if (Math.abs(e.clientX - clickStart.current.x) < 5 && Math.abs(e.clientY - clickStart.current.y) < 5) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

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
           setTargetZoom(1.2);
           setTargetOffset({ x: 0, y: 0 });
        }
      } 
      else if (viewLevel === 'SYSTEM' && selectedGalaxy) {
        let hit = null;
        const currentSystems = systems[selectedGalaxy] || [];
        for (let s of currentSystems) {
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
           setTargetZoom(1.5);
           setTargetOffset({ x: 0, y: 0 });
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
        style={{ cursor: isDragging ? 'grabbing' : (hoveredObject ? 'pointer' : 'grab'), width: '100%', height: '100%' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* TOP NAVIGATION BAR - New Design based on user sketch */}
      <Box sx={{ 
        position: 'absolute', 
        top: 30, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000,
        px: 4
      }}>
        {/* Regresar Button */}
        <Box sx={{ position: 'absolute', left: 40 }}>
          <Button 
            variant="outlined" 
            onClick={() => router.back()}
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'lowercase', 
              borderColor: 'rgba(0, 240, 255, 0.4)',
              color: '#00F0FF',
              px: 4,
              py: 1,
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: '#00F0FF',
                bgcolor: 'rgba(0, 240, 255, 0.1)'
              }
            }}
          >
            regresar
          </Button>
        </Box>

        {/* Central Search Container */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 3, 
          bgcolor: 'rgba(5, 5, 20, 0.5)', 
          backdropFilter: 'blur(15px)', 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 1.5,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Galaxy Selector */}
          <Autocomplete
            options={galaxies}
            getOptionLabel={(option) => option.name}
            value={galaxies.find(g => g.id === selectedGalaxy) || null}
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedGalaxy(newValue.id);
                setViewLevel('SYSTEM');
                setTargetZoom(1.5);
                setTargetOffset({ x: 0, y: 0 });
              }
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="galaxia" 
                variant="standard"
                InputProps={{ 
                  ...params.InputProps, 
                  disableUnderline: true,
                  sx: { 
                    color: 'white', 
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    '& input': { textAlign: 'center' }
                  }
                }}
                sx={{ width: 160 }}
              />
            )}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              px: 2,
              py: 0.5,
              '&:hover': { borderColor: 'rgba(0, 240, 255, 0.4)' }
            }}
          />

          {/* System Selector */}
          <Autocomplete
            options={systems[selectedGalaxy || ''] || []}
            getOptionLabel={(option) => option.name}
            value={(systems[selectedGalaxy || ''] || []).find(s => s.id === selectedSystem) || null}
            disabled={!selectedGalaxy}
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedSystem(newValue.id);
                setViewLevel('PLANET');
                setTargetZoom(1.5);
                setTargetOffset({ x: 0, y: 0 });
              }
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="sistema solar" 
                variant="standard"
                InputProps={{ 
                  ...params.InputProps, 
                  disableUnderline: true,
                  sx: { 
                    color: 'white', 
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    '& input': { textAlign: 'center' }
                  }
                }}
                sx={{ width: 160 }}
              />
            )}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              px: 2,
              py: 0.5,
              '&:hover': { borderColor: 'rgba(0, 240, 255, 0.4)' }
            }}
          />

          {/* Planet Selector */}
          <Autocomplete
            options={planets[selectedSystem || ''] || []}
            getOptionLabel={(option) => option.name}
            value={selectedPlanet}
            disabled={!selectedSystem}
            onChange={(_, newValue) => {
              setSelectedPlanet(newValue);
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="planeta" 
                variant="standard"
                InputProps={{ 
                  ...params.InputProps, 
                  disableUnderline: true,
                  sx: { 
                    color: 'white', 
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    '& input': { textAlign: 'center' }
                  }
                }}
                sx={{ width: 160 }}
              />
            )}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              px: 2,
              py: 0.5,
              '&:hover': { borderColor: 'rgba(0, 240, 255, 0.4)' }
            }}
          />

          {/* Reset Button - Integrated text button for clarity */}
          <Button
            onClick={() => {
              setSelectedGalaxy(null);
              setSelectedSystem(null);
              setSelectedPlanet(null);
              setViewLevel('GALAXY');
              setTargetZoom(1);
              setTargetOffset({ x: 0, y: 0 });
            }}
            startIcon={<DeleteSweep />}
            sx={{ 
              color: 'rgba(255,255,255,0.5)', 
              textTransform: 'lowercase',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              ml: 1,
              px: 2,
              borderRadius: '12px',
              transition: 'all 0.3s',
              '&:hover': { 
                color: '#ff4d4d', 
                bgcolor: 'rgba(255, 77, 77, 0.1)',
              } 
            }}
          >
            limpiar
          </Button>
        </Box>

        {/* Zoom Controls - Moved to corner or kept discrete */}
        <Box sx={{ position: 'absolute', right: 40, display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setTargetZoom(z => Math.max(z - 0.2, 0.2))} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#00F0FF' } }}><ZoomOut /></IconButton>
          <IconButton onClick={() => setTargetZoom(z => Math.min(z + 0.2, 5))} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#00F0FF' } }}><ZoomIn /></IconButton>
        </Box>
      </Box>

      {selectedPlanet && (
        <Fade in={true}>
          <Paper sx={{ position: 'absolute', bottom: 20, right: 20, p: 3, bgcolor: 'rgba(5, 5, 20, 0.9)', backdropFilter: 'blur(20px)', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
             <Typography variant="h5" sx={{ color: '#00F0FF', mb: 1 }}>{selectedPlanet.name}</Typography>
             <Typography variant="caption" sx={{ color: '#808191', mb: 3 }}>{selectedPlanet.type} | Pop: {selectedPlanet.population || 0}</Typography>
             <PlanetCanvas 
                animate 
                seed={selectedPlanet.seed} 
                size={250} 
                terrainHue={selectedPlanet.terrainHue} 
                oceanHue={selectedPlanet.oceanHue}
                faunaHue={selectedPlanet.faunaHue}
                cloudHue={selectedPlanet.cloudHue}
                radius={selectedPlanet.radius}
                hasRings={selectedPlanet.hasRings}
                biome={selectedPlanet.biome} 
                type={selectedPlanet.type} 
                atmosphere={parseInt(selectedPlanet.atmosphere) || 50}
             />
          </Paper>
        </Fade>
      )}
    </Box>
  );
}
