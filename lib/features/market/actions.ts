import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCryptosApi, getCryptoHistoryApi } from './api';

export const fetchCryptos = createAsyncThunk(
    'market/fetchCryptos',
    async (networkId: string = 'ETH-SEPOLIA', { rejectWithValue }) => {
        try {
            const data = await getCryptosApi(networkId);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch cryptos');
        }
    }
);

export const fetchCryptoHistory = createAsyncThunk(
    'market/fetchCryptoHistory',
    async ({ cryptoId, range }: { cryptoId: string; range: string }, { rejectWithValue }) => {
        try {
            const data = await getCryptoHistoryApi(cryptoId, range);
            return { cryptoId, range, data };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
        }
    }
);
