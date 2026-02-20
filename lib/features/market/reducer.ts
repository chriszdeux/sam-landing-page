// 1-Importar tipos, acciones y utilidades
// 2-Definir estado inicial del mercado
// 3-Crear slice con reducers para criptomonedas
// 4-Exportar reducer por defecto

//# 1-Importar tipos, acciones y utilidades
import { createSlice } from '@reduxjs/toolkit';
import { MarketState, AnalyticsData } from './types';
import { fetchCryptos, fetchCryptoHistory } from './actions';
import { Cryptocurrency } from '../../types/crypto';

//# 2-Definir estado inicial del mercado
const initialState: MarketState = {
    cryptos: [],
    historicalData: {},
    isLoading: false,
    error: null,
};

//# 3-Crear slice con reducers para criptomonedas
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
                state.lastFetch = Date.now();
                state.lastArgs = JSON.stringify(action.meta.arg);
                const { data, page } = action.payload;

                if (data === false) return;

                const newCryptos = (Array.isArray(data) ? data : (data.data || [])) as Cryptocurrency[];

                if (page === 1) {
                    state.cryptos = newCryptos;
                } else {
                    
                    const existingIds = new Set(state.cryptos.map((c: Cryptocurrency) => c.id));
                    const uniqueNew = newCryptos.filter((c: Cryptocurrency) => !existingIds.has(c.id));
                    state.cryptos = [...state.cryptos, ...uniqueNew];
                }
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            .addCase(fetchCryptoHistory.pending, () => {
                
            })
            .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
                const { cryptoId, range, data } = action.payload;
                
                
                let history: AnalyticsData[] = [];
                
                if (Array.isArray(data)) {
                    history = data;
                } else if (Array.isArray(data?.historicalData)) {
                     history = data.historicalData;
                } else if (data?.data && Array.isArray(data.data.historicalData)) {
                     
                     history = data.data.historicalData;
                } else if (Array.isArray(data?.data)) {
                     history = data.data;
                }

                
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
                 
                 console.error('History fetch failed', action.payload);
            });
    },
});

//# 4-Exportar reducer por defecto
export default marketSlice.reducer;
