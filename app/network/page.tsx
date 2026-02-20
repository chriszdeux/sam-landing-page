// 1-Selección de datos desde el estado global de Redux
// 2-Selección de datos desde el estado global de Redux
// 3-Selección de ítem y actualización de network
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Button, IconButton } from '@mui/material';
import { Background } from '../../components/layout/Background';

//# 1-Selección de datos desde el estado global de Redux
import { useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function NetworkSelectionPage() {
  const router = useRouter();
  
  //# 2-Selección de datos desde el estado global de Redux
  const { networks, selectedNetwork } = useAppSelector((state) => state.blockchain);

  
  
  //# 3-Selección de ítem y actualización de network
  const handleNetworkSelect = (networkId: string) => {
    
    router.push(`/network/${networkId}/connecting`);
  };

  
  
  //# 4-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
            <PageHeader 
                title="SISTEMAS INTERPLANETARIOS" 
                subtitle="Selecciona la red blockchain a la que deseas conectarte para sincronizar tus activos."
                color="#00f3ff"
            />

            <Grid container spacing={6} justifyContent="center">
                {networks.map((network, index) => {
                    const isSelected = selectedNetwork?.id === network.id;
                    const color = network.additionalInfo?.color || '#00f3ff';
                    
                    
                    
                    //# 5-Estructuración y renderizado visual del componente UI
                    return (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={network.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                style={{ height: '100%' }}
                            >
                                <TechFrame 
                                    color={color} 
                                    className="h-full"
                                    onClick={() => handleNetworkSelect(network.id)}
                                    sx={{ 
                                        height: '100%', 
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="overline" sx={{ color: color, letterSpacing: 2, display: 'block' }}>
                                                    {network.identification?.symbol || 'NET'} - PROTOCOL
                                                </Typography>
                                                <Typography variant="h4" color="white" fontWeight="bold" sx={{ mb: 1 }}>
                                                    {network.identification?.name}
                                                </Typography>
                                                {isSelected && (
                                                    <Box sx={{ 
                                                        display: 'inline-flex', 
                                                        alignItems: 'center', 
                                                        px: 1, py: 0.5, 
                                                        bgcolor: 'rgba(0, 255, 0, 0.1)', 
                                                        border: '1px solid #00ff00', 
                                                        borderRadius: 1, 
                                                        gap: 0.5 
                                                    }}>
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ff00', boxShadow: '0 0 5px #00ff00' }} />
                                                        <Typography variant="caption" color="#00ff00" fontWeight="bold">CONECTADO</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <IconButton sx={{ 
                                                border: `1px solid ${color}`, 
                                                color: color,
                                                '&:hover': { bgcolor: `${color}20` }
                                            }}>
                                                <ArrowForward />
                                            </IconButton>
                                        </Box>
                                        
                                        {}
                                        <Box sx={{ 
                                            height: 150, 
                                            width: '100%', 
                                            position: 'relative', 
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                             <Box sx={{
                                                 width: 100,
                                                 height: 100,
                                                 borderRadius: '50%',
                                                 background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
                                                 boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}80`,
                                                 position: 'relative',
                                                 zIndex: 2
                                             }}>
                                                 {}
                                                 <Box sx={{
                                                     position: 'absolute',
                                                     inset: -10,
                                                     borderRadius: '50%',
                                                     border: `1px dashed ${color}40`,
                                                     animation: 'spin 10s linear infinite'
                                                 }} />
                                             </Box>
                                             {}
                                             <Box sx={{
                                                 position: 'absolute',
                                                 inset: 0,
                                                 backgroundImage: `radial-gradient(${color}20 1px, transparent 1px)`,
                                                 backgroundSize: '20px 20px',
                                                 opacity: 0.3,
                                                 maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                                                 zIndex: 1
                                             }} />
                                        </Box>

                                        {}
                                        <Grid container spacing={2} sx={{ mt: 'auto' }}>
                                            <Grid size={{ xs: 4 }}>
                                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>MARKET CAP</Typography>
                                                    <Typography variant="body2" color="white" fontWeight="bold">
                                                        ${((network as any).blockchainProps?.marketCap || 0).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>SUPPLY</Typography>
                                                    <Typography variant="body2" color="white" fontWeight="bold">
                                                       {((network as any).blockchainProps?.circulatingSupply || 0).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>TOKENS</Typography>
                                                    <Typography variant="body2" color="white" fontWeight="bold">
                                                        {(network as any).tokensSupported?.total || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {}
                                        <Button 
                                            fullWidth 
                                            variant="outlined" 
                                            sx={{ 
                                                mt: 2, 
                                                borderColor: color, 
                                                color: color,
                                                '&:hover': {
                                                    bgcolor: `${color}10`,
                                                    borderColor: color,
                                                    boxShadow: `0 0 15px ${color}40`
                                                }
                                            }}
                                        >
                                            {isSelected ? 'RE-SINCRONIZAR' : 'INICIAR CONEXIÓN'}
                                        </Button>
                                    </Box>
                                </TechFrame>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>
            
            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Container>
    </Box>
  );
}
