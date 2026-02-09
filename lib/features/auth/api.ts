import api from '../../api';

import { RegistrationData } from './types';

export const loginApi = async (credentials: Record<string, string>) => {
  const response = await api.post('/auth/login', credentials);
  if (!response || !response.data) {
    if (typeof window !== 'undefined') alert("Error: No se recibieron datos de inicio de sesión");
    throw new Error("No data received from login");
  }
  return response.data;
};

export const registerApi = async (userData: RegistrationData) => {
  const response = await api.post('/auth', userData);
  if (!response || !response.data) {
     if (typeof window !== 'undefined') alert("Error: No se recibieron datos de registro");
     throw new Error("No data received from register");
  }
  return response.data;
};

export const validateAccountApi = async (data: { code: string }) => {
  const response = await api.put('/auth/confirm-account', data);
  if (!response || !response.data) {
     if (typeof window !== 'undefined') alert("Error: No se recibieron datos de validación");
     throw new Error("No data received from validation");
  }
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/auth/profile');
  if (!response || !response.data) {
     // Optional: alert only on critical failures or rely on UI to handle the thrown error
     // User asked to alert if response.data doesn't exist.
     if (typeof window !== 'undefined') alert("Error: No se pudo obtener el perfil");
     throw new Error("No profile data received");
  }
  return response.data;
};

export const getUserInfoApi = async () => {
  const response = await api.get('/users/user-info');
  if (!response || !response.data) {
     if (typeof window !== 'undefined') alert("Error: No se pudo obtener información del usuario");
     throw new Error("No user info data received");
  }
  return response.data;
};
