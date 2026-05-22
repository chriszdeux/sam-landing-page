// 1-Importar tipos y acciones
// 2-Definir estado inicial de transacciones
// 3-Crear slice con reducers para manejo de datos
// 4-Exportar reducer por defecto

//# 1-Importar tipos y acciones
import { createSlice } from '@reduxjs/toolkit';
import { TransactionsState } from './types';
import { fetchTransactions } from './actions';

//# 2-Definir estado inicial de transacciones
const initialState: TransactionsState = {
    byStoreBoxId: {},
    isLoading: false,
    error: null,
};

//# 3-Crear slice con reducers para manejo de datos
const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                 state.isLoading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lastFetch = Date.now();
                state.lastArgs = JSON.stringify(action.meta.arg);
                const { storeId, data, page } = action.payload;

                // Ensure the store object is initialized even if data is null
                if (!state.byStoreBoxId[storeId]) {
                    state.byStoreBoxId[storeId] = {
                        id: storeId,
                        blockchainID: 'unknown',
                        transactions: [],
                        count: 0,
                        transactionsBuyQueue: [],
                        transactionsSellQueue: [],
                        transactionsTransferQueue: [],
                        startDate: new Date().toISOString(),
                        endDate: null,
                        currentTransactionBlock: 0
                    };
                }

                if (!data || data === false) {
                    console.warn(`[TRANSACTIONS_REDUCER] No data received for storeId: ${storeId}`);
                    return;
                }
                
                // El backend devuelve { message: string, data: [] }
                const newTransactions = Array.isArray(data?.data) ? data.data : [];
                
                if (page === 1) {
                    state.byStoreBoxId[storeId].transactions = newTransactions;
                } else {
                    const existing = state.byStoreBoxId[storeId].transactions;
                    // Evitar duplicados por ID
                    const existingIds = new Set(existing.map((t: any) => t.id));
                    const uniqueNew = newTransactions.filter((t: any) => !existingIds.has(t.id));
                    state.byStoreBoxId[storeId].transactions = [...existing, ...uniqueNew];
                }
                
                state.byStoreBoxId[storeId].count = state.byStoreBoxId[storeId].transactions.length;

            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

//# 4-Exportar reducer por defecto
export default transactionsSlice.reducer;
