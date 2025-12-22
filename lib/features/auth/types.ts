export interface CryptoHoldings {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
}

export interface WalletsAddressed {
  recipientWalletAddress: string;
  senderWalletAddress: string;
}

export interface WalletInterface {
  id: string;
  ownerID?: string;
  isContract?: boolean;
  store: CryptoHoldings[];
  createdAt?: string;
}

export interface Wallet {
  label: string;
  walletAddress: string;
  details?: WalletInterface; // Keeping this for backward compatibility if needed, though we move to walletsInfo
}

export interface Reward {
  id: string;
  claimedAt: string;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  birthday: string;
  confirmedAccount: boolean;
  isBanned: boolean;
  transactions: unknown[]; 
  wallets: Wallet[];
  rewards: Reward[];
  balance: number;
  referralCode: string;
  token: string;
}

export interface AuthState {
  userInfo: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  walletsInfo: WalletInterface | null;
}
