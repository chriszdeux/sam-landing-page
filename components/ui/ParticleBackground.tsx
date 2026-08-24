// 1-Definir componente de fondo de partículas canvas
// 2-Inicializar y dibujar capas, rayos y chispas
// 3-Renderizar elemento canvas

//# 1-Definir componente de fondo de partículas canvas
'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Fondo de red de datos. Se dibuja en un canvas fijo detrás de todo, con una
 * capa negra al 70% encima, así que cada capa se mantiene deliberadamente
 * tenue: el fondo aporta atmósfera y no debe competir con el contenido.
 *
 * Capas, de atrás hacia adelante:
 *   nebulosa → grilla pulsante → polvo (parallax) → micro-código hex →
 *   conexiones → nodos → rayos → chispas → fogonazo de impacto
 *
 * Los rayos se calculan una sola vez al nacer con desplazamiento fractal de
 * punto medio, en vez de re-aleatorizar los vértices cada frame: quedan
 * detallados y estables en lugar de nerviosos. Al apagarse dejan chispas que
 * caen y se enfrían, que era el pedido central.
 */

const NODE_COLORS = ['#00f3ff', '#ff0055'] as const;
const HEX_CHARS = '0123456789ABCDEF';

const SPARK_POOL = 420;
const DUST_POOL = 90;
const CONNECTION_DIST = 150;

interface Node {
  x: number; y: number; vx: number; vy: number; size: number; ci: number;
  // Titileo: cada nodo late con su propia fase y frecuencia, así la red
  // respira en desorden en vez de pulsar toda junta.
  phase: number; freq: number; tw: number;
  // Sólo algunos nodos son galaxias; si todos lo fueran la red se volvería
  // ruido y taparía el contenido.
  galaxy: boolean; rot: number; rotSpeed: number; tilt: number;
}
interface Dust { x: number; y: number; vx: number; vy: number; size: number; depth: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; ci: number }
interface Pt { x: number; y: number }
interface Bolt { pts: Pt[]; branches: Pt[][]; life: number; max: number; ci: number }
interface Flash { x: number; y: number; life: number; max: number; ci: number }

// Sprite de glow pre-renderizado: sustituye a shadowBlur, que recalcula un
// blur gaussiano por cada figura dibujada.
function makeGlow(color: string, r = 24): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = r * 2;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, color + '66');
  grad.addColorStop(1, color + '00');
  g.fillStyle = grad;
  g.fillRect(0, 0, r * 2, r * 2);
  return c;
}

// Galaxia espiral pre-renderizada una sola vez. En el loop sólo se rota y
// escala con drawImage: dibujar los brazos punto por punto cada frame, por 80
// nodos, sería inviable.
function makeGalaxy(color: string, r = 56): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = r * 2;
  const g = c.getContext('2d')!;

  // Los brazos se trazan aparte para poder difuminarlos enteros. Pocas vueltas
  // con poca dispersión daban aspas de shuriken en vez de una espiral: acá van
  // casi dos vueltas completas, con la nube ensanchándose hacia afuera.
  const tmp = document.createElement('canvas');
  tmp.width = tmp.height = r * 2;
  const tg = tmp.getContext('2d')!;
  tg.translate(r, r);
  tg.globalCompositeOperation = 'lighter';
  tg.fillStyle = color;
  const ARMS = 2;
  for (let arm = 0; arm < ARMS; arm++) {
    const base = (arm / ARMS) * Math.PI * 2;
    for (let i = 0; i < 300; i++) {
      const f = i / 300;
      const a = base + f * 5.6;               // ~1.8 vueltas: envuelve como disco
      const rad = f * r * 0.94;
      const spread = 2.4 + f * 5.5;           // nube ancha, no una línea
      const px = Math.cos(a) * rad + (Math.random() - 0.5) * spread;
      const py = Math.sin(a) * rad * 0.62 + (Math.random() - 0.5) * spread;
      tg.globalAlpha = (1 - f) * 0.3;
      tg.beginPath();
      tg.arc(px, py, 0.85 - f * 0.35, 0, Math.PI * 2);
      tg.fill();
    }
  }

  g.translate(r, r);

  // Halo del disco
  const halo = g.createRadialGradient(0, 0, 0, 0, 0, r);
  halo.addColorStop(0, color + '73');
  halo.addColorStop(0.45, color + '2b');
  halo.addColorStop(1, color + '00');
  g.fillStyle = halo;
  g.fillRect(-r, -r, r * 2, r * 2);

  // Un blur sobre los brazos ya trazados: se paga una vez al crear el sprite,
  // no por frame, y es lo que los vuelve difusos en lugar de recortados.
  g.globalCompositeOperation = 'lighter';
  g.filter = `blur(${(r * 0.055).toFixed(2)}px)`;
  g.drawImage(tmp, -r, -r);
  g.filter = 'none';

  // Núcleo, también difuso en el borde
  g.globalAlpha = 1;
  const core = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.26);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.28, color);
  core.addColorStop(1, color + '00');
  g.fillStyle = core;
  g.beginPath();
  g.arc(0, 0, r * 0.26, 0, Math.PI * 2);
  g.fill();
  return c;
}

// Desplazamiento fractal de punto medio: cada pasada parte los segmentos y
// desvía el medio en perpendicular, con amplitud decreciente.
function subdivide(pts: Pt[], displace: number, detail: number): Pt[] {
  if (detail <= 0) return pts;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    out.push(a);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const off = (Math.random() - 0.5) * displace;
    out.push({ x: (a.x + b.x) / 2 + (-dy / len) * off, y: (a.y + b.y) / 2 + (dx / len) * off });
  }
  out.push(pts[pts.length - 1]);
  return subdivide(out, displace * 0.55, detail - 1);
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //# 2-Inicializar y dibujar capas, rayos y chispas
  useEffect(function initParticleSystem() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glows = [makeGlow(NODE_COLORS[0]), makeGlow(NODE_COLORS[1]), makeGlow('#ffffff')];
    const galaxies = [makeGalaxy(NODE_COLORS[0]), makeGalaxy(NODE_COLORS[1])];

    let width = 0;
    let height = 0;
    let dpr = 1;

    let nodes: Node[] = [];
    let dust: Dust[] = [];
    let hex: { x: number; y: number; vy: number; drift: number; text: string; size: number; opacity: number }[] = [];
    const sparks: Spark[] = Array.from({ length: SPARK_POOL }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 1, ci: 0 }));
    const bolts: Bolt[] = [];
    const flashes: Flash[] = [];

    const mouse = { x: -9999, y: -9999 };
    const grid = new Map<number, number[]>();
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let boltCooldown = 0.6;

    const randHex = () =>
      '0x' + HEX_CHARS[(Math.random() * 16) | 0] + HEX_CHARS[(Math.random() * 16) | 0];

    const seed = () => {
      const nodeCount = Math.min(80, Math.floor((width * height) / 15000));
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        size: Math.random() * 2 + 1,
        ci: Math.random() < 0.72 ? 0 : 1,
        phase: Math.random() * Math.PI * 2,
        freq: 0.5 + Math.random() * 1.7,
        tw: 1,
        galaxy: Math.random() < 0.16,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.22,
        tilt: 0.45 + Math.random() * 0.5,
      }));

      // Polvo: tres profundidades que se mueven a distinta velocidad -> parallax.
      dust = Array.from({ length: Math.min(DUST_POOL, Math.floor((width * height) / 22000)) }, () => {
        const depth = 0.3 + Math.random() * 0.7;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 6 * depth,
          vy: -(4 + Math.random() * 10) * depth,
          size: 0.4 + Math.random() * 1.1,
          depth,
        };
      });

      hex = Array.from({ length: Math.min(35, Math.floor(width / 45)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 24 + 9),
        drift: (Math.random() - 0.5) * 5,
        text: randHex(),
        size: Math.random() * 8 + 9,
        opacity: Math.random() * 0.05 + 0.02,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Fondo a escala 1: es una atmósfera difusa detrás de un velo negro al
      // 70%, donde subir la resolución multiplica el costo sin verse.
      dpr = 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const spawnSpark = (x: number, y: number, ci: number, power: number) => {
      for (let i = 0; i < SPARK_POOL; i++) {
        const s = sparks[i];
        if (s.life > 0) continue;
        const a = Math.random() * Math.PI * 2;
        const sp = (18 + Math.random() * 62) * power;
        s.x = x; s.y = y;
        s.vx = Math.cos(a) * sp;
        s.vy = Math.sin(a) * sp - 12;
        s.max = 0.55 + Math.random() * 1.15;
        s.life = s.max;
        s.size = 0.6 + Math.random() * 1.5;
        s.ci = ci;
        return;
      }
    };

    // Un rayo salta entre nodos cercanos; el trazo se detalla por fractal y
    // puede abrir ramas cortas.
    const fireBolt = () => {
      if (nodes.length < 2) return;
      const start = nodes[(Math.random() * nodes.length) | 0];
      const chain: Pt[] = [{ x: start.x, y: start.y }];
      const used = new Set<Node>([start]);
      let cur = start;

      const hops = 2 + ((Math.random() * 3) | 0);
      for (let k = 0; k < hops; k++) {
        let best: Node | null = null;
        let bestD = CONNECTION_DIST * 1.6;
        for (const n of nodes) {
          if (used.has(n)) continue;
          const d = Math.hypot(cur.x - n.x, cur.y - n.y);
          if (d < bestD) { bestD = d; best = n; }
        }
        if (!best) break;
        used.add(best);
        chain.push({ x: best.x, y: best.y });
        cur = best;
      }
      if (chain.length < 2) return;

      const ci = Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 1 : 2;
      const pts = subdivide(chain, 26, 4);

      const branches: Pt[][] = [];
      const branchCount = (Math.random() * 3) | 0;
      for (let b = 0; b < branchCount; b++) {
        const i = 2 + ((Math.random() * (pts.length - 4)) | 0);
        const from = pts[i];
        const a = Math.random() * Math.PI * 2;
        const len = 18 + Math.random() * 46;
        branches.push(subdivide([from, { x: from.x + Math.cos(a) * len, y: from.y + Math.sin(a) * len }], 14, 3));
      }

      const max = 0.32 + Math.random() * 0.3;
      bolts.push({ pts, branches, life: max, max, ci });

      // El destello deja chispas repartidas a lo largo del trazo.
      const sparkCount = 10 + ((Math.random() * 14) | 0);
      for (let s = 0; s < sparkCount; s++) {
        const p = pts[(Math.random() * pts.length) | 0];
        spawnSpark(p.x, p.y, ci, 0.6 + Math.random() * 0.6);
      }
      flashes.push({ x: pts[0].x, y: pts[0].y, life: 0.3, max: 0.3, ci });
      const end = pts[pts.length - 1];
      flashes.push({ x: end.x, y: end.y, life: 0.34, max: 0.34, ci });
    };

    const strokePolyline = (pts: Pt[], w: number, alpha: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineWidth = w;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      ctx.clearRect(0, 0, width, height);

      // La nebulosa vive en dos capas CSS (ver el JSX): son manchas enormes y
      // lentísimas, y compositarlas por GPU cuesta nada, mientras blitearlas
      // acá se llevaba el grueso del presupuesto del frame.

      // ── Grilla pulsante ──
      const pulse = Math.sin(t * 0.9) * 0.008 + 0.015;
      ctx.strokeStyle = `rgba(0, 243, 255, ${pulse})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += 120) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y < height; y += 120) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      // ── Polvo con parallax ──
      for (const d of dust) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y < -6) { d.y = height + 6; d.x = Math.random() * width; }
        if (d.x < -6) d.x = width + 6; else if (d.x > width + 6) d.x = -6;
        ctx.globalAlpha = 0.05 + d.depth * 0.13;
        ctx.fillStyle = '#9fe8ff';
        ctx.fillRect(d.x, d.y, d.size, d.size);
      }
      ctx.globalAlpha = 1;

      // ── Micro-código hex ──
      for (const h of hex) {
        h.y += h.vy * dt;
        h.x += h.drift * dt;
        if (h.y < -20) { h.y = height + 20; h.x = Math.random() * width; h.text = randHex(); }
        ctx.fillStyle = `rgba(0, 243, 255, ${h.opacity})`;
        ctx.font = `bold ${h.size}px monospace`;
        ctx.fillText(h.text, h.x, h.y);
      }

      // ── Nodos: repulsión suave del cursor ──
      for (const p of nodes) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < 40000 && dSq > 1) {
          const d = Math.sqrt(dSq);
          const force = (200 - d) / 200;
          p.vx -= (dx / d) * force * 130 * dt;
          p.vy -= (dy / d) * force * 130 * dt;
        }
        // Friccion equivalente al 0.98/frame original, ahora por segundo.
        const fr = Math.pow(0.98, dt * 60);
        p.vx *= fr;
        p.vy *= fr;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        // 0.45..1 — nunca llega a apagarse del todo
        p.tw = 0.725 + 0.275 * Math.sin(t * p.freq + p.phase);
      }

      // ── Conexiones (grilla espacial; j>i ya evita pares repetidos) ──
      const cell = CONNECTION_DIST;
      const cols = Math.ceil(width / cell) + 2;
      // Se reutilizan el Map y los arrays entre frames: reasignarlos generaba
      // basura para el GC 60 veces por segundo.
      for (const arr of grid.values()) arr.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        const key = ((nodes[i].y / cell) | 0) * cols + ((nodes[i].x / cell) | 0);
        const arr = grid.get(key);
        if (arr) arr.push(i); else grid.set(key, [i]);
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const gx = (p.x / cell) | 0;
        const gy = (p.y / cell) | 0;
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const bucket = grid.get((gy + oy) * cols + (gx + ox));
            if (!bucket) continue;
            for (const j of bucket) {
              if (j <= i) continue;
              const q = nodes[j];
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              const dSq = dx * dx + dy * dy;
              if (dSq >= cell * cell) continue;
              ctx.globalAlpha = 1 - Math.sqrt(dSq) / cell;
              ctx.strokeStyle = NODE_COLORS[p.ci];
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      // ── Nodos: titileo propio, y unos pocos girando como galaxias ──
      ctx.globalCompositeOperation = 'lighter';
      for (const p of nodes) {
        const tw = p.tw;
        if (p.galaxy) {
          p.rot += p.rotSpeed * dt;
          const r = (15 + p.size * 9) * (0.94 + tw * 0.12);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, p.tilt);            // inclinación: se leen como discos, no como círculos
          ctx.globalAlpha = 0.5 * tw;
          ctx.drawImage(galaxies[p.ci], -r, -r, r * 2, r * 2);
          ctx.restore();
        } else {
          const r = p.size * 4.2 * (0.7 + tw * 0.5);
          ctx.globalAlpha = 0.5 * tw;
          ctx.drawImage(glows[p.ci], p.x - r, p.y - r, r * 2, r * 2);
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      // Núcleo sólido encima del glow, para que el nodo siga leyéndose nítido
      for (const p of nodes) {
        ctx.globalAlpha = 0.55 + 0.45 * p.tw;
        ctx.fillStyle = p.galaxy ? '#ffffff' : NODE_COLORS[p.ci];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.galaxy ? 0.85 : 1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Rayos: trazo ancho tenue + núcleo fino, en vez de shadowBlur ──
      if (!reduced) {
        boltCooldown -= dt;
        if (boltCooldown <= 0) {
          fireBolt();
          boltCooldown = 0.35 + Math.random() * 1.5;
        }
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life -= dt;
        if (b.life <= 0) { bolts.splice(i, 1); continue; }
        const k = b.life / b.max;
        const color = b.ci === 2 ? '#ffffff' : NODE_COLORS[b.ci];
        strokePolyline(b.pts, 5 * k, 0.1 * k, color);
        strokePolyline(b.pts, 1.1, 0.75 * k, '#ffffff');
        for (const br of b.branches) strokePolyline(br, 0.8, 0.4 * k, color);
      }
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      // ── Chispas: caen y se enfrían tras cada destello ──
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < SPARK_POOL; i++) {
        const s = sparks[i];
        if (s.life <= 0) continue;
        s.life -= dt;
        if (s.life <= 0) continue;
        s.vy += 26 * dt;                       // gravedad: se sienten como brasas
        const fr = Math.pow(0.94, dt * 60);
        s.vx *= fr;
        s.vy *= fr;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const k = s.life / s.max;
        const r = s.size * 3.2;
        ctx.globalAlpha = k * 0.42;
        ctx.drawImage(glows[s.ci], s.x - r, s.y - r, r * 2, r * 2);
      }

      // ── Fogonazo en los extremos del rayo ──
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt;
        if (f.life <= 0) { flashes.splice(i, 1); continue; }
        const k = f.life / f.max;
        const r = 34 * (1.25 - k * 0.6);
        ctx.globalAlpha = k * 0.3;
        ctx.drawImage(glows[f.ci], f.x - r, f.y - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onVisibility = () => {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      } else if (!raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    resize();

    if (reduced) {
      // Un solo cuadro: atmósfera sin movimiento.
      draw(performance.now());
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  //# 3-Renderizar elemento canvas
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-20 h-full w-full bg-[#05050f] [transform:translate3d(0,0,0)] [will-change:transform]"
      />
      {/* Nebulosa: manchas lentas compositadas por GPU. Fuera del canvas para
          no pagarlas en cada frame; motion-reduce las deja quietas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -z-[19] h-[70vmax] w-[70vmax] rounded-full opacity-70 will-change-transform [background:radial-gradient(circle,rgba(0,243,255,0.055)_0%,transparent_65%)] animate-[nebulaDriftA_46s_ease-in-out_infinite] motion-reduce:animate-none"
        style={{ left: '-10vmax', top: '-12vmax' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -z-[19] h-[62vmax] w-[62vmax] rounded-full opacity-70 will-change-transform [background:radial-gradient(circle,rgba(255,0,85,0.04)_0%,transparent_65%)] animate-[nebulaDriftB_61s_ease-in-out_infinite] motion-reduce:animate-none"
        style={{ right: '-14vmax', bottom: '-16vmax' }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-black/70" />
    </>
  );
};
