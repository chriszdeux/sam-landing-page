// 1-Definir interfaz financiera de la criptomoneda
// 2-Definir interfaz principal de la criptomoneda
// 3-Definir interfaz simplificada para listados

//# 1-Definir interfaz financiera de la criptomoneda
export interface Financial {
  isInfiniteSupply?: boolean;
  totalSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  marketCap: number;
  limitMarketCap: number;
  price: number;
  volume24h?: number;
  change24h?: number;
  allTimeHigh: number;
  allTimeHighDate: string; 
  allTimeLow: number;
  allTimeLowDate: string; 
  decimals?: number;
  contractAddress?: string;
  tokenType?: string;
  analyticsID: string;
}

//# 2-Definir interfaz principal de la criptomoneda
export interface Cryptocurrency {
  id: string;  
  identification: {
    name: string;
    symbol: string;
    image128?: string;
    image256?: string;
  };
  financial: Financial;
  network: {
    id: string;
    name: string;
  };
  additionalInfo?: {
    pColor: string;
    sColor: string;
    description: string[];
    dateCreated: string; 
    lastModified?: string; 
    descriptionLastUpdated?: string;
    developers: string[];
  };
  isActive: boolean;
  updatedAt?: string;
}

//# 3-Definir interfaz simplificada para listados
export interface RandomCryptocurrency {
  id: string;
  identification: {
    name: string;
    symbol: string;
    image128?: string;
    image256?: string;
  };
  financial: { 
    price: number;
    change24h: number;
   };
  additionalInfo?: {
    pColor: string;
    sColor: string;
  };
  isActive: boolean;
}
