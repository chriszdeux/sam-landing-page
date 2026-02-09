import React from 'react';
import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import { Mechanic } from '../../lib/data/mechanics';
import { AnimationRegistry } from './AnimationRegistry';

export const LayoutType4 = ({ mechanic }: { mechanic: Mechanic }) => {
    // Helper to render animation component
    const renderAnimation = (animationType?: string) => {
        if (!animationType) return null;
        const AnimationComponent = AnimationRegistry[animationType];
        if (!AnimationComponent) return null;
        return <AnimationComponent color={mechanic.color} />;
    };

    return (
    <Container maxWidth="xl" sx={{ pt: 22, pb: 12 }}>
        <Grid container spacing={0}>
             <Grid size={{ xs: 12, md: 5 }}>
                 <Box sx={{ 
                     height: '100%', 
                     minHeight: 500, 
                     bgcolor: '#050505', 
                     borderRight: `1px solid ${mechanic.color}20`,
                     display: 'flex', 
                     flexDirection: 'column',
                     justifyContent: 'center',
                     color: 'white',
                     p: 6,
                     position: 'relative',
                     overflow: 'hidden'
                 }}>
                     {mechanic.backgroundImage && (
                        <Box sx={{ 
                            position: 'absolute', 
                            inset: -20, // Extend slightly to avoid blur edges
                            backgroundImage: `url(${mechanic.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(4px) contrast(1.1) brightness(0.6)',
                            opacity: 0.3,
                            zIndex: 0
                        }} />
                     )}
                     
                     {/* Gradient Glow */}
                     <Box sx={{ 
                         position: 'absolute', 
                         top: 0, 
                         right: 0, 
                         width: '100%',
                         height: '100%',
                         background: `radial-gradient(circle at top right, ${mechanic.color}15, transparent 70%)`, 
                         pointerEvents: 'none',
                         zIndex: 1 
                     }} />
                     
                     <Box sx={{ position: 'relative', zIndex: 10 }}>
                         <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ color: mechanic.color }}>{mechanic.title}</Typography>
                         <Typography variant="h6" sx={{ opacity: 0.8, color: 'text.secondary' }}>{mechanic.content.statLabel}</Typography>
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
                     
                     <Grid container spacing={4}>
                         {mechanic.content.features.map((f, i) => (
                             <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                 <Box sx={{ 
                                     overflow: 'hidden',
                                     borderRadius: 4,
                                     border: '1px solid rgba(255,255,255,0.1)', 
                                     height: '100%',
                                     transition: 'all 0.3s',
                                     '&:hover': { 
                                         borderColor: mechanic.color,
                                         transform: 'translateY(-5px)',
                                         boxShadow: `0 10px 30px ${mechanic.color}20`
                                     }
                                 }}>
                                     {f.modalImage ? (
                                         <Box sx={{ height: 200, width: '100%', overflow: 'hidden', position: 'relative' }}>
                                             <img 
                                                 src={f.modalImage} 
                                                 alt={f.title}
                                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                             />
                                             <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111 0%, transparent 100%)' }} />
                                         </Box>
                                     ) : (f.animationType && (
                                         <Box sx={{ height: 200, width: '100%', overflow: 'hidden', position: 'relative' }}>
                                             {renderAnimation(f.animationType)}
                                             <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111 0%, transparent 20%)', pointerEvents: 'none' }} />
                                         </Box>
                                     ))}
                                     <Box sx={{ p: 3 }}>
                                       <Typography variant="h6" fontWeight="bold" gutterBottom color="white">
                                           {f.title}
                                       </Typography>
                                       <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                           {f.description}
                                       </Typography>
                                     </Box>
                                 </Box>
                             </Grid>
                         ))}
                     </Grid>
                 </Box>
             </Grid>
        </Grid>
    </Container>
    );
};
