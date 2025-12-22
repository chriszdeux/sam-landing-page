import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, validateAccountApi } from './api';
import api from '../../api';

// ... (existing code found implicitly, but we are appending)

export const fetchWalletDetails = createAsyncThunk(
  'auth/fetchWalletDetails',
  async (walletId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blockchain/wallets/${walletId}`);
      return { walletId, data: response.data };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch wallet details');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        // Saving encoded credentials as per user request (Note: Security Risk)
        const encoded = btoa(`${credentials.email}:${credentials.password}`);
        localStorage.setItem('_c', encoded);
      }
      return data;
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
         return rejectWithValue((err as any).response?.data?.message || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
     const token = localStorage.getItem('token');
     const encodedCreds = localStorage.getItem('_c');

     if (token) {
        // First try to validate current token if we had an endpoint, 
        // but since we are simulating persistence or using full credentials re-login:
        
        // If we have credentials saved, we prioritize re-logging to get fresh data
        if (encodedCreds) {
            try {
                const decoded = atob(encodedCreds);
                const [email, password] = decoded.split(':');
                const data = await loginApi({ email, password });
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                return data;
            } catch (e) {
                console.error("Auto-login failed", e);
                // If auto-login fails, we might want to logout
                return rejectWithValue('Auto-login failed');
            }
        }
        
        // If no credentials but we have token, maybe we could try getProfile if available?
        // For now, based on requirements, we mostly rely on the stored credentials logic.
     }
     
     return rejectWithValue('No session');
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const validateAccount = createAsyncThunk(
  'auth/validateAccount',
  async (data: { code: string }, { rejectWithValue }) => {
    try {
      const result = await validateAccountApi(data);
      return result;
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
