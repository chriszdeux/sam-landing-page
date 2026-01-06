'use client';

import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';


export default function InfiniteExplorationPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 16, pb: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h1" align="center" sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            mb: 8,
            background: 'linear-gradient(45deg, #00f3ff, #ffb700)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            UNIVERSO EN EXPANSIÓN
          </Typography>
        </motion.div>

        <Stack spacing={12}>
          {/* Section 1: Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                Más allá de la Heliosfera
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
                Lo que comenzó en Marte no pudo ser contenido. En 2065, la humanidad lanzó la primera sonda tripulada hacia Próxima Centauri. 
                El reto no era solo la supervivencia física, sino la viabilidad económica a 4 años luz de distancia. 
                El Protocolo LynCore respondió replicando su arquitectura, creando una red donde el valor viaja más rápido que la materia.
              </Typography>
            </Box>
          </motion.div>

          {/* Section 2: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box
              component="img"
              src="https://placehold.co/1200x600/0a0a1a/00f3ff/png?text=Acelerador+de+Particulas+Interestelar"
              alt="Interstellar Particle Accelerator"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 0 40px rgba(0, 243, 255, 0.2)',
                border: '1px solid rgba(0, 243, 255, 0.1)',
              }}
            />
          </motion.div>

          {/* Section 3: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'secondary.main' }}>
                Los Grandes Aceleradores de Sistemas
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
                Para sostener la economía galáctica, LynCore desplegó estructuras masivas:
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                  <li style={{ marginBottom: '15px' }}><strong>Nodos de Forja Solar:</strong> Satélites similares a Helios-Prime en cada estrella colonizada, captando energía pura.</li>
                  <li style={{ marginBottom: '15px' }}><strong>Aceleradores Quetzalcóatl:</strong> Puentes de entrelazamiento cuántico en los bordes de cada sistema.</li>
                  <li><strong>Sincronización Galáctica:</strong> Aunque las naves tardan décadas, el valor (<Link href="/mechanics/economy" style={{ color: '#ff0055', textDecoration: 'none', fontWeight: 'bold' }}>$TAO</Link>) y la información viajan instantáneamente.</li>
                </ul>
              </Typography>
            </Box>
          </motion.div>

          {/* Section 4: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box
              component="img"
              src="https://placehold.co/1200x600/1a0a0a/ffb700/png?text=Forja+Solar+Helios-Prime"
              alt="Helios-Prime Solar Forge"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 0 40px rgba(255, 183, 0, 0.2)',
                border: '1px solid rgba(255, 183, 0, 0.1)',
              }}
            />
          </motion.div>

          {/* Section 5: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 3, color: 'white' }}>
                La Soberanía Estelar
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
                La expansión no es solo territorial, es existencial. Con la Capa de Tránsito conectando sistemas y las Forjas alimentando la independencia energética de cada colonia, 
                LynCore ha asegurado que la humanidad no dependa de un solo punto de fallo. La Tierra es el origen, pero las estrellas son el destino.
              </Typography>
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
