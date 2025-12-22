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
  allTimeHighDate: string; // Changed Date to string for frontend serialization
  allTimeLow: number;
  allTimeLowDate: string; // Changed Date to string for frontend serialization
  decimals?: number;
  contractAddress?: string;
  tokenType?: string;
  candlesID: string;
}

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
    dateCreated: string; // string for frontend
    lastModified?: string; // string for frontend
    developers: string[];
  };
  isActive: boolean;
}

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
