import { createSlice } from '@reduxjs/toolkit';
import { BlockchainState } from './types';
import { BlockchainInterface } from '../../types/blockchain';
import { fetchNetworks } from './actions';

const initialState: BlockchainState = {
    networks: [],
    selectedNetwork: null,
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

    },
});

export const { setSelectedNetwork } = blockchainSlice.actions;

export default blockchainSlice.reducer;
