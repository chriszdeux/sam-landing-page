import api from '../../api';

export const getNetworksApi = async () => {
    const response = await api.get('/blockchain/network');
    return response.data;
};

export const getRewardsApi = async () => {
    const response = await api.get('/blockchain/rewards');
    return response.data;
};

export const claimRewardApi = async (id: string, userId: string) => {
    const response = await api.put(`/blockchain/rewards/claim-reward/${id}`, { userId });
    return response.data;
};



export const getNextBlockTimeApi = async (networkId: string) => {
    const response = await api.get(`/blockchain/network/${networkId}/next-time`);
    return response.data;
};
