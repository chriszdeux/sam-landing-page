"use client";

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { PageHeader } from '@/components/ui/PageHeader';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { roadmapData } from '@/lib/data/roadmap';
import { RoadmapNode } from '@/components/ui/RoadmapNode';

export default function RoadmapPage() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pt: 12, pb: 20 }}>
      <ParticleBackground />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
        <PageHeader 
          title="Lyncore Roadmap" 
          subtitle="Conoce el camino hacia la descentralización y la economía del futuro." 
        />
        
        <Box sx={{ mt: 12, position: 'relative' }}>
          {/* Vertical Riel (Timeline Line) */}
          <Box 
            sx={{ 
              position: 'absolute', 
              left: { xs: 0, md: 0 }, // Aligning with the dots in RoadmapNode
              top: 0, 
              bottom: 0, 
              width: '2px', 
              background: 'linear-gradient(to bottom, #00f3ff, rgba(255,255,255,0.1))',
              opacity: 0.3,
              zIndex: 0
            }} 
          />

          {/* Roadmap Phases */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {roadmapData.map((item, index) => (
              <RoadmapNode
                key={index}
                {...item}
                isActive={item.status === 'Activo'}
                isLast={index === roadmapData.length - 1}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                * El Roadmap está sujeto a cambios basados en el consenso de la red y avances tecnológicos.
            </Typography>
        </Box>
      </Container>
    </Box>
  );
}
