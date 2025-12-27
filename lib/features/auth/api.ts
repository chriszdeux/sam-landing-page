import api from '../../api';

export const loginApi = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData: any) => {
  const response = await api.post('/auth', userData);
  return response.data;
};

export const validateAccountApi = async (data: { code: string }) => {
  const response = await api.put('/auth/validate-account', data);
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
