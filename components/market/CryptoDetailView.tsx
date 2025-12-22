'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Stack, Container, Grid, Button, Chip, Avatar, Divider, CircularProgress } from '@mui/material';
import { ParticleBackground } from '../ui/ParticleBackground';
import { ArrowBack, TrendingUp, TrendingDown, AccessTime, Code } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { CryptoChart } from './CryptoChart';
import { CryptoStats } from './CryptoStats';
import { CryptoNews } from './CryptoNews';
import { TransactionHistory } from './TransactionHistory';
import { Card } from '../ui/Card';


// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';

interface CryptoDetailViewProps {
    id: string;
}

export const CryptoDetailView = ({ id }: CryptoDetailViewProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { cryptos, isLoading } = useSelector((state: RootState) => state.market);
    // Assuming selectedNetworkId is not available directly, we might default or fix types later. Using hardcoded for now or selecting from store if available.
    // const { selectedNetworkId } = useSelector((state: RootState) => state.blockchain); 
    
    const [selectedRange, setSelectedRange] = React.useState('1d');
    
    // Find the crypto in the store
    const crypto = cryptos.find((c) => c.id === id);

// ... (I'll do single replacement for dependency array)
    useEffect(() => {
        // If we don't have the crypto and aren't loading, try fetching
        if (!crypto && !isLoading && cryptos.length === 0) {
            dispatch(fetchCryptos('ETH-SEPOLIA'));
        }
    }, [crypto, isLoading, cryptos.length, dispatch]);

    // Show loading state if we are loading and don't have the crypto yet
    if (isLoading && !crypto) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
               <CircularProgress color="primary" />
            </Box>
        );
    }

    // Show error or not found if still no crypto
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
    // Fallback description if missing
    const description = crypto.additionalInfo?.description || [
        `${crypto.identification.name} is a cryptocurrency on the ${crypto.network.name} network.`
    ];

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', pt: 10, pb: 10 }}>
            <ParticleBackground />
            
            <Container maxWidth="xl">
                {/* Header Section */}
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
                                src={crypto.identification.image128}
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
                                </Stack>
                            </Box>
                        </Stack>

                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                ${crypto.financial.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
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

                    {/* Main Content Grid */}
                    <Grid container spacing={4}>
                        {/* Left Column: Chart & Transactions */}
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
                                     <TransactionHistory walletId={crypto.financial.contractAddress} />
                                </Box>
                            </Stack>
                        </Grid>

                        {/* Right Column: Stats, Description, News */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderBottom: '2px solid', borderColor: 'primary.main', display: 'inline-block', pb: 0.5 }}>
                                        Estadísticas de Mercado
                                    </Typography>
                                    <CryptoStats financial={crypto.financial} color={color} />
                                </Box>

                                <Card glowColor={color} sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Sobre {crypto.identification.name}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                                        {description.join(' ')}
                                    </Typography>
                                    
                                    <Stack spacing={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <AccessTime fontSize="small" sx={{ color: 'primary.main' }} />
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Creado: {crypto.additionalInfo?.dateCreated ? new Date(crypto.additionalInfo.dateCreated).toLocaleDateString() : 'Desconocido'}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Code fontSize="small" sx={{ color: 'primary.main' }} />
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Developers: {crypto.additionalInfo?.developers.join(', ') || 'N/A'}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Card>

                                <CryptoNews name={crypto.identification.name} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
};
