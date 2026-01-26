'use client';

import React from 'react';
import { Box, Container, Typography, Button, Avatar, Grid, Chip } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { ContentCopy, Verified, GppBad } from '@mui/icons-material';

export default function SettingsPage() {
  const { userInfo } = useAppSelector((state) => state.auth);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      <Container maxWidth="lg" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
        <PageHeader 
            title="CONFIGURACIÓN DE CUENTA" 
            subtitle="Administra tu perfil personal, preferencias y seguridad del sistema."
            color="#00f3ff"
        />

        <Grid container spacing={4}>
            {/* Left Column: Profile Card */}
            <Grid size={{ xs: 12, md: 4 }}>
                <TechFrame>
                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                         <Box sx={{ 
                             position: 'relative', 
                             width: 120, 
                             height: 120, 
                             mb: 3 
                         }}>
                             <Avatar sx={{ 
                                 width: '100%', 
                                 height: '100%', 
                                 bgcolor: 'primary.main', 
                                 fontSize: '3rem',
                                 border: '2px solid #00f3ff',
                                 boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)'
                             }}>
                                {userInfo?.username?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: userInfo?.confirmedAccount ? '#00e676' : '#ff1744',
                                border: '2px solid black',
                                boxShadow: '0 0 10px currentColor',
                                color: userInfo?.confirmedAccount ? '#00e676' : '#ff1744'
                            }} />
                         </Box>

                         <Typography variant="h5" color="white" fontWeight="bold" gutterBottom>
                             {userInfo?.name} {userInfo?.lastName}
                         </Typography>
                         <Typography variant="body1" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             @{userInfo?.username}
                             {userInfo?.confirmedAccount && <Verified fontSize="small" />}
                         </Typography>
                         
                         <Box sx={{ mt: 2, width: '100%' }}>
                            <Chip 
                                label={userInfo?.isBanned ? "ACCESO DENEGADO" : "ACCESO AUTORIZADO"} 
                                color={userInfo?.isBanned ? "error" : "success"} 
                                variant="outlined"
                                sx={{ width: '100%' }}
                            />
                         </Box>
                    </Box>
                </TechFrame>
            </Grid>

            {/* Right Column: Details & Settings */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    
                    {/* Basic Info */}
                    <TechFrame color="#ff0055">
                        <Box sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ color: '#ff0055', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {'// DATOS DE USUARIO'}
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">ID DE USUARIO</Typography>
                                    <Box 
                                        onClick={() => copyToClipboard(userInfo?.id || '')}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1, 
                                            color: 'white', 
                                            cursor: 'pointer',
                                            '&:hover': { color: 'primary.main' }
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                            {userInfo?.id ? `${userInfo.id.substring(0, 12)}...` : 'N/A'}
                                        </Typography>
                                        <ContentCopy fontSize="small" sx={{ opacity: 0.5 }} />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">CORREO ELECTRÓNICO</Typography>
                                    <Typography variant="body1" color="white">{userInfo?.email}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">FECHA DE NACIMIENTO</Typography>
                                    <Typography variant="body1" color="white">{userInfo?.birthday || 'No definida'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">CÓDIGO DE REFERENCIA</Typography>
                                    <Box 
                                        onClick={() => copyToClipboard(userInfo?.referralCode || '')}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1, 
                                            color: '#ffb700', 
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                            {userInfo?.referralCode || 'N/A'}
                                        </Typography>
                                        <ContentCopy fontSize="small" sx={{ opacity: 0.5 }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </TechFrame>

                    {/* Preferences */}
                    {/* Preferences - Commented out as info is not available yet
                    <TechFrame color="#00f3ff">
                        <Box sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ color: '#00f3ff', mb: 3 }}>
                                // PREFERENCIAS DEL SISTEMA
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControlLabel 
                                    control={<Switch defaultChecked sx={{ '& .MuiSwitch-track': { bgcolor: 'grey.800' } }} />} 
                                    label="Notificaciones de transacciones" 
                                    sx={{ color: 'white' }} 
                                />
                                <FormControlLabel 
                                    control={<Switch sx={{ '& .MuiSwitch-track': { bgcolor: 'grey.800' } }} />} 
                                    label="Modo Privacidad (Ocultar balances)" 
                                    sx={{ color: 'white' }} 
                                />
                                <FormControlLabel 
                                    control={<Switch defaultChecked sx={{ '& .MuiSwitch-track': { bgcolor: 'grey.800' } }} />} 
                                    label="2FA (Doble Factor de Autenticación)" 
                                    sx={{ color: 'white' }} 
                                />
                            </Box>
                        </Box>
                    </TechFrame>
                    */}

                     {/* Security Actions */}
                     <TechFrame color="#ffb700">
                        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6" sx={{ color: '#ffb700', mb: 1 }}>
                                {'// ZONA DE SEGURIDAD'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button variant="outlined" color="primary">Cambiar Contraseña</Button>
                                <Button variant="outlined" color="error" startIcon={<GppBad />}>Cerrar Sesión en otros dispositivos</Button>
                            </Box>
                        </Box>
                     </TechFrame>

                </Box>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
