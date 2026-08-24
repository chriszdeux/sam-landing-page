"use client";

import { motion } from "framer-motion";
import { Typography } from "../ui/Typography";

const floatingOrb = (color: string, top: string, left: string, size: number, delay: number) => (
  <motion.div
    animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.35, 0.12] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    style={{
      position: "absolute",
      top,
      left,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(60px)",
      pointerEvents: "none",
    }}
  />
);

export function LyncoreTeaser() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050a14]">
      {/* Background grid */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#00f3ff25 1px, transparent 1px),
            linear-gradient(90deg, #00f3ff25 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(55deg) translateY(-80px)",
        }}
      />

      {/* Ambient orbs */}
      {floatingOrb("#00f3ff", "20%", "15%", 500, 0)}
      {floatingOrb("#ffb700", "65%", "70%", 400, 2)}
      {floatingOrb("#b000ff", "50%", "40%", 300, 1)}

      {/* Scanning line */}
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0,243,255,0.04) 50%, transparent)",
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-[2]"
      >
        <div
          className="max-w-[640px] rounded-[20px] border border-[#00f3ff]/[0.15] px-8 py-12 text-center backdrop-blur-[20px] sm:px-16"
          style={{
            background: "rgba(255,255,255,0.03)",
            boxShadow: "0 0 60px rgba(0,243,255,0.08), 0 0 120px rgba(176,0,255,0.05)",
          }}
        >
          {/* Logo / Name */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <Typography
              variant="h2"
              className="mb-1 text-[2.8rem] sm:text-[4rem] font-black uppercase tracking-[6px] bg-gradient-to-br from-[#00f3ff] via-[#ffb700] via-60% to-white bg-clip-text text-transparent [-webkit-text-fill-color:transparent]"
            >
              Lyncore
            </Typography>
          </motion.div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="mb-6 h-0.5 rounded"
              style={{ background: "linear-gradient(90deg, transparent, #00f3ff, #ffb700, transparent)" }}
            />
          </motion.div>

          {/* PRÓXIMAMENTE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="mb-6 flex flex-row items-center justify-center gap-3">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="h-2 w-2 rounded-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" />
              </motion.div>
              <Typography
                variant="h5"
                className="text-[1rem] sm:text-[1.4rem] font-bold uppercase tracking-[8px] text-white"
              >
                PRÓXIMAMENTE
              </Typography>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
              >
                <div className="h-2 w-2 rounded-full bg-[#ffb700] shadow-[0_0_10px_#ffb700]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Typography
              variant="body1"
              className="text-[0.85rem] sm:text-[1rem] italic tracking-[2px] text-white/50"
            >
              Ledger de supervivencia del yermo digital.
            </Typography>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
