// 1-Definir enumeraciones para tipo y estado de transacciones
// 2-Definir interfaz para detalle de transacciones
// 3-Definir estructura para agrupamiento de transacciones
// 4-Definir estado global de transacciones

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
  transactionDocumentID?: string;
  financialInfo: {
    cryptoID: string;
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
  additionalInfo: {
    description?: string;
  }
  transactionType: TransactionType;
  status: TransactionStatus;
  confirmedBy?: string;
  dateCreated: string; 
  duration: string;
}

//# 3-Definir estructura para agrupamiento de transacciones
export interface TransactionBucket {
  id: string;
  blockchainID: string;
  transactions: TransactionsInterface[] | [];
  count: number;
  transactionsBuyQueue: string[] | [];
  transactionsSellQueue: string[] | [];
  transactionsTransferQueue: string[] | [];
  prevBlockID?: string | null;
  nextBlockID?: string | null;
  startDate: string; 
  endDate: string | null; 
  currentTransactionBlock: number;
}

//# 4-Definir estado global de transacciones
export interface TransactionsState {
    byStoreBoxId: {
        [storeId: string]: TransactionBucket
    };
    isLoading: boolean;
    error: string | null;
    lastFetch?: number;
    lastArgs?: string;
}
