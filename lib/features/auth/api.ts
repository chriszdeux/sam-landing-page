import api from '../../api';

import { RegistrationData } from './types';

export const loginApi = async (credentials: Record<string, string>) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData: RegistrationData) => {
  const response = await api.post('/auth', userData);
  return response.data;
};

export const validateAccountApi = async (data: { code: string }) => {
  const response = await api.put('/auth/confirm-account', data);
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
