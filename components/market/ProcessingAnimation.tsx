'use client';

/**
 * ProcessingAnimation — Premium Web3 Crypto Audit Experience
 *
 * Layers:
 *  1. Canvas particle emitter (60fps, GPU-accelerated via translate3d)
 *  2. Scrolling hex-hash stream background (CSS keyframes)
 *  3. 3D SVG orbit rings (framer-motion, multi-axis rotation)
 *  4. Central token avatar with step-synchronized glow
 *  5. Live crypto-terminal with blinking cursor line
 *  6. Step progress label
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Particle type ────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
}

// ─── Static hex rows (generated once per mount, not on every render) ──────────
function makeHexRows(count: number): string[] {
  return Array.from({ length: count }, () =>
    (Math.random() * 0xFFFFFFFF >>> 0).toString(16).padStart(8, '0')
  );
}

// ─── Step → glow intensity map ───────────────────────────────────────────────
const STEP_GLOW: Record<number, string> = {
  1: '0 0 20px rgba(212,163,115,0.5), 0 0 50px rgba(0,243,255,0.15)',
  2: '0 0 30px rgba(212,163,115,0.7), 0 0 70px rgba(0,243,255,0.25)',
  3: '0 0 40px rgba(212,163,115,0.9), 0 0 90px rgba(0,243,255,0.35)',
  4: '0 0 50px rgba(0,255,136,0.8),   0 0 100px rgba(0,243,255,0.4)',
};

// ─── Canvas Particle Emitter ──────────────────────────────────────────────────
const ParticleCanvas = React.memo(({ step }: { step: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const cx = W / 2;
    const cy = H / 2;

    const GOLD = ['#E6C594', '#D4A373', '#FFD580'];
    const CYAN = ['#00f3ff', '#00e5ff', '#40c4ff'];
    const emitRate = 2 + step; // more particles as step advances

    let frameCount = 0;

    const emit = () => {
      for (let i = 0; i < emitRate; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.2;
        const isGold = Math.random() > 0.45;
        const palette = isGold ? GOLD : CYAN;
        particlesRef.current.push({
          x: cx + Math.cos(angle) * (20 + Math.random() * 15),
          y: cy + Math.sin(angle) * (20 + Math.random() * 15),
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.5,
          life: 0,
          maxLife: 60 + Math.random() * 80,
          size: 1.2 + Math.random() * 2.5,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
      // cap at 200 particles
      if (particlesRef.current.length > 200) {
        particlesRef.current.splice(0, particlesRef.current.length - 200);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frameCount++;
      if (frameCount % 2 === 0) emit(); // emit every 2nd frame → ~30 emits/s

      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      for (const p of particlesRef.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // air resistance
        p.vy *= 0.98;
        const progress = p.life / p.maxLife;
        const alpha = progress < 0.2
          ? progress / 0.2               // fade in
          : 1 - (progress - 0.2) / 0.8; // fade out
        ctx.globalAlpha = alpha * 0.85;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [step]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
});
ParticleCanvas.displayName = 'ParticleCanvas';

// ─── Hex Stream Column ────────────────────────────────────────────────────────
const HexColumn = React.memo(({ col, rows }: { col: number; rows: string[] }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: `${col * 16.5}%`,
      top: 0,
      fontSize: '0.45rem',
      fontFamily: 'monospace',
      color: col % 2 === 0 ? '#00f3ff' : '#D4A373',
      lineHeight: 1.7,
      userSelect: 'none',
      pointerEvents: 'none',
    }}
    initial={{ y: '-100%', opacity: 0 }}
    animate={{ y: '220%', opacity: [0, 1, 1, 0] }}
    transition={{
      duration: 7 + col * 1.4,
      repeat: Infinity,
      ease: 'linear',
      delay: col * 0.9,
      opacity: { times: [0, 0.1, 0.85, 1], duration: 7 + col * 1.4 },
    }}
  >
    {rows.map((h, r) => <div key={r}>{h}</div>)}
  </motion.div>
));
HexColumn.displayName = 'HexColumn';

// ─── Main Component ───────────────────────────────────────────────────────────
export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  processingStep,
  walletId,
  networkFee,
  selectedCrypto,
  getStepText,
}) => {
  // Stable hex rows — only generated once per mount
  const hexColumns = useMemo(
    () => Array.from({ length: 6 }, () => makeHexRows(28)),
    []
  );

  const currentGlow = STEP_GLOW[processingStep] ?? STEP_GLOW[1];
  const stepLabel = getStepText(processingStep);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        minHeight: 520,
        overflow: 'hidden',
        /* CSS 3D context for child perspective transforms */
        perspective: '800px',
        perspectiveOrigin: '50% 40%',
      }}
    >
      {/* ── Layer 0: scrolling hex hash stream ── */}
      <Box sx={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        pointerEvents: 'none', zIndex: 0, opacity: 0.07,
      }}>
        {hexColumns.map((rows, col) => (
          <HexColumn key={col} col={col} rows={rows} />
        ))}
      </Box>

      {/* ── Header ── */}
      <Typography
        variant="h6"
        sx={{
          color: '#E6C594', mb: 2, fontWeight: 900, letterSpacing: 3,
          textShadow: '0 0 14px rgba(212,163,115,0.6)',
          position: 'relative', zIndex: 2, mt: 1,
          fontFamily: 'monospace',
        }}
      >
        PROCESANDO TRANSACCIÓN
      </Typography>

      {/* ── Layer 1: Orbit system + Canvas ── */}
      <Box
        sx={{
          position: 'relative',
          width: 260, height: 260,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 3, zIndex: 2,
          /* 3D stage */
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Canvas particle emitter — sits behind everything else */}
        <ParticleCanvas step={processingStep} />

        {/* Radial halo glow — GPU-composited */}
        <Box sx={{
          position: 'absolute',
          width: 220, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(212,163,115,0.18) 0%, transparent 68%)',
          filter: 'blur(18px)',
          animation: 'haloGlow 2.4s ease-in-out infinite',
          '@keyframes haloGlow': {
            '0%,100%': { transform: 'scale(0.88)', opacity: 0.35 },
            '50%':      { transform: 'scale(1.12)', opacity: 0.85 },
          },
          willChange: 'transform, opacity',
          zIndex: 1,
        }} />

        {/* ── SVG orbit rings — 3D perspective ── */}
        <svg
          style={{
            position: 'absolute',
            width: '100%', height: '100%',
            overflow: 'visible',
            zIndex: 2,
            transform: 'rotateX(20deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Ring A: wide gold dashed — slow CW */}
          <motion.ellipse cx="130" cy="130" rx="100" ry="32"
            fill="none" stroke="#D4A373" strokeWidth="1.6" strokeDasharray="6 5"
            style={{ transformOrigin: '130px 130px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          />
          {/* Ring B: medium cyan solid — fast CCW */}
          <motion.ellipse cx="130" cy="130" rx="115" ry="42"
            fill="none" stroke="#00f3ff" strokeWidth="1" strokeOpacity={0.8}
            style={{ transformOrigin: '130px 130px', rotateX: '55deg' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
          />
          {/* Ring C: inner tight gold — fast CW */}
          <motion.ellipse cx="130" cy="130" rx="75" ry="24"
            fill="none" stroke="#E6C594" strokeWidth="1.3" strokeDasharray="3 7"
            style={{ transformOrigin: '130px 130px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 0.8 }}
          />
          {/* Ring D: outer white ghost — ultra-slow CW */}
          <motion.ellipse cx="130" cy="130" rx="128" ry="52"
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="4 10"
            style={{ transformOrigin: '130px 130px', rotate: -25 }}
            animate={{ rotate: 335 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          {/* Ring E: diagonal red-orange accent — medium CCW */}
          <motion.ellipse cx="130" cy="130" rx="88" ry="16"
            fill="none" stroke="rgba(255,120,80,0.4)" strokeWidth="0.9" strokeDasharray="2 8"
            style={{ transformOrigin: '130px 130px', rotateY: '70deg' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 11, repeat: Infinity, ease: 'linear', delay: 2 }}
          />
        </svg>

        {/* ── Orbital nodes — glowing dots that ride the rings ── */}
        {[0, 1, 2].map(i => {
          const colors = ['#D4A373', '#00f3ff', '#E6C594'];
          const radii = [100, 115, 75];
          const durations = [7, 5.5, 3.5];
          const r = radii[i];
          return (
            <motion.div
              key={`node-${i}`}
              style={{
                position: 'absolute',
                width: 7, height: 7,
                borderRadius: '50%',
                backgroundColor: colors[i],
                boxShadow: `0 0 12px 3px ${colors[i]}`,
                willChange: 'transform',
                zIndex: 3,
              }}
              animate={{
                x: Array.from({ length: 37 }, (_, k) => Math.cos((k / 36) * Math.PI * 2) * r),
                y: Array.from({ length: 37 }, (_, k) => Math.sin((k / 36) * Math.PI * 2) * (r * 0.3)),
              }}
              transition={{ duration: durations[i], repeat: Infinity, ease: 'linear' }}
            />
          );
        })}

        {/* ── Central token — step-synced glow ── */}
        <motion.div
          animate={{
            scale: [1, 1.07, 1],
            filter: [
              `drop-shadow(0 0 8px rgba(212,163,115,0.5))`,
              `drop-shadow(0 0 22px rgba(212,163,115,0.95)) drop-shadow(0 0 40px rgba(0,243,255,0.4))`,
              `drop-shadow(0 0 8px rgba(212,163,115,0.5))`,
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ zIndex: 4, position: 'relative', willChange: 'transform, filter' }}
        >
          <Avatar
            src={selectedCrypto?.identification.image256 || selectedCrypto?.identification.image128}
            sx={{
              width: 72, height: 72,
              border: '2.5px solid #D4A373',
              bgcolor: 'rgba(5,5,12,0.98)',
              boxShadow: currentGlow,
              transition: 'box-shadow 0.8s ease',
              fontWeight: 900, fontSize: '1.4rem',
            }}
          >
            {selectedCrypto?.identification.symbol?.[0] ?? 'S'}
          </Avatar>
        </motion.div>
      </Box>

      {/* ── Layer 2: crypto terminal ── */}
      <Box sx={{
        width: '100%',
        bgcolor: 'rgba(0,0,0,0.65)',
        p: '14px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(0,243,255,0.1)',
        fontFamily: 'monospace',
        mb: 2,
        zIndex: 2,
        position: 'relative',
        backdropFilter: 'blur(6px)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
      }}>
        {/* Terminal title bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff5f57' }} />
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#febc2e' }} />
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#28c840' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', ml: 1, fontSize: '0.6rem', letterSpacing: 1 }}>
            CRYPTO_AUDIT_v3.1 — SECURE_CHANNEL
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          <Typography variant="caption" sx={{ color: '#00ff88', fontSize: '0.63rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.3)' }}>[OK]</Box>
            {' '}NODE_HANDSHAKE ·· wallet:{walletId ? `${walletId.substring(0, 14)}…` : 'N/A'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#00f3ff', fontSize: '0.63rem' }}>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.3)' }}>[OK]</Box>
            {' '}BLOCKCHAIN_NET · SYNCED · NODES:247 · DIFF:3
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.63rem' }}>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.3)' }}>[  ]</Box>
            {' '}TX_FEE:{networkFee ? ` ${networkFee} CR` : ' 0 CR'} · ASSET:{selectedCrypto?.identification.symbol ?? '—'} · PRICE:{selectedCrypto?.financial.price?.toLocaleString() ?? '—'}
          </Typography>
          {/* Blinking active line */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{ color: '#E6C594', fontSize: '0.7rem' }}
            >
              ▶
            </motion.span>
            <Typography variant="caption" sx={{ color: '#E6C594', fontSize: '0.63rem', fontWeight: 'bold' }}>
              SIGNING_TX · {stepLabel.split(':')[0]}
            </Typography>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.35 }}
              style={{ color: '#E6C594', fontSize: '0.75rem', marginLeft: 2 }}
            >
              █
            </motion.span>
          </Box>
        </Box>
      </Box>

      {/* ── Step progress bar ── */}
      <Box sx={{ width: '100%', mb: 1, zIndex: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#E6C594', fontWeight: 'bold', fontSize: '0.72rem' }}>
            {stepLabel}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', fontFamily: 'monospace' }}>
            {processingStep}/4
          </Typography>
        </Box>
        {/* Track */}
        <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#D4A373,#00f3ff)', originX: 0 }}
            animate={{ scaleX: processingStep / 4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </Box>
      </Box>

      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', zIndex: 2, position: 'relative', fontFamily: 'monospace', letterSpacing: 1 }}>
        EST. &lt; 10s · 60fps · GPU_ACCEL: ON
      </Typography>
    </motion.div>
  );
};
