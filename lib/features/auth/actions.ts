// 1-Lógica principal y renderizado del módulo

import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, validateAccountApi, getUserInfoApi } from './api';
import { RegistrationData } from './types';
import api, { AUTH_STORAGE_KEY, clearLegacyCredentialKeys } from '../../api';

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
          // The 30s UI cooldown handles rate limiting now
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
        localStorage.setItem(AUTH_STORAGE_KEY, data.token);
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
  async (_, { rejectWithValue }) => {
     if (typeof window === 'undefined') {
        return rejectWithValue('No session');
     }

     // Limpieza de las claves heredadas que guardaban la contraseña ('_c' del auto-login en
     // cada carga, 'pending_password' del registro). Se hace aquí porque checkAuth es lo
     // primero que corre en el arranque (AuthLoader), con sesión o sin ella.
     clearLegacyCredentialKeys();

     const token = localStorage.getItem(AUTH_STORAGE_KEY);
     if (!token) {
        return rejectWithValue('No session');
     }

     try {
        // Valida contra el backend el token que ya está guardado, en lugar de volver a
        // loguear. skipAuthRedirect deja que el 401 se maneje aquí: en el arranque basta con
        // limpiar y dejar al usuario deslogueado en la página que está viendo.
        const data = await getUserInfoApi({ skipAuthRedirect: true });
        return data;
     } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 403) {
           localStorage.removeItem(AUTH_STORAGE_KEY);
           return rejectWithValue('Session expired');
        }
        const message = (err as { message?: string })?.message || 'Failed to validate session';
        return rejectWithValue(message);
     }
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
  async (walletData: { userId: string; label: string; walletAddress: string }, { rejectWithValue }) => {
    const { userId, ...data } = walletData;
    try {
      const response = await api.put(`/users/${userId}/add-wallet`, data);
      return { ...data, message: response.data?.message || 'Wallet added successfully' };
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add wallet';
      return rejectWithValue(errorMsg);
    }
  }
);

export const removeWallet = createAsyncThunk(
  'auth/removeWallet',
  async (walletData: { userId: string; walletAddress: string }, { rejectWithValue }) => {
    const { userId, walletAddress } = walletData;
    try {
      const response = await api.put(`/users/${userId}/remove-wallet`, { walletAddress });
      return { walletAddress, message: response.data?.message || 'Wallet removed successfully' };
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to remove wallet';
      return rejectWithValue(errorMsg);
    }
  }
);