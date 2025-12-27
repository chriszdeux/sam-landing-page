import React from 'react';
import Link from 'next/link';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Rocket, Globe, Zap, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { openModal } from '../../lib/features/uiSlice';
import { useAppDispatch } from '../../lib/hooks';
import { cyan } from '@mui/material/colors';

export const HeroSection = () => {
  const dispatch = useAppDispatch();

  return (
    <Section id="home" className="relative overflow-hidden">
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              mb: 2,
              background: 'linear-gradient(45deg, #00f3ff, #ffb700)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              PROYECTO SAM
            </Typography>
            <Typography variant="h4" sx={{ mb: 4, color: 'text.secondary', fontWeight: 300 }}>
              Domina la Galaxia. Construye tu Legado.
            </Typography>
            <Typography variant="body1" sx={{ mb: 6, maxWidth: 600, color: 'text.secondary', fontSize: '1.1rem' }}>
              Una simulación de cripto-economía inmersiva donde la exploración espacial,
              la gestión de recursos y la estrategia política definen tu destino.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                glow
                onClick={() => dispatch(openModal('register'))}
                startIcon={<Rocket />}
              >
                Comenzar Misión
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => document.getElementById('mechanics')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorar Mecánicas
              </Button>
            </Stack>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {[
              { icon: Globe, label: 'Universo en Expansión', color: cyan[500], href: '/exploracion-infinita' },
              { icon: Zap, label: 'Economía Real', color: '#ffb700', href: '/market' }, // Updated Link and Color
              { icon: Shield, label: 'Seguridad Blockchain', color: '#00f3ff', href: '#' },
              { icon: Rocket, label: 'Conquista Espacial', color: '#ff0055', href: '#' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Box sx={{
                    p: 3,
                    bgcolor: 'rgba(10,10,10,0.6)', // Darker background with opacity
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.05)',
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(45deg, ${item.color}00, ${item.color}10)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: item.color,
                      boxShadow: `0 10px 30px -10px ${item.color}66`,
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}>
                    <item.icon size={32} color={item.color} style={{ marginBottom: 16, position: 'relative', zIndex: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold" color="white" sx={{ position: 'relative', zIndex: 1 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Link>
              </motion.div>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
};
