import { createSlice } from '@reduxjs/toolkit';
import { MarketState } from './types';
import { fetchCryptos, fetchCryptoHistory } from './actions';

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
                state.cryptos = action.payload;
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
                state.historicalData[cryptoId] = {
                    data: data.data,
                    total: data.total,
                    range: range
                };
            })
            .addCase(fetchCryptoHistory.rejected, (state, action) => {
                 // handle specific error for chart?
                 console.error('History fetch failed', action.payload);
            });
    },
});

export default marketSlice.reducer;
