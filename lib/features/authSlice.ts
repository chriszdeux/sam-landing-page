import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

interface Wallet {
  label: string;
  walletAddress: string;
}

interface Reward {
  id: string;
  claimedAt: string;
}

interface User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  birthday: string;
  confirmedAccount: boolean;
  isBanned: boolean;
  transactions: any[];
  wallets: Wallet[];
  rewards: Reward[];
  balance: number;
  referralCode: string;
  token?: string; // Optional if token is separate
}

interface AuthState {
  userInfo: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  walletAddress: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  status: 'idle',
  error: null,
  walletAddress: null,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth', userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const validateAccount = createAsyncThunk(
  'auth/validateAccount',
  async (data: { code: string }, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/validate-account', data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Validation failed');
    }
  }
);

export const connectWallet = createAsyncThunk(
  'auth/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      if (typeof (window as any).ethereum !== 'undefined') {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } else {
        return rejectWithValue('MetaMask is not installed');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to connect wallet');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.walletAddress = null;
      localStorage.removeItem('token');
    },
    disconnectWallet: (state) => {
      state.walletAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload; // Assuming payload is the User object itself based on previous request
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming register returns user/token or we redirect to login
        // Adjust based on actual backend response
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Validate Account
      .addCase(validateAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(validateAccount.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(validateAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Connect Wallet
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.walletAddress = action.payload;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, disconnectWallet } = authSlice.actions;
export default authSlice.reducer;
