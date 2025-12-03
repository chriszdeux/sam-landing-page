'use client';

import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';


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
                Un Universo Sin Límites
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
                El universo de SAM está en constante crecimiento. Cada mes, lanzamos nuevos planetas y mapas detallados,
                expandiendo las fronteras de lo conocido. Desde nebulosas ricas en recursos hasta sistemas estelares inexplorados,
                siempre habrá un nuevo horizonte que conquistar. La expansión es constante, y solo los más rápidos podrán
                reclamar los mejores territorios.
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
              src="https://placehold.co/1200x600/0a0a1a/00f3ff/png?text=Nave+Explorando+Nebula"
              alt="Spaceship exploring nebula"
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
                Descubre Nuevos Mundos
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
                No estás solo en la oscuridad. Civilizaciones antiguas y facciones rivales compiten por el control de los territorios más valiosos.
                Descubre planetas habitables con ecosistemas únicos, establece colonias mineras en asteroides ricos en minerales y defiende
                tus fronteras de los piratas espaciales y las flotas enemigas. Cada planeta cuenta una historia, y tú eres el autor de su destino.
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
              src="https://placehold.co/1200x600/1a0a0a/ffb700/png?text=Paisaje+Alienigena"
              alt="Alien landscape"
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
                Tu Legado Comienza Aquí
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
                La exploración es solo el comienzo. Lo que encuentres ahí fuera definirá el futuro de la humanidad.
                ¿Serás un diplomático pacífico que une sistemas estelares, un comerciante astuto que controla las rutas de suministro,
                o un conquistador despiadado que impone su voluntad por la fuerza? En SAM, tu legado se escribe en las estrellas.
              </Typography>
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
