// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import Image from 'next/image';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { architectureData } from '../../lib/data/architecture';
import { motion } from 'framer-motion';

export default function ArchitecturePage() {
  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="xl" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 1 }}>
        <PageHeader 
            title="Arquitectura Colonial"
            subtitle="Construye, gestiona y expande tu imperio con estructuras de última tecnología."
            color="#00f3ff"
        />

        <Grid container spacing={4}>
          {architectureData.map((building, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={building.id} sx={{ display: 'flex' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{ height: '100%', width: '100%' }}
              >
                <TechFrame 
                    color={building.color}
                    className="h-full w-full"
                    sx={{ height: '100%' }}
                >
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
                        <Box sx={{
                            width: '100%',
                            height: 200,
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
                                style={{ 
                                    objectFit: 'cover',
                                    opacity: 0.8
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
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, lineHeight: 1.6, zIndex: 2 }}>
                                {building.description}
                            </Typography>
                        </Box>
                    </Box>
                </TechFrame>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
