// 1-Configurar cliente Axios con URL base
// 2-Interceptar peticiones para inyectar token

//# 1-Configurar cliente Axios con URL base
import axios from 'axios';
import { EnvVariables } from './constants/variables';

const api = axios.create({
  baseURL: `${EnvVariables.connect}${EnvVariables.apiVersion}`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Error:", error.message);
    if (error.config) {
       console.error("Request URL:", (error.config.baseURL || '') + error.config.url);
    }
    return Promise.reject(error);
  }
);

export const hadesApi = axios.create({
  baseURL: `${EnvVariables.connect}/hades-v1/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

hadesApi.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
