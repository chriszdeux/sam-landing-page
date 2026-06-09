// 1-Lógica principal y renderizado del módulo

import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, validateAccountApi, getUserInfoApi } from './api';
import { RegistrationData } from './types';
import api from '../../api';

export const refreshUserInfo = createAsyncThunk(
  'auth/refreshUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserInfoApi();
      return data;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Failed to refresh user info';
      return rejectWithValue(message);
    }
  },
  {
      condition: (_, { getState }) => {
          const { auth } = getState() as { auth: { status: string; lastRefresh?: number } };
          if (auth.status === 'loading') {
              return false;
          }
          if (auth.lastRefresh && Date.now() - auth.lastRefresh < 240000) { // 4 minutes
              return false;
          }
      }
  }
);

export const fetchWalletDetails = createAsyncThunk(
  'auth/fetchWalletDetails',
  async (walletId: string, { rejectWithValue }) => {
    try {
      const response = await api.get('/blockchain/wallets/' + walletId);
      return { walletId, data: response.data };
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Failed to fetch wallet details';
      return rejectWithValue(message);
    }
  },
  {
    condition: (walletId, { getState }) => {
      const { auth } = getState() as { auth: { status: string; walletsInfo: any } };
      if (auth.status === 'loading' || (auth.walletsInfo && auth.walletsInfo.walletAddress === walletId)) {
        return false;
      }
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
        
        
        const encoded = btoa(credentials.email + ':' + credentials.password);
        localStorage.setItem('_c', encoded);
      }
      return data;
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
         const errorObj = err as { response?: { data?: { message?: string } } };
         return rejectWithValue(errorObj.response?.data?.message || 'Login failed');
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
                console.error('Auto-login failed', e);
                
                return rejectWithValue('Auto-login failed');
            }
        }
        
        
        
     }
     
     return rejectWithValue('No session');
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegistrationData, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (err: unknown) {
      
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const validateAccount = createAsyncThunk(
  'auth/validateAccount',
  async (data: { code: string }, { rejectWithValue }) => {
    try {
      const result = await validateAccountApi(data);
      return result;
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Validation failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const addWallet = createAsyncThunk(
  'auth/addWallet',
  async (data: { walletAddress: string, blockchainId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/blockchain/wallets', data);
      return response.data;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Failed to add wallet';
      return rejectWithValue(message);
    }
  }
);

export const removeWallet = createAsyncThunk(
  'auth/removeWallet',
  async (walletId: string, { rejectWithValue }) => {
    try {
      await api.delete('/blockchain/wallets/' + walletId);
      return walletId;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Failed to remove wallet';
      return rejectWithValue(message);
    }
  }
);