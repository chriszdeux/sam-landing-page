import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { AutoGraph, CheckCircle, Info } from '@mui/icons-material';
import { Mechanic } from '../../lib/data/mechanics';
import { FeatureModal } from './FeatureModal';

import { AnimationRegistry } from './AnimationRegistry';

export const LayoutType2 = ({ mechanic }: { mechanic: Mechanic }) => {
    const [selectedFeature, setSelectedFeature] = useState<{title: string, description: string, modalContent?: string, modalImage?: string} | null>(null);

    const renderAnimation = (animationType?: string) => {
        if (!animationType) return null;
        const AnimationComponent = AnimationRegistry[animationType];
        if (!AnimationComponent) return null;
        return <AnimationComponent color={mechanic.color} />;
    };

    return (
    <Box>
        <FeatureModal 
            open={!!selectedFeature} 
            onClose={() => setSelectedFeature(null)} 
            title={selectedFeature?.title || ''} 
            description={selectedFeature?.description || ''} 
            content={selectedFeature?.modalContent}
            image={selectedFeature?.modalImage}
            color={mechanic.color}
        />
        <Box sx={{ 
            height: '60vh', 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'black',
            overflow: 'hidden'
        }}>
            {renderAnimation(mechanic.backgroundAnimation)}
            
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%', height: '120%',
                background: `radial-gradient(circle, ${mechanic.color}20 0%, transparent 70%)`,
                zIndex: 1
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
                                {mechanic.content.features.map((f, i) => (
                                    <Box 
                                        key={i} 
                                        onClick={() => mechanic.id === 'combat' ? setSelectedFeature(f) : null}
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: 1, 
                                            cursor: mechanic.id === 'combat' ? 'pointer' : 'default',
                                            '&:hover': mechanic.id === 'combat' ? { opacity: 0.8 } : {}
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CheckCircle sx={{ color: mechanic.color, fontSize: 20 }} />
                                            <Typography variant="body1" fontWeight="bold">
                                                {f.title}
                                                {mechanic.id === 'combat' && <Info sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />}
                                            </Typography>
                                        </Box>
                                        {/* For Mining (or others not combat), show description inline */}
                                        {mechanic.id !== 'combat' && (
                                            <Typography variant="body2" color="gray" sx={{ ml: 4 }}>
                                                {f.description}
                                            </Typography>
                                        )}
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
};
