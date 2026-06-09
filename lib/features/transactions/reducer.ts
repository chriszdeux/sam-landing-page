import { createSlice } from '@reduxjs/toolkit';
import { TransactionsInterface } from './types';
import { fetchTransactions } from './actions';

export interface TransactionsState {
    transactions: TransactionsInterface[];
    isLoading: boolean;
    error: string | null;
    total: number;
    cache: Record<number, TransactionsInterface[]>;
    lastFetch?: number;
    lastArgs?: string;
}

const initialState: TransactionsState = {
    transactions: [],
    isLoading: false,
    error: null,
    total: 0,
    cache: {},
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearTransactions: (state) => {
            state.transactions = [];
            state.cache = {};
            state.total = 0;
        },
        setTransactionsFromCache: (state, action) => {
            const page = action.payload;
            if (state.cache[page]) {
                state.transactions = state.cache[page];
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                 state.isLoading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lastFetch = Date.now();
                state.lastArgs = JSON.stringify(action.meta.arg);
                const { data, page } = action.payload;

                if (!data || data === false) {
                    console.warn('[TRANSACTIONS_REDUCER] No data received');
                    return;
                }
                
                const newTransactions = Array.isArray(data?.data) ? data.data : [];
                state.total = data?.pagination?.total || 0;
                
                // Store in cache and update current transactions
                state.cache[page] = newTransactions;
                state.transactions = newTransactions;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearTransactions, setTransactionsFromCache } = transactionsSlice.actions;
export default transactionsSlice.reducer;
