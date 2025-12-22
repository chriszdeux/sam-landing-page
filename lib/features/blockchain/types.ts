import { BlockchainInterface } from '../../types/blockchain';

// Basic Transaction Interface from backend
export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL',
    TRANSFER = 'TRANSFER'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
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

export interface BlockchainState {
    networks: BlockchainInterface[];
    selectedNetwork: {
        id: string;
        transactionStoreID?: string;
    } | null;

    isLoading: boolean;
    error: string | null;
}
