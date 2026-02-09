'use client';

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { motion } from 'framer-motion';
import { EnvVariables } from '@/lib/constants/variables';

export default function ConquestPage() {
    const { project } = EnvVariables;
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="lg" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 1, color: 'white' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                <Typography variant="h2" align="center" gutterBottom sx={{ color: '#ffb700', mb: 8, textTransform: 'uppercase', letterSpacing: 8 }}>
                    CONQUISTA DE SISTEMAS
                </Typography>

                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main' }}>Marte: La Primera Frontera (2042)</Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                            Todo cambió en Arsia Mons. Los colonos, hartos de los impuestos terrestres, adoptaron {project} como moneda nativa, probando por primera vez la soberanía financiera interplanetaria.
                        </Typography>
                        <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', mt: 4 }}>El Tratado de Sirio (2088)</Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                            Por primera vez en la historia, una IA ({project}) negoció la paz. Evitó una guerra civil galáctica entre corporaciones mineras y colonias soberanas mediante contratos inteligentes inmutables.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ width: '100%', height: 300, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,0,0.3)' }}>
                            <Typography variant="h1">🪐</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </motion.div>
        </Container>
    </Box>
  );
}
