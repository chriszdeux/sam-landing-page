/**
 * Sección de Historia/Cronología
 * Componentes visuales personalizados (TechFrame, DataLog)
 * Animaciones complejas con GSAP (ScrollTrigger)
 * Renderizado de eventos históricos
 */
'use client';

import React, { useRef } from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../ui/Section';
import { historyData } from '../../lib/data/history';
import { EnvVariables } from '@/lib/constants/variables';

gsap.registerPlugin(ScrollTrigger);

const TechFrame = ({ children, color = '#ff0055' }: { children: React.ReactNode; color?: string }) => (
  <Box
    sx={{
      position: 'relative',
      p: '4px',
      background: `linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%)`,
      filter: `drop-shadow(0 0 5px ${color}80)`,
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
      bgcolor: 'rgba(0,0,0,0.7)',
    }}>
      {children}
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

const DataLog = ({ title, year, children, align = 'left' }: { title: string; year?: string; children: React.ReactNode; align?: 'left' | 'right' }) => (
  <Box sx={{ 
    textAlign: align, 
    position: 'relative',
    p: { xs: 2, md: 4 },
    borderLeft: align === 'left' ? '2px solid #ff0055' : 'none',
    borderRight: align === 'right' ? '2px solid #00f3ff' : 'none',
    background: 'linear-gradient(90deg, rgba(255, 0, 85, 0.05) 0%, rgba(0,0,0,0) 100%)',
    backdropFilter: 'blur(5px)',
  }}>
    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2, display: 'block', mb: 1, fontFamily: 'monospace' }}>
      {'// ARCHIVE RECORD: '}{year || 'UNKNOWN'}
    </Typography>
    <Typography variant="h3" sx={{ 
      mb: 3, 
      color: 'white', 
      textTransform: 'uppercase', 
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(255, 0, 85, 0.5)',
      fontSize: { xs: '1.8rem', md: '2.5rem' }
    }}>
      {title}
    </Typography>
    <Typography component="div" variant="body1" sx={{ fontSize: '1.1rem', color: 'gray', lineHeight: 1.8, fontFamily: 'monospace' }}>
      {children}
    </Typography>
  </Box>
);

export const HistorySection = () => {
  const container = useRef<HTMLElement | null>(null);
  const { project } = EnvVariables;

  useGSAP(() => {
    gsap.from('.history-main-title', {
      scrollTrigger: {
        trigger: '.history-main-title',
        start: 'top 80%',
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    const headers = gsap.utils.toArray<HTMLElement>('.history-year-header');
    headers.forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    const textBlocks = gsap.utils.toArray<HTMLElement>('.history-text-block');
    textBlocks.forEach((block) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    const imageBlocks = gsap.utils.toArray<HTMLElement>('.history-image-block');
    imageBlocks.forEach((block) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
        },
        x: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

  }, { scope: container });

  return (
    <Section id="history" className="overflow-hidden">
      <Box ref={container}>
        <Box sx={{ mb: 12 }} className="history-main-title">
          <Typography variant="h2" align="center" gutterBottom sx={{ 
              color: 'white', 
              textTransform: 'uppercase', 
              fontWeight: 900,
              textShadow: '0 0 20px rgba(0, 243, 255, 0.8)'    
          }}>
            Cronología {project}
          </Typography>
          <Divider sx={{ my: 4, borderColor: '#00f3ff', opacity: 0.3, maxWidth: '200px', mx: 'auto' }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {historyData.map((eventData, yearIndex) => (
            <Box key={eventData.year}>

              <Box className="history-year-header" sx={{ textAlign: 'center', mb: 10 }}>
                  <Typography variant="overline" sx={{ color: '#ffb700', letterSpacing: 8, fontSize: '1.2rem', display: 'block', mb: 2 }}>
                      AÑO // {eventData.year}
                  </Typography>
                  <Typography variant="h3" sx={{ 
                      fontSize: { xs: '1.8rem', md: '4rem' }, 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: 'white',
                      textTransform: 'uppercase',
                      hyphens: 'auto',
                      wordBreak: 'break-word',
                  }}>
                      {eventData.title}
                  </Typography>
                  <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6, fontFamily: 'monospace' }}>
                      {eventData.description}
                  </Typography>
              </Box>

                  <Grid container spacing={{ xs: 2, md: 8 }} alignItems="center">
                  {eventData.details.map((detail, index) => {
                      const isEven = index % 2 === 0;
                      
                      return (
                          <React.Fragment key={`${eventData.year}-${index}`}>

                              <Grid 
                                size={{ xs: 12, md: 6 }} 
                                sx={{ order: isEven ? { xs: 2, md: 1 } : { xs: 2, md: 2 } }}
                                className="history-text-block"
                              >
                                  <DataLog 
                                      title={detail.heading} 
                                      year={`${eventData.year}.${index + 1}`} 
                                      align={isEven ? 'left' : 'right'}
                                  >
                                      {detail.paragraphs.map((p, i) => (
                                          <p key={i} style={{ marginBottom: i < detail.paragraphs.length - 1 ? '1em' : 0 }}>
                                              {p}
                                          </p>
                                      ))}
                                  </DataLog>
                              </Grid>



                              <Grid 
                                size={{ xs: 12, md: 6 }} 
                                sx={{ order: isEven ? { xs: 1, md: 2 } : { xs: 1, md: 1 } }}
                                className="history-image-block"
                              >
                                  <TechFrame color={isEven ? '#00f3ff' : '#ffb700'}>
                                      <Box className="glitch-effect" sx={{ 
                                          position: 'relative', 
                                          height: { xs: 300, md: 400 }, 
                                          width: '100%',
                                          overflow: 'hidden'
                                      }}>
                                          {detail.image ? (
                                              <Image
                                                  src={detail.image}
                                                  alt={detail.imageCaption}
                                                  fill
                                                  className="holo-image"
                                                  style={{ 
                                                      objectFit: 'cover',
                                                      animationDelay: `${((yearIndex * 5 + index) * 0.7) % 5}s`
                                                  }}
                                              />
                                          ) : (
                                              <Box sx={{ 
                                                  height: '100%', 
                                                  width: '100%', 
                                                  display: 'flex', 
                                                  alignItems: 'center', 
                                                  justifyContent: 'center',
                                                  background: `radial-gradient(circle at center, ${isEven ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 183, 0, 0.1)'} 0%, transparent 70%)`
                                              }}>
                                                  <Typography sx={{ color: 'text.disabled', fontStyle: 'italic', p: 2, textAlign: 'center' }}>
                                                      [IMAGEN NO DISPONIBLE: {detail.imageCaption}]
                                                  </Typography>
                                              </Box>
                                          )}

                                          <Box sx={{
                                              position: 'absolute',
                                              bottom: 0,
                                              left: 0,
                                              right: 0,
                                              p: 2,
                                              background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                              color: 'rgba(255,255,255,0.8)',
                                              fontSize: '0.8rem',
                                              fontFamily: 'monospace',
                                              zIndex: 3,
                                          }}>
                                              IMG_REF: {detail.imageCaption}
                                          </Box>
                                      </Box>
                                  </TechFrame>
                              </Grid>
                          </React.Fragment>
                      );
                  })}
              </Grid>

              {yearIndex < historyData.length - 1 && (
                   <Divider sx={{ mt: 16, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
};
