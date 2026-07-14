'use client';

import React, { useRef, useState } from 'react';
import { Box, Typography, Divider, Grid, Button } from '@mui/material';
import { FileText, Play as PlayIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../ui/Section';
import { historyData } from '../../lib/data/history';
import { EnvVariables } from '@/lib/constants/variables';
import { CinematicStoryteller } from '../ui/CinematicStoryteller';
import { LoreFileModal } from '../ui/LoreFileModal';

gsap.registerPlugin(ScrollTrigger);

const DataLog = ({ 
  title, 
  year, 
  children, 
  color = '#00f3ff' 
}: { 
  title: string; 
  year?: string; 
  children: React.ReactNode; 
  color?: string;
}) => (
  <Box sx={{ 
    position: 'relative',
    p: { xs: 3, md: 5 },
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    borderLeft: `3px solid ${color}`,
    bgcolor: 'rgba(5, 10, 15, 0.65)',
    boxShadow: `0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.01)`,
    borderRadius: '4px',
    overflow: 'hidden',
  }}>
    {/* Monospace overlay scanlines for CRT aesthetic */}
    <Box sx={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%)',
      backgroundSize: '100% 4px',
      pointerEvents: 'none',
      zIndex: 2
    }} />

    <Typography variant="overline" sx={{ 
      color: 'rgba(255, 255, 255, 0.4)', 
      letterSpacing: 3, 
      display: 'block', 
      mb: 1.5, 
      fontFamily: 'monospace',
      fontSize: '0.75rem'
    }}>
      {`// RECORD_ENTRY: `}{year || 'UNKNOWN'}
    </Typography>
    
    <Typography variant="h4" sx={{ 
      mb: 3, 
      color: '#fff', 
      textTransform: 'uppercase', 
      fontWeight: 800,
      fontFamily: 'monospace',
      textShadow: `0 0 10px ${color}80`,
      fontSize: { xs: '1.5rem', md: '2.2rem' }
    }}>
      {title}
    </Typography>
    
    <Typography component="div" variant="body1" sx={{ 
      fontSize: '1rem', 
      color: 'rgba(255, 255, 255, 0.75)', 
      lineHeight: 1.8, 
      fontFamily: 'monospace' 
    }}>
      {children}
    </Typography>
  </Box>
);

export const HistorySection = () => {
  const [isCinematicOpen, setIsCinematicOpen] = useState(false);
  const [isLoreOpen, setIsLoreOpen] = useState(false);
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
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

  }, { scope: container });

  return (
    <Section id="history" className="overflow-hidden">
      {/* Dynamic Static & Flicker Animation Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes static-flicker {
          0%, 100% { opacity: 0.98; }
          50% { opacity: 1; }
          95% { opacity: 0.97; }
        }
      `}} />

      <Box ref={container} sx={{ animation: 'static-flicker 0.25s infinite' }}>
        <Box sx={{ mb: 12 }} className="history-main-title">
          <Typography variant="h2" align="center" gutterBottom sx={{ 
              color: 'white', 
              textTransform: 'uppercase', 
              fontWeight: 900,
              fontFamily: 'monospace',
              textShadow: '0 0 20px rgba(0, 243, 255, 0.8)'    
          }}>
            CRONOLOGÍA {project}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayIcon size={18} />}
              onClick={() => setIsCinematicOpen(true)}
              sx={{ 
                background: 'rgba(0, 243, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 243, 255, 0.5)',
                color: '#fff', 
                fontWeight: '900',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                letterSpacing: 2,
                px: 4,
                py: 1.5,
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.15)',
                '&:hover': {
                    background: 'rgba(0, 243, 255, 0.15)',
                    boxShadow: '0 0 30px rgba(0, 243, 255, 0.4)',
                    transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Reproducir Historia
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileText size={18} />}
              onClick={() => setIsLoreOpen(true)}
              sx={{ 
                borderColor: 'rgba(0, 243, 255, 0.4)',
                color: '#00f3ff', 
                fontWeight: '900',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                letterSpacing: 2,
                px: 4,
                py: 1.5,
                '&:hover': {
                    borderColor: '#00f3ff',
                    background: 'rgba(0, 243, 255, 0.05)',
                    boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
                    transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Leer Canon (lore.md)
            </Button>
          </Box>
          <Divider sx={{ my: 4, borderColor: '#00f3ff', opacity: 0.3, maxWidth: '200px', mx: 'auto' }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {historyData.map((eventData, yearIndex) => (
            <Box key={eventData.year}>

              <Box className="history-year-header" sx={{ textAlign: 'center', mb: 8 }}>
                  <Typography variant="overline" sx={{ color: '#ffb700', letterSpacing: 8, fontSize: '1.1rem', display: 'block', mb: 2, fontFamily: 'monospace' }}>
                      AÑO {eventData.year}
                  </Typography>
                  <Typography variant="h3" sx={{ 
                      fontSize: { xs: '1.8rem', md: '3.5rem' }, 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: 'white',
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      letterSpacing: 1,
                  }}>
                      {eventData.title}
                  </Typography>
                  <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '850px', mx: 'auto', lineHeight: 1.6, fontFamily: 'monospace', fontSize: '1.05rem' }}>
                      {eventData.description}
                  </Typography>
              </Box>

              <Grid container spacing={4}>
                {eventData.details.map((detail, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <Grid 
                      key={`${eventData.year}-${index}`}
                      size={{ xs: 12 }} 
                      className="history-text-block"
                    >
                      <DataLog 
                          title={detail.heading} 
                          year={`${eventData.year}.${index + 1}`} 
                          color={isEven ? '#00f3ff' : '#ffb700'}
                      >
                          {detail.paragraphs.map((p, i) => (
                              <p key={i} style={{ marginBottom: i < detail.paragraphs.length - 1 ? '1.2em' : 0 }}>
                                  {p}
                              </p>
                          ))}
                      </DataLog>
                    </Grid>
                  );
                })}
              </Grid>

              {yearIndex < historyData.length - 1 && (
                   <Divider sx={{ mt: 12, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <CinematicStoryteller 
        data={historyData} 
        isOpen={isCinematicOpen} 
        onClose={() => setIsCinematicOpen(false)} 
      />

      <LoreFileModal 
        open={isLoreOpen} 
        onClose={() => setIsLoreOpen(false)} 
      />
    </Section>
  );
};
