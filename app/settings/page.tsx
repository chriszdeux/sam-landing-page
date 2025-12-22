'use client';

import React from 'react';
import { Box, Container, Typography, Switch, FormControlLabel, Button, Avatar } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppSelector } from '../../lib/hooks';

export default function SettingsPage() {
  const { userInfo } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      <Container maxWidth="md" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6, color: 'primary.main' }}>
          Configuración de Cuenta
        </Typography>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                    {userInfo?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                    <Typography variant="h5" color="white">{userInfo?.username || 'Usuario'}</Typography>
                    <Typography variant="body2" color="text.secondary">{userInfo?.email || 'email@example.com'}</Typography>
                </Box>
            </Box>

            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>General</Typography>
            
            <Box sx={{ mb: 3 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Notificaciones de transacciones" sx={{ color: 'white' }} />
            </Box>
            <Box sx={{ mb: 3 }}>
                <FormControlLabel control={<Switch />} label="Modo Privacidad (Ocultar balances)" sx={{ color: 'white' }} />
            </Box>

            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1, mt: 4 }}>Seguridad</Typography>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                 <Button variant="outlined" color="primary">Cambiar Contraseña</Button>
                 <Button variant="outlined" color="error">Cerrar Sesión en otros dispositivos</Button>
             </Box>
        </Box>
      </Container>
    </Box>
  );
}
