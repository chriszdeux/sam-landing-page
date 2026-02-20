// 1-Definir vista de detalles de criptomoneda
// 2-Obtener estado global, autenticación y configuración
// 3-Manejar navegación a transacción
// 4-Renderizar vista de carga o error
// 5-Renderizar detalles completos de la criptomoneda

//# 1-Definir vista de detalles de criptomoneda
'use client';

import React from 'react';
import { Box, Typography, Stack, Container, Grid, Button, Chip, Avatar, Divider, CircularProgress } from '@mui/material';
import { ParticleBackground } from '../ui/ParticleBackground';
import { ArrowBack, TrendingUp, TrendingDown, AccessTime, Code, ShoppingCart, AttachMoney } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { CryptoChart } from './CryptoChart';
import { CryptoStats } from './CryptoStats';
import { TransactionHistory } from './TransactionHistory';
import { MarketSentiment } from './MarketSentiment';
import { Card } from '../ui/Card';
import { TaoIcon } from '../ui/TaoIcon';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { addNotification } from '../../lib/features/uiSlice';

interface CryptoDetailViewProps {
    id: string;
}

export const CryptoDetailView = ({ id }: CryptoDetailViewProps) => {
    const router = useRouter();
    
    //# 2-Obtener estado global, autenticación y configuración
    const dispatch = useAppDispatch();
    const { cryptos, isLoading } = useAppSelector((state) => state.market);
    const { token } = useAppSelector((state) => state.auth);
    
    const [selectedRange, setSelectedRange] = React.useState('1d');
    
    const crypto = cryptos.find((c) => c.id === id);

    //# 3-Manejar navegación a transacción
    const handleTransaction = (type: 'BUY' | 'SELL' | 'TRANSFER') => {
        if (!token) {
            dispatch(addNotification({
                type: 'warning',
                message: 'Operación restringida: Debes iniciar sesión para realizar transacciones.'
            }));
            return;
        }
        router.push(`/market/trade?type=${type}&cryptoId=${id}&redirect=detail`);
    };

    //# 4-Renderizar vista de carga o error
    if (isLoading && !crypto) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
               <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!crypto) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" color="error">Criptomoneda no encontrada</Typography>
                <Button onClick={() => router.push('/market')} variant="outlined">Volver al Mercado</Button>
            </Box>
        );
    }

    const isPositive = (crypto.financial.change24h || 0) >= 0;
    const color = isPositive ? '#00ff88' : '#ff0055';
    const description = crypto.additionalInfo?.description || [
        `${crypto.identification.name} is a cryptocurrency on the ${crypto.network.name} network.`
    ];

    //# 5-Renderizar detalles completos de la criptomoneda
    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', pt: 10, pb: 10 }}>
            <ParticleBackground />
            
            <Container maxWidth="xl">
                <Stack spacing={4}>
                    <Button 
                        startIcon={<ArrowBack />} 
                        onClick={() => router.back()}
                        sx={{ color: 'text.secondary', width: 'fit-content', '&:hover': { color: 'primary.main' } }}
                    >
                        Volver al Mercado
                    </Button>

                    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar 
                                src={crypto.identification.image256 || crypto.identification.image128}
                                alt={crypto.identification.name}
                                sx={{ width: 64, height: 64, bgcolor: crypto.additionalInfo?.pColor || 'primary.main' }}
                            >
                                {crypto.identification.symbol[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                    {crypto.identification.name} <Typography component="span" variant="h5" sx={{ color: 'text.secondary', ml: 1 }}>{crypto.identification.symbol}</Typography>
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Chip label="Rank #N/A" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                                    <Chip label="Coin" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                                    <Chip label={crypto.network.name} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                                    {crypto.isActive !== undefined && (
                                        <Chip 
                                            label={crypto.isActive ? 'Activo' : 'Inactivo'} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: crypto.isActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)', 
                                                color: crypto.isActive ? '#00ff88' : '#ff0055',
                                                border: '1px solid',
                                                borderColor: crypto.isActive ? '#00ff88' : '#ff0055'
                                            }} 
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Stack>

                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                                {crypto.financial.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                <TaoIcon size={32} />
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Chip 
                                    icon={isPositive ? <TrendingUp /> : <TrendingDown />} 
                                    label={`${isPositive ? '+' : ''}${crypto.financial.change24h?.toFixed(2)}% (24h)`}
                                    sx={{ 
                                        bgcolor: isPositive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)', 
                                        color: color,
                                        fontWeight: 'bold'
                                    }} 
                                />
                            </Stack>
                        </Box>
                    </Stack>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>Rendimiento</Typography>
                                        <Stack direction="row" spacing={1}>
                                            {['1h', '6h', '1d', '7d', '1m', '3m', '12m', 'all'].map((tf) => (
                                                <Button 
                                                    key={tf} 
                                                    variant="text" 
                                                    size="small"
                                                    onClick={() => setSelectedRange(tf)}
                                                    sx={{ 
                                                        color: tf === selectedRange ? 'primary.main' : 'text.secondary',
                                                        minWidth: 'auto',
                                                        bgcolor: tf === selectedRange ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    {tf}
                                                </Button>
                                            ))}
                                        </Stack>
                                    </Stack>
                                    <CryptoChart color={color} cryptoId={id} range={selectedRange} />
                                </Box>

                                <Box>
                                     <MarketSentiment cryptoId={id} />
                                     <TransactionHistory walletId={crypto.financial.contractAddress} />
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack spacing={4}>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<ShoppingCart />}
                                        onClick={() => handleTransaction('BUY')}
                                        sx={{ 
                                            bgcolor: '#00ff88', 
                                            color: '#000',
                                            fontWeight: 'bold',
                                            '&:hover': { bgcolor: '#00cc6a' }
                                        }}
                                    >
                                        Comprar
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<AttachMoney />}
                                        onClick={() => handleTransaction('SELL')}
                                        sx={{ 
                                            color: '#ff0055', 
                                            borderColor: '#ff0055',
                                            fontWeight: 'bold',
                                            '&:hover': { 
                                                bgcolor: 'rgba(255, 0, 85, 0.1)',
                                                borderColor: '#ff0055' 
                                            }
                                        }}
                                    >
                                        Vender
                                    </Button>
                                </Stack>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderBottom: '2px solid', borderColor: 'primary.main', display: 'inline-block', pb: 0.5 }}>
                                        Estadísticas de Mercado
                                    </Typography>
                                    <CryptoStats financial={crypto.financial} color={color} />
                                </Box>

                                <Card glowColor={crypto.additionalInfo?.pColor || color} sx={{ p: 3, border: `1px solid ${crypto.additionalInfo?.pColor || 'rgba(255,255,255,0.1)'}40` }}>
                                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        Sobre {crypto.identification.name}
                                        {crypto.additionalInfo?.pColor && (
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: crypto.additionalInfo.pColor, boxShadow: `0 0 10px ${crypto.additionalInfo.pColor}` }} />
                                        )}
                                    </Typography>
                                    
                                    <Box sx={{ mb: 3 }}>
                                        {description.map((desc, i) => (
                                            <Typography key={i} variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1.5 }}>
                                                {desc}
                                            </Typography>
                                        ))}
                                    </Box>
                                    
                                    <Divider sx={{ my: 2, borderColor: `${crypto.additionalInfo?.sColor || 'rgba(255,255,255,0.1)'}40` }} />

                                    <Stack spacing={2}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <AccessTime fontSize="small" sx={{ color: crypto.additionalInfo?.pColor || 'primary.main' }} />
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Creado:</Box> {crypto.additionalInfo?.dateCreated ? new Date(crypto.additionalInfo.dateCreated).toLocaleDateString() : 'Desconocido'}
                                            </Typography>
                                        </Stack>
                                        
                                        {crypto.updatedAt && (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AccessTime fontSize="small" sx={{ color: crypto.additionalInfo?.sColor || 'text.secondary' }} />
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Actualizado:</Box> {new Date(crypto.updatedAt).toLocaleString()}
                                                </Typography>
                                            </Stack>
                                        )}
                                        
                                        <Box>
                                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                <Code fontSize="small" sx={{ color: crypto.additionalInfo?.pColor || 'primary.main' }} />
                                                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                    Developers:
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                                {crypto.additionalInfo?.developers && crypto.additionalInfo.developers.length > 0 ? (
                                                    crypto.additionalInfo.developers.map((dev, index) => (
                                                        <Chip 
                                                            key={index} 
                                                            label={dev} 
                                                            size="small" 
                                                            variant="outlined"
                                                            sx={{ 
                                                                color: crypto.additionalInfo?.sColor || 'text.secondary',
                                                                borderColor: `${crypto.additionalInfo?.pColor || 'rgba(255,255,255,0.2)'}60`,
                                                                bgcolor: `${crypto.additionalInfo?.pColor || '#ffffff'}10`
                                                            }} 
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">N/A</Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
};
