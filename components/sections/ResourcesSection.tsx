import React from 'react';
import Link from 'next/link';
import { Typography, Grid, Box, Button } from '@mui/material';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { ArrowForward } from '@mui/icons-material';
import { resourcesData } from '../../lib/data/resources';

export const ResourcesSection = () => {
  // Taking first 4 items for the preview
  const previewResources = resourcesData.slice(0, 4);

  return (
    <Section id="resources">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Recursos Galácticos
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {previewResources.map((resource, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index} sx={{ display: 'flex' }}>
             <Card
                glowColor={resource.color}
                sx={{
                  height: '100%',
                  width: '100%',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    '& .scan-effect': {
                        top: '100%'
                    }
                  }
                }}
              >
                {/* Scanning Effect Overlay */}
                <Box 
                    className="scan-effect"
                    sx={{
                        position: 'absolute',
                        top: '-100%',
                        left: 0,
                        width: '100%',
                        height: '50%',
                        background: `linear-gradient(to bottom, transparent, ${resource.color}40, transparent)`,
                        transition: 'top 1.5s ease-in-out',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />

                <Box sx={{
                  width: 120,
                  height: 120,
                  position: 'relative',
                  borderRadius: '16px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  mb: 3,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  overflow: 'hidden',
                }}>
                  <img 
                    src={resource.image} 
                    alt={resource.name}
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        opacity: 0.8
                    }} 
                  />
                  <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${resource.color}40, transparent)` }} />
                </Box>
                
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: 'white', mb: 1, zIndex: 2 }}>
                  {resource.name}
                </Typography>

                <Typography variant="caption" sx={{ 
                    color: resource.color, 
                    border: `1px solid ${resource.color}40`, 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    mb: 2,
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                    zIndex: 2
                }}>
                    {resource.type}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, lineHeight: 1.6, zIndex: 2 }}>
                  {resource.description}
                </Typography>
              </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Link href="/resources" style={{ textDecoration: 'none' }}>
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
                Ver más recursos
            </Button>
        </Link>
      </Box>
    </Section>
  );
};
