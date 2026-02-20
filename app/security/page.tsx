// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { Shield, Lock, VpnKey, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { motion } from 'framer-motion';
import { EnvVariables } from '@/lib/constants/variables';

export default function SecurityPage() {
    const { project } = EnvVariables;
    const router = useRouter();
  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
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
      <Background />
      
      <Container maxWidth="lg" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 1, color: 'white' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <PageHeader 
                title="SEGURIDAD DE PROTOCOLO" 
                subtitle="Infraestructura descentralizada protegida por leyes físicas y criptográficas."
                color="#00f3ff"
            />
            
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                 <Shield sx={{ fontSize: 100, color: 'primary.main', filter: 'drop-shadow(0 0 20px #00f3ff)' }} />
            </Box>

            <Typography variant="h5" paragraph sx={{ lineHeight: 1.8, mb: 6, textAlign: 'center' }}>
                En 2036, desde servidores sumergidos en túneles geotérmicos de Guadalajara, nació {project}. Nos protegemos con algo más fuerte que la criptografía: la soberanía energética y la distribución interestelar.
            </Typography>

            <List sx={{ bgcolor: 'rgba(0,0,0,0.5)', p: 4, borderRadius: 4, border: '1px solid rgba(0,243,255,0.2)' }}>
                <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon><Lock sx={{ color: 'primary.main', fontSize: 40 }} /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography variant="h5" color="white">Prueba de Propósito</Typography>}
                        secondary={<Typography variant="body1" color="text.secondary">El sistema no crece solo por minería, sino por utilidad real. La Capa de Sedimento en la Tierra es el ancla ética inmutable.</Typography>}
                    />
                </ListItem>
                <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon><VpnKey sx={{ color: 'primary.main', fontSize: 40 }} /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography variant="h5" color="white">Red ${project}</Typography>}
                        secondary={<Typography variant="body1" color="text.secondary">Uso de entrelazamiento cuántico para sincronizar billeteras entre sistemas solares instantáneamente, eliminando la latencia luz.</Typography>}
                    />
                </ListItem>
                <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon><Shield sx={{ color: 'primary.main', fontSize: 40 }} /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography variant="h5" color="white">Soberanía Energética</Typography>}
                        secondary={<Typography variant="body1" color="text.secondary">Gracias a Helios-Prime y las Forjas Solares, {project} genera su propio combustible de cómputo. Nadie puede apagarla.</Typography>}
                    />
                </ListItem>
            </List>
        </motion.div>
      </Container>
    </Box>
  );
}
