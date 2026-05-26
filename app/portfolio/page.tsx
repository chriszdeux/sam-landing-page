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
import { Box, Typography, Grid, Container, IconButton, Tooltip as MuiTooltip, Stack, Divider } from '@mui/material';
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
import { RefreshCw, Zap, TrendingUp, Wallet, PieChart, Activity } from 'lucide-react';
import { Asset } from '../../lib/types/portfolio';
import { PortfolioChart } from '../../components/portfolio/PortfolioChart';
import { AssetList } from '../../components/portfolio/AssetList';
import { TransactionsTable } from '../../components/portfolio/TransactionsTable';
import { PageHeader } from '../../components/ui/PageHeader';

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
    }, [selectedNetwork?.id, cryptos.length]);

    
    
    
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

    const totalValue = assets.reduce((acc, curr) => acc + curr.value, 0);
    const totalPowerMining = selectedNetwork?.blockchainProps?.totalPowerMining || 0;
    const marketCap = selectedNetwork?.blockchainProps?.marketCap || 0;
    const circulatingSupply = selectedNetwork?.blockchainProps?.circulatingSupply || 0;

  //# 12-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 10 }}>
        <Background />
        
        <Container maxWidth="xl" sx={{ pt: 14, position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    mb: 6,
                    gap: 2
                }}>
                    <PageHeader 
                        title="MI PORTAFOLIO" 
                        subtitle="CENTRO DE OPERACIONES FINANCIERAS Y MINERÍA"
                        color="#00f3ff"
                        sx={{ mb: 0, pt: 0 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                         <MuiTooltip title="Sincronizar con la Red">
                            <IconButton 
                                onClick={handleRefresh} 
                                disabled={isRefreshing}
                                sx={{ 
                                    color: '#00f3ff', 
                                    border: '1px solid rgba(0, 243, 255, 0.3)',
                                    bgcolor: 'rgba(0, 243, 255, 0.05)',
                                    p: 1.5,
                                    '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.1)', transform: 'rotate(180deg)' },
                                    transition: 'all 0.5s ease'
                                }}
                            >
                                <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={24} />
                            </IconButton>
                        </MuiTooltip>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {/* Stat Card 1: Total Balance */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TechFrame color="#00f3ff">
                            <Box sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(0, 243, 255, 0.7)', letterSpacing: 2, fontWeight: 'bold' }}>
                                        VALOR TOTAL
                                    </Typography>
                                    <PieChart size={18} color="#00f3ff" style={{ opacity: 0.7 }} />
                                </Stack>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, textShadow: '0 0 15px rgba(0, 243, 255, 0.3)' }}>
                                    {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                     <TaoIcon size={24} color="#00f3ff" />
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1, display: 'block' }}>
                                    ACTIVOS TOTALES: {assets.length}
                                </Typography>
                            </Box>
                        </TechFrame>
                    </Grid>

                    {/* Stat Card 2: Mining Power */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TechFrame color="#00ff9d">
                            <Box sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(0, 255, 157, 0.7)', letterSpacing: 2, fontWeight: 'bold' }}>
                                        POTENCIA RED
                                    </Typography>
                                    <Zap size={18} color="#00ff9d" style={{ opacity: 0.7 }} />
                                </Stack>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    {totalPowerMining.toLocaleString()}
                                    <Typography component="span" variant="caption" sx={{ color: '#00ff9d', fontWeight: 'bold' }}>GH/s</Typography>
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1, display: 'block' }}>
                                    ESTADO: {selectedNetwork?.isActive ? 'OPERATIVO' : 'DESCONECTADO'}
                                </Typography>
                            </Box>
                        </TechFrame>
                    </Grid>

                    {/* Stat Card 3: Market Cap */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TechFrame color="#ffb700">
                            <Box sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 183, 0, 0.7)', letterSpacing: 2, fontWeight: 'bold' }}>
                                        CAP. MERCADO
                                    </Typography>
                                    <TrendingUp size={18} color="#ffb700" style={{ opacity: 0.7 }} />
                                </Stack>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {marketCap.toLocaleString()}
                                    <TaoIcon size={24} color="#ffb700" />
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    SUPPLY: {circulatingSupply.toLocaleString()}
                                </Typography>
                            </Box>
                        </TechFrame>
                    </Grid>

                    {/* Stat Card 4: Wallets */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TechFrame color="#ef9a9a">
                            <Box sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(239, 154, 154, 0.7)', letterSpacing: 2, fontWeight: 'bold' }}>
                                        BILLETERAS
                                    </Typography>
                                    <Wallet size={18} color="#ef9a9a" style={{ opacity: 0.7 }} />
                                </Stack>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>
                                    {userInfo?.wallets?.length || 0}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1, display: 'block' }}>
                                    GUARDADAS: {userInfo?.walletsSaved?.length || 0}
                                </Typography>
                            </Box>
                        </TechFrame>
                    </Grid>
                </Grid>
            </motion.div>

            <Grid container spacing={4}>
                {/* Left Section: Operational Data */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={4}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                <Activity size={20} color="#00f3ff" />
                                <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: 3 }}>
                                    {'// GESTOR_DE_IDENTIDADES_CRIPTO'}
                                </Typography>
                            </Stack>
                            <WalletManager />
                        </Box>
                        
                        {selectedNetwork?.id && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                <Divider sx={{ mb: 4, borderColor: 'rgba(0, 243, 255, 0.1)' }} />
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <TrendingUp size={20} color="#00f3ff" />
                                    <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: 3 }}>
                                        {'// REGISTRO_INTERESTELAR_DE_TRANSACCIONES'}
                                    </Typography>
                                </Stack>
                                <TransactionsTable 
                                    storeId={selectedNetwork?.id} 
                                    walletId={userInfo?.wallets && userInfo.wallets.length > 0 ? userInfo.wallets[0].walletAddress : undefined}
                                />
                            </motion.div>
                        )}
                    </Stack>
                </Grid>

                {/* Right Section: Analytics & Assets */}
                <Grid size={{ xs: 12, lg: 4 }}>
                     <Stack spacing={4}>
                        {assets.length > 0 ? (
                            <>
                                <Box>
                                    <Typography variant="overline" sx={{ color: 'white', fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 2 }}>
                                        <PieChart size={16} /> DISTRIBUCIÓN DE ACTIVOS
                                    </Typography>
                                    <TechFrame>
                                        <Box sx={{ p: 2 }}>
                                            <PortfolioChart assets={assets} controls={controls} />
                                        </Box>
                                    </TechFrame>
                                </Box>
                                <Box>
                                    <Typography variant="overline" sx={{ color: 'white', fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 2 }}>
                                        <PieChart size={16} /> DETALLE DE TOKENS
                                    </Typography>
                                    <AssetList assets={assets} totalValue={totalValue} />
                                </Box>
                            </>
                        ) : (
                            <TechFrame color="rgba(255,255,255,0.1)">
                                <Box sx={{ p: 6, textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>MÓDULO VACÍO</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">No se detectaron activos en la red seleccionada.</Typography>
                                </Box>
                            </TechFrame>
                        )}
                     </Stack>
                </Grid>
            </Grid>
        </Container>
    </Box>
  );
}
