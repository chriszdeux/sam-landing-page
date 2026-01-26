import { createSlice } from '@reduxjs/toolkit';
import { MarketState } from './types';
import { fetchCryptos, fetchCryptoHistory } from './actions';
import { Cryptocurrency } from '../../types/crypto';

const initialState: MarketState = {
    cryptos: [],
    historicalData: {},
    isLoading: false,
    error: null,
};

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCryptos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCryptos.fulfilled, (state, action) => {
                state.isLoading = false;
                const { data, page } = action.payload;

                if (data === false) return;

                const newCryptos = (Array.isArray(data) ? data : (data.data || [])) as Cryptocurrency[];

                if (page === 1) {
                    state.cryptos = newCryptos;
                } else {
                    // Append logic
                    const existingIds = new Set(state.cryptos.map((c: Cryptocurrency) => c.id));
                    const uniqueNew = newCryptos.filter((c: Cryptocurrency) => !existingIds.has(c.id));
                    state.cryptos = [...state.cryptos, ...uniqueNew];
                }
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // History
            .addCase(fetchCryptoHistory.pending, (state) => {
                // state.isLoading = true; // Optional: don't block entire UI for chart
            })
            .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
                const { cryptoId, range, data } = action.payload;
                
                // Helper to extract the array from various potential API structures
                let history: { price: number; timestamp: number }[] = [];
                
                if (Array.isArray(data)) {
                    history = data;
                } else if (Array.isArray(data?.historicalData)) {
                     history = data.historicalData;
                } else if (data?.data && Array.isArray(data.data.historicalData)) {
                     // Covers { total: 300, data: { historicalData: [...] } }
                     history = data.data.historicalData;
                } else if (Array.isArray(data?.data)) {
                     history = data.data;
                }

                // Extract current state if available in the same payload
                const currentBuyState = data?.currentBuyState || data?.data?.currentBuyState;
                const currentSellState = data?.currentSellState || data?.data?.currentSellState;
                
                state.historicalData[cryptoId] = {
                    data: history,
                    total: data.total || history.length,
                    range: range,
                    currentBuyState: currentBuyState,
                    currentSellState: currentSellState
                };
            })
            .addCase(fetchCryptoHistory.rejected, (state, action) => {
                 // handle specific error for chart?
                 console.error('History fetch failed', action.payload);
            });
    },
});

export default marketSlice.reducer;
