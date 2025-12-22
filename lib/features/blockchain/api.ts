import api from '../../api';

export const getNetworksApi = async () => {
    const response = await api.get('/blockchain/network');
    return response.data;
};


