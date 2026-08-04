// 1-Importar dependencias y APIs del módulo
// 2-Acción asíncrona para obtener redes disponibles
// 3-Acción asíncrona para obtener recompensas
// 4-Acción asíncrona para reclamar recompensa
// 5-Acción asíncrona para obtener tiempo del próximo bloque


//# 1-Importar dependencias y APIs del módulo
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNetworksApi, getRewardsApi, claimRewardApi, getNextBlockTimeApi, getBlocksHistoryApi, getProcessingFrequenciesApi } from './api';
import { getProfileApi } from '../auth/api'; 
import { setUserInfo, updateBalance } from '../auth/reducer';
import { RootState } from '../../store';

//# 2-Acción asíncrona para obtener redes disponibles
export const fetchNetworks = createAsyncThunk(
    'blockchain/fetchNetworks',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getNetworksApi();
            return data;
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch networks');
        }
    }
);

//# 3-Acción asíncrona para obtener recompensas
export const fetchRewards = createAsyncThunk(
    'blockchain/fetchRewards',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getRewardsApi();
            return data;
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch rewards');
        }
    }
);

//# 4-Acción asíncrona para reclamar recompensa
export const claimReward = createAsyncThunk(
    'blockchain/claimReward',
    async ({ id, userId, rewardType, amount }: { id: string; userId: string; rewardType?: string; amount?: number }, { dispatch, rejectWithValue, getState }) => {
        try {
            const data = await claimRewardApi(id, userId);
            
            
             if (rewardType === 'CREDIT' && amount) {
                 const state = getState() as RootState;
                 const currentBalance = state.auth.userInfo?.balance || 0;
                 dispatch(updateBalance(currentBalance + amount));
             } else {
                 
                try {
                    const userProfile = await getProfileApi();
                    dispatch(setUserInfo(userProfile));
                } catch (profileErr) {
                    console.warn('Failed to refresh profile after reward claim', profileErr);
                }
             }

            return data;
        } catch (err: unknown) {
             const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to claim reward');
        }
    }
);

//# 5-Acción asíncrona para obtener tiempo del próximo bloque
export const fetchNextBlockTime = createAsyncThunk(
    'blockchain/fetchNextBlockTime',
    async (networkId: string, { rejectWithValue }) => {
        try {
            const data = await getNextBlockTimeApi(networkId);
            return data;
        } catch (err: unknown) {
             const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch next block time');
        }
    }
);

const pendingBlocksHistoryFetches = new Set<string>();

//# 6-Acción asíncrona para obtener historial de bloques
export const fetchBlocksHistory = createAsyncThunk(
    'blockchain/fetchBlocksHistory',
    async (arg: string | { blockchainId: string; thresholdMinutes?: number }, { rejectWithValue }) => {
        const blockchainId = typeof arg === 'string' ? arg : arg.blockchainId;
        pendingBlocksHistoryFetches.add(blockchainId);
        try {
            const data = await getBlocksHistoryApi(blockchainId);
            return data;
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch blocks history');
        } finally {
            pendingBlocksHistoryFetches.delete(blockchainId);
        }
    },
    {
        condition: (arg, { getState }) => {
            const blockchainId = typeof arg === 'string' ? arg : arg.blockchainId;
            if (pendingBlocksHistoryFetches.has(blockchainId)) {
                return false;
            }
            const { blockchain } = getState() as RootState;
            const thresholdMinutes = typeof arg === 'string' ? undefined : arg.thresholdMinutes;
            
            if (thresholdMinutes !== undefined && blockchain.lastBlocksFetch !== null) {
                const limitMs = thresholdMinutes * 60 * 1000;
                const elapsed = Date.now() - blockchain.lastBlocksFetch;
                if (elapsed < limitMs) {
                    return false;
                }
            }
            return true;
        }
    }
);

export const fetchProcessingFrequencies = createAsyncThunk(
    'blockchain/fetchProcessingFrequencies',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProcessingFrequenciesApi();
            return data;
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to fetch processing frequencies');
        }
    },
    {
        condition: (_, { getState }) => {
            const { blockchain } = getState() as RootState;
            if (blockchain.chronoBurstFreqTypes && Object.keys(blockchain.chronoBurstFreqTypes).length > 0) {
                return false;
            }
            return true;
        }
    }
);

