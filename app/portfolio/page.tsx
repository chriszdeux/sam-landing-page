"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Stack, Tab, Tabs, IconButton, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { RefreshCw, Database, Activity, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Hooks y Redux
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { fetchCryptos, fetchCryptoHistory } from '../../lib/features/market/actions';
import { fetchNetworks, fetchMiningPower } from '../../lib/features/blockchain/actions';
import { refreshUserInfo } from '../../lib/features/auth/actions';
import { updateNetworkPower } from '../../lib/features/blockchain/reducer';
import api from '../../lib/api';

// Componentes Propios
import { ParticleBackground } from '../../components/ui/ParticleBackground';
import { BalancesPanel } from '../../components/portfolio/BalancesPanel';
import { CandlestickChart } from '../../components/portfolio/CandlestickChart';
import { MiningControlPanel } from '../../components/portfolio/MiningControlPanel';
import { TransactionsTable } from '../../components/portfolio/TransactionsTable';
import { TaoIcon } from '../../components/ui/TaoIcon';

export default function FusionDashboard() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    // Selectores de Estado
    const { userInfo, walletsInfo } = useAppSelector((state: any) => state.auth);
    const { cryptos, historicalData, isLoading: marketLoading } = useAppSelector((state: any) => state.market);
    const { selectedNetwork, networks } = useAppSelector((state: any) => state.blockchain);
    
    // Estado Local
    const [selectedCryptoId, setSelectedCryptoId] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isInjecting, setIsInjecting] = useState(false);
    
    // Estado del Bucle de Energía
    const [energy, setEnergy] = useState(0);
    const [maxEnergy, setMaxEnergy] = useState(100);
    const [labStats, setLabStats] = useState({ efficiency: 82, temperature: 38, uptime: 99.9 });
    const energyRef = useRef(0);

    // Inicialización de Datos
    useEffect(() => {
        dispatch(fetchNetworks());
        dispatch(fetchMiningPower());
    }, [dispatch]);

    useEffect(() => {
        if (selectedNetwork?.id) {
            dispatch(fetchCryptos(selectedNetwork.id));
        }
    }, [selectedNetwork, dispatch]);

    useEffect(() => {
        if (cryptos.length > 0 && !selectedCryptoId) {
            setSelectedCryptoId(cryptos[0].id);
        }
    }, [cryptos, selectedCryptoId]);

    useEffect(() => {
        if (selectedCryptoId) {
            dispatch(fetchCryptoHistory({ cryptoId: selectedCryptoId, range: '1d' }));
        }
    }, [selectedCryptoId, dispatch]);

    // Bucle de Recarga de Energía (Sincronizado con LaboratorioView)
    useEffect(() => {
        const labId = userInfo?.idLabs?.[0];
        if (labId) {
            api.get('/labs/' + labId).then(res => {
                const data = res.data.laboratory || res.data;
                setEnergy(data.energy || 0);
                energyRef.current = data.energy || 0;
                setMaxEnergy(data.maxEnergy || 100);
                setLabStats({
                    efficiency: data.efficiency || 82,
                    temperature: data.temperature || 38,
                    uptime: data.uptime || 99.9
                });
            }).catch(() => {
                setEnergy(0);
                energyRef.current = 0;
            });
        }
    }, [userInfo?.idLabs]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (energyRef.current < maxEnergy) {
                const nextEnergy = energyRef.current + 0.5; // Incremento suave
                energyRef.current = nextEnergy;
                setEnergy(nextEnergy);
            }
        }, 100); // 500ms para notar el progreso

        return () => clearInterval(timer);
    }, [maxEnergy]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await dispatch(refreshUserInfo()).unwrap();
        } catch (e) {
            console.error("Sincronización fallida", e);
        } finally {
            setTimeout(() => setIsSyncing(false), 800);
        }
    };

    const handleInjectPower = async () => {
        const labId = userInfo?.idLabs?.[0];
        if (!selectedNetwork || !labId || isInjecting || energy < 10) return;
        
        setIsInjecting(true);
        try {
            const amountToInject = Math.floor(energy);
            const res = await api.post('/labs/' + labId + '/inject-power', {
                blockchainId: selectedNetwork.id,
                energyAmount: amountToInject
            });
            
            // Reiniciar energía local tras inyección exitosa
            setEnergy(0);
            energyRef.current = 0;
            
            const newPower = res.data?.totalPowerMining || res.data?.networkPower || res.data?.data?.totalPowerMining;
            if (newPower) {
                dispatch(updateNetworkPower({ id: selectedNetwork.id, totalPowerMining: Number(newPower) }));
            }
        } catch (error) {
            console.error('Error al inyectar poder', error);
        } finally {
            setTimeout(() => setIsInjecting(false), 1000);
        }
    };

    const handleTradeRedirect = (type: 'BUY' | 'SELL') => {
        if (selectedCryptoId) {
            router.push('/market/trade?type=' + type + '&cryptoId=' + selectedCryptoId + '&redirect=portfolio');
        } else {
            router.push('/market');
        }
    };

    const activeCrypto = cryptos.find((c: any) => c.id === selectedCryptoId);
    const currentPriceData = historicalData[selectedCryptoId]?.data || [];

    // Cálculo de Balances (En THAOS)
    const thaoBalance = userInfo?.balance || 0;
    const cryptoBalanceInThaos = walletsInfo?.store?.reduce((acc: number, item: any) => {
        const crypto = cryptos.find((c: any) => c.id === item.id || c.identification.symbol === item.symbol);
        const priceInThaos = crypto?.financial.price || 0;
        return acc + (Number(item.quantity) * priceInThaos);
    }, 0) || 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#000', position: 'relative', overflow: 'hidden' }}>
            <ParticleBackground />
            
            {/* Header / Navbar Integrada */}
            <Box sx={{ 
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200,
                background: 'linear-gradient(180deg, rgba(5, 10, 20, 0.9) 0%, rgba(5, 10, 20, 0) 100%)',
                backdropFilter: 'blur(10px)', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
                        <LayoutDashboard size={20} color="#00f3ff" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 4, color: 'white', textTransform: 'uppercase' }}>
                        FUSIÓN // DASHBOARD
                    </Typography>
                </Stack>
                <IconButton onClick={handleSync} disabled={isSyncing} sx={{ color: '#00f3ff', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                    <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                </IconButton>
            </Box>

            {/* Layout Centrado con max-width */}
            <Container maxWidth="xl" sx={{ pt: 14, pb: 8, position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
                <Grid container spacing={4} sx={{ maxWidth: 1600 }}>
                    
                    {/* COLUMNA IZQUIERDA: FINANZAS */}
                    <Grid item xs={12} lg={3}>
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <BalancesPanel 
                                thaoBalance={thaoBalance} 
                                cryptoBalance={cryptoBalanceInThaos}
                                onBuy={() => handleTradeRedirect('BUY')}
                                onSell={() => handleTradeRedirect('SELL')}
                            />
                        </motion.div>
                    </Grid>

                    {/* COLUMNA CENTRAL: MERCADO */}
                    <Grid item xs={12} lg={6}>
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <Box sx={{ 
                                bgcolor: 'rgba(10, 15, 25, 0.6)', borderRadius: 4, p: 4, 
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(30px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                height: '100%', minHeight: 650
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                                    <Box sx={{ maxWidth: '65%' }}>
                                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: 2 }}>ACTIVO SELECCIONADO</Typography>
                                        <Tabs 
                                            value={selectedCryptoId} 
                                            onChange={(e, v) => setSelectedCryptoId(v)}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            sx={{ mt: 1, '& .MuiTabs-indicator': { bgcolor: '#00f3ff', height: 3 }, '& .MuiTab-root': { color: 'rgba(255,255,255,0.3)', fontWeight: 900, minWidth: 70 } }}
                                        >
                                            {cryptos.map((crypto: any) => (
                                                <Tab key={crypto.id} value={crypto.id} label={crypto.identification.symbol} sx={{ '&.Mui-selected': { color: '#00f3ff' } }} />
                                            ))}
                                        </Tabs>
                                    </Box>
                                    
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end' }}>
                                            {(activeCrypto?.financial?.price || 0).toLocaleString()} <TaoIcon size={32} color="#00f3ff" />
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 900, color: (activeCrypto?.financial?.change24h || 0) >= 0 ? '#00ff88' : '#ff0055' }}>
                                            {((activeCrypto?.financial?.change24h || 0) >= 0 ? '+' : '') + (activeCrypto?.financial?.change24h || 0) + "% (24H)"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <CandlestickChart data={currentPriceData} isLoading={marketLoading} />
                                
                                <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(0, 243, 255, 0.03)', border: '1px dashed rgba(255, 243, 255, 0.05)' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Database size={14} /> TRANSMISIÓN DE DATOS EN TIEMPO REAL // PROTOCOLO SOLIS ACTIVO
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* COLUMNA DERECHA: MINERÍA */}
                    <Grid item xs={12} lg={3}>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                            <Stack spacing={4}>
                                <MiningControlPanel 
                                    powerMining={selectedNetwork?.blockchainProps?.totalPowerMining || 0} 
                                    maxPower={10000} 
                                    efficiency={labStats.efficiency} 
                                    temperature={labStats.temperature} 
                                    uptime={labStats.uptime}
                                    energyAvailable={energy}
                                    maxEnergy={maxEnergy}
                                    onInjectPower={handleInjectPower}
                                    isInjecting={isInjecting}
                                />
                                
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                        <Activity size={16} color="#00f3ff" />
                                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 900, letterSpacing: 2 }}>REGISTRO DE OPERACIONES</Typography>
                                    </Stack>
                                    <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                        <TransactionsTable 
                                            storeId={selectedNetwork?.storeTransactionId || selectedNetwork?.id || ''} 
                                            walletId={userInfo?.wallets?.[0]?.walletAddress} 
                                        />
                                    </Box>
                                </Box>
                            </Stack>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
