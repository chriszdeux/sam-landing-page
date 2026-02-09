import React from 'react';
import { Box, Typography, Container, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Settings } from '@mui/icons-material';
import { Mechanic } from '../../lib/data/mechanics';
import { AnimationRegistry } from './AnimationRegistry';

export const LayoutType3 = ({ mechanic }: { mechanic: Mechanic }) => {
    
    const renderAnimation = (animationType?: string) => {
        if (!animationType) return null;
        const AnimationComponent = AnimationRegistry[animationType];
        if (!AnimationComponent) return null;
        return <AnimationComponent color={mechanic.color} />;
    };

    return (
    <Box sx={{ 
        width: '100%',
        minHeight: '100vh',
        position: 'relative'
    }}>
        {/* Cinematic Background Layer */}
        {mechanic.backgroundImage && (
            <Box sx={{ 
                position: 'fixed', // Use fixed to cover screen even on scroll
                inset: -20, // Negative margin to avoid blur edges
                backgroundImage: `url(${mechanic.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px) contrast(1.1) brightness(0.6)',
                zIndex: 0
            }} />
        )}

        {/* Dark Overlay Gradient */}
        {mechanic.backgroundImage && (
            <Box sx={{ 
                position: 'fixed', // Matches the background layer
                inset: 0, 
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                zIndex: 0 
            }} />
        )}

    <Container maxWidth="xl" sx={{ pt: 25, pb: 10, position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 15 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h6" color={mechanic.color} gutterBottom sx={{ letterSpacing: 4 }}>MÓDULO DE GESTIÓN</Typography>
                <Typography variant="h1" fontWeight="900" sx={{ mb: 4, textTransform: 'uppercase' }}>{mechanic.title}</Typography>
                <Box sx={{ height: 4, width: 100, bgcolor: mechanic.color, mx: 'auto', mb: 6, borderRadius: 2 }} />
                
                <Container maxWidth="md">
                    <Typography variant="h5" color="text.secondary" sx={{ mx: 'auto', lineHeight: 1.6 }}>
                        {mechanic.content.heading}
                    </Typography>
                </Container>
            </motion.div>
        </Box>

        {/* Intro Paragraphs */}
        <Grid container spacing={4} sx={{ mb: 20 }}>
            {mechanic.content.paragraphs.map((p: string, i: number) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <Box sx={{ 
                            p: 4, 
                            height: '100%',
                            borderTop: `2px solid ${mechanic.color}40`,
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)'
                        }}>
                             <Typography fontSize="1.1rem" color="text.secondary" lineHeight={1.8}>{p}</Typography>
                        </Box>
                    </motion.div>
                </Grid>
            ))}
        </Grid>

        {/* Features List - "Visualizing Everything" */}
        <Stack spacing={20}>
            {mechanic.content.features.map((f, i) => (
                <Grid container spacing={8} alignItems="center" direction={i % 2 === 0 ? 'row' : 'row-reverse'} key={i}>
                    {/* Visual Side */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div 
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box sx={{ 
                                position: 'relative', 
                                borderRadius: 8, 
                                overflow: 'hidden',
                                border: `1px solid ${mechanic.color}30`,
                                boxShadow: `0 20px 50px ${mechanic.color}10`
                            }}>
                                {/* Animated Image or Component */}
                                {f.modalImage ? (
                                    <Box sx={{ height: 500, width: '100%', overflow: 'hidden' }}>
                                        <motion.img 
                                            src={f.modalImage} 
                                            alt={f.title}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1.2, x: [0, -10, 0], y: [0, -5, 0] }}
                                            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, #000 0%, transparent 50%)` }} />
                                    </Box>
                                ) : (f.animationType ? (
                                    <Box sx={{ height: 500, width: '100%', overflow: 'hidden' }}>
                                        {renderAnimation(f.animationType)}
                                    </Box>
                                ) : (
                                    <Box sx={{ height: 500, bgcolor: `${mechanic.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Settings sx={{ fontSize: 100, color: mechanic.color, opacity: 0.5 }} />
                                    </Box>
                                ))}
                                
                                {/* Overlay Number */}
                                <Typography sx={{ 
                                    position: 'absolute', 
                                    top: 20, 
                                    left: 20, 
                                    fontSize: '8rem', 
                                    fontWeight: 900, 
                                    color: 'white', 
                                    opacity: 0.1,
                                    lineHeight: 1
                                }}>
                                    0{i + 1}
                                </Typography>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* Content Side */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div 
                             initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }} 
                             whileInView={{ opacity: 1, x: 0 }} 
                             viewport={{ once: true }}
                             transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Box>
                                <Typography variant="overline" color={mechanic.color} fontWeight="bold" letterSpacing={2}>SISTEMA {i + 1}</Typography>
                                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mt: 1, mb: 4 }}>{f.title}</Typography>
                                
                                {f.modalContent ? (
                                    f.modalContent.split('\n\n').map((paragraph, idx) => (
                                        <Typography key={idx} paragraph color="text.secondary" sx={{ fontSize: '1.2rem', lineHeight: 1.8, mb: 3 }}>
                                            {paragraph}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography paragraph color="text.secondary" sx={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
                                        {f.description}
                                    </Typography>
                                )}
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            ))}
        </Stack>

    </Container>
    </Box>
    );
};
