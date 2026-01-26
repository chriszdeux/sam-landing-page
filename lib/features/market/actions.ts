import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCryptosApi, getCryptoHistoryApi } from './api';

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
        condition: (_, { getState }) => {
            const { market } = getState() as { market: { isLoading: boolean } };
            if (market.isLoading) {
                return false;
            }
        },
    }
);

export const fetchCryptoHistory = createAsyncThunk(
    'market/fetchCryptoHistory',
    async ({ cryptoId, range }: { cryptoId: string; range: string }, { rejectWithValue }) => {
        try {
            const data = await getCryptoHistoryApi(cryptoId, range);
            return { cryptoId, range, data };
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch history');
        }
    }
);
