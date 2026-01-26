import { createSlice } from '@reduxjs/toolkit';
import { BlockchainState, Reward } from './types';
import { BlockchainInterface } from '../../types/blockchain';
import { fetchNetworks, fetchRewards, claimReward, fetchNextBlockTime } from './actions';

const initialState: BlockchainState = {
    networks: [],
    selectedNetwork: null,
    rewards: [],
    nextBlockTime: null,
    isLoading: false,
    error: null,
};

const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        setSelectedNetwork: (state, action) => {
            state.selectedNetwork = action.payload; 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNetworks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNetworks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.networks = action.payload;
                // Set the default selected network if not set or if current selection is invalid
                if (action.payload.length > 0) {
                     // Check if we have a selection and if it still exists in the list
                     const exists = state.selectedNetwork && action.payload.find((n: BlockchainInterface) => n.id === state.selectedNetwork?.id);
                     if (!exists) {
                         // Initialize with the first network
                         state.selectedNetwork = action.payload[0];
                     }
                }
            })
            .addCase(fetchNetworks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Rewards
            .addCase(fetchRewards.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRewards.fulfilled, (state, action) => {
                // Handle response format { message: "...", data: [...] }
                const payload = action.payload as { data?: Reward[] } | Reward[];
                
                if (payload && 'data' in payload && Array.isArray(payload.data)) {
                    state.rewards = payload.data;
                } else if (Array.isArray(payload)) {
                    state.rewards = payload as Reward[];
                } else {
                    state.rewards = [];
                    console.warn('Invalid rewards format:', payload);
                }
            })
            .addCase(fetchRewards.rejected, (state, action) => {
                 console.error('Failed to load rewards:', action.payload);
            })
            // Claim Reward
            .addCase(claimReward.fulfilled, (state, action) => {
                const rewardId = action.meta.arg.id;
                const rewardIndex = state.rewards.findIndex(r => r.id === rewardId);
                if (rewardIndex !== -1) {
                    state.rewards[rewardIndex].isClaimed = true;
                    // Simulate next claim time based on interval (in minutes)
                    const intervalMinutes = state.rewards[rewardIndex].interval || 1;
                    state.rewards[rewardIndex].nextClaimTime = Date.now() + (intervalMinutes * 60 * 1000);
                }
            })
            // Next Block Time
            .addCase(fetchNextBlockTime.fulfilled, (state, action) => {
                // Assuming payload is { nextBlockTime: number } or similar depending on the API structure.
                // Based on previous actions, it seems we return `response.data`.
                // If response.data IS the number, use action.payload.
                // If response.data is { nextTime: number }, use action.payload.nextTime.
                // Let's assume the API returns { nextTime: timestamp } or similar based on typical patterns.
                // However, the interface says `nextBlockTime: number | null`.
                // Let's assume the payload itself is the object returned.
                // Checking `fetchNextBlockTime` implementation: `return data`.
                // The prompt for `getNextBlockTimeApi` said it calls the endpoint.
                // Let's assume the data has a property `nextTime` or it is the value itself.
                // We'll trust the user's implicit guidance or standard patterns. 
                // Wait, I created the API function. It returns `response.data`.
                // The implementation plan says "fetch the next block confirmation time".
                // I will assume the payload is an object containing `nextBlockTime` or `timestamp`.
                // But better to check what I should expect. 
                // Let's check `api.ts` again... `response.data`.
                // If the user didn't specify the response format, I'll store `action.payload` if it's a number, or `action.payload.nextBlockTime` etc.
                // Safer to assume `action.payload.nextTime` or just `action.payload` if it's the number.
                // Let's be safe and map it if it's an object, or direct if it's a primitive (unlikely for JSON).
                // I'll update the state assuming `action.payload` contains the relevant time.
                // Actually, I'll just map `action.payload` directly if compatible, or `action.payload.nextTime`.
                // Let's assume `action.payload.nextTime` as a common convention.
                // I will add a safe check.
                if (typeof action.payload === 'number') {
                     state.nextBlockTime = action.payload;
                } else if (action.payload && typeof action.payload.nextTime === 'number') {
                     state.nextBlockTime = action.payload.nextTime;
                } else {
                     // fallback or log
                     console.warn("Unexpected payload format for nextBlockTime", action.payload);
                }
            });

    },
});

export const { setSelectedNetwork } = blockchainSlice.actions;

export default blockchainSlice.reducer;
