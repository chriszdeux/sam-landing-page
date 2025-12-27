import api from '../../api';

export const getCryptosApi = async (networkId: string = 'ETH-SEPOLIA') => {
    const response = await api.get(`/blockchain/crypto/${networkId}`);
    return response.data;
};

export const getCryptoHistoryApi = async (cryptoId: string, range: string) => {
    const response = await api.get(`/blockchain/candles/${cryptoId}?range=${range}`);
    return response.data;
};
