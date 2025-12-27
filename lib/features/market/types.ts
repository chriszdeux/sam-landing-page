import { Cryptocurrency } from '../../types/crypto';

export interface CandleData {
    buy: number;
    sell: number;
    price: number;
    timestamp: number;
}

export interface MarketState {
    cryptos: Cryptocurrency[];
    historicalData: {
        [cryptoId: string]: {
            data: CandleData[];
            range: string;
            total: number;
        };
    };
    isLoading: boolean;
    error: string | null;
}
