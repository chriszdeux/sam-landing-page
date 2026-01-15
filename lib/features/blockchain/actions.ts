import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNetworksApi, getRewardsApi, claimRewardApi } from './api';
import { getProfileApi } from '../auth/api'; 
import { setUserInfo } from '../auth/reducer';

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

export const claimReward = createAsyncThunk(
    'blockchain/claimReward',
    async ({ id, userId }: { id: string; userId: string }, { dispatch, rejectWithValue }) => {
        try {
            const data = await claimRewardApi(id, userId);
            
            // Auto-refresh user profile to update balance
            try {
                // getProfileApi usually uses token from header, no args needed
                const userProfile = await getProfileApi();
                dispatch(setUserInfo(userProfile));
            } catch (profileErr) {
                console.warn('Failed to refresh profile after reward claim', profileErr);
            }

            return data;
        } catch (err: unknown) {
             const errorObj = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(errorObj.response?.data?.message || 'Failed to claim reward');
        }
    }
);


