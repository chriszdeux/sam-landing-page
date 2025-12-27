import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNetworksApi } from './api';

export const fetchNetworks = createAsyncThunk(
    'blockchain/fetchNetworks',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getNetworksApi();
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch networks');
        }
    }
);


