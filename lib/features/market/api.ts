import api from '../../api';

let lastCheckDate: string | null = null;
let lastNetworkId: string | null = null;

export const resetCryptoCheck = () => {
    lastCheckDate = null;
    lastNetworkId = null;
};

export const getCryptosApi = async (networkId: string = 'ETH-SEPOLIA', page: number = 1, limit: number = 20) => {
    // If network changes, reset validation date
    if (lastNetworkId !== networkId) {
        lastCheckDate = null;
        lastNetworkId = networkId;
    }

    let url = `/blockchain/crypto/${networkId}?page=${page}&limit=${limit}`;
    
    if (lastCheckDate) {
        url += `&lastCheck=${lastCheckDate}`;
    }

    const response = await api.get(url);
    
    // Update the date for the next call only if the request was successful
    lastCheckDate = new Date().toISOString();

    return response.data
};

export const getCryptoHistoryApi = async (cryptoId: string, range: string, signal?: AbortSignal) => {
    const response = await api.get(`/blockchain/analytics/${cryptoId}?range=${range}`, { signal });
    return response.data;
};
