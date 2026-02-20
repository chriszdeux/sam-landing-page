// 1-Definir interfaces para datos históricos de precios
// 2-Definir estado de las operaciones de trading
// 3-Definir estado global del mercado de criptomonedas

//# 1-Definir interfaces para datos históricos de precios
import { Cryptocurrency } from '../../types/crypto';

export interface AnalyticsData {
    buy?: number;
    sell?: number;
    price: number;
    timestamp: number;
}

//# 2-Definir estado de las operaciones de trading
export interface TradeState {
    amount: number;
    counter: number;
    _id?: string;
}

//# 3-Definir estado global del mercado de criptomonedas
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
    lastFetch?: number;
    lastArgs?: string;
}
