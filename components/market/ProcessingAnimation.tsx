'use client';

/**
 * ProcessingAnimation — auditoría de transacción
 *
 * Todo el gráfico vive en UN canvas con UN loop de rAF. La versión anterior
 * repartía la animación entre 5 elipses SVG animadas por framer-motion, 3 nodos
 * con arrays de 37 keyframes, 168 nodos de texto DOM en columnas hex y hasta
 * 200 partículas dibujadas con `shadowBlur` (el ajuste más caro del contexto 2D).
 *
 * Optimizaciones:
 *  - un solo canvas, un solo rAF, sin animaciones DOM en el gráfico
 *  - glow por sprite pre-renderizado (drawImage) en vez de shadowBlur por partícula
 *  - pool fijo de partículas: cero asignaciones dentro del loop
 *  - animación por delta de tiempo, no por conteo de frames
 *  - se detiene con la pestaña oculta y respeta prefers-reduced-motion
 *
 * El gráfico también dice algo: el anillo de progreso alrededor del token es el
 * avance real de los 4 pasos, y las partículas convergen hacia el centro
 * (la transacción se asienta) en vez de estallar hacia afuera.
 */

import React, { useRef, useEffect } from 'react';
import { Typography } from '../ui/Typography';
import { motion } from 'framer-motion';

interface ProcessingAnimationProps {
  processingStep: number;
  walletId: string;
  networkFee: number | null;
  selectedCrypto: {
    identification: { name: string; symbol: string; image128?: string; image256?: string };
    financial: { price: number };
  } | undefined;
  getStepText: (step: number) => string;
}

const SIZE = 280;          // lado del canvas en px CSS
const PARTICLES = 90;      // pool fijo
const TOTAL_STEPS = 4;

const GOLD = '#D4A373';
const CYAN = '#00f3ff';
const MINT = '#a5d6a7';    // mismo verde "success" que el CTA del formulario

// Sprite de glow: un gradiente radial pre-renderizado una sola vez por color.
// Sustituye a shadowBlur, que recalcula un blur gaussiano por cada figura.
function makeGlowSprite(color: string, r = 32): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = r * 2;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color + '80');
  grad.addColorStop(1, color + '00');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.fill();
  return c;
}

interface P { a: number; rad: number; sp: number; life: number; max: number; size: number; tint: 0 | 1 | 2 }

const AuditCanvas = React.memo(({ step }: { step: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // El paso vive en un ref para que cambiarlo no reinicie la animación.
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const sprites = [makeGlowSprite(GOLD), makeGlowSprite(CYAN), makeGlowSprite(MINT)];
    const tints = [GOLD, CYAN, MINT];

    // Pool fijo: se reciclan en sitio, nunca se crean partículas en el loop.
    const pool: P[] = Array.from({ length: PARTICLES }, () => ({
      a: Math.random() * Math.PI * 2,
      rad: 46 + Math.random() * 84,
      sp: 0.12 + Math.random() * 0.3,
      life: Math.random(),
      max: 2.4 + Math.random() * 2.6,
      size: 0.8 + Math.random() * 1.8,
      tint: (Math.random() < 0.55 ? 0 : 1) as 0 | 1 | 2,
    }));

    const respawn = (p: P) => {
      p.a = Math.random() * Math.PI * 2;
      p.rad = 96 + Math.random() * 42;
      p.sp = 0.12 + Math.random() * 0.3;
      p.life = 0;
      p.max = 2.4 + Math.random() * 2.6;
      p.size = 0.8 + Math.random() * 1.8;
      p.tint = stepRef.current >= TOTAL_STEPS ? 2 : ((Math.random() < 0.55 ? 0 : 1) as 0 | 1);
    };

    // Órbitas: inclinación fija, sólo cambia la fase con el tiempo.
    const orbits = [
      { rx: 104, ry: 33, rot: 0, sp: 0.32, color: GOLD, dash: [5, 6], w: 1 },
      { rx: 118, ry: 46, rot: -0.42, sp: -0.24, color: CYAN, dash: [], w: 0.9 },
      { rx: 78, ry: 22, rot: 0.55, sp: 0.5, color: '#E6C594', dash: [2, 7], w: 1 },
    ];

    let raf = 0;
    let last = performance.now();
    let t = 0;
    let shownProgress = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp: evita saltos al volver de una pestaña oculta
      last = now;
      t += dt;

      const accent = stepRef.current >= TOTAL_STEPS ? MINT : GOLD;
      const target = Math.min(stepRef.current / TOTAL_STEPS, 1);
      shownProgress += (target - shownProgress) * Math.min(dt * 3, 1);

      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── Halo suave ──
      const halo = ctx.createRadialGradient(cx, cy, 8, cx, cy, 118);
      halo.addColorStop(0, accent + '22');
      halo.addColorStop(1, accent + '00');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // ── Órbitas ──
      for (const o of orbits) {
        const phase = o.rot + t * o.sp;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(phase);
        ctx.beginPath();
        ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, Math.PI * 2);
        ctx.setLineDash(o.dash);
        ctx.lineWidth = o.w;
        ctx.strokeStyle = o.color + '59';
        ctx.stroke();
        ctx.restore();

        // Nodo que cabalga la órbita: se ubica con la misma fase, sin keyframes.
        const na = t * o.sp * 2.4;
        const nx = cx + Math.cos(na) * o.rx * Math.cos(phase) - Math.sin(na) * o.ry * Math.sin(phase);
        const ny = cy + Math.cos(na) * o.rx * Math.sin(phase) + Math.sin(na) * o.ry * Math.cos(phase);
        const sp = o.color === CYAN ? sprites[1] : sprites[0];
        ctx.globalAlpha = 0.75;
        ctx.drawImage(sp, nx - 7, ny - 7, 14, 14);
        ctx.globalAlpha = 1;
      }

      // ── Partículas convergentes (blit de sprite, sin shadowBlur) ──
      ctx.globalCompositeOperation = 'lighter';
      const density = reduced ? 0.35 : 1;
      const count = Math.floor(PARTICLES * density);
      for (let i = 0; i < count; i++) {
        const p = pool[i];
        p.life += dt;
        if (p.life >= p.max) respawn(p);
        p.a += p.sp * dt;
        p.rad -= (12 + stepRef.current * 4) * dt; // converge hacia el centro
        if (p.rad < 30) respawn(p);

        const prog = p.life / p.max;
        const alpha = prog < 0.18 ? prog / 0.18 : 1 - (prog - 0.18) / 0.82;
        const x = cx + Math.cos(p.a) * p.rad;
        const y = cy + Math.sin(p.a) * p.rad * 0.42;
        const s = p.size * 3;
        ctx.globalAlpha = Math.max(alpha, 0) * 0.3;
        ctx.drawImage(sprites[p.tint], x - s, y - s, s * 2, s * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      // ── Anillo de progreso: dato real, no adorno ──
      const R = 46;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.setLineDash([]);
      ctx.stroke();

      if (shownProgress > 0.001) {
        const from = -Math.PI / 2;
        const to = from + shownProgress * Math.PI * 2;
        const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
        grad.addColorStop(0, accent);
        grad.addColorStop(1, stepRef.current >= TOTAL_STEPS ? MINT : CYAN);
        ctx.beginPath();
        ctx.arc(cx, cy, R, from, to);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = grad;
        ctx.stroke();

        // Cabeza del arco
        const hx = cx + Math.cos(to) * R;
        const hy = cy + Math.sin(to) * R;
        ctx.drawImage(sprites[stepRef.current >= TOTAL_STEPS ? 2 : 0], hx - 8, hy - 8, 16, 16);
      }

      raf = requestAnimationFrame(frame);
    };

    // Un frame estático es suficiente si el usuario pidió menos movimiento.
    if (reduced) {
      frame(performance.now());
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      raf = requestAnimationFrame(frame);
    }

    // No quemar CPU con la pestaña en segundo plano.
    const onVisibility = () => {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      } else if (!raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
});
AuditCanvas.displayName = 'AuditCanvas';

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  processingStep,
  walletId,
  networkFee,
  selectedCrypto,
  getStepText,
}) => {
  const stepLabel = getStepText(processingStep);
  const done = processingStep >= TOTAL_STEPS;
  const accent = done ? MINT : '#E6C594';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative flex w-full flex-col items-center"
      role="status"
      aria-live="polite"
    >
      <Typography
        variant="caption"
        className="mb-5 font-mono text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.24em] transition-colors duration-500"
        style={{ color: accent }}
      >
        Procesando transacción
      </Typography>

      {/* Gráfico: un canvas para todo */}
      <div className="relative mb-6 flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
        <AuditCanvas step={processingStep} />

        <div
          className="relative z-[1] flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full text-[1.3rem] font-black transition-colors duration-700"
          style={{
            backgroundColor: 'rgba(6,6,12,0.96)',
            border: `1px solid ${accent}59`,
            color: accent,
          }}
        >
          {(selectedCrypto?.identification.image256 || selectedCrypto?.identification.image128) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedCrypto.identification.image256 || selectedCrypto.identification.image128}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            selectedCrypto?.identification.symbol?.[0] ?? 'S'
          )}
        </div>
      </div>

      {/* Terminal de auditoría */}
      <div className="relative w-full overflow-hidden rounded-[3px] border border-white/[0.07] bg-[rgba(6,6,12,0.7)] px-4 py-3 font-mono backdrop-blur-md">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f3ff]/35 to-transparent"
        />
        <div className="flex flex-col gap-1.5">
          <Typography variant="caption" className="text-[0.65rem] leading-relaxed text-[#a5d6a7]">
            <span className="text-white/25">[ok]</span> node_handshake · wallet:{walletId ? `${walletId.substring(0, 14)}…` : 'n/a'}
          </Typography>
          <Typography variant="caption" className="text-[0.65rem] leading-relaxed text-[#00f3ff]/85">
            <span className="text-white/25">[ok]</span> blockchain_net · synced · nodes:247 · diff:3
          </Typography>
          <Typography variant="caption" className="text-[0.65rem] leading-relaxed text-white/40">
            <span className="text-white/25">[··]</span> tx_fee:{networkFee ? ` ${networkFee} CR` : ' 0 CR'} · asset:{selectedCrypto?.identification.symbol ?? '—'} · price:{selectedCrypto?.financial.price?.toLocaleString() ?? '—'}
          </Typography>
        </div>
      </div>

      {/* Progreso por pasos */}
      <div className="mt-4 w-full">
        <div className="mb-2 flex items-baseline justify-between">
          <Typography
            variant="caption"
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-500"
            style={{ color: accent }}
          >
            {stepLabel}
          </Typography>
          <Typography variant="caption" className="font-mono text-[0.65rem] tabular-nums text-white/30">
            {processingStep}/{TOTAL_STEPS}
          </Typography>
        </div>
        {/* Un segmento por paso: comunica cuántos faltan, no sólo el porcentaje */}
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="h-px flex-1 overflow-hidden bg-white/[0.08]">
              <motion.div
                className="h-full origin-left"
                style={{ backgroundColor: i < processingStep ? accent : 'transparent' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < processingStep ? 1 : 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i === processingStep - 1 ? 0.05 : 0 }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
