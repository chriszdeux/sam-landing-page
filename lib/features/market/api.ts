// 1-Importar cliente HTTP base
// 2-Función para controlar cache de peticiones
// 3-Obtener lista de criptomonedas con paginación
// 4-Obtener histórico de precios de criptomonedas

//# 1-Importar cliente HTTP base
import api from '../../api';

let lastCheckDate: string | null = null;
let lastNetworkId: string | null = null;

//# 2-Función para controlar cache de peticiones
export const resetCryptoCheck = () => {
    lastCheckDate = null;
    lastNetworkId = null;
};

//# 3-Obtener lista de criptomonedas con paginación
export const getCryptosApi = async (networkId: string = 'ETH-SEPOLIA', page: number = 1, limit: number = 20) => {
    
    if (lastNetworkId !== networkId) {
        lastCheckDate = null;
        lastNetworkId = networkId;
    }

    let url = `/blockchain/crypto/${networkId}?page=${page}&limit=${limit}`;
    
    if (lastCheckDate) {
        url += `&lastCheck=${lastCheckDate}`;
    }

    const response = await api.get(url);
    
    
    lastCheckDate = new Date().toISOString();

    return response.data
};

//# 4-Obtener histórico de precios de criptomonedas
export const getCryptoHistoryApi = async (cryptoId: string, range: string, signal?: AbortSignal) => {
    const response = await api.get(`/blockchain/analytics/${cryptoId}?range=${range}`, { signal });
    return response.data;
};
