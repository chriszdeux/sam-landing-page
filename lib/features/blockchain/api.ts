// 1-Definir función para obtener redes
// 2-Definir función para obtener recompensas
// 3-Definir función para reclamar recompensas
// 4-Definir función para obtener tiempo del siguiente bloque

//# 1-Definir función para obtener redes
import api from '../../api';

export const getNetworksApi = async () => {
    const response = await api.get('/blockchain/network');
    return response.data;
};

//# 2-Definir función para obtener recompensas
export const getRewardsApi = async () => {
    const response = await api.get('/blockchain/rewards');
    return response.data;
};

//# 3-Definir función para reclamar recompensas
export const claimRewardApi = async (id: string, userId: string) => {
    const response = await api.put(`/blockchain/rewards/claim-reward/${id}`, { userId });
    return response.data;
};

//# 4-Definir función para obtener tiempo del siguiente bloque
export const getNextBlockTimeApi = async (networkId: string) => {
    const response = await api.get(`/blockchain/network/${networkId}/next-time`);
    return response.data;
};
