// 1-Estructuración y renderizado visual del componente UI

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Mechanic } from '../../lib/data/mechanics';
import { DefenseAnimation } from './DefenseAnimation';

export const LayoutTypeDefense = ({ mechanic }: { mechanic: Mechanic }) => {
    
    
    //# 1-Estructuración y renderizado visual del componente UI
    return (
    <Box sx={{ 
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        bgcolor: '#050000' 
    }}>
        {}
        {mechanic.backgroundImage && (
            <Box sx={{ 
                position: 'fixed',
                inset: -20,
                backgroundImage: `url(${mechanic.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px) contrast(1.1) brightness(0.6)',
                zIndex: 0
            }} />
        )}

        {}
        <Box sx={{ 
            position: 'fixed',
            inset: 0, 
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(20,0,0,0.9) 100%)',
            zIndex: 0 
        }} />

    <Container maxWidth="xl" sx={{ pt: 25, pb: 10, position: 'relative', zIndex: 1 }}>
        
        {}
        <Box sx={{ textAlign: 'center', mb: 15 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h6" color={mechanic.color} gutterBottom sx={{ letterSpacing: 4 }}>SISTEMA DE DEFENSA</Typography>
                <Typography variant="h1" fontWeight="900" sx={{ mb: 4, textTransform: 'uppercase', color: 'white' }}>{mechanic.title}</Typography>
                <Box sx={{ height: 4, width: 100, bgcolor: mechanic.color, mx: 'auto', mb: 6, borderRadius: 2, boxShadow: `0 0 20px ${mechanic.color}` }} />
                
                <Container maxWidth="md">
                    <Typography variant="h5" color="text.secondary" sx={{ mx: 'auto', lineHeight: 1.6 }}>
                        {mechanic.content.heading}
                    </Typography>
                </Container>
            </motion.div>
        </Box>

        {}
        <Grid container spacing={4} sx={{ mb: 10 }}>
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
                            background: 'linear-gradient(180deg, rgba(255,50,50,0.05) 0%, transparent 100%)'
                        }}>
                             <Typography fontSize="1.1rem" color="text.secondary" lineHeight={1.8}>{p}</Typography>
                        </Box>
                    </motion.div>
                </Grid>
            ))}
        </Grid>

        {}
        <Box sx={{ mb: 10 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <Typography variant="overline" color={mechanic.color} display="block" textAlign="center" sx={{ mb: 2, letterSpacing: 2 }}>
                    VISUALIZACIÓN DE AMENAZAS EN TIEMPO REAL
                </Typography>
                <DefenseAnimation />
            </motion.div>
        </Box>

    </Container>
    </Box>
    );
};
