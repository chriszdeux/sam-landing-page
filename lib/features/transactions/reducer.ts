import { createSlice } from '@reduxjs/toolkit';
import { TransactionsState } from './types';
import { fetchTransactions } from './actions';

const initialState: TransactionsState = {
    byStoreBoxId: {},
    isLoading: false,
    error: null,
};

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
                const { storeId, data, page } = action.payload;
                
                // The API returns { data: TransactionsInterface[] }
                const newTransactions = data.data || [];
                
                // Ensure we have a bucket structure
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

                if (page === 1) {
                    state.byStoreBoxId[storeId].transactions = newTransactions;
                } else {
                    // Verify if we already have transactions to append to
                    const existing = state.byStoreBoxId[storeId].transactions;
                    state.byStoreBoxId[storeId].transactions = [...existing, ...newTransactions];
                }
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default transactionsSlice.reducer;
