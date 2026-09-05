// 1-Configurar cliente Axios con URL base
// 2-Interceptar peticiones para inyectar token
// 3-Interceptar respuestas para manejar sesión expirada

//# 1-Configurar cliente Axios con URL base
import axios, { AxiosError, AxiosInstance } from 'axios';
import { EnvVariables } from './constants/variables';

// El backend ya emite JWT con expiración (expiresIn, 7 días por defecto), así que un token
// puede caducar en mitad de la sesión. Sin interceptor de respuesta ese 401 terminaba como
// rechazo genérico en el rejectWithValue del thunk: ni se limpiaba el token ni se avisaba al
// usuario, la UI solo dejaba de cargar datos.
export const AUTH_STORAGE_KEY = 'token';

// Claves heredadas que llegaron a guardar la contraseña del usuario en localStorage:
//   '_c'                -> btoa(email + ':' + password), para re-loguear en cada carga.
//   'pending_password'  -> la contraseña en claro, para auto-loguear tras verificar la cuenta.
//   'pending_email'     -> acompañaba a la anterior; sin ella no la lee nadie.
// Ninguna se escribe ya. Se borran al arrancar para vaciarlas de los navegadores que las
// tengan: el borrado de 'pending_*' dependía de completar la verificación, así que en
// cualquier registro abandonado la contraseña se quedaba ahí indefinidamente.
export const LEGACY_CREDENTIALS_KEY = '_c';
export const LEGACY_PENDING_EMAIL_KEY = 'pending_email';
export const LEGACY_PENDING_PASSWORD_KEY = 'pending_password';

export const LEGACY_CREDENTIAL_KEYS = [
  LEGACY_CREDENTIALS_KEY,
  LEGACY_PENDING_EMAIL_KEY,
  LEGACY_PENDING_PASSWORD_KEY,
];

export const clearLegacyCredentialKeys = () => {
  if (typeof window === 'undefined') return;
  LEGACY_CREDENTIAL_KEYS.forEach((key) => localStorage.removeItem(key));
};

// El login vive en un modal sobre la landing; el flujo de cierre de sesión del repo es
// /auth/logging-out, que despacha logout() y devuelve al home (donde está el modal).
const LOGOUT_ROUTE = '/auth/logging-out';

// Un 401 de estos endpoints no es una sesión expirada: es una credencial mal puesta o un
// código de validación inválido. El formulario tiene que poder pintar su propio error, así
// que aquí no se limpia nada ni se redirige.
const PUBLIC_AUTH_PATHS = ['auth/login', 'auth/confirm-account'];

// Permite que una petición se salte la redirección y maneje el 401 por su cuenta (lo usa
// checkAuth al validar el token en el arranque: ahí queremos dejar al usuario en la página
// que ya está viendo, sin pasar por la pantalla de DISCONNECTING).
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const isPublicAuthRequest = (url: string) =>
  PUBLIC_AUTH_PATHS.some((path) => url.replace(/^\//, '').startsWith(path));

//# 3-Interceptar respuestas para manejar sesión expirada
const setupResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url || '';

      // Solo 401. Un 403 en este backend viene de comprobaciones de permiso/estado de cuenta
      // (isGod, cuenta banneada), no de un token caducado: cerrar sesión ahí escondería el
      // error real detrás de un logout.
      if (
        status === 401 &&
        !isPublicAuthRequest(url) &&
        !error.config?.skipAuthRedirect &&
        typeof window !== 'undefined'
      ) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        clearLegacyCredentialKeys();
        // Evita re-entrar en la ruta de logout cuando ya se está saliendo.
        if (window.location.pathname !== LOGOUT_ROUTE) {
          window.location.href = LOGOUT_ROUTE;
        }
      }

      return Promise.reject(error);
    }
  );
};

const api = axios.create({
  baseURL: `${EnvVariables.connect}${EnvVariables.apiVersion}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

//# 2-Interceptar peticiones para inyectar token
api.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
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

setupResponseInterceptor(api);

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
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

setupResponseInterceptor(hadesApi);

export default api;
