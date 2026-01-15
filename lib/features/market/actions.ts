import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCryptosApi, getCryptoHistoryApi } from './api';

export const fetchCryptos = createAsyncThunk(
    'market/fetchCryptos',
    async (networkId: string = 'ETH-SEPOLIA', { rejectWithValue }) => {
        try {
            const data = await getCryptosApi(networkId);
            return data;
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch cryptos');
        }
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
