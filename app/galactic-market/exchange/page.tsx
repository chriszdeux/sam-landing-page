"use client";

import { Box, Container, Typography, IconButton } from "@mui/material";
import { ArrowBack, SwapHoriz } from "@mui/icons-material";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExchangePage() {
  return (
    <Box sx={{ minHeight: '100vh', pt: 15, pb: 10, bgcolor: '#05050c' }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" gap={2} mb={6}>
          <Link href="/galactic-market">
            <IconButton sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
            RESOURCE <span style={{ color: '#ffd700' }}>EXCHANGE</span>
          </Typography>
        </Box>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{ 
            p: 10, 
            textAlign: 'center', 
            bgcolor: 'rgba(255,215,0,0.05)', 
            border: '1px dashed rgba(255,215,0,0.3)',
            borderRadius: 4
          }}>
            <SwapHoriz sx={{ fontSize: 100, color: '#ffd700', mb: 4, opacity: 0.5 }} />
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Módulo de Intercambio P2P</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Esta sección estará disponible en la Fase 3 del despliegue del Mercado Galáctico.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
