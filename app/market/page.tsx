// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Obtención del despachador para emitir acciones al store
// 4-Selección de datos desde el estado global de Redux
// 5-Selección de datos desde el estado global de Redux
// 6-Selección de datos desde el estado global de Redux
// 7-Efecto secundario para sincronización del ciclo de vida
// 8-Manejo de lógica de usuario para handleTransaction
// 9-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { motion } from 'framer-motion';
import { TaoIcon } from '../../components/ui/TaoIcon';

//# 2-Obtención del despachador para emitir acciones al store
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';
import { addNotification } from '../../lib/features/uiSlice';
import { BlockchainDataDisplay } from '../../components/market/BlockchainDataDisplay';

export default function MarketPage() {
  const router = useRouter();
  
  //# 3-Obtención del despachador para emitir acciones al store
  const dispatch = useDispatch<AppDispatch>();
  
  
  //# 4-Selección de datos desde el estado global de Redux
  const { cryptos, isLoading, error } = useSelector((state: RootState) => state.market);
  
  
  //# 5-Selección de datos desde el estado global de Redux
  const { selectedNetwork } = useSelector((state: RootState) => state.blockchain);
  
  
  //# 6-Selección de datos desde el estado global de Redux
  const { token } = useSelector((state: RootState) => state.auth);

  
  
  //# 7-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    if (selectedNetwork?.id) {
        dispatch(fetchCryptos(selectedNetwork.id));
    }
  }, [dispatch, selectedNetwork?.id]);

  
  
  //# 8-Manejo de lógica de usuario para handleTransaction
  const handleTransaction = (e: React.MouseEvent, type: 'BUY' | 'SELL' | 'TRANSFER', cryptoId: string) => {
    e.stopPropagation();
    
    if (!token) {
        dispatch(addNotification({
            type: 'warning',
            message: 'Operación restringida: Debes iniciar sesión para realizar transacciones.'
        }));
        return;
    }

    router.push(`/market/trade?type=${type}&cryptoId=${cryptoId}&redirect=market`);
  };

  
  
  //# 9-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
        <PageHeader 
            title="Mercado Galáctico" 
            subtitle="Intercambia activos digitales en tiempo real a través del sistema multi-cadena."
            color="#00f3ff"
        />

        <BlockchainDataDisplay network={selectedNetwork} />

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
                    <TechFrame
                    onClick={() => router.push(`/market/${crypto.id}`)}
                    color={crypto.additionalInfo?.pColor || '#00f3ff'}
                    className="h-full w-full"
                    sx={{
                        height: '100%',
                    }}
                >
                    <Box sx={{
                        height: '100%',
                        width: '100%',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between', 
                        position: 'relative'
                    }}>
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
                             <Image 
                                src={crypto.identification.image128} 
                                alt={crypto.identification.name} 
                                fill
                                style={{ objectFit: 'contain' }} 
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
                    

                    <Box sx={{ textAlign: 'center', mb: 3, zIndex: 1, width: '100%' }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {crypto.financial.price.toLocaleString(undefined, { maximumFractionDigits: 5 })}
                            <TaoIcon size={28} />
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

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, width: '100%', mt: 'auto', zIndex: 1 }}>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={(e) => handleTransaction(e, 'BUY', crypto.id)}
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
                            onClick={(e) => handleTransaction(e, 'SELL', crypto.id)}
                            sx={{ 
                                borderColor: 'rgba(255, 23, 68, 0.3)',
                                color: '#ff1744',
                                '&:hover': { borderColor: '#ff1744', bgcolor: 'rgba(255, 23, 68, 0.1)' }
                            }}
                        >
                            VENDER
                        </Button>
                    </Box>
                    </Box>
                </TechFrame>
                </motion.div>
                </Grid>
            ))}
            </Grid>
        )}
      </Container>
    </Box>
  );
}
