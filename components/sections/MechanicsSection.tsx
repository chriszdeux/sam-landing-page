import React, { useRef } from 'react';
import Link from 'next/link';
import { Typography, Grid, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../ui/Section';
import { TechFrame } from '../ui/TechFrame';
import { SectionTitle } from '../ui/SectionTitle';
import { mechanicsData } from '../../lib/data/mechanics';
import { EnvVariables } from '@/lib/constants/variables';

gsap.registerPlugin(ScrollTrigger);

export const MechanicsSection = () => {
  const container = useRef<HTMLElement | null>(null);
  const { coin1, coin2, coin3 } = EnvVariables
  useGSAP(() => {
    // Animate Title
    gsap.from('.mechanics-title', {
      scrollTrigger: {
        trigger: '.mechanics-title',
        start: 'top 85%',
      },
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Animate Cards
    gsap.from('.mechanic-card-item', {
      scrollTrigger: {
        trigger: '.mechanics-grid',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }, { scope: container });

  return (
    <Section id="mechanics">
      <Box ref={container}>
        <Box className="mechanics-title">
            <SectionTitle subtitle="// CORE SYSTEMS" align="center">
                Mecánicas de Juego
            </SectionTitle><SectionTitle subtitle="// Próximamente //" align="center">
            </SectionTitle>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch" className="mechanics-grid">
            {mechanicsData.map((mechanic, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }} className="mechanic-card-item">
                <TechFrame color={mechanic.color} className="h-full w-full">
                    <Box sx={{
                        height: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        justifyContent: 'space-between'
                    }}>
                        <Link href={`/mechanics/${mechanic.slug}`} style={{ textDecoration: 'none' }}>
                            <Box className="icon-box" sx={{
                                p: 3,
                                borderRadius: '24px',
                                bgcolor: 'rgba(255,255,255,0.03)',
                                mb: 3,
                                border: `1px solid rgba(255,255,255,0.1)`,
                                transition: 'all 0.4s ease',
                                display: 'inline-flex',
                                '&:hover': {
                                    bgcolor: `${mechanic.color}20`,
                                    transform: 'scale(1.1) rotate(5deg)',
                                    borderColor: mechanic.color
                                }
                            }}>
                                <mechanic.icon size={40} color={mechanic.color} />
                            </Box>
                        </Link>
                        
                        <Link href={`/mechanics/${mechanic.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                            {mechanic.title}
                        </Typography>
                        </Link>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
                        {mechanic.description.split(/(\${coin1}|\${coin2}|\${coin3})/g).map((part, index) => {
                            if (part === coin1) return <Link key={index} href="/mechanics/economy" style={{ color: '#ff0055', textDecoration: 'none', fontWeight: 'bold' }}>{coin1}</Link>;
                            if (part === coin2) return <Link key={index} href="/mechanics/economy" style={{ color: '#ffb700', textDecoration: 'none', fontWeight: 'bold' }}>{coin2}</Link>;
                            if (part === coin3) return <Link key={index} href="/mechanics/economy" style={{ color: '#00ff9d', textDecoration: 'none', fontWeight: 'bold' }}>{coin3}</Link>;
                            return part;
                        })}
                        </Typography>

                        <Link href={`/mechanics/${mechanic.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box className="learn-more" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: mechanic.color,
                            opacity: 0.8,
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            '&:hover': {
                                opacity: 1,
                                transform: 'translateY(2px)',
                            }
                        }}>
                            EXPLORAR <ArrowForward fontSize="small" />
                        </Box>
                        </Link>
                    </Box>
                </TechFrame>
            </Grid>
            ))}
        </Grid>
      </Box>
    </Section>
  );
};
