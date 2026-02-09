import React, { useRef } from 'react';
import Link from 'next/link';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { Rocket, Globe, Shield } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import { TechFrame } from '../ui/TechFrame';
import { Section } from '../ui/Section';
import { openModal } from '../../lib/features/uiSlice';
import { useAppDispatch } from '../../lib/hooks';
import { cyan } from '@mui/material/colors';
import { EnvVariables } from '@/lib/constants/variables';
import { TaoIcon } from '../ui/TaoIcon';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const dispatch = useAppDispatch();
  const container = useRef<HTMLElement | null>(null);
  const { project, coin } = EnvVariables;
  useGSAP(() => {
    // Animate Left Content
    gsap.from('.hero-content', {
      scrollTrigger: {
        trigger: '.hero-content',
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Animate Right Grid Items with Stagger
    gsap.from('.hero-grid-item', {
      scrollTrigger: {
        trigger: '.hero-grid-container',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });
  }, { scope: container });

  return (
    <Section id="home" className="relative overflow-hidden">
      <Box ref={container}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box className="hero-content">
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '5rem' },
                mb: 2,
                background: 'linear-gradient(45deg, #00f3ff, #ffb700)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {project}
              </Typography>
              <Typography variant="h4" sx={{ mb: 4, color: 'text.secondary', fontWeight: 300 }}>
                La soberanía ya no es planetaria; es galáctica.
              </Typography>
              <Typography variant="body1" sx={{ mb: 6, maxWidth: 600, color: 'text.secondary', fontSize: '1.1rem' }}>
                Vive la evolución de {project}: desde el subsuelo de Guadalajara hasta la colonización de Alfa Centauri. 
                Una economía viva donde el valor (<TaoIcon size={20} />) y la energía 
                 fluyen a través de una red interestelar soberana.
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
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="hero-grid-container" sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
              {[
                { icon: Globe, label: 'Expansión Interestelar', color: cyan[500], href: '/exploracion-infinita' },
                { icon: Shield, label: `Protocolo ${project}`, color: '#00f3ff', href: '/security' },
              ].map((item, index) => (
                <Box
                  key={index}
                  className="hero-grid-item"
                  sx={{ height: '100%' }}
                >
                  <Link href={item.href} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                    <TechFrame color={item.color} className="h-full">
                      <Box sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '160px',
                      }}>
                        <item.icon size={40} color={item.color} style={{ marginBottom: 16, position: 'relative', zIndex: 3 }} />
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          color="white" 
                          align="center" 
                          sx={{ 
                            position: 'relative', 
                            zIndex: 3,
                            textTransform: 'uppercase',
                            letterSpacing: 1
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    </TechFrame>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Section>
  );
};
