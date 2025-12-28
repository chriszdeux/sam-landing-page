import React from 'react';
import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import { Mechanic } from '../../lib/data/mechanics';

export const LayoutType4 = ({ mechanic }: { mechanic: Mechanic }) => (
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
                     color: 'white',
                     p: 6,
                     position: 'relative',
                     overflow: 'hidden'
                 }}>
                     <Typography variant="h1" sx={{ fontWeight: 900, opacity: 0.2, position: 'absolute', top: -20, left: -20, fontSize: '10rem', color: 'black' }}>
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
                     
                     <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.1)' }} />
                     
                     <Typography variant="h6" sx={{ mb: 3, color: mechanic.color }}>Tecnologías en Desarrollo</Typography>
                     
                     <Grid container spacing={3}>
                         {mechanic.content.features.map((f, i) => (
                             <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                 <Box sx={{ 
                                     p: 2, 
                                     border: '1px solid rgba(255,255,255,0.1)', 
                                     borderRadius: 2,
                                     height: '100%',
                                     transition: 'border-color 0.3s',
                                     '&:hover': { borderColor: mechanic.color }
                                 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="white">
                                        {f.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {f.description}
                                    </Typography>
                                 </Box>
                             </Grid>
                         ))}
                     </Grid>
                 </Box>
             </Grid>
        </Grid>
    </Container>
);
