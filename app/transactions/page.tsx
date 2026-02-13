/**
 * Importación de dependencias y componentes UI.
 * Inicialización de hooks de Redux.
 * Lógica para obtener transacciones por tienda.
 * Manejo de paginación y carga de datos.
 * Efecto para cargar transacciones iniciales.
 * Vista alternativa si no hay red seleccionada.
 * Renderizado principal con tabla de transacciones.
 */

'use client';

import React, { useEffect } from 'react';
import { Container, CircularProgress } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';
import { GenericTable } from '../../components/ui/GenericTable';
import { transactionsPageColumns } from '../../components/market/transactionsPageColumns';
import { TransactionsInterface } from '../../lib/features/transactions/types';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { selectedNetwork, networks } = useAppSelector((state) => state.blockchain);
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

    const [page, setPage] = React.useState(0);
    const pageSize = 20;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        
        if (storeId && transactionData.length < (newPage + 1) * pageSize) {
            dispatch(fetchTransactions({ storeId, page: newPage + 1, limit: pageSize }));
        }
    };
    
    const hasMoreStats = transactionData.length >= (page + 1) * pageSize;
    const totalRows = hasMoreStats ? transactionData.length + pageSize : transactionData.length;

    useEffect(() => {
        if (storeId) {
            dispatch(fetchTransactions({ storeId, page: 1, limit: pageSize }));
        }
    }, [storeId, dispatch]);

    if (!selectedNetwork) {
         return (
            <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center">
                <Background />
                <div className="relative z-10 text-center px-4">
                     <h2 className="text-2xl font-bold text-gray-400">Por favor seleccione una red para ver las transacciones.</h2>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative w-full overflow-hidden">
            <Background />
            
            <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
                
                <PageHeader 
                    title="Historial de Transacciones" 
                    subtitle={`Red: ${currentNetwork?.identification?.name || selectedNetwork?.identification?.name || selectedNetwork.id} | Store ID: ${selectedNetwork?.storeTransactions?.transactionStoreID}`}
                />

                <TechFrame color="#00f3ff">
                    <div className="w-full overflow-hidden p-4">
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
