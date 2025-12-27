export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  color: string;
  image: string;
}

export const marketData: CryptoAsset[] = [
  {
    id: 'sam-token',
    symbol: 'SAM',
    name: 'Samium',
    price: 134.52,
    change24h: 12.5,
    marketCap: '$4.2B',
    volume: '$245M',
    color: '#00f3ff',
    image: 'https://placehold.co/100x100/1a1a2e/00f3ff/png?text=SAM'
  },
  {
    id: 'deuterium',
    symbol: 'DTR',
    name: 'Deuterium',
    price: 45.20,
    change24h: -2.3,
    marketCap: '$1.8B',
    volume: '$89M',
    color: '#ff0055',
    image: 'https://placehold.co/100x100/1a1a2e/ff0055/png?text=DTR'
  },
  {
    id: 'dark-matter',
    symbol: 'DKM',
    name: 'Dark Matter',
    price: 12050.00,
    change24h: 5.8,
    marketCap: '$800M',
    volume: '$12M',
    color: '#9b59b6',
    image: 'https://placehold.co/100x100/1a1a2e/9b59b6/png?text=DKM'
  },
  {
    id: 'solar-credits',
    symbol: 'SLR',
    name: 'Solar Credits',
    price: 1.05,
    change24h: 0.1,
    marketCap: '$12B',
    volume: '$2.1B',
    color: '#f1c40f',
    image: 'https://placehold.co/100x100/1a1a2e/f1c40f/png?text=SLR'
  },
  {
    id: 'plasma-core',
    symbol: 'PLC',
    name: 'Plasma Core',
    price: 890.30,
    change24h: 8.4,
    marketCap: '$650M',
    volume: '$45M',
    color: '#e74c3c',
    image: 'https://placehold.co/100x100/1a1a2e/e74c3c/png?text=PLC'
  },
  {
    id: 'nano-tech',
    symbol: 'NNO',
    name: 'Nanotech',
    price: 23.40,
    change24h: -1.2,
    marketCap: '$2.1B',
    volume: '$130M',
    color: '#2ecc71',
    image: 'https://placehold.co/100x100/1a1a2e/2ecc71/png?text=NNO'
  },
  {
    id: 'void-shards',
    symbol: 'VDS',
    name: 'Void Shards',
    price: 666.00,
    change24h: 33.3,
    marketCap: '$66M',
    volume: '$6M',
    color: '#8e44ad',
    image: 'https://placehold.co/100x100/1a1a2e/8e44ad/png?text=VDS'
  },
  {
    id: 'terra-token',
    symbol: 'TRT',
    name: 'Terra Token',
    price: 12.50,
    change24h: 1.5,
    marketCap: '$5B',
    volume: '$500M',
    color: '#3498db',
    image: 'https://placehold.co/100x100/1a1a2e/3498db/png?text=TRT'
  }
];

export const graphData = [
    { time: '00:00', value: 100 },
    { time: '04:00', value: 120 },
    { time: '08:00', value: 115 },
    { time: '12:00', value: 140 },
    { time: '16:00', value: 135 },
    { time: '20:00', value: 160 },
    { time: '24:00', value: 155 },
];
