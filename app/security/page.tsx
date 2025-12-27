'use client';

import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { Shield, Lock, VpnKey } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function SecurityPage() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="lg" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 1, color: 'white' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" align="center" gutterBottom sx={{ color: 'primary.main', mb: 6 }}>
                Seguridad Blockchain
            </Typography>
            
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                 <Shield sx={{ fontSize: 100, color: 'primary.main', filter: 'drop-shadow(0 0 20px #00f3ff)' }} />
            </Box>

            <Typography variant="h5" paragraph sx={{ lineHeight: 1.8, mb: 6, textAlign: 'center' }}>
                En el universo de SAM, la seguridad no es una opción, es una necesidad de supervivencia. Nuestra infraestructura se basa en contratos inteligentes de grado militar auditados por la Federación Galáctica.
            </Typography>

            <List sx={{ bgcolor: 'rgba(0,0,0,0.5)', p: 4, borderRadius: 4, border: '1px solid rgba(0,243,255,0.2)' }}>
                <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon><Lock sx={{ color: 'primary.main', fontSize: 40 }} /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography variant="h5" color="white">Encriptación Cuántica</Typography>}
                        secondary={<Typography variant="body1" color="text.secondary">Todos los activos y transacciones están protegidos por algoritmos pos-cuánticos resistentes a ataques de fuerza bruta.</Typography>}
                    />
                </ListItem>
                <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon><VpnKey sx={{ color: 'primary.main', fontSize: 40 }} /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography variant="h5" color="white">Propiedad Inmutable</Typography>}
                        secondary={<Typography variant="body1" color="text.secondary">Lo que es tuyo, es tuyo. Ni los desarrolladores ni los piratas pueden confiscar tus activos en la blockchain.</Typography>}
                    />
                </ListItem>
            </List>
        </motion.div>
      </Container>
    </Box>
  );
}
