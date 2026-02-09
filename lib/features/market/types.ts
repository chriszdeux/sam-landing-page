import { Cryptocurrency } from '../../types/crypto';

export interface AnalyticsData {
    buy?: number;
    sell?: number;
    price: number;
    timestamp: number;
}

export interface TradeState {
    amount: number;
    counter: number;
    _id?: string;
}

export interface MarketState {
    cryptos: Cryptocurrency[];
    historicalData: {
        [cryptoId: string]: {
            data: AnalyticsData[];
            range: string;
            total: number;
            currentBuyState?: TradeState;
            currentSellState?: TradeState;
        };
    };
    isLoading: boolean;
    error: string | null;
}
