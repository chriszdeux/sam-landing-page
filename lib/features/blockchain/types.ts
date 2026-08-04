// 1-Definir enumeraciones para transacciones
// 2-Definir interfaces para transacciones, bloques y baldes
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

//# 2-Definir interfaces para transacciones, bloques y baldes
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

export interface BlockInterface {
  index: number;
  id: string;
  blockchainId: string;
  prevBlock: string;
  nextBlock: string | null;
  difficulty: number;
  buyCount?: number;
  sellCount?: number;
  transferCount?: number;
  transactionsBuyQueue?: number | string[];
  transactionsSellQueue?: number | string[];
  transactionsTransferQueue?: number | string[];
  maxTransactions: number;
  miners: string[]; // Direcciones de wallet planas
  fee: number;
  minerRewards: number; 
  createdAt: string | Date;
  minedAt?: string | Date;
}

export interface TransactionBucket {
  id: string;
  blockchainID: string;
  transactions: TransactionsInterface[] | [];
  count: number;
  transactionsBuyQueue: number | string[] | [];
  transactionsSellQueue: number | string[] | [];
  transactionsTransferQueue: number | string[] | [];
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
    activeBlock: BlockInterface | null;
    blocksHistory: BlockInterface[];
    rewards: Reward[];
    nextBlockTime: number | null;

    isLoading: boolean;
    error: string | null;
    chronoBurstFreqTypes: {
        label: string;
        frequencies: {
            [key: string]: { value: number; unit: string };
        };
    } | null;
    lastBlocksFetch: number | null;
}
