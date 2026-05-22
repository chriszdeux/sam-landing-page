// 1-Obtención del despachador para emitir acciones al store
// 2-Obtención del despachador para emitir acciones al store
// 3-Estructuración y renderizado visual del componente UI

import React, { useRef } from 'react';
import Link from 'next/link';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { Rocket, Globe, Shield, Activity, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import { TechFrame } from '../ui/TechFrame';
import { Section } from '../ui/Section';
import { openModal } from '../../lib/features/uiSlice';

//# 1-Obtención del despachador para emitir acciones al store
import { useAppDispatch } from '../../lib/hooks';
import { cyan } from '@mui/material/colors';
import { EnvVariables } from '@/lib/constants/variables';
import { TaoIcon } from '../ui/TaoIcon';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  
  //# 2-Obtención del despachador para emitir acciones al store
  const dispatch = useAppDispatch();
  const container = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { project } = EnvVariables;

  useGSAP(() => {
    gsap.from('.hero-content', {
      scrollTrigger: {
        trigger: '.hero-content',
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    });

    gsap.from('.hero-grid-item', {
      scrollTrigger: {
        trigger: '.hero-grid-container',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'expo.out'
    });

    gsap.from('.hero-video-container', {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut'
    });
  }, { scope: container });

  
  
  //# 3-Estructuración y renderizado visual del componente UI
  return (
    <Section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Cyberpunk Video Background */}
      <Box className="hero-video-container" sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 243, 255, 0.15) 0%, rgba(5, 10, 20, 0.8) 70%, #050a14 100%)',
          zIndex: 1
        }
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6) contrast(1.2) saturate(1.2)',
          }}
        >
          <source src="/assets/videos/hero.mp4" type="video/mp4" />
        </video>
        
        {/* Scanlines Effect */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.3
        }} />
      </Box>

      <Box ref={container} sx={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box className="hero-content">
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ width: 40, height: 2, bgcolor: '#00f3ff', boxShadow: '0 0 10px #00f3ff' }} />
                <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Activity size={14} /> ESTADO: TRANSMISIÓN_ACTIVA
                </Typography>
              </Stack>

              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '5.5rem' },
                mb: 1,
                fontWeight: 900,
                lineHeight: 1,
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #fff 20%, #00f3ff 50%, #fff 80%)',
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shine 4s linear infinite',
                filter: 'drop-shadow(0 0 15px rgba(0, 243, 255, 0.3))',
                '@keyframes shine': {
                  'to': { backgroundPosition: '200% center' }
                }
              }}>
                {project}
              </Typography>
              
              <Typography variant="h4" sx={{ 
                mb: 4, 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: 700,
                letterSpacing: -0.5,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                La soberanía ya no es planetaria; <Box component="span" sx={{ color: '#00f3ff', textShadow: '0 0 10px #00f3ff' }}>es galáctica.</Box>
              </Typography>

              <Typography variant="body1" sx={{ 
                mb: 6, 
                maxWidth: 600, 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '1.15rem',
                lineHeight: 1.8,
                borderLeft: '2px solid rgba(0, 243, 255, 0.3)',
                pl: 3
              }}>
                Vive la evolución de {project}: desde el subsuelo de Guadalajara hasta la colonización de Alfa Centauri. 
                Una economía viva donde el valor (<TaoIcon size={20} />) y la energía 
                 fluyen a través de una red interestelar soberana.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  glow
                  onClick={() => dispatch(openModal('register'))}
                  startIcon={<Rocket />}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    bgcolor: '#00f3ff',
                    color: '#000',
                    '&:hover': { bgcolor: '#00d0db' }
                  }}
                >
                  Comenzar Misión
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => document.getElementById('mechanics')?.scrollIntoView({ behavior: 'smooth' })}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.1rem', 
                    color: '#fff', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: '#00f3ff', color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.05)' }
                  }}
                >
                  Explorar Mecánicas
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="hero-grid-container" sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 3, maxWidth: '400px', ml: 'auto' }}>
              {[
                { icon: Globe, label: 'Expansión Interestelar', color: '#00f3ff', href: '/exploracion-infinita', desc: 'Explora sistemas solares únicos y reclama tu territorio.' },
                { icon: Shield, label: `Protocolo ${project}`, color: '#ffb700', href: '/security', desc: 'Seguridad de grado militar en cada transacción galáctica.' },
              ].map((item, index) => (
                <Box
                  key={index}
                  className="hero-grid-item"
                >
                  <Link href={item.href} style={{ textDecoration: 'none' }}>
                    <TechFrame color={item.color} className="h-full">
                      <Box sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        height: '100%',
                      }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: '12px', 
                          bgcolor: `${item.color}15`, 
                          border: `1px solid ${item.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 15px ${item.color}20`
                        }}>
                          <item.icon size={32} color={item.color} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            color="white" 
                            sx={{ 
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              fontSize: '0.9rem',
                              mb: 0.5
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: 1.4, display: 'block' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                        <Zap size={16} color={item.color} style={{ marginLeft: 'auto', opacity: 0.5 }} />
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

