import { Cryptocurrency } from '../../types/crypto';

export interface CandleData {
    buy: number;
    sell: number;
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
            data: CandleData[];
            range: string;
            total: number;
            currentBuyState?: TradeState;
            currentSellState?: TradeState;
        };
    };
    isLoading: boolean;
    error: string | null;
}
