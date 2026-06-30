'use client';

import React from 'react';
import { Box, Typography, Stack, Avatar, IconButton, Divider, Container, Button } from '@mui/material';
import { ArrowBack, Inventory, MonetizationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../lib/hooks';
import { TechFrame } from '../../../components/ui/TechFrame';
import { Background } from '../../../components/layout/Background';

export default function AssetsPage() {
    const router = useRouter();
    const { walletsInfo } = useAppSelector((state) => state.auth);
    const assets = walletsInfo?.store || [];

    return (
        <main className="min-h-screen relative pb-20">
            <Background />
            
            <Container maxWidth="xl" sx={{ pt: { xs: 12, md: 16 }, position: 'relative', zIndex: 10 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <IconButton 
                            onClick={() => router.back()} 
                            sx={{ 
                                color: '#00f3ff', 
                                border: '1px solid rgba(0, 243, 255, 0.3)',
                                bgcolor: 'rgba(0, 243, 255, 0.05)',
                                '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.1)' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ 
                                p: 1.5, 
                                bgcolor: 'rgba(0, 243, 255, 0.1)', 
                                borderRadius: 2, 
                                border: '1px solid rgba(0, 243, 255, 0.3)',
                                display: 'flex'
                            }}>
                                <Inventory sx={{ color: '#00f3ff', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
                                    Inventario de <Box component="span" sx={{ color: '#00f3ff' }}>Activos</Box>
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(0, 243, 255, 0.6)', fontWeight: 'bold', letterSpacing: 2 }}>
                                    {assets.length} PROTOCOLOS IDENTIFICADOS EN LA RED
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>

                <Divider sx={{ mb: 6, borderColor: 'rgba(255,255,255,0.05)' }} />

                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, 
                    gap: 4 
                }}>
                    {assets.length > 0 ? (
                        assets.map((asset, index) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <TechFrame color="rgba(0, 243, 255, 0.2)">
                                    <Box sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                            <Avatar sx={{ 
                                                width: 56,
                                                height: 56,
                                                bgcolor: 'rgba(0, 243, 255, 0.1)', 
                                                color: '#00f3ff', 
                                                border: '2px solid rgba(0, 243, 255, 0.3)',
                                                fontWeight: 'bold',
                                                fontSize: '1.5rem'
                                            }}>
                                                {asset.symbol[0]}
                                            </Avatar>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', display: 'block' }}>
                                                    PROTOCOL_ID
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#00f3ff', fontFamily: 'monospace' }}>
                                                    {asset.id.slice(0, 8)}...
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                                            {asset.name}
                                        </Typography>
                                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', letterSpacing: 2 }}>
                                            {asset.symbol}
                                        </Typography>

                                        <Box sx={{ 
                                            mt: 4, 
                                            p: 2, 
                                            bgcolor: 'rgba(255,255,255,0.02)', 
                                            borderRadius: 2,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'baseline'
                                        }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                                                BALANCE DISPONIBLE
                                            </Typography>
                                            <Typography variant="h5" sx={{ color: '#00f3ff', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                {asset.quantity.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        
                                        <Button 
                                            variant="outlined" 
                                            fullWidth 
                                            sx={{ 
                                                mt: 3, 
                                                borderColor: 'rgba(0, 243, 255, 0.3)', 
                                                color: '#00f3ff',
                                                '&:hover': { borderColor: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.05)' }
                                            }}
                                            onClick={() => router.push(`/market/${asset.id}`)}
                                        >
                                            DETALLES DEL PROTOCOLO
                                        </Button>
                                    </Box>
                                </TechFrame>
                            </motion.div>
                        ))
                    ) : (
                        <Box sx={{ gridColumn: '1 / -1', py: 20, textAlign: 'center' }}>
                            <MonetizationOn sx={{ fontSize: 80, color: 'rgba(255,255,255,0.05)', mb: 3 }} />
                            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
                                No se han detectado protocolos activos en su billetera.
                            </Typography>
                            <Button 
                                variant="contained" 
                                sx={{ mt: 4, bgcolor: '#00f3ff', color: '#000', fontWeight: 'bold' }}
                                onClick={() => router.push('/market')}
                            >
                                ADQUIRIR ACTIVOS
                            </Button>
                        </Box>
                    )}
                </Box>
            </Container>
        </main>
    );
}
