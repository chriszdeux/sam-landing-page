import api from '../../api';

let lastCheckDate: string | null = null;

export const resetTransactionsCheck = () => {
    lastCheckDate = null;
};

export const getTransactionsApi = async (storeId: string, wallet: string, page: number = 1, limit: number = 10) => {
    let url = `/blockchain/transactions/${storeId}?page=${page}&limit=${limit}`;
    if (wallet) {
        url += `&walletId=${wallet}`;
    }
    
    if (lastCheckDate) {
        url += `&lastCheck=${lastCheckDate}`;
    }

    const response = await api.get(url);

    // Update the date for the next call only if the request was successful
    lastCheckDate = new Date().toISOString();

    return response.data;
};
