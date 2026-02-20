// 1-Importar dependencias para acciones asíncronas
// 2-Acción para obtener listado de criptomonedas
// 3-Acción para obtener historial de precios

//# 1-Importar dependencias para acciones asíncronas
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCryptosApi, getCryptoHistoryApi } from './api';

//# 2-Acción para obtener listado de criptomonedas
export const fetchCryptos = createAsyncThunk(
    'market/fetchCryptos',
    async (args: string | { networkId?: string; page?: number; limit?: number } = 'ETH-SEPOLIA', { rejectWithValue }) => {
        const { networkId, page, limit } = typeof args === 'string' 
            ? { networkId: args, page: 1, limit: 20 } 
            : { networkId: args.networkId || 'ETH-SEPOLIA', page: args.page || 1, limit: args.limit || 20 };

        try {
            const data = await getCryptosApi(networkId, page, limit);
            return { data, page };
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch cryptos');
        }
    },
    {
        condition: (args, { getState }) => {
            const { market } = getState() as { market: { isLoading: boolean; lastFetch?: number; lastArgs?: string } };
            if (market.isLoading) {
                return false;
            }
            if (market.lastFetch && 
                Date.now() - market.lastFetch < 240000 && // 4 minutes
                market.lastArgs === JSON.stringify(args)) {
                return false;
            }
        },
    }
);

//# 3-Acción para obtener historial de precios
export const fetchCryptoHistory = createAsyncThunk(
    'market/fetchCryptoHistory',
    async ({ cryptoId, range }: { cryptoId: string; range: string }, { rejectWithValue, signal }) => {
        try {
            const data = await getCryptoHistoryApi(cryptoId, range, signal);
            return { cryptoId, range, data };
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch history');
        }
    }
);
