// 1-Definir enumeraciones para transacciones
// 2-Definir interfaces para transacciones y bloques
// 3-Definir interfaces para recompensas y estado

//# 1-Definir enumeraciones para transacciones
import { BlockchainInterface } from '../../types/blockchain';

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

//# 2-Definir interfaces para transacciones y bloques
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
  dateCreated: string; 
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
  startDate: string; 
  endDate: string | null; 
  currentTransactionBlock: number;
}

//# 3-Definir interfaces para recompensas y estado
export interface Reward {
    id: string;
    name: string;
    description: string;
    amount: number;
    interval: number; 
    rewardType: 'CREDIT';
    isClaimed?: boolean; 
    nextClaimTime?: number; 
}

export interface BlockchainState {
    networks: BlockchainInterface[];
    selectedNetwork: BlockchainInterface | null;
    rewards: Reward[];
    nextBlockTime: number | null;

    isLoading: boolean;
    error: string | null;
}
