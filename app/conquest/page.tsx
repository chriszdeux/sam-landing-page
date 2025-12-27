'use client';

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { motion } from 'framer-motion';

export default function ConquestPage() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="lg" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 1, color: 'white' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                <Typography variant="h2" align="center" gutterBottom sx={{ color: '#ffb700', mb: 8, textTransform: 'uppercase', letterSpacing: 8 }}>
                    La Conquista Espacial
                </Typography>

                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main' }}>Fase 1: Expansión</Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                            La humanidad ha superado los límites del sistema solar. Ahora, la carrera es por asegurar los exoplanetas ricos en recursos antes que las corporaciones rivales.
                        </Typography>
                        <Typography paragraph sx={{ lineHeight: 1.8 }}>
                            Establece bases operativas, despliega flotas mineras y defiende tu territorio contra incursiones hostiles.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ width: '100%', height: 300, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,0,0.3)' }}>
                            <Typography variant="h1">🚀</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </motion.div>
        </Container>
    </Box>
  );
}
