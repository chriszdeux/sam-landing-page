// 1-Importar cliente HTTP base
// 2-Función para resetear cursor de paginación
// 3-Función para obtener historial de transacciones

//# 1-Importar cliente HTTP base
import api from '../../api';

let lastCheckDate: string | null = null;

//# 2-Función para resetear cursor de paginación
export const resetTransactionsCheck = () => {
    lastCheckDate = null;
};

//# 3-Función para obtener historial de transacciones
export const getTransactionsApi = async (storeId: string, wallet: string, page: number = 1, limit: number = 10) => {
    let url = `/blockchain/transactions/${storeId}?page=${page}&limit=${limit}`;
    if (wallet) {
        url += `&walletId=${wallet}`;
    }
    
    if (lastCheckDate) {
        url += `&lastCheck=${lastCheckDate}`;
    }
    console.log("url", url)
    const response = await api.get(url);

    
    lastCheckDate = new Date().toISOString();

    return response.data;
};
