'use client';

import React from 'react';
import { Box, Typography, Container, Stack, Chip, Button, Divider, Grid } from '@mui/material';
import { ParticleBackground } from '../../../components/ui/ParticleBackground';
import { ArrowBack, CheckCircle, Warning, VerifiedUser, Speed, Storage, SettingsInputComponent } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../lib/hooks';

export default function NetworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const { networks } = useAppSelector((state) => state.blockchain);
    
    // Find network details
    const network = networks.find(n => n.id === id);

    // If undefined (e.g., direct access before load), handle gracefully
    // But typically AuthLoader handles fetch. 
    if (!network && networks.length === 0) {
         // Show loading or empty state
         return <Box sx={{ minHeight: '100vh', bgcolor: '#000' }} />;
    }

    if (!network) {
         return (
             <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
                 <Typography color="error">Red no encontrada</Typography>
                 <Button onClick={() => router.push('/')}>Volver</Button>
             </Box>
         );
    }

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', pt: 12, pb: 10 }}>
            <ParticleBackground />
            
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => router.back()}
                    sx={{ color: 'text.secondary', mb: 4, '&:hover': { color: 'primary.main' } }}
                >
                    Atrás
                </Button>

                <Grid container spacing={6}>
                    {/* Left Column: Card Info */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            border: `1px solid ${network.additionalInfo.color}`,
                            bgcolor: 'rgba(10,10,10,0.6)',
                            backdropFilter: 'blur(20px)',
                            background: `linear-gradient(145deg, rgba(20,20,30,0.8) 0%, ${network.additionalInfo.color}10 100%)`,
                            boxShadow: `0 0 30px ${network.additionalInfo.color}20`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                             {/* Decorative circle */}
                             <Box sx={{ 
                                 position: 'absolute', 
                                 top: -50, 
                                 right: -50, 
                                 width: 150, 
                                 height: 150, 
                                 borderRadius: '50%', 
                                 bgcolor: network.additionalInfo.color, 
                                 filter: 'blur(50px)', 
                                 opacity: 0.3 
                             }} />

                             <Stack spacing={3}>
                                 <Box>
                                     <Chip 
                                        label={network.blockchainProps.status || 'Active'} 
                                        color={network.blockchainProps.status === 'Active' ? 'success' : 'default'} 
                                        size="small" 
                                        sx={{ mb: 2 }} 
                                     />
                                     <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff', lineHeight: 1.2 }}>
                                         {network.identification.name}
                                     </Typography>
                                     <Typography variant="h6" sx={{ color: network.additionalInfo.color, opacity: 0.8 }}>
                                         {network.identification.symbol}
                                     </Typography>
                                 </Box>

                                 <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                     {network.additionalInfo.description?.[0] || 'A powerful decentralized network.'}
                                 </Typography>
                                 
                                 <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                                 <Stack spacing={2}>
                                     <Stack direction="row" alignItems="center" spacing={2}>
                                         <Speed sx={{ color: network.additionalInfo.color }} />
                                         <Box>
                                             <Typography variant="caption" color="text.secondary">Circulating Supply</Typography>
                                             <Typography variant="body1" color="white">
                                                 {network.blockchainProps.circulatingSupply.toLocaleString()}
                                             </Typography>
                                         </Box>
                                     </Stack>
                                     <Stack direction="row" alignItems="center" spacing={2}>
                                         <Storage sx={{ color: network.additionalInfo.color }} />
                                         <Box>
                                             <Typography variant="caption" color="text.secondary">Market Cap</Typography>
                                             <Typography variant="body1" color="white">
                                                ${network.blockchainProps.marketCap.toLocaleString()}
                                            </Typography>
                                         </Box>
                                     </Stack>
                                     <Stack direction="row" alignItems="center" spacing={2}>
                                         <VerifiedUser sx={{ color: network.additionalInfo.color }} />
                                         <Box>
                                             <Typography variant="caption" color="text.secondary">Tokens Supported</Typography>
                                             <Typography variant="body1" color="white">
                                                 {network.tokensSupported?.total || 0}
                                             </Typography>
                                         </Box>
                                     </Stack>
                                     {network.additionalInfo.developers && network.additionalInfo.developers.length > 0 && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Desarrolladores</Typography>
                                            <Typography variant="body2" color="white">
                                                {network.additionalInfo.developers.join(', ')}
                                            </Typography>
                                        </Box>
                                     )}
                                 </Stack>

                                 <Button 
                                    variant="contained" 
                                    size="large"
                                    startIcon={<SettingsInputComponent />}
                                    onClick={() => router.push(`/network/${network.id}/connecting`)}
                                    sx={{ 
                                        mt: 2, 
                                        bgcolor: network.additionalInfo.color,
                                        '&:hover': { bgcolor: network.additionalInfo.color, filter: 'brightness(1.2)' }
                                    }}
                                 >
                                     Conectar a esta Red
                                 </Button>
                             </Stack>
                        </Box>
                    </Grid>

                    {/* Right Column: Other Networks */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Otras Redes Disponibles</Typography>
                         <Grid container spacing={2}>
                             {networks
                                .filter(n => n.id !== network.id)
                                .map((otherNet) => (
                                 <Grid size={{ xs: 12, sm: 6 }} key={otherNet.id}>
                                     <Box 
                                        onClick={() => router.push(`/network/${otherNet.id}`)}
                                        sx={{ 
                                            p: 3, 
                                            borderRadius: 2, 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            bgcolor: 'rgba(255,255,255,0.03)', 
                                            cursor: 'pointer',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { 
                                                bgcolor: 'rgba(255,255,255,0.08)', 
                                                transform: 'translateY(-5px)',
                                                borderColor: otherNet.additionalInfo.color
                                            }
                                        }}
                                     >
                                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                              <Typography variant="h6" color="white">{otherNet.identification.name}</Typography>
                                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: otherNet.additionalInfo.color }} />
                                         </Stack>
                                         <Typography variant="body2" color="text.secondary" noWrap>
                                             {otherNet.identification.symbol}
                                         </Typography>
                                     </Box>
                                 </Grid>
                             ))}
                             {networks.length <= 1 && (
                                 <Typography color="text.secondary" sx={{ p: 2 }}>No hay otras redes disponibles en este momento.</Typography>
                             )}
                         </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
