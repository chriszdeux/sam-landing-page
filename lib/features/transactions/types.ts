// 1-Definir enumeraciones para tipo y estado de transacciones
// 2-Definir interfaz para detalle de transacciones
// 3-Definir estado global de transacciones

//# 1-Definir enumeraciones para tipo y estado de transacciones
export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL',
    TRANSFER = 'TRANSFER',
    CONVERT = 'CONVERT',
    MINE = 'MINE',
    REWARD = 'REWARD',
    STAKING = 'STAKING'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    FAILED = 'FAILED'
}

//# 2-Definir interfaz para detalle de transacciones
export interface TransactionsInterface {
  id: string;
  blockchainId: string;
  financialInfo: {
    crypto: string;
    symbol: string;
    amount: number;
    quantity: number;
    fee: number;
    price: number;
  }
  addresses: {
    recipientWalletAddress: string;
    senderWalletAddress: string;
  }
  transactionType: TransactionType;
  status: TransactionStatus;
  dateCreated: string;
  duration: string;
  powerRequired?: number;
  confirmedByLabId?: string;
}

//# 3-Definir estado global de transacciones
export interface TransactionsState {
    transactions: TransactionsInterface[];
    isLoading: boolean;
    error: string | null;
    total: number;
    lastFetch?: number;
    lastArgs?: string;
}
