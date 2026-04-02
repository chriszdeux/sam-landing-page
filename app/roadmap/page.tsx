"use client";

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { PageHeader } from '@/components/ui/PageHeader';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { motion } from 'framer-motion';

const roadmapPhases = [
  { phase: "Fase 1", title: "Lanzamiento MVP & Wishlist", status: "Activo", desc: "Apertura del ecosistema web para registros e integración inicial. Prepárate para el inicio." },
  { phase: "Fase 2", title: "Minería & Laboratorio", status: "Próximamente", desc: "Activación del marketplace minero, gestión de hardware, y simulación de desgaste operativo." },
  { phase: "Fase 3", title: "Consenso de Red Lyncore", status: "Próximamente", desc: "Participación en el Power Pool global, procesamiento de transacciones, inyección y recompensas de bloque." },
  { phase: "Fase 4", title: "Economía y Trading", status: "Próximamente", desc: "Habilitación del comercio de tokens en el mercado abierto, liquidez, y portafolio avanzado." }
];

export default function RoadmapPage() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pt: 12 }}>
      <ParticleBackground />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <PageHeader 
          title="Lyncore Roadmap" 
          subtitle="Conoce el camino hacia la descentralización y la economía del futuro." 
        />
        
        <Box sx={{ mt: 8, mb: 10 }}>
          <Grid container spacing={4}>
            {roadmapPhases.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Box sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    bgcolor: 'rgba(10, 15, 30, 0.6)', 
                    border: '1px solid',
                    borderColor: item.status === 'Activo' ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255,255,255,0.05)',
                    boxShadow: item.status === 'Activo' ? '0 0 20px rgba(0, 243, 255, 0.1)' : 'none',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: item.status === 'Activo' ? 'rgba(0, 243, 255, 0.8)' : 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-5px)'
                    }
                  }}>
                    {item.status === 'Activo' && (
                      <Box sx={{ 
                        position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', 
                        bgcolor: '#00f3ff', boxShadow: '0 0 10px #00f3ff' 
                      }} />
                    )}
                    <Typography variant="overline" sx={{ color: item.status === 'Activo' ? '#00f3ff' : 'text.secondary', fontWeight: 'bold', display: 'block', mb: 1 }}>
                      {item.phase} • {item.status}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, mb: 2, fontWeight: 'bold', color: item.status === 'Activo' ? 'white' : 'rgba(255,255,255,0.8)' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
