import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Settings } from '@mui/icons-material';
import { Mechanic } from '../../lib/data/mechanics';
import { FeatureModal } from './FeatureModal';

export const LayoutType3 = ({ mechanic }: { mechanic: Mechanic }) => {
    const [selectedFeature, setSelectedFeature] = useState<{title: string, description: string, modalContent?: string, modalImage?: string} | null>(null);

    return (
    <Container maxWidth="lg" sx={{ pt: 25, pb: 10 }}>
        <FeatureModal 
            open={!!selectedFeature} 
            onClose={() => setSelectedFeature(null)} 
            title={selectedFeature?.title || ''} 
            description={selectedFeature?.description || ''} 
            content={selectedFeature?.modalContent}
            image={selectedFeature?.modalImage}
            color={mechanic.color}
        />
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
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
                        Selecciona un módulo para ver detalles
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, width: '100%' }}>
                        {mechanic.content.features.map((f, i) => (
                            <Box 
                                key={i} 
                                onClick={() => setSelectedFeature(f)}
                                sx={{ 
                                    p: 3, 
                                    bgcolor: 'rgba(0,0,0,0.5)', 
                                    borderRadius: 2,
                                    border: `1px solid ${i === 0 ? mechanic.color : 'rgba(255,255,255,0.1)'}`,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: mechanic.color,
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Settings sx={{ color: i === 0 ? mechanic.color : 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" fontWeight="bold">{f.title}</Typography>
                            </Box>
                        ))}
                    </Box>
                 </Box>
            </Grid>
        </Grid>
    </Container>
    );
};
