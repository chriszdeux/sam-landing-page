"use client";

import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";

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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#050a14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: `
            linear-gradient(#00f3ff25 1px, transparent 1px),
            linear-gradient(90deg, #00f3ff25 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(55deg) translateY(-80px)",
          zIndex: 0,
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
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, transparent, rgba(0,243,255,0.04) 50%, transparent)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <Box
          sx={{
            px: { xs: 4, sm: 8 },
            py: { xs: 6, sm: 8 },
            borderRadius: 5,
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0,243,255,0.15)",
            boxShadow: "0 0 60px rgba(0,243,255,0.08), 0 0 120px rgba(176,0,255,0.05)",
            textAlign: "center",
            maxWidth: 640,
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
              sx={{
                fontWeight: 900,
                letterSpacing: 6,
                textTransform: "uppercase",
                background: "linear-gradient(135deg, #00f3ff 0%, #ffb700 60%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 1,
                fontSize: { xs: "2.8rem", sm: "4rem" },
              }}
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
            <Box
              sx={{
                height: 2,
                background: "linear-gradient(90deg, transparent, #00f3ff, #ffb700, transparent)",
                borderRadius: 1,
                mb: 3,
              }}
            />
          </motion.div>

          {/* PRÓXIMAMENTE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#00f3ff", boxShadow: "0 0 10px #00f3ff" }} />
              </motion.div>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 8,
                  color: "#fff",
                  textTransform: "uppercase",
                  fontSize: { xs: "1rem", sm: "1.4rem" },
                }}
              >
                PRÓXIMAMENTE
              </Typography>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ffb700", boxShadow: "0 0 10px #ffb700" }} />
              </motion.div>
            </Stack>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2,
                fontStyle: "italic",
                fontSize: { xs: "0.85rem", sm: "1rem" },
              }}
            >
              Su simulador de blockchain y exploración.
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
