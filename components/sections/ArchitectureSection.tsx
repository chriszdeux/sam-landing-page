// 1-Estructuración y renderizado visual del componente UI

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography, Grid, Box, Button } from '@mui/material';
import { Section } from '../ui/Section';
import { TechFrame } from '../ui/TechFrame';
import { SectionTitle } from '../ui/SectionTitle';
import { ArrowForward } from '@mui/icons-material';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { architectureData } from '../../lib/data/architecture';

gsap.registerPlugin(ScrollTrigger);

export const ArchitectureSection = () => {
  const container = useRef<HTMLElement | null>(null);
  const previewBuildings = architectureData.slice(0, 4);

  useGSAP(() => {
    gsap.from('.arch-title', {
      scrollTrigger: {
        trigger: '.arch-title',
        start: 'top 85%',
      },
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.arch-card', {
      scrollTrigger: {
        trigger: '.arch-grid',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });

    gsap.from('.arch-btn', {
      scrollTrigger: {
        trigger: '.arch-btn',
        start: 'top 95%',
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power2.out'
    });

  }, { scope: container });

  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <Section id="architecture">
      <Box ref={container}>
        <Box className="arch-title">
            <SectionTitle subtitle="// STRUCTURES" align="center">
                Arquitectura
            </SectionTitle>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch" className="arch-grid">
            {previewBuildings.map((building, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index} sx={{ display: 'flex' }} className="arch-card">
                <TechFrame color={building.color} className="h-full w-full">
                    <Box sx={{
                        height: '100%',
                        width: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        justifyContent: 'space-between'
                    }}>
                        <Box className="glitch-effect" sx={{
                            width: '100%',
                            height: 180,
                            position: 'relative',
                            borderRadius: '16px',
                            bgcolor: 'rgba(255,255,255,0.03)',
                            mb: 3,
                            border: `1px solid rgba(255,255,255,0.1)`,
                            overflow: 'hidden',
                        }}>
                            <Image 
                                src={building.image} 
                                alt={building.name}
                                fill
                                className="holo-image"
                                style={{ 
                                    objectFit: 'cover',
                                    opacity: 0.8,
                                    animationDelay: `${(index * 1.2) % 5}s`
                                }} 
                            />
                            <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${building.color}40, transparent)` }} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: 'white', mb: 1, zIndex: 2 }}>
                                {building.name}
                            </Typography>

                            <Typography variant="caption" sx={{ 
                                color: building.color, 
                                border: `1px solid ${building.color}40`, 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1,
                                mb: 2,
                                textTransform: 'uppercase',
                                fontSize: '0.65rem',
                                zIndex: 2
                            }}>
                                NIVEL {building.level} | {building.type}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6, zIndex: 2 }}>
                                {building.description}
                            </Typography>
                        </Box>
                    </Box>
                </TechFrame>
            </Grid>
            ))}
        </Grid>
        
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }} className="arch-btn">
            <Link href="/architecture" style={{ textDecoration: 'none' }}>
                <Button 
                    variant="outlined" 
                    endIcon={<ArrowForward />}
                    sx={{ 
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.2)',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(0,255,255,0.05)'
                        }
                    }}
                >
                    Ver más estructuras
                </Button>
            </Link>
        </Box>
      </Box>
    </Section>
  );
};
