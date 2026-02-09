'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Grid, InputAdornment } from '@mui/material';
import Image from 'next/image';
import { Search } from '@mui/icons-material';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { resourcesData } from '../../lib/data/resources';
import { EnvVariables } from '@/lib/constants/variables';
import { motion } from 'framer-motion';

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resourcesData.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="xl" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PageHeader
                title="Base de Datos de Materiales"
                subtitle={`Catálogo completo de recursos, minerales y tecnologías exóticas disponibles en el universo ${EnvVariables.project}.`}
                color="#00f3ff"
            />
        </motion.div>

        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 10 }}>
            <Input
                fullWidth
                placeholder="Buscar material por nombre o tipo..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                }
                sx={{
                    borderRadius: 4,
                    '& .MuiInputBase-input': { color: 'white' },
                }}
            />
        </Box>

        <Grid container spacing={4}>
            {filteredResources.map((resource, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={resource.id}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: index * 0.05 }}
                        style={{ height: '100%' }}
                    >
                        <TechFrame 
                            color={resource.color}
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
                                <Box className="glitch-effect" sx={{
                                    width: 120,
                                    height: 120,
                                    position: 'relative',
                                    borderRadius: '16px',
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    mb: 3,
                                    border: `1px solid rgba(255,255,255,0.1)`,
                                    overflow: 'hidden',
                                }}>
                                    <Image 
                                        src={resource.image} 
                                        alt={resource.name}
                                        fill
                                        style={{ 
                                            objectFit: 'cover',
                                            opacity: 0.8
                                        }} 
                                    />
                                    <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${resource.color}40, transparent)` }} />
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: 'white', mb: 1, zIndex: 2 }}>
                                        {resource.name}
                                    </Typography>

                                    <Typography variant="caption" sx={{ 
                                        color: resource.color, 
                                        border: `1px solid ${resource.color}40`, 
                                        px: 1, 
                                        py: 0.5, 
                                        borderRadius: 1,
                                        mb: 2,
                                        textTransform: 'uppercase',
                                        fontSize: '0.65rem',
                                        zIndex: 2
                                    }}>
                                        {resource.type}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6, zIndex: 2 }}>
                                        {resource.description}
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
