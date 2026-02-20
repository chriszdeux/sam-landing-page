// 1-Configurar cliente Axios con URL base
// 2-Interceptar peticiones para inyectar token

//# 1-Configurar cliente Axios con URL base
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
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

export default api;
