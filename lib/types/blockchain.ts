// 1-Definir propiedades de minería e información básica
// 2-Definir información adicional y rangos de tarifas
// 3-Definir estados y niveles de carga de la red
// 4-Definir propiedades detalladas de la blockchain
// 5-Definir interfaces para tokens, transacciones y pools
// 6-Definir interfaz principal de la blockchain

//# 1-Definir propiedades de minería e información básica
export interface MiningProps {
  baseWorkRequired: number; 
  workIncreaseFactor: number; 
  rewardReductionFactor: number; 
}

export interface BlockchainInfo {
  name: string;
  symbol: string;
  image?: string;
}

//# 2-Definir información adicional y rangos de tarifas
export interface AdditionalInfo {
  description: string[];
  color: string;
  dateCreated: string; 
  lastUpdated?: string; 
  developers: string[];
}

export interface FeeRange {
  min: number;
  max: number;
}

//# 3-Definir estados y niveles de carga de la red
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

//# 4-Definir propiedades detalladas de la blockchain
export interface BlockchainProps {
  miningProps?: MiningProps;
  initialNodeCount: number;
  nodeCount?: number;
  blockCount?: number;
  blockInterval: number;
  runningProcess: boolean;
  lastRunDate: string; 
  difficulty: number;
  fees?: FeeRange;
  feeBase: number;
  supportedAssets?: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  marketCap: number;
  status?: BlockchainStatus;
  operationStatus?: NetworkLoadLevel; 
}

//# 5-Definir interfaces para tokens, transacciones y pools
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

export interface BlockchainPoolNetwork {
    poolID: string;
    
}

//# 6-Definir interfaz principal de la blockchain
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
