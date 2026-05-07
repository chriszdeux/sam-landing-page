"use client";

import { Box, Container, Typography, Paper, Grid } from "@mui/material";
import { ShoppingCart, SwapHoriz, Analytics } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GalacticMarketPage() {
  return (
    <Box sx={{ minHeight: '100vh', pt: 15, pb: 10, bgcolor: '#05050c' }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            MERCADO <span style={{ color: '#00f3ff' }}>GALÁCTICO</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 8, textAlign: 'center' }}>
            Central de intercambio de módulos y recursos para sistemas CORE_MODULES-8.
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Link href="/galactic-market/comprar" style={{ textDecoration: 'none' }}>
                <MarketCard 
                  icon={<ShoppingCart sx={{ fontSize: 40, color: '#00f3ff' }} />}
                  title="COMPRAR MÓDULOS"
                  description="Adquiere planos y estructuras para expandir tu estación."
                />
              </Link>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Link href="/galactic-market/exchange" style={{ textDecoration: 'none' }}>
                <MarketCard 
                  icon={<SwapHoriz sx={{ fontSize: 40, color: '#ffd700' }} />}
                  title="EXCHANGE"
                  description="Intercambia recursos y módulos con otros usuarios."
                />
              </Link>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Link href="/galactic-market/stats" style={{ textDecoration: 'none' }}>
                <MarketCard 
                  icon={<Analytics sx={{ fontSize: 40, color: '#ff0055' }} />}
                  title="ESTADÍSTICAS"
                  description="Analiza las tendencias del mercado y el valor de tus activos."
                />
              </Link>
            </Grid>
          </Grid>
          
          <Paper sx={{ mt: 8, p: 4, bgcolor: 'rgba(0, 243, 255, 0.05)', border: '1px dashed rgba(0, 243, 255, 0.3)', textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h5" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>
              MODO CONSTRUCCIÓN CENTRALIZADO
            </Typography>
            <Typography sx={{ color: 'white', mt: 1 }}>
              Los procesos de compra (Phase 1 & Phase 2) han sido trasladados aquí para optimizar el rendimiento del simulador.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

function MarketCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Paper sx={{ 
      p: 4, 
      height: '100%', 
      bgcolor: 'rgba(255,255,255,0.03)', 
      border: '1px solid rgba(255,255,255,0.1)', 
      borderRadius: 4,
      transition: 'all 0.3s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        bgcolor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(0, 243, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)'
      }
    }}>
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{description}</Typography>
    </Paper>
  );
}
