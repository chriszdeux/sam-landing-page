import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNetworksApi, getRewardsApi, claimRewardApi, getNextBlockTimeApi } from './api';
import { getProfileApi } from '../auth/api'; 
import { setUserInfo, updateBalance } from '../auth/reducer';
import { RootState } from '../../store';

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

// ... previous code
export const claimReward = createAsyncThunk(
    'blockchain/claimReward',
    async ({ id, userId, rewardType, amount }: { id: string; userId: string; rewardType?: string; amount?: number }, { dispatch, rejectWithValue, getState }) => {
        try {
            const data = await claimRewardApi(id, userId);
            
            // Update balance if it's a credit reward
             if (rewardType === 'CREDIT' && amount) {
                 const state = getState() as RootState;
                 const currentBalance = state.auth.userInfo?.balance || 0;
                 dispatch(updateBalance(currentBalance + amount));
             } else {
                 // Fallback: Refresh user profile
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


