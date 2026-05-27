// 1-Importar dependencias y acciones
// 2-Definir estado inicial de blockchain
// 3-Crear slice con reducers síncronos
// 4-Manejar acciones asíncronas de redes y recompensas
// 5-Manejar actualización de tiempo del siguiente bloque
// 6-Exportar acciones y reducer por defecto

//# 1-Importar dependencias y acciones
import { createSlice } from '@reduxjs/toolkit';
import { BlockchainState, Reward } from './types';
import { BlockchainInterface } from '../../types/blockchain';
import { fetchNetworks, fetchRewards, claimReward, fetchNextBlockTime, fetchMiningPower, fetchNetworkSpecificPower } from './actions';

//# 2-Definir estado inicial de blockchain
const initialState: BlockchainState = {
    networks: [],
    selectedNetwork: null,
    rewards: [],
    nextBlockTime: null,
    isLoading: false,
    error: null,
};

//# 3-Crear slice con reducers síncronos
const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        setSelectedNetwork: (state, action) => {
            state.selectedNetwork = action.payload; 
        },
        updateNetworkPower: (state, action) => {
            const { id, totalPowerMining, energy } = action.payload;
            const network = state.networks.find(n => n.id === id);
            if (network) {
                // blockchainProps ha sido eliminado de la interfaz, se maneja de forma segura o se omite según nueva arquitectura
                const net = network as any;
                if (!net.blockchainProps) net.blockchainProps = {};
                if (totalPowerMining !== undefined) net.blockchainProps.totalPowerMining = totalPowerMining;
                if (energy !== undefined) net.blockchainProps.energy = energy;
            }
            if (state.selectedNetwork && state.selectedNetwork.id === id) {
                const selNet = state.selectedNetwork as any;
                if (!selNet.blockchainProps) selNet.blockchainProps = {};
                if (totalPowerMining !== undefined) selNet.blockchainProps.totalPowerMining = totalPowerMining;
                if (energy !== undefined) selNet.blockchainProps.energy = energy;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            //# 4-Manejar acciones asíncronas de redes y recompensas
            .addCase(fetchNetworks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNetworks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.networks = action.payload;
                
                if (action.payload.length > 0) {
                     const exists = state.selectedNetwork && action.payload.find((n: BlockchainInterface) => n.id === state.selectedNetwork?.id);
                     if (!exists) {
                         state.selectedNetwork = action.payload[0];
                     } else {
                         state.selectedNetwork = exists;
                     }
                }
            })
            .addCase(fetchNetworks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            .addCase(fetchRewards.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRewards.fulfilled, (state, action) => {
                state.isLoading = false;
                const payload = action.payload as { data?: Reward[] } | Reward[];
                if (payload && 'data' in payload && Array.isArray(payload.data)) {
                    state.rewards = payload.data;
                } else if (Array.isArray(payload)) {
                    state.rewards = payload as Reward[];
                } else {
                    state.rewards = [];
                }
            })
            .addCase(fetchRewards.rejected, (state) => {
                state.isLoading = false;
            })
            
            .addCase(claimReward.fulfilled, (state, action) => {
                const rewardId = action.meta.arg.id;
                const rewardIndex = state.rewards.findIndex(r => r.id === rewardId);
                if (rewardIndex !== -1) {
                    state.rewards[rewardIndex].isClaimed = true;
                    const intervalVal = typeof state.rewards[rewardIndex].interval === 'number' 
                        ? state.rewards[rewardIndex].interval 
                        : parseInt(state.rewards[rewardIndex].interval || '1', 10);
                    state.rewards[rewardIndex].nextClaimTime = Date.now() + (intervalVal * 60 * 1000);
                }
            })
            
            //# 5-Manejar actualización de tiempo del siguiente bloque
            .addCase(fetchNextBlockTime.fulfilled, (state, action) => {
                if (typeof action.payload === 'number') {
                     state.nextBlockTime = action.payload;
                } else if (action.payload && typeof action.payload.nextTime === 'number') {
                     state.nextBlockTime = action.payload.nextTime;
                }
            })

            // Power Mining Polling
            .addCase(fetchMiningPower.fulfilled, (state, action) => {
                if (state.selectedNetwork) {
                    const selNet = state.selectedNetwork as any;
                    if (!selNet.blockchainProps) selNet.blockchainProps = {};
                    selNet.blockchainProps.totalPowerMining = action.payload.totalPowerMining;
                }
            })
            // Specific Power/Energy Polling
            .addCase(fetchNetworkSpecificPower.fulfilled, (state, action) => {
                const { id, energy, totalPowerMining } = action.payload;
                const network = state.networks.find(n => n.id === id);
                if (network) {
                    const net = network as any;
                    if (!net.blockchainProps) net.blockchainProps = {};
                    net.blockchainProps.energy = energy;
                    net.blockchainProps.totalPowerMining = totalPowerMining;
                }
                if (state.selectedNetwork && state.selectedNetwork.id === id) {
                    const selNet = state.selectedNetwork as any;
                    if (!selNet.blockchainProps) selNet.blockchainProps = {};
                    selNet.blockchainProps.energy = energy;
                    selNet.blockchainProps.totalPowerMining = totalPowerMining;
                }
            });

    },
});

//# 6-Exportar acciones y reducer por defecto
export const { setSelectedNetwork, updateNetworkPower } = blockchainSlice.actions;
export default blockchainSlice.reducer;
