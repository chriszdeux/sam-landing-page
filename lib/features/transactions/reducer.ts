// 1-Importar tipos y acciones
// 2-Definir estado inicial de transacciones
// 3-Crear slice con reducers para manejo de datos
// 4-Exportar reducer por defecto

//# 1-Importar tipos y acciones
import { createSlice } from '@reduxjs/toolkit';
import { TransactionsState, TransactionsInterface } from './types';
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
    reducers: {
        clearTransactionsError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                 state.isLoading = true;
                 state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lastFetch = Date.now();
                state.lastArgs = JSON.stringify(action.meta.arg);
                const { storeId, data, page } = action.payload;

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
                        currentTransactionBlock: 0,
                        fee: 0
                    };
                }

                if (!data) {
                    console.warn('[TRANSACTIONS_REDUCER] No data received for storeId: ' + storeId);
                    return;
                }
                
                // Mapeo robusto: puede venir en data.data, data.transactions o ser el array directamente
                let newTransactions: TransactionsInterface[] = [];
                if (Array.isArray(data)) {
                    newTransactions = data;
                } else if (data && Array.isArray(data.data)) {
                    newTransactions = data.data;
                } else if (data && Array.isArray(data.transactions)) {
                    newTransactions = data.transactions;
                }
                
                if (page === 1) {
                    state.byStoreBoxId[storeId].transactions = newTransactions;
                } else {
                    const existing = state.byStoreBoxId[storeId].transactions;
                    const existingIds = new Set(existing.map((t: TransactionsInterface) => t.id));
                    const uniqueNew = newTransactions.filter((t: TransactionsInterface) => !existingIds.has(t.id));
                    state.byStoreBoxId[storeId].transactions = [...existing, ...uniqueNew];
                }
                
                state.byStoreBoxId[storeId].count = state.byStoreBoxId[storeId].transactions.length;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Error al obtener transacciones';
            });
    },
});

//# 4-Exportar reducer por defecto
export const { clearTransactionsError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
