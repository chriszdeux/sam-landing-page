'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowBack, CalendarToday } from '@mui/icons-material';
import { historyData } from '../../../lib/data/history';
import { Button } from '../../../components/ui/Button';

export default function HistoryDetailPage({ params }: { params: Promise<{ year: string }> }) {
  const router = useRouter();
  const { year } = use(params);
  
  const eventData = historyData.find(e => e.year === year);

  if (!eventData) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" color="error">Evento no encontrado</Typography>
        <Button onClick={() => router.back()}>Volver</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      pt: 12, 
      pb: 8,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50vh',
        background: 'linear-gradient(180deg, rgba(0, 243, 255, 0.05) 0%, rgba(0,0,0,0) 100%)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="text" 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            Volver a la Historia
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <CalendarToday sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              Año {eventData.year}
            </Typography>
          </Stack>

          <Typography variant="h1" sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' }, 
            fontWeight: 'bold', 
            mb: 3,
            background: 'linear-gradient(90deg, #fff, #aaa)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {eventData.title}
          </Typography>

          <Typography variant="h5" color="text.secondary" sx={{ mb: 8, maxWidth: '800px', lineHeight: 1.6 }}>
            {eventData.description}
          </Typography>
        </motion.div>

        <Stack spacing={8}>
          {eventData.details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 6,
                alignItems: 'center',
                flexDirection: index % 2 === 1 ? 'row-reverse' : 'row' // visual alternating handled by grid template areas if needed, but simple grid is fine
              }}>
                <Box sx={{ order: index % 2 === 1 ? { md: 2 } : { md: 1 } }}>
                  <Typography variant="h3" sx={{ mb: 3, color: 'secondary.main', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                    {detail.heading}
                  </Typography>
                  {detail.paragraphs.map((p, i) => (
                    <Typography key={i} paragraph sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                      {p}
                    </Typography>
                  ))}
                </Box>
                
                <Box sx={{ 
                  order: index % 2 === 1 ? { md: 1 } : { md: 2 },
                  position: 'relative'
                }}>
                  <Box sx={{
                    height: 300,
                    width: '100%',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                     {/* Abstract Visual Placeholder */}
                     <Box sx={{
                       position: 'absolute',
                       inset: 0,
                       background: `radial-gradient(circle at ${index % 2 === 0 ? '30% 30%' : '70% 70%'}, ${index % 2 === 0 ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 183, 0, 0.2)'} 0%, transparent 70%)`
                     }} />
                     <Typography sx={{ 
                       textAlign: 'center', 
                       p: 2, 
                       color: 'text.disabled',
                       fontStyle: 'italic'
                     }}>
                       [Visualización: {detail.imageCaption}]
                     </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
