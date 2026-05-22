"use client";

import { useEffect, useRef } from "react";

interface PlanetCanvasProps {
  seed: string;
  size?: number;
  terrainHue?: number;
  oceanHue?: number;
  faunaHue?: number;
  cloudHue?: number;
  radius?: number; // 1 to 10
  hasRings?: boolean;
  biome?: string;
  type?: string;
  atmosphere?: number; // 0 to 100
  animate?: boolean; 
  // Legacy support
  hue?: number;
}

interface TypeConfig {
  scale: number;
  octaves: number;
  threshold: number;
  cloudMultiplier: number;
  featureLevel: number;
}

const TYPE_CONFIGS: Record<string, TypeConfig> = {
  "TERRESTRIAL": { scale: 1.2, octaves: 6, threshold: 0.15, cloudMultiplier: 1.0, featureLevel: 1 },
  "GAS_GIANT": { scale: 0.4, octaves: 2, threshold: -1.0, cloudMultiplier: 1.2, featureLevel: 0 },
  "ICE": { scale: 1.5, octaves: 5, threshold: 0.1, cloudMultiplier: 1.8, featureLevel: 0.5 },
  "ARID": { scale: 0.8, octaves: 3, threshold: 0.2, cloudMultiplier: 0.5, featureLevel: 0.2 },
  "VOLCANIC": { scale: 1.3, octaves: 4, threshold: 0.2, cloudMultiplier: 0.8, featureLevel: 0.8 },
  "DEFAULT": { scale: 1.0, octaves: 4, threshold: 0, cloudMultiplier: 1.0, featureLevel: 0.5 }
};

// 3D Simplex Noise for Seamless Looping (sampling on a cylinder)
const createNoise3D = (seed: string) => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  for (let i = 255; i > 0; i--) {
    hash = (hash * 16807) % 2147483647;
    const j = hash % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];

  const dot = (g: number[], x: number, y: number, z: number) => g[0] * x + g[1] * y + g[2] * z;

  return (x: number, y: number, z: number) => {
    let n0, n1, n2, n3;
    const F3 = 1.0 / 3.0;
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const G3 = 1.0 / 6.0;
    const t = (i + j + k) * G3;
    const X0 = i - t; const Y0 = j - t; const Z0 = k - t;
    const x0 = x - X0; const y0 = y - Y0; const z0 = z - Z0;

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3; const y1 = y0 - j1 + G3; const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3; const y2 = y0 - j2 + 2.0 * G3; const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3; const y3 = y0 - 1.0 + 3.0 * G3; const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255; const jj = j & 255; const kk = k & 255;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0; else { t0 *= t0; n0 = t0 * t0 * dot(grad3[perm[ii + perm[jj + perm[kk]]] % 12], x0, y0, z0); }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0; else { t1 *= t1; n1 = t1 * t1 * dot(grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12], x1, y1, z1); }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0; else { t2 *= t2; n2 = t2 * t2 * dot(grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12], x2, y2, z2); }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0; else { t3 *= t3; n3 = t3 * t3 * dot(grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12], x3, y3, z3); }

    return 32.0 * (n0 + n1 + n2 + n3);
  };
};

const fbm3D = (noise: (x: number, y: number, z: number) => number, x: number, y: number, z: number, octaves = 4) => {
  let value = 0; let amplitude = 0.5; let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise(x * frequency, y * frequency, z * frequency);
    frequency *= 2.0; amplitude *= 0.5;
  }
  return value;
};

export default function PlanetCanvas(props: PlanetCanvasProps) {
  const { 
    seed, size = 300, terrainHue = 30, oceanHue = 200, faunaHue = 120, cloudHue = 0, 
    radius = 5, atmosphere = 50, hasRings = false, biome, type, animate = false 
  } = props;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise3D = createNoise3D(seed);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Scale Radius [T-127]: Logarithmic compression for visibility
    const visualRadius = (size / 2) * (0.4 + (Math.log10(radius) * 0.4));
    
    const pType = type?.toUpperCase() || (biome && (biome.toLowerCase().includes('forest') || biome.toLowerCase().includes('ocean')) ? "TERRESTRIAL" : "DEFAULT");
    const config = TYPE_CONFIGS[pType] || TYPE_CONFIGS["DEFAULT"];
    const resolution = animate ? 3 : 2;

    const getHsl = (h: number, l: number, s = 60) => `hsl(${h}, ${s}%, ${l}%)`;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rot = rotationRef.current;

      // Define a Light Source Direction [NEW]
      // Light comes from the top-left-front
      const lightX = -0.5;
      const lightY = -0.5;
      const lightZ = 0.8;
      const lightLen = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
      const lx_norm = lightX / lightLen;
      const ly_norm = lightY / lightLen;
      const lz_norm = lightZ / lightLen;

      // 0. Atmospheric Outer Glow [T-128] - Premium VFX
      if (atmosphere > 0) {
          const atmosLevel = atmosphere / 100;
          const atmosphereRadius = visualRadius * (1 + atmosLevel * 0.4);
          
          // Outer bloom (Soft diffuse aura)
          const bloomGradient = ctx.createRadialGradient(
            centerX, centerY, visualRadius * 0.8,
            centerX, centerY, atmosphereRadius
          );
          
          const aHue = oceanHue;
          bloomGradient.addColorStop(0, `hsla(${aHue}, 90%, 80%, ${0.6 * atmosLevel})`);
          bloomGradient.addColorStop(0.3, `hsla(${aHue}, 80%, 70%, ${0.3 * atmosLevel})`);
          bloomGradient.addColorStop(1, `hsla(${aHue}, 70%, 60%, 0)`);
          
          ctx.save();
          ctx.fillStyle = bloomGradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, atmosphereRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Atmospheric Scatter (Light-side glow)
          const scatterGradient = ctx.createRadialGradient(
            centerX + lx_norm * visualRadius * 0.6, 
            centerY + ly_norm * visualRadius * 0.6, 
            0,
            centerX, centerY, atmosphereRadius * 1.2
          );
          scatterGradient.addColorStop(0, `hsla(${aHue}, 100%, 95%, ${0.4 * atmosLevel})`);
          scatterGradient.addColorStop(0.4, `hsla(${aHue}, 90%, 85%, ${0.1 * atmosLevel})`);
          scatterGradient.addColorStop(1, 'transparent');
          
          ctx.globalCompositeOperation = "screen";
          ctx.fillStyle = scatterGradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, atmosphereRadius * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
      }

      // 1. Draw Rings if enabled [T-126]
      if (hasRings) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(Math.PI / 8); 
          
          // Main ring body
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${terrainHue}, 60%, 50%, 0.4)`;
          ctx.lineWidth = visualRadius * 0.3;
          ctx.ellipse(0, 0, visualRadius * 1.8, visualRadius * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
          
          // Shadow on rings from planet
          const ringShadow = ctx.createRadialGradient(0, 0, visualRadius, 0, 0, visualRadius * 2);
          ringShadow.addColorStop(0, 'rgba(0,0,0,0.6)');
          ringShadow.addColorStop(0.5, 'rgba(0,0,0,0)');
          ctx.strokeStyle = ringShadow;
          ctx.stroke();
          
          ctx.restore();
      }

      // 2. Draw Planet Sphere
      const cosRot = Math.cos(rot);
      const sinRot = Math.sin(rot);

      for (let lx = 0; lx < size; lx += resolution) {
        for (let ly = 0; ly < size; ly += resolution) {
          const dx = lx - centerX;
          const dy = ly - centerY;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist <= visualRadius) {
            // Normal Vector for the sphere
            const nx = dx / visualRadius;
            const ny = dy / visualRadius;
            const nz = Math.sqrt(Math.max(0, 1 - (distSq / (visualRadius * visualRadius))));

            // Diffuse Shading
            const dotProduct = (nx * lx_norm + ny * ly_norm + nz * lz_norm);
            const diffuse = Math.max(0.1, dotProduct); 

            // 3D Spherical Rotation
            // Rotate around Y axis
            const rnx = nx * cosRot + nz * sinRot;
            const rnz = -nx * sinRot + nz * cosRot;
            const rny = ny;

            // Spherical Sampling for Noise (No distortion at poles)
            const horizontalStretch = pType === "GAS_GIANT" ? 0.3 : 1.0;
            const verticalStretch = pType === "GAS_GIANT" ? 4.0 : 1.0;

            const noiseX = rnx * config.scale * horizontalStretch;
            const noiseY = rny * config.scale * verticalStretch;
            const noiseZ = rnz * config.scale;

            const surfaceNoise = fbm3D(noise3D, noiseX, noiseY, noiseZ, config.octaves);

            // [T-121] Lógica de Paletas por Bioma
            const pBiome = biome?.toUpperCase() || "DEFAULT";
            let baseH, baseL, baseS = 60;
            
            // Mask for secondary/tertiary colors [T-121: Horizontal stretch x10]
            const zoneNoise = fbm3D(noise3D, noiseX * 0.1, noiseY * 2.0, noiseZ * 0.1, 2);
            const detailNoise = fbm3D(noise3D, noiseX * 3, noiseY * 3, noiseZ * 3, 2);

            if (pType === "GAS_GIANT") {
                const mix = (surfaceNoise + 1) / 2;
                baseH = oceanHue + (terrainHue - oceanHue) * mix;
                baseL = 35 + mix * 20;
            } else if (pBiome === "OCEANIC" || pBiome === "OCEÁNICO") {
                if (surfaceNoise > config.threshold + 0.1) { // Sparse islands
                    baseH = terrainHue;
                    baseL = 40 + detailNoise * 10;
                } else {
                    // 3 Colors: Base (oceanHue) + Cobalt + Foam
                    if (detailNoise > 0.3) { // Foam/Waves
                        baseH = 0; baseS = 0; baseL = 90; 
                    } else if (zoneNoise > 0.2) { // Cobalt deeper zones
                        baseH = 220; baseL = 20;
                    } else {
                        baseH = oceanHue; baseL = 30;
                    }
                }
            } else if (pBiome === "TUNDRA") {
                // 3 Colors: Cyan Base + Stone Gray + Ice Blue
                if (surfaceNoise > config.threshold) {
                    if (zoneNoise > 0.3) { // Gray Stone
                        baseH = 0; baseS = 0; baseL = 40;
                    } else { // Cyan Base
                        baseH = terrainHue; baseL = 85;
                    }
                } else { // Ice Blue
                    baseH = 200; baseL = 70;
                }
            } else if (pBiome === "VEGETATION" || pBiome === "VEGETACIÓN") {
                // 3 Colors: Green Base + Earth Brown + Dark Green
                if (surfaceNoise > config.threshold) {
                    if (zoneNoise > 0.4) { // Earth Brown
                        baseH = 30; baseS = 40; baseL = 30;
                    } else if (detailNoise > 0.1) { // Dark Green
                        baseH = 140; baseL = 20;
                    } else { // Green Base
                        baseH = faunaHue; baseL = 45;
                    }
                } else { // Water for vegetation planets
                    baseH = oceanHue; baseL = 25;
                }
            } else if (pBiome === "VOLCANIC" || pBiome === "VOLCÁNICO") {
                // 3 Colors: Charred Black + Lava Red + Bright Orange
                if (surfaceNoise > 0.2) { // Charred Rock
                    baseH = 0; baseS = 0; baseL = 15;
                } else if (surfaceNoise > 0) { // Lava Red
                    baseH = 0; baseS = 90; baseL = 50;
                } else { // Bright Orange
                    baseH = 30; baseS = 100; baseL = 60;
                }
            } else if (pBiome === "DESERT" || pBiome === "DESÉRTICO") {
                // 3 Colors: Sand Base + Clay Brown + Pale Yellow
                if (zoneNoise > 0.3) { // Clay Brown
                    baseH = 20; baseS = 50; baseL = 40;
                } else if (detailNoise > 0.2) { // Pale Yellow
                    baseH = 50; baseS = 40; baseL = 70;
                } else { // Sand Base
                    baseH = terrainHue; baseL = 55;
                }
            } else {
                // Default logic
                if (surfaceNoise > config.threshold) {
                    const featureMix = fbm3D(noise3D, noiseX * 2, noiseY * 2, noiseZ * 2, 2);
                    baseH = featureMix > 0.1 ? faunaHue : terrainHue;
                    baseL = 30 + surfaceNoise * 20;
                } else {
                    baseH = oceanHue;
                    baseL = 20 + surfaceNoise * 10;
                    baseS = 70;
                }
            }

            // Apply Diffuse Lighting to the color
            const finalL = baseL * diffuse;
            const finalColor = `hsl(${baseH}, ${baseS}%, ${finalL}%)`;

            ctx.globalAlpha = 1.0;
            ctx.fillStyle = finalColor;
            ctx.fillRect(lx, ly, resolution + 0.1, resolution + 0.1);

            // Layer 2: Clouds with separate lighting & rotation speed
            const cCosRot = Math.cos(rot * 1.5);
            const cSinRot = Math.sin(rot * 1.5);
            const crnx = nx * cCosRot + nz * cSinRot;
            const crnz = -nx * cSinRot + nz * cCosRot;
            
            const cloudNoise = fbm3D(noise3D, crnx * config.scale * 1.5, rny * config.scale * 1.5, crnz * config.scale * 1.5, 2);
            const cloudLimit = pType === "ICE" ? 0.05 : 0.15;
            
            if (cloudNoise > cloudLimit) {
               const cloudAlpha = Math.min(0.8, 1.5 * (cloudNoise - cloudLimit));
               const cloudL = 90 * diffuse;
               ctx.fillStyle = `hsla(${cloudHue}, 20%, ${cloudL}%, ${cloudAlpha})`;
               ctx.fillRect(lx, ly, resolution + 0.1, resolution + 0.1);
            }

            // Layer 3: Rim Lighting & Fresnel [T-128]
            const fresnel = Math.pow(1 - nz, 3);
            if (fresnel > 0.2 && atmosphere > 0) {
                const rimIntensity = fresnel * (atmosphere / 100) * diffuse;
                ctx.fillStyle = `hsla(${oceanHue}, 100%, 85%, ${rimIntensity * 0.6})`;
                ctx.fillRect(lx, ly, resolution + 0.1, resolution + 0.1);
            }

            // Layer 4: Specular Highlight (The "Sun Reflection")
            const specX = centerX - visualRadius * 0.4;
            const specY = centerY - visualRadius * 0.4;
            const specDistSq = Math.pow(lx - specX, 2) + Math.pow(ly - specY, 2);
            if (specDistSq < visualRadius * visualRadius * 0.02) {
                const specIntensity = Math.pow(1 - (Math.sqrt(specDistSq) / (visualRadius * 0.15)), 2) * 0.4;
                ctx.fillStyle = `rgba(255, 255, 255, ${specIntensity})`;
                ctx.fillRect(lx, ly, resolution + 0.1, resolution + 0.1);
            }

            // Layer 5: Terminator (Day/Night transition)
            if (dotProduct < 0.1) {
                const shadowIntensity = Math.min(0.8, (0.1 - dotProduct) * 5);
                ctx.fillStyle = `rgba(0, 5, 20, ${shadowIntensity})`;
                ctx.fillRect(lx, ly, resolution + 0.1, resolution + 0.1);
            }
          }
        }
      }

      ctx.globalAlpha = 1.0;
      if (animate) {
        rotationRef.current += 0.01;
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [seed, size, terrainHue, oceanHue, faunaHue, cloudHue, radius, atmosphere, hasRings, biome, type, animate]);

  const glowSize = (atmosphere / 100) * 80;
  const glowOpacity = (atmosphere / 100) * 0.4;
  const glowColor = `hsla(${oceanHue}, 80%, 60%, ${glowOpacity})`;

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        boxShadow: "0 0 40px rgba(0, 0, 0, 0.5)",
        backgroundColor: "transparent",
      }}
    />
  );
}
