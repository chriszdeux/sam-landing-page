export interface MiningProps {
  baseWorkRequired: number; // Variable value
  workIncreaseFactor: number; // Float value
  rewardReductionFactor: number; // Float value
}

export interface BlockchainInfo {
  name: string;
  symbol: string;
  image?: string;
}

export interface AdditionalInfo {
  description: string[];
  color: string;
  dateCreated: string; // Changed to string for frontend serialization
  lastUpdated?: string; // Changed to string for frontend serialization
  developers: string[];
}

export interface FeeRange {
  min: number;
  max: number;
}

// Enum placeholders based on usage context
export enum BlockchainStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Maintenance = 'Maintenance'
}

export enum NetworkLoadLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Congested = 'Congested'
}

export interface BlockchainProps {
  miningProps?: MiningProps;
  initialNodeCount: number;
  nodeCount?: number;
  blockCount?: number;
  blockInterval: number;
  runningProcess: boolean;
  lastRunDate: string; // Changed to string
  difficulty: number;
  fees?: FeeRange;
  feeBase: number;
  supportedAssets?: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  marketCap: number;
  status?: BlockchainStatus;
  operationStatus?: NetworkLoadLevel; // mostrar 3 estados
}

export interface CryptoGenesis {
  id: string;
  name: string;
}

export interface TokenList {
  tokenID: string;
  tokenSymbol: string;
}

export interface TokensSupported {
  total: number;
  tokens: TokenList[];
}

export interface TransactionsProps {
  transactionStoreID: string;
}

// Stub for missing interface
export interface BlockchainPoolNetwork {
    poolID: string;
    // Add other fields if known
}

export interface BlockchainInterface {
  id: string;
  identification: BlockchainInfo;
  additionalInfo: AdditionalInfo;
  blockchainProps: BlockchainProps;
  poolNetwork?: BlockchainPoolNetwork[];
  poolNetworkQueue?: BlockchainPoolNetwork[];
  cryptoGenesis: CryptoGenesis;
  tokensSupported?: TokensSupported;
  storeTransactions: TransactionsProps;
  isActive: boolean;
  chain?: string;
}
