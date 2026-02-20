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
import { Container, CircularProgress, Box } from '@mui/material';
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

export default function TransactionsPage() {
    
    //# 3-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();
    
    //# 4-Selección de datos desde el estado global de Redux
    const { selectedNetwork, networks } = useAppSelector((state) => state.blockchain);
    
    //# 5-Selección de datos desde el estado global de Redux
    const { byStoreBoxId, isLoading: loading, error } = useAppSelector((state) => state.transactions);

    const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
    
    const storeId = selectedNetwork?.storeTransactions?.transactionStoreID || currentNetwork?.storeTransactions?.transactionStoreID;
    const rawData = storeId ? byStoreBoxId[storeId] : null;
    let transactionData: TransactionsInterface[] = [];
    
    if (rawData) {
        if (Array.isArray(rawData)) {
            transactionData = rawData[0]?.transactions || [];
        } else if (rawData.transactions && Array.isArray(rawData.transactions)) {
            transactionData = rawData.transactions;
        }
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
                    subtitle={`Red: ${currentNetwork?.identification?.name || selectedNetwork?.identification?.name || selectedNetwork.id} | Store ID: ${selectedNetwork?.storeTransactions?.transactionStoreID}`}
                />

                <TechFrame color="#00f3ff">
                    <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid rgba(0, 243, 255, 0.1)' }}>
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
        </main>
    );
}
