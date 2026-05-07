// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '../../components/ui/Button';
import Image from 'next/image';
import { ParticleBackground } from '../../components/ui/ParticleBackground';
import { EnvVariables } from '@/lib/constants/variables';

export default function InfiniteExplorationPage() {
  const router = useRouter();

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      bgcolor: '#050514',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Particles */}
      <ParticleBackground />

      {/* Back Button - Positioned overlay */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
        <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ 
              backdropFilter: 'blur(5px)',
              borderColor: 'rgba(0, 243, 255, 0.5)',
              color: '#00f3ff',
              '&:hover': {
                borderColor: '#00f3ff',
                bgcolor: 'rgba(0, 243, 255, 0.1)'
              }
            }}
        >
            Regresar
        </Button>
      </Box>

<<<<<<< Updated upstream
          {}
          <Grid container spacing={8} alignItems="center">
            
            {}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <DataLog title="Más allá de la Heliosfera" date="2065.04.12">
                  Lo que comenzó en Marte no pudo ser contenido. En 2065, la humanidad lanzó la primera sonda tripulada hacia Próxima Centauri. 
                  El reto no era solo la supervivencia física, sino la viabilidad económica a 4 años luz de distancia. 
                  El <strong style={{ color: '#00f3ff' }}>Protocolo {EnvVariables.project}</strong> respondió replicando su arquitectura, creando una red donde el valor viaja más rápido que la materia.
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

            {}
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
                   Para sostener la economía galáctica, {project} desplegó estructuras masivas:
                    <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                      <li style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[NODOS]</span> Forja Solar: Captadores de energía pura.
                      </li>
                      <li style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[PUENTES]</span> Aceleradores 
                        {project}: Entrelazamiento cuántico.
                      </li>
                      <li>
                        <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[SYNC]</span> Valor <Link href="/mechanics/economy" style={{ color: '#ff0055', textDecoration: 'none', fontWeight: 'bold' }}>(${EnvVariables.coin1})</Link> instantáneo.
                      </li>
                    </ul>
                </DataLog>
              </motion.div>
            </Grid>
            
            {}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                 <DataLog title="La Soberanía Estelar" date="2088.01.01">
                   La expansión no es solo territorial, es <strong style={{ color: '#00f3ff' }}>existencial</strong>. Con la Capa de Tránsito conectando sistemas y las Forjas alimentando la independencia energética de cada colonia, 
                    {project} ha asegurado que la humanidad no dependa de un solo punto de fallo.
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
=======
      {/* Full Screen Map Container */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <GalacticExplorer />
>>>>>>> Stashed changes
      </Box>
    </Box>
  );
}

