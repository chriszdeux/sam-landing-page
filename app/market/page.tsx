'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Background } from '../../components/layout/Background';
import { Card } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { Send } from '@mui/icons-material';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';

import { MarketLineChart } from '../../components/market/MarketLineChart';


export default function MarketPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cryptos, isLoading, error } = useSelector((state: RootState) => state.market);
  const { selectedNetwork } = useSelector((state: RootState) => state.blockchain);

  useEffect(() => {
    if (selectedNetwork?.id) {
        dispatch(fetchCryptos(selectedNetwork.id));
    }
  }, [selectedNetwork?.id, dispatch]);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6, color: 'primary.main' }}>
          Mercado Galáctico
        </Typography>

        {/* Chart Section */}
        {/* Chart Section */}
        <MarketLineChart />

        {/* Assets Grid */}
        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>Activos Listados</Typography>
        
        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                <CircularProgress color="primary" />
            </Box>
        ) : error ? (
            <Typography align="center" color="error">Error al cargar datos: {error}</Typography>
        ) : (
            <Grid container spacing={4}>
            {cryptos.map((crypto, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={crypto.id}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ height: '100%' }}
                >
                    <Card
                    onClick={() => router.push(`/market/${crypto.id}`)}
                    glowColor={crypto.additionalInfo?.pColor || '#00f3ff'}
                    sx={{
                    height: '100%',
                    width: '100%',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: `linear-gradient(180deg, rgba(20, 20, 25, 0.8) 0%, ${(crypto.additionalInfo?.pColor || '#00f3ff')}15 100%)`,
                    }}
                >
                    {/* Ambient Glow */}
                    <Box sx={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: crypto.additionalInfo?.pColor || 'primary.main',
                        filter: 'blur(80px)',
                        opacity: 0.15,
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    {/* Header: Symbol & Name */}
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, zIndex: 1 }}>
                        <Box sx={{ textAlign: 'left' }}>
                             <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.1 }}>{crypto.identification.symbol}</Typography>
                             <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>{crypto.identification.name}</Typography>
                        </Box>
                        <Box sx={{ 
                            px: 1, py: 0.5, 
                            borderRadius: 1, 
                            bgcolor: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            letterSpacing: 1
                        }}>
                            COIN
                        </Box>
                    </Box>

                    {/* Main Image - Dominant */}
                    <Box sx={{ 
                        width: 160, 
                        height: 160, 
                        my: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        position: 'relative',
                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                        '&:hover': { 
                            transform: 'scale(1.1) translateY(-5px)' 
                        }
                    }}>
                        {crypto.identification.image128 ? (
                             <img 
                                src={crypto.identification.image128} 
                                alt={crypto.identification.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                            />
                        ) : (
                            <Box sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                bgcolor: crypto.additionalInfo?.pColor || 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3.5rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                boxShadow: `0 0 30px ${(crypto.additionalInfo?.pColor || '#00f3ff')}40`
                            }}>
                                {crypto.identification.symbol[0]}
                            </Box>
                        )}
                    </Box>
                    
                    {/* Price Section */}
                    <Box sx={{ textAlign: 'center', mb: 3, zIndex: 1, width: '100%' }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                            ${crypto.financial.price.toLocaleString(undefined, { maximumFractionDigits: 5 })}
                        </Typography>
                        
                        <Box sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: 10,
                            bgcolor: (crypto.financial.change24h || 0) >= 0 ? 'rgba(0, 255, 157, 0.08)' : 'rgba(255, 51, 51, 0.08)',
                            border: `1px solid ${(crypto.financial.change24h || 0) >= 0 ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 51, 51, 0.2)'}`
                        }}>
                             <Typography variant="body2" fontWeight="bold" sx={{ color: (crypto.financial.change24h || 0) >= 0 ? '#00ff9d' : '#ff3333' }}>
                                {(crypto.financial.change24h || 0) > 0 ? '+' : ''}{(crypto.financial.change24h || 0).toFixed(2)}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>24h</Typography>
                        </Box>
                    </Box>

                    {/* Actions Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, width: '100%', mt: 'auto', zIndex: 1 }}>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/market/trade?type=BUY&cryptoId=${crypto.id}`);
                            }}
                            sx={{ 
                                borderColor: 'rgba(0, 230, 118, 0.3)',
                                color: '#00e676',
                                '&:hover': { borderColor: '#00e676', bgcolor: 'rgba(0, 230, 118, 0.1)' }
                            }}
                        >
                            COMPRAR
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/market/trade?type=SELL&cryptoId=${crypto.id}`);
                            }}
                            sx={{ 
                                borderColor: 'rgba(255, 23, 68, 0.3)',
                                color: '#ff1744',
                                '&:hover': { borderColor: '#ff1744', bgcolor: 'rgba(255, 23, 68, 0.1)' }
                            }}
                        >
                            VENDER
                        </Button>
                        {/* Transfer is secondary, can be full width or just hidden if space is tight. Let's make it full width below */}
                    </Box>
                     <Button 
                        variant="text" 
                        size="small" 
                        fullWidth
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/market/trade?type=TRANSFER&cryptoId=${crypto.id}`);
                        }}
                        sx={{ 
                            mt: 1,
                            color: 'text.secondary',
                            zIndex: 1,
                            '&:hover': { color: 'white' }
                        }}
                    >
                        <Send sx={{ fontSize: 16, mr: 1 }} /> TRANSFERIR
                    </Button>
                </Card>
                </motion.div>
                </Grid>
            ))}
            </Grid>
        )}
      </Container>
    </Box>
  );
}
