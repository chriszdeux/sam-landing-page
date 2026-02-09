'use client';

import React from 'react';
import { Box, Typography, Grid, Container, Paper, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppSelector } from '../../lib/hooks';
import { motion, useAnimation } from 'framer-motion';
import { TaoIcon } from '../../components/ui/TaoIcon';
import { WalletManager } from '../../components/portfolio/WalletManager';
import { TechFrame } from '../../components/ui/TechFrame';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';
import { refreshUserInfo } from '../../lib/features/auth/actions';
import { PageHeader } from '../../components/ui/PageHeader';
import { RefreshCw } from 'lucide-react';
import { Asset } from '../../lib/types/portfolio';
import { PortfolioChart } from '../../components/portfolio/PortfolioChart';
import { AssetList } from '../../components/portfolio/AssetList';

export default function PortfolioPage() {
    const { walletsInfo } = useAppSelector((state) => state.auth);
    const { cryptos } = useAppSelector((state) => state.market);
    const { selectedNetwork } = useAppSelector((state) => state.blockchain);
    const dispatch = useDispatch<AppDispatch>();
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const controls = useAnimation();

    // Fetch cryptos if they are not loaded
    React.useEffect(() => {
        if (selectedNetwork?.id && cryptos.length === 0) {
            dispatch(fetchCryptos(selectedNetwork.id));
        }
    }, [dispatch, selectedNetwork?.id, cryptos.length]);

    // Trigger animation every 4-7 seconds
    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const animate = async () => {
            await controls.start({
                filter: [
                    'brightness(1) drop-shadow(0 0 0px rgba(0,243,255,0))', 
                    'brightness(1.3) drop-shadow(0 0 25px rgba(0,243,255,0.6))', 
                    'brightness(1) drop-shadow(0 0 0px rgba(0,243,255,0))'
                ],
                transition: { duration: 2, ease: "easeInOut" }
            });
            
            // Schedule next animation
            const delay = Math.random() * (7000 - 4000) + 4000;
            timeoutId = setTimeout(animate, delay);
        };

        // Start initial loop
        timeoutId = setTimeout(animate, 2000);

        return () => clearTimeout(timeoutId);
    }, [controls]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await dispatch(refreshUserInfo()).unwrap();
        } catch (err) {
            console.error('Failed to refresh user info', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Use store data or empty array
    let assets: Asset[] = [];
    
    if (walletsInfo?.store) {
        const store = walletsInfo.store;
        assets = store.map((item, i) => {
            // Find current price in market cryptos
            const marketCrypto = cryptos.find(c => c.id === item.id || c.identification.symbol === item.symbol); 
            const price = marketCrypto?.financial?.price || 0;
            const quantity = Number(item.quantity) || 0;
            const value = quantity * price;

            // Generate neon colors
            const colors = ['#00f3ff', '#ff0055', '#ffff00', '#00ff00', '#ff00ff', '#00ffff'];

            return {
                id: item.id || marketCrypto?.id || '',
                name: item.name,
                symbol: item.symbol, 
                value: value,
                quantity: quantity,
                color: colors[i % colors.length]
            };
        });
    }

    if (assets.length === 0 && walletsInfo) {
         assets = []; 
    }

    const totalValue = assets.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <PageHeader 
                    title="INVENTARIO DE ACTIVOS" 
                    subtitle="Gestión y visualización de tu portafolio de activos digitales."
                    color="#00f3ff"
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 8, gap: 2 }}>
                    <TechFrame>
                        <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" color="text.secondary">Valor Total:</Typography>
                            <Typography variant="h4" sx={{ color: '#00f3ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <TaoIcon size={24} /> 
                            </Typography>
                        </Box>
                    </TechFrame>

                     <MuiTooltip title="Actualizar datos">
                        <IconButton 
                            onClick={handleRefresh} 
                            disabled={isRefreshing}
                            sx={{ color: '#00f3ff', border: '1px solid rgba(0, 243, 255, 0.3)' }}
                        >
                            <RefreshCw className={isRefreshing ? 'animate-spin' : ''} />
                        </IconButton>
                    </MuiTooltip>
                </Box>
            </motion.div>

            <WalletManager />

            {assets.length > 0 ? (
                <Grid container spacing={8} justifyContent="center" alignItems="center">
                    <Grid size={{ xs: 12, md: 5 }}>
                        <PortfolioChart assets={assets} controls={controls} />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 7 }}>
                        <AssetList assets={assets} totalValue={totalValue} />
                    </Grid>
                </Grid>
            ) : (
                <Paper sx={{ p: 5, bgcolor: 'rgba(255,255,255,0.05)', textAlign: 'center', maxWidth: 500, mx: 'auto', mt: 10 }}>
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                        Inventario Vacío
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No posees activos actualmente. Visita el Mercado para adquirir tus primeros criptoactivos.
                    </Typography>
                </Paper>
            )}
        </Container>
    </Box>
  );
}
