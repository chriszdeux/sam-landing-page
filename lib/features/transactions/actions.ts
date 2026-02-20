// 1-Importar dependencias para acciones asíncronas
// 2-Crear acción para obtener listado de transacciones
// 3-Condición para evitar peticiones duplicadas

//# 1-Importar dependencias para acciones asíncronas
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactionsApi } from './api';

//# 2-Crear acción para obtener listado de transacciones
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async ({ storeId, walletId, page = 1, limit = 10 }: { storeId: string; walletId?: string; page?: number; limit?: number }, { rejectWithValue }) => {
        console.log("walletId", walletId)
        try {
            const data = await getTransactionsApi(storeId, walletId || '', page, limit);
            return { storeId, data, page };
        } catch (err: unknown) {
             const errorObj = err as { response?: { data?: { message?: string } } };
             return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch transactions');
        }
    },
    {
        //# 3-Condición para evitar peticiones duplicadas
        condition: (args, { getState }) => {
            const { transactions } = getState() as { transactions: { isLoading: boolean; lastFetch?: number; lastArgs?: string } };
            if (transactions.isLoading) {
                return false;
            }
            if (transactions.lastFetch && 
                Date.now() - transactions.lastFetch < 240000 && // 4 minutes
                transactions.lastArgs === JSON.stringify(args)) {
                return false;
            }
        },
    }
);
