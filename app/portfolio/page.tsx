// 1-Selección de datos desde el estado global de Redux
// 2-Obtención del despachador para emitir acciones al store
// 3-Selección de datos desde el estado global de Redux
// 4-Selección de datos desde el estado global de Redux
// 5-Selección de datos desde el estado global de Redux
// 6-Obtención del despachador para emitir acciones al store
// 7-Control de estado booleano para is refreshing
// 8-Efecto secundario para sincronización del ciclo de vida
// 9-Efecto secundario para sincronización del ciclo de vida
// 10-Estructuración y renderizado visual del componente UI
// 11-Manejo de lógica de usuario para handleRefresh
// 12-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Box, Typography, Grid, Container, Paper, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import { Background } from '../../components/layout/Background';

//# 1-Selección de datos desde el estado global de Redux
import { useAppSelector } from '../../lib/hooks';
import { motion, useAnimation } from 'framer-motion';
import { TaoIcon } from '../../components/ui/TaoIcon';
import { WalletManager } from '../../components/portfolio/WalletManager';
import { TechFrame } from '../../components/ui/TechFrame';

//# 2-Obtención del despachador para emitir acciones al store
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';
import { refreshUserInfo } from '../../lib/features/auth/actions';
import { RefreshCw } from 'lucide-react';
import { Asset } from '../../lib/types/portfolio';
import { PortfolioChart } from '../../components/portfolio/PortfolioChart';
import { AssetList } from '../../components/portfolio/AssetList';
import { TransactionsTable } from '../../components/portfolio/TransactionsTable';

export default function PortfolioPage() {
    
    //# 3-Selección de datos desde el estado global de Redux
    const { walletsInfo, userInfo } = useAppSelector((state) => state.auth);
    
    //# 4-Selección de datos desde el estado global de Redux
    const { cryptos } = useAppSelector((state) => state.market);
    
    //# 5-Selección de datos desde el estado global de Redux
    const { selectedNetwork } = useAppSelector((state) => state.blockchain);
    
    //# 6-Obtención del despachador para emitir acciones al store
    const dispatch = useDispatch<AppDispatch>();
    
    //# 7-Control de estado booleano para is refreshing
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const controls = useAnimation();

    
    
    
    //# 8-Efecto secundario para sincronización del ciclo de vida
    React.useEffect(() => {
        if (selectedNetwork?.id && cryptos.length === 0) {
            dispatch(fetchCryptos(selectedNetwork.id));
        }
    }, [dispatch, selectedNetwork?.id, cryptos.length]);

    
    
    
    //# 9-Efecto secundario para sincronización del ciclo de vida
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
            
            
            const delay = Math.random() * (7000 - 4000) + 4000;
            timeoutId = setTimeout(animate, delay);
        };

        
        timeoutId = setTimeout(animate, 2000);

        
        
        //# 10-Estructuración y renderizado visual del componente UI
        return () => clearTimeout(timeoutId);
    }, [controls]);

    
    
    //# 11-Manejo de lógica de usuario para handleRefresh
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

    
    let assets: Asset[] = [];
    
    if (walletsInfo?.store) {
        const store = walletsInfo.store;
        assets = store.map((item, i) => {
            
            const marketCrypto = cryptos.find(c => c.id === item.id || c.identification.symbol === item.symbol); 
            const price = marketCrypto?.financial?.price || 0;
            const quantity = Number(item.quantity) || 0;
            const value = quantity * price;

            
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

  //# 12-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 10 }}>
        <Background />
        
        <Container maxWidth="xl" sx={{ pt: 14, position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                         <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: 1 }}>
                            PORTAFOLIO
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
                            VISTA GENERAL DE ACTIVOS
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                         <MuiTooltip title="Actualizar datos">
                            <IconButton 
                                onClick={handleRefresh} 
                                disabled={isRefreshing}
                                sx={{ 
                                    color: '#00f3ff', 
                                    border: '1px solid rgba(0, 243, 255, 0.3)',
                                    bgcolor: 'rgba(0, 243, 255, 0.05)',
                                    '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.1)' }
                                }}
                            >
                                <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={20} />
                            </IconButton>
                        </MuiTooltip>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Stat Card 1: Total Balance */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TechFrame color="#00f3ff">
                            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(0, 243, 255, 0.7)', letterSpacing: 1 }}>BALANCE TOTAL</Typography>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                         <TaoIcon size={24} color="#00f3ff" />
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff' }}>
                                    <TaoIcon size={32} />
                                </Box>
                            </Box>
                        </TechFrame>
                    </Grid>
                     {/* Stat Card 2: Asset Count */}
                     <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TechFrame color="#ce93d8">
                            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(206, 147, 216, 0.7)', letterSpacing: 1 }}>ACTIVOS DISTINTOS</Typography>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>
                                        {assets.length}
                                    </Typography>
                                </Box>
                                <Box sx={{ opacity: 0.5 }}>
                                    {/* Icon placeholder or mini chart */}
                                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #ce93d8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ce93d8', fontWeight: 'bold' }}>
                                        %
                                    </Box>
                                </Box>
                            </Box>
                        </TechFrame>
                    </Grid>
                     {/* Stat Card 3: Wallet Count */}
                     <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TechFrame color="#ffff00">
                            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 0, 0.7)', letterSpacing: 1 }}>WALLETS ACTIVAS</Typography>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>
                                        {userInfo?.wallets?.length || 0}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'rgba(255, 255, 0, 0.1)', color: '#ffff00' }}>
                                   {/* Wallet Icon */}
                                   <Box sx={{ width: 32, height: 32, border: '2px solid currentColor', borderRadius: 1 }} />
                                </Box>
                            </Box>
                        </TechFrame>
                    </Grid>
                </Grid>
            </motion.div>

            <Grid container spacing={4}>
                {/* Left Column: Wallets & Transactions (2/3 width) */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Box sx={{ mb: 4 }}>
                        <WalletManager />
                    </Box>
                    
                    {selectedNetwork?.id && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                             <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', mb: 2, display: 'block', letterSpacing: 4 }}>
                                {'// HISTORIAL_TRANSACCIONES'}
                            </Typography>
                            <TransactionsTable 
                                storeId={selectedNetwork?.id} 
                                walletId={userInfo?.wallets?.length === 1 ? userInfo.wallets[0].walletAddress : undefined}
                            />
                        </motion.div>
                    )}
                </Grid>

                {/* Right Column: Charts & Assets (1/3 width) */}
                <Grid size={{ xs: 12, lg: 4 }}>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {assets.length > 0 ? (
                            <>
                                <Box>
                                    <Typography variant="overline" sx={{ color: 'white', fontWeight: 'bold', mb: 2, display: 'block', letterSpacing: 2 }}>
                                        ANÁLISIS GRÁFICO
                                    </Typography>
                                    <TechFrame>
                                        <Box sx={{ p: 2 }}>
                                            <PortfolioChart assets={assets} controls={controls} />
                                        </Box>
                                    </TechFrame>
                                </Box>
                                <Box>
                                    <Typography variant="overline" sx={{ color: 'white', fontWeight: 'bold', mb: 2, display: 'block', letterSpacing: 2 }}>
                                        LISTADO DE ACTIVOS
                                    </Typography>
                                    <AssetList assets={assets} totalValue={totalValue} />
                                </Box>
                            </>
                        ) : (
                            <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">Sin activos</Typography>
                                <Typography variant="caption" color="text.secondary">Explora el mercado para comenzar.</Typography>
                            </Paper>
                        )}
                     </Box>
                </Grid>
            </Grid>
        </Container>
    </Box>
  );
}
