"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Paper, Autocomplete, TextField, Fade, Button, CircularProgress } from "@mui/material";
import { ZoomIn, ZoomOut, ArrowBack, Explore, ErrorOutline } from "@mui/icons-material";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const { galaxies, systems, planets, loading, error } = useAppSelector((state) => state.space);

  const [viewLevel, setViewLevel] = useState<ViewLevel>('GALAXY');
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<any | null>(null);

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
  const lastSpawn = useRef<Record<string, number>>({});

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

          ctx.fillStyle = "white";
          ctx.font = "bold 14px monospace";
          ctx.textAlign = "center";
          ctx.fillText(g.name, px, py + 180);
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

          ctx.fillStyle = "white";
          ctx.font = "12px monospace";
          ctx.textAlign = "center";
          ctx.fillText(s.name, px, py + 40);
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

          ctx.beginPath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1 / currentZoom.current;
          ctx.ellipse(0, 0, orbitDistance, orbitDistance * 0.6, 0, 0, Math.PI * 2);
          ctx.stroke();

          const currentAngle = orbitAngle + time * (1 / orbitIndex);
          const px = Math.cos(currentAngle) * orbitDistance;
          const py = Math.sin(currentAngle) * orbitDistance * 0.6;

          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.ellipse(px, py + 8, 15, 15 * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();

          const visualRadio = 10 + (Math.log10(p.radius || 5) * 10);
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

          ctx.fillStyle = "white";
          ctx.font = `${12 / currentZoom.current}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(p.name, px, py + 25 / currentZoom.current);
          
          if (selectedPlanet?.id === p.id) {
             ctx.beginPath();
             ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
             ctx.lineWidth = 2 / currentZoom.current;
             ctx.arc(px, py, 22, 0, Math.PI * 2);
             ctx.stroke();
          }
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
    if (!isDragging) return;
    setTargetOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
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
        style={{ cursor: isDragging ? 'grabbing' : 'grab', width: '100%', height: '100%' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <Paper sx={{ position: 'absolute', top: 20, left: 20, p: 2, bgcolor: 'rgba(5, 5, 20, 0.8)', backdropFilter: 'blur(10px)', width: 300, border: '1px solid rgba(0, 240, 255, 0.2)' }}>
        <Typography variant="h6" sx={{ color: '#00F0FF', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Explore /> Explorador Galáctico
          {loading && <CircularProgress size={20} sx={{ ml: 'auto', color: '#00F0FF' }} />}
        </Typography>

        {error && (
          <Typography variant="caption" sx={{ color: '#ff4d4d', mb: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255, 0, 0, 0.1)', p: 1, borderRadius: 1 }}>
            <ErrorOutline fontSize="small" /> Pérdida de señal con la red galáctica.
          </Typography>
        )}

        {viewLevel !== 'GALAXY' && (
          <Button 
            startIcon={<ArrowBack />} 
            sx={{ mb: 2, color: '#00F0FF' }}
            onClick={() => {
              if (viewLevel === 'PLANET') {
                  setViewLevel('SYSTEM');
                  setTargetZoom(1.2);
              }
              else if (viewLevel === 'SYSTEM') {
                  setViewLevel('GALAXY');
                  setTargetZoom(1);
              }
              setSelectedPlanet(null);
              setTargetOffset({ x: 0, y: 0 });
            }}
          >
            Atrás
          </Button>
        )}

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
          renderInput={(params) => <TextField {...params} label="Galaxia" size="small" sx={{ '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(0, 240, 255, 0.2)' } } }} />}
          sx={{ mb: 2 }}
        />

        <Fade in={viewLevel !== 'GALAXY'}>
          <Box>
            <Autocomplete
              options={systems[selectedGalaxy || ''] || []}
              getOptionLabel={(option) => option.name}
              value={(systems[selectedGalaxy || ''] || []).find(s => s.id === selectedSystem) || null}
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedSystem(newValue.id);
                  setViewLevel('PLANET');
                  setTargetZoom(1.5);
                  setTargetOffset({ x: 0, y: 0 });
                }
              }}
              renderInput={(params) => <TextField {...params} label="Sistema Solar" size="small" sx={{ '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(0, 240, 255, 0.2)' } } }} />}
              sx={{ mb: 2 }}
            />
          </Box>
        </Fade>

        <Fade in={viewLevel === 'PLANET'}>
          <Box>
            <Autocomplete
              options={planets[selectedSystem || ''] || []}
              getOptionLabel={(option) => option.name}
              value={selectedPlanet}
              onChange={(_, newValue) => {
                setSelectedPlanet(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Planeta" size="small" sx={{ '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(0, 240, 255, 0.2)' } } }} />}
            />
          </Box>
        </Fade>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          <IconButton onClick={() => setTargetZoom(z => Math.max(z - 0.2, 0.2))} sx={{ color: 'white' }}><ZoomOut /></IconButton>
          <IconButton onClick={() => setTargetZoom(z => Math.min(z + 0.2, 5))} sx={{ color: 'white' }}><ZoomIn /></IconButton>
        </Box>
      </Paper>

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
