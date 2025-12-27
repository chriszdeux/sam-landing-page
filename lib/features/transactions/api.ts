import api from '../../api';

export const getTransactionsApi = async (storeId: string, wallet: string, page: number = 1, limit: number = 10) => {
    let url = `/blockchain/transactions/${storeId}?page=${page}&limit=${limit}`;
    if (wallet) {
        url += `&walletId=${wallet}`;
    }
    const response = await api.get(url);
    return response.data;
};
