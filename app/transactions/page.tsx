// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Obtención del despachador para emitir acciones al store
// 4-Selección de datos desde el estado global de Redux
// 5-Selección de datos desde el estado global de Redux
// 6-Gestión de estado local para page
// 7-Manejo de cambios en el input page
// 8-Efecto secundario para sincronización del ciclo de vida
// 9-Estructuración y renderizado visual del componente UI
// 10-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect } from 'react';
import { Container, CircularProgress, Box, Paper, Stack, Typography } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import SearchIcon from '@mui/icons-material/Search';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { GenericTable } from '../../components/ui/GenericTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { TransactionsInterface } from '../../lib/features/transactions/types';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { Sensors } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function TransactionsPage() {
    
    //# 3-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();
    
    //# 4-Selección de datos desde el estado global de Redux
    const { selectedNetwork, networks } = useAppSelector((state) => state.blockchain);
    // Se remueve la referencia a blockchainProps según la nueva estructura simplificada
    const totalPowerMining = 0; 
    
    //# 5-Selección de datos desde el estado global de Redux
    const { byStoreBoxId, isLoading: loading, error } = useAppSelector((state) => state.transactions);

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    
    // Se utiliza storeTransactionId en lugar de storeTransactions.transactionStoreID
    const storeId = selectedNetwork?.storeTransactionId || currentNetwork?.storeTransactionId;
    const rawData = storeId ? byStoreBoxId[storeId] : null;
    let transactionData: TransactionsInterface[] = [];
    
    if (rawData?.transactions && Array.isArray(rawData.transactions)) {
        transactionData = rawData.transactions;
    }

    
    //# 6-Gestión de estado local para page
    const [page, setPage] = React.useState(0);
    const [walletSearch, setWalletSearch] = React.useState('');
    const [appliedWalletFilter, setAppliedWalletFilter] = React.useState('');
    const pageSize = 10;

    const handleSearch = () => {
        setAppliedWalletFilter(walletSearch);
        setPage(0);
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: walletSearch, page: 1, limit: pageSize }));
        }
    };

    
    
    //# 7-Manejo de cambios en el input page
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (storeId && transactionData.length < (newPage + 1) * pageSize) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, page: newPage + 1, limit: pageSize }));
        }
    };
    
    const hasMoreStats = transactionData.length >= (page + 1) * pageSize;
    const totalRows = hasMoreStats ? transactionData.length + pageSize : transactionData.length;

    
    
    //# 8-Efecto secundario para sincronización del ciclo de vida
    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, walletId: appliedWalletFilter, page: 1, limit: pageSize }));
        }
    }, [storeId, dispatch, appliedWalletFilter, pageSize]);

    if (!selectedNetwork) {
         
         
         //# 9-Estructuración y renderizado visual del componente UI
         return (
            <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center">
                <Background />
                <div className="relative z-10 text-center px-4">
                     <h2 className="text-2xl font-bold text-gray-400">Por favor seleccione una red para ver las transacciones.</h2>
                </div>
            </main>
        );
    }

    
    
    //# 10-Estructuración y renderizado visual del componente UI
    return (
        <main className="min-h-screen relative w-full overflow-hidden">
            <Background />
            
            <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
                
                <PageHeader 
                    title="Historial de Transacciones" 
                    subtitle={`Red: ${currentNetwork?.identification?.name || selectedNetwork?.identification?.name || selectedNetwork.id} | Store ID: ${selectedNetwork?.storeTransactionId || 'N/A'}`}
                />

                <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper sx={{
                            p: 3,
                            background: "rgba(0, 243, 255, 0.05)",
                            border: "1px solid rgba(0, 243, 255, 0.2)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 0 30px rgba(0, 243, 255, 0.1)",
                        }}>
                            <Box sx={{ 
                                p: 1.5, 
                                bgcolor: "rgba(0, 243, 255, 0.1)", 
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(0, 243, 255, 0.3)"
                            }}>
                                <Sensors sx={{ color: "#00f3ff", fontSize: 32 }} className="pulse-animation" />
                            </Box>
                            <Box>
                                <Typography variant="overline" sx={{ color: "#00f3ff", fontWeight: "bold", letterSpacing: 2, display: "block", lineHeight: 1, mb: 0.5 }}>
                                    NETWORK MINING POWER
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                    <Typography variant="h3" sx={{ color: "#fff", fontWeight: 900, letterSpacing: -1, textShadow: "0 0 20px rgba(0, 243, 255, 0.5)" }}>
                                        {(totalPowerMining || 0).toLocaleString('en-US')}
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: "#00f3ff", fontWeight: "bold", opacity: 0.8 }}>
                                        GH/s
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ ml: "auto", display: { xs: "none", md: "block" } }}>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block" }}>STATUS</Typography>
                                        <Typography variant="body2" sx={{ color: "#00ff88", fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Box component="span" sx={{ width: 8, height: 8, bgcolor: "#00ff88", borderRadius: "50%", display: "inline-block" }} />
                                            ACTIVE
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>
                    </motion.div>
                </Box>

                <TechFrame color="#00f3ff">
                    <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', borderBottom: '1px solid rgba(0, 243, 255, 0.1)' }}>
                        <Input 
                            placeholder="Buscar por Wallet Address..." 
                            value={walletSearch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWalletSearch(e.target.value)}
                            fullWidth
                            sx={{ mb: 0 }}
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleSearch}
                            startIcon={<SearchIcon />}
                            sx={{ height: 48, minWidth: 120 }}
                        >
                            BUSCAR
                        </Button>
                    </Box>
                    <div className="w-full overflow-x-auto p-4">
                        {loading && transactionData.length === 0 ? (
                             <div className="flex justify-center p-10">
                                 <CircularProgress color="primary" />
                             </div>
                         ) : error ? (
                             <div className="p-10 text-center">
                                 <p className="text-red-500">{error}</p>
                             </div>
                         ) : (
                             <GenericTable 
                                columns={transactionsPageColumns} 
                                data={transactionData} 
                                pageSize={pageSize} 
                                enablePagination={true}
                                manualPagination={true}
                                page={page}
                                onPageChange={handlePageChange}
                                totalRows={totalRows}
                             />
                         )}
                    </div>
                </TechFrame>
            </Container>
            <style jsx global>{`
                @keyframes pulse { 
                    0% { opacity: 1; transform: scale(1); } 
                    50% { opacity: 0.5; transform: scale(0.95); } 
                    100% { opacity: 1; transform: scale(1); } 
                }
                .pulse-animation {
                    animation: pulse 2s infinite ease-in-out;
                }
            `}</style>
        </main>
    );
}
