
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
  dateCreated: string; // Serialized date
  duration: string;
}

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
  startDate: string; // Serialized date
  endDate: string | null; // Serialized date
  currentTransactionBlock: number;
}

export interface TransactionsState {
    byStoreBoxId: {
        [storeId: string]: TransactionBucket
    };
    isLoading: boolean;
    error: string | null;
}
