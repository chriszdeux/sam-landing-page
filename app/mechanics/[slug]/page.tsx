'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container, Grid, Stack, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowBack, CheckCircle, AutoGraph, Settings } from '@mui/icons-material';
import { mechanicsData, Mechanic } from '../../../lib/data/mechanics';
import { Button } from '../../../components/ui/Button';

// -- Sub-Layout Components --

const LayoutType1 = ({ mechanic }: { mechanic: Mechanic }) => (
  <Container maxWidth="xl" sx={{ pt: 20 }}>
    <Grid container spacing={8} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Typography variant="overline" color={mechanic.color} sx={{ letterSpacing: 3, fontWeight: 'bold' }}>
             MECÁNICA PRINCIPAL
          </Typography>
          <Typography variant="h1" sx={{ mt: 2, mb: 4, fontWeight: 800, fontSize: { xs: '3rem', md: '5rem' } }}>
            {mechanic.title}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            {mechanic.content.paragraphs[0]}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">{mechanic.content.statLabel}</Typography>
                <Typography variant="h4" color="white" fontWeight="bold">{mechanic.content.statValue}</Typography>
            </Box>
          </Stack>
        </motion.div>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Box sx={{ 
                height: 500, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: 8,
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${mechanic.color}40`,
                boxShadow: `0 0 50px ${mechanic.color}20`
            }}>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <mechanic.icon size={120} color={mechanic.color} opacity={0.5} />
                </Box>
                {/* Simulated UI Overlay */}
                <Box sx={{ position: 'absolute', bottom: 30, left: 30, right: 30, p: 3, bgcolor: 'rgba(0,0,0,0.8)', borderRadius: 4, backdropFilter: 'blur(10px)' }}>
                    <Typography variant="subtitle2" color={mechanic.color}>Estado del Sistema</Typography>
                    <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.1)', mt: 1, borderRadius: 2 }}>
                        <Box sx={{ width: '70%', height: '100%', bgcolor: mechanic.color, borderRadius: 2 }} />
                    </Box>
                </Box>
            </Box>
        </motion.div>
      </Grid>
    </Grid>
    
    <Box sx={{ mt: 10 }}>
        <Grid container spacing={4}>
            {mechanic.content.paragraphs.slice(1).map((p: string, i: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={i}>
                    <Typography fontSize="1.1rem" color="text.secondary" lineHeight={1.8}>{p}</Typography>
                </Grid>
            ))}
        </Grid>
    </Box>
    
    <Box sx={{ mt: 10, mb: 10 }}>
        <Typography variant="h4" gutterBottom>Características Clave</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {mechanic.content.features.map((f: string, i: number) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, borderLeft: `4px solid ${mechanic.color}` }}>
                        <Typography fontWeight="bold">{f}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
  </Container>
);

const LayoutType2 = ({ mechanic }: { mechanic: Mechanic }) => (
    <Box>
        <Box sx={{ 
            height: '60vh', 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'black',
            overflow: 'hidden'
        }}>
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%', height: '120%',
                background: `radial-gradient(circle, ${mechanic.color}20 0%, transparent 70%)`
            }} />
             <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <mechanic.icon size={64} color={mechanic.color} style={{ marginBottom: 20 }} />
                    <Typography variant="h1" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -2 }}>
                        {mechanic.title}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mt: 2, fontFamily: 'monospace' }}>
                         {mechanic.content.statLabel}: <span style={{ color: mechanic.color }}>{mechanic.content.statValue}</span>
                    </Typography>
                </motion.div>
            </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -10, position: 'relative', zIndex: 20, mb: 10 }}>
            <Box sx={{ bgcolor: '#0a0a0a', p: { xs: 4, md: 8 }, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 8 }}>
                         <Typography variant="h4" gutterBottom sx={{ color: mechanic.color }}>{mechanic.content.heading}</Typography>
                         {mechanic.content.paragraphs.map((p: string, i: number) => (
                             <Typography key={i} paragraph sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 3 }}>
                                 {p}
                             </Typography>
                         ))}
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>
                            <Typography variant="h6" gutterBottom><AutoGraph sx={{ verticalAlign: 'middle', mr: 1 }} /> Highlights</Typography>
                            <Stack spacing={2} sx={{ mt: 3 }}>
                                {mechanic.content.features.map((f: string, i: number) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircle sx={{ color: mechanic.color, fontSize: 20 }} />
                                        <Typography variant="body2">{f}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </Box>
);

const LayoutType3 = ({ mechanic }: { mechanic: Mechanic }) => (
    <Container maxWidth="lg" sx={{ pt: 25, pb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typography variant="h6" color={mechanic.color} gutterBottom>MÓDULO DE GESTIÓN</Typography>
                <Typography variant="h1" fontWeight="bold" sx={{ mb: 4 }}>{mechanic.title}</Typography>
                <Box sx={{ height: 2, width: 100, bgcolor: mechanic.color, mx: 'auto', mb: 4 }} />
                <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                    {mechanic.content.heading}
                </Typography>
            </motion.div>
        </Box>

        <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={4}>
                    {mechanic.content.paragraphs.map((p: string, i: number) => (
                        <Box key={i} sx={{ p: 3, borderLeft: `2px solid rgba(255,255,255,0.1)` }}>
                            <Typography color="text.secondary">{p}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                 <Box sx={{ 
                     height: '100%', 
                     minHeight: 400,
                     bgcolor: 'rgba(255,255,255,0.02)', 
                     borderRadius: 4, 
                     border: '1px dashed rgba(255,255,255,0.2)',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                     p: 4
                 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, width: '100%' }}>
                        {mechanic.content.features.map((f: string, i: number) => (
                            <Box key={i} sx={{ 
                                p: 3, 
                                bgcolor: 'rgba(0,0,0,0.5)', 
                                borderRadius: 2,
                                border: `1px solid ${i === 0 ? mechanic.color : 'rgba(255,255,255,0.1)'}`,
                                textAlign: 'center'
                            }}>
                                <Settings sx={{ color: i === 0 ? mechanic.color : 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" fontWeight="bold">{f}</Typography>
                            </Box>
                        ))}
                    </Box>
                 </Box>
            </Grid>
        </Grid>
    </Container>
);

const LayoutType4 = ({ mechanic }: { mechanic: Mechanic }) => (
    <Container maxWidth="xl" sx={{ pt: 22, pb: 12 }}>
        <Grid container spacing={0}>
             <Grid size={{ xs: 12, md: 5 }}>
                 <Box sx={{ 
                     height: '100%', 
                     minHeight: 500, 
                     bgcolor: mechanic.color, 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center',
                     color: 'black',
                     p: 6,
                     position: 'relative',
                     overflow: 'hidden'
                 }}>
                     <Typography variant="h1" sx={{ fontWeight: 900, opacity: 0.1, position: 'absolute', top: -20, left: -20, fontSize: '10rem' }}>
                         R&D
                     </Typography>
                     <Box sx={{ position: 'relative', zIndex: 10 }}>
                         <Typography variant="h2" fontWeight="bold" gutterBottom>{mechanic.title}</Typography>
                         <Typography variant="h6" sx={{ opacity: 0.8 }}>{mechanic.content.statLabel}</Typography>
                         <Typography variant="h3" fontWeight="bold">{mechanic.content.statValue}</Typography>
                     </Box>
                 </Box>
             </Grid>
             <Grid size={{ xs: 12, md: 7 }}>
                 <Box sx={{ height: '100%', bgcolor: '#111', p: { xs: 4, md: 10 } }}>
                     <Typography variant="h4" gutterBottom color="text.primary">{mechanic.content.heading}</Typography>
                     {mechanic.content.paragraphs.map((p: string, i: number) => (
                         <Typography key={i} paragraph color="text.secondary" sx={{ mb: 3 }}>
                             {p}
                         </Typography>
                     ))}
                     <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                         {mechanic.content.features.map((f: string, i: number) => (
                             <Chip key={i} label={f} sx={{ 
                                 bgcolor: 'rgba(255,255,255,0.05)', 
                                 color: 'white',
                                 border: '1px solid rgba(255,255,255,0.1)'
                             }} />
                         ))}
                     </Box>
                 </Box>
             </Grid>
        </Grid>
    </Container>
);


export default function MechanicPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const mechanic = mechanicsData.find(m => m.slug === slug);

  if (!mechanic) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Mecánica no encontrada</Typography>
        <Button onClick={() => router.back()}>Volver</Button>
      </Box>
    );
  }

  const renderLayout = () => {
      switch(mechanic.layoutType) {
          case 'type2': return <LayoutType2 mechanic={mechanic} />;
          case 'type3': return <LayoutType3 mechanic={mechanic} />;
          case 'type4': return <LayoutType4 mechanic={mechanic} />;
          default: return <LayoutType1 mechanic={mechanic} />;
      }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      <Box sx={{ position: 'fixed', top: 100, left: { xs: 20, md: 40 }, zIndex: 100 }}>
        <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ backdropFilter: 'blur(5px)' }}
        >
            Atrás
        </Button>
      </Box>
      
      {renderLayout()}
    </Box>
  );
}
