import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactionsApi } from './api';

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async ({ storeId, walletId, page = 1, limit = 10 }: { storeId: string; walletId?: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const data = await getTransactionsApi(storeId, walletId || '', page, limit);
            return { storeId, data, page };
        } catch (err: any) {
             return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);
