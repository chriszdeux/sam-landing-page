'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ParticleBackground } from '../../components/ui/ParticleBackground';

// Custom components for the Sci-Fi aesthetic

const TechFrame = ({ children, color = '#00f3ff' }: { children: React.ReactNode; color?: string }) => (
  <Box
    sx={{
      position: 'relative',
      p: '4px',
      background: `linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%)`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: `1px solid ${color}40`,
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)',
        pointerEvents: 'none',
      },
    }}
  >
    <Box sx={{ 
      position: 'relative', 
      clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)',
      bgcolor: 'rgba(0,0,0,0.5)',
    }}>
      {children}
      {/* Scanline effect */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `linear-gradient(to bottom, transparent 50%, ${color}10 50%)`,
        backgroundSize: '100% 4px',
        pointerEvents: 'none',
        zIndex: 2,
      }} />
    </Box>
  </Box>
);

const DataLog = ({ title, date, children, align = 'left' }: { title: string; date?: string; children: React.ReactNode; align?: 'left' | 'right' }) => (
  <Box sx={{ 
    textAlign: align, 
    position: 'relative',
    p: 4,
    borderLeft: align === 'left' ? '2px solid #00f3ff' : 'none',
    borderRight: align === 'right' ? '2px solid #ffb700' : 'none',
    background: 'linear-gradient(90deg, rgba(0, 243, 255, 0.05) 0%, rgba(0,0,0,0) 100%)',
    backdropFilter: 'blur(5px)',
  }}>
    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2, display: 'block', mb: 1, fontFamily: 'monospace' }}>
      {'// LOG DATA: '}{date || 'UNKNOWN'}
    </Typography>
    <Typography variant="h3" sx={{ 
      mb: 3, 
      color: 'white', 
      textTransform: 'uppercase', 
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(0,243,255,0.5)',
      fontSize: { xs: '1.8rem', md: '2.5rem' }
    }}>
      {title}
    </Typography>
    <Typography component="div" variant="body1" sx={{ fontSize: '1.1rem', color: 'gray', lineHeight: 1.8, fontFamily: 'monospace' }}>
      {children}
    </Typography>
  </Box>
);

export default function InfiniteExplorationPage() {
  return (
    <>
      <ParticleBackground />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'transparent',
        pt: 16, 
        pb: 12,
        overflow: 'hidden',
        position: 'relative', // Ensure context for children
        zIndex: 1
      }}>
        <Container maxWidth="xl">
          {/* HERO SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Box sx={{ textAlign: 'center', mb: 16, position: 'relative' }}>
              <Typography variant="overline" sx={{ color: '#ffb700', letterSpacing: 8, fontSize: '1.2rem', display: 'block', mb: 2 }}>
                SYSTEM OVERRIDE // CLASSIFIED
              </Typography>
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '6rem' },
                fontWeight: 900,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '-2px',
                textShadow: '0 0 20px rgba(0, 243, 255, 0.8)',
                position: 'relative',
                display: 'inline-block'
              }}>
                UNIVERSO EN <span style={{ color: '#00f3ff' }}>EXPANSIÓN</span>
              </Typography>
              <Divider sx={{ my: 4, borderColor: '#00f3ff', opacity: 0.3, maxWidth: '200px', mx: 'auto' }} />
            </Box>
          </motion.div>

          {/* CONTENT GRID */}
          <Grid container spacing={8} alignItems="center">
            
            {/* BLOCK 1: Text Left, Image Right */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <DataLog title="Más allá de la Heliosfera" date="2065.04.12">
                  Lo que comenzó en Marte no pudo ser contenido. En 2065, la humanidad lanzó la primera sonda tripulada hacia Próxima Centauri. 
                  El reto no era solo la supervivencia física, sino la viabilidad económica a 4 años luz de distancia. 
                  El <strong style={{ color: '#00f3ff' }}>Protocolo LynCore</strong> respondió replicando su arquitectura, creando una red donde el valor viaja más rápido que la materia.
                </DataLog>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <TechFrame color="#00f3ff">
                  <Image
                    src="/assets/images/universe_expansion/beyond.jpg"
                    alt="Beyond the Heliosphere"
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </TechFrame>
              </motion.div>
            </Grid>

            {/* BLOCK 2: Image Left, Text Right */}
             <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <TechFrame color="#ffb700">
                  <Image
                    src="/assets/images/universe_expansion/energy_supply.jpg"
                    alt="Helios-Prime Solar Forge"
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </TechFrame>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                 <DataLog title="Los Grandes Aceleradores de Sistemas" date="2072.11.08" align="right">
                   Para sostener la economía galáctica, LynCore desplegó estructuras masivas:
                    <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                      <li style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[NODOS]</span> Forja Solar: Captadores de energía pura.
                      </li>
                      <li style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[PUENTES]</span> Aceleradores Quetzalcóatl: Entrelazamiento cuántico.
                      </li>
                      <li>
                        <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[SYNC]</span> Valor <Link href="/mechanics/economy" style={{ color: '#ff0055', textDecoration: 'none', fontWeight: 'bold' }}>($TAO)</Link> instantáneo.
                      </li>
                    </ul>
                </DataLog>
              </motion.div>
            </Grid>
            
            {/* BLOCK 3: Text Left, Image Right */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                 <DataLog title="La Soberanía Estelar" date="2088.01.01">
                   La expansión no es solo territorial, es <strong style={{ color: '#00f3ff' }}>existencial</strong>. Con la Capa de Tránsito conectando sistemas y las Forjas alimentando la independencia energética de cada colonia, 
                   LynCore ha asegurado que la humanidad no dependa de un solo punto de fallo.
                   <br /><br />
                   <span style={{ color: 'white', backgroundColor: '#00f3ff33', padding: '4px 8px', borderRadius: '4px' }}>ESTADO: INDEPENDIENTE</span>
                </DataLog>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <TechFrame color="#ff0055">
                  <Image
                    src="/assets/images/universe_expansion/acelerator.jpg"
                    alt="Interstellar Particle Accelerator"
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </TechFrame>
              </motion.div>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
}
