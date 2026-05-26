// 1-Definir función para obtener redes
// 2-Definir función para obtener recompensas
// 3-Definir función para reclamar recompensas
// 4-Definir función para obtener tiempo del siguiente bloque
// 5-Definir función para obtener potencia de minado total

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

//# 5-Definir función para obtener potencia de minado total
export const getMiningPowerApi = async () => {
    // Endpoint actualizado según reporte de BACK (12:00)
    const response = await api.get('/blockchain/total-power');
    return response.data;
};

//# 6-Definir función para obtener potencia y energía específica de una red (Requiere Auth)
export const getNetworkSpecificPowerApi = async (id: string) => {
    const response = await api.get(`/blockchain/${id}/total-power`);
    return response.data;
};
