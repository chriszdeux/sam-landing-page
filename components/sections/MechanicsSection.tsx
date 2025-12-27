import React from 'react';
import Link from 'next/link';
import { Typography, Grid, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { mechanicsData } from '../../lib/data/mechanics';

export const MechanicsSection = () => {
  return (
    <Section id="mechanics">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Mecánicas de Juego
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {mechanicsData.map((mechanic, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }}>
            <Link href={`/mechanics/${mechanic.slug}`} style={{ textDecoration: 'none', width: '100%' }}>
              <Card
                glowColor={mechanic.color}
                sx={{
                  height: '100%',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'visible', // mechanics card icons might pop out or transform?
                  // but previously it was 'hidden'. Let's check constraints.
                  // It was overflow: 'hidden'. Let's keep it 'hidden' if needed, but 'visible' is better for "tech corners" if they exist.
                  // However, if the content (like icon-box) scales, we might want it clipped?
                  // The previous code had overflow: 'hidden'.
                  // The new Card has tech corners that are safely inside.
                  // Let's use hidden to be safe with the layout as before.
                  overflow: 'hidden',

                  '&:hover': {
                    '& .icon-box': {
                      background: `${mechanic.color}20`,
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                    '& .learn-more': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    }
                  }
                }}
              >
                <Box className="icon-box" sx={{
                  p: 3,
                  borderRadius: '24px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  mb: 3,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  transition: 'all 0.4s ease',
                  display: 'inline-flex',
                }}>
                  <mechanic.icon size={40} color={mechanic.color} />
                </Box>
                
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                  {mechanic.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
                  {mechanic.description}
                </Typography>

                <Box className="learn-more" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: mechanic.color,
                  opacity: 0.7,
                  transform: 'translateY(5px)',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  EXPLORAR <ArrowForward fontSize="small" />
                </Box>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};
