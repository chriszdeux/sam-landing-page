import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import api, { hadesApi, AUTH_STORAGE_KEY, LEGACY_CREDENTIALS_KEY } from './api';

const LOGOUT_ROUTE = '/auth/logging-out';

// Adaptador falso: axios solo necesita una función que resuelva o rechace, así que sirve para
// ejercitar los interceptores sin tocar la red.
const rejectWith = (status: number) => async (config: InternalAxiosRequestConfig) => {
  throw new AxiosError(
    `Request failed with status code ${status}`,
    'ERR_BAD_REQUEST',
    config,
    null,
    {
      status,
      statusText: String(status),
      data: { message: 'nope' },
      headers: {},
      config,
    }
  );
};

const resolveWith = (data: unknown) => async (config: InternalAxiosRequestConfig) => ({
  status: 200,
  statusText: 'OK',
  data,
  headers: {},
  config,
});

type Adapter = AxiosInstance['defaults']['adapter'];

const originalApiAdapter = api.defaults.adapter;
const originalHadesAdapter = hadesApi.defaults.adapter;

let location: { href: string; pathname: string };

beforeEach(() => {
  localStorage.clear();
  location = { href: '/portfolio', pathname: '/portfolio' };
  Object.defineProperty(window, 'location', {
    value: location,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  api.defaults.adapter = originalApiAdapter;
  hadesApi.defaults.adapter = originalHadesAdapter;
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('api response interceptor', () => {
  it('should clear the token and send the user to the logout route on 401', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-expired');
    localStorage.setItem(LEGACY_CREDENTIALS_KEY, 'legacy-blob');
    api.defaults.adapter = rejectWith(401) as Adapter;

    await expect(api.get('/users/user-info')).rejects.toBeInstanceOf(AxiosError);

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(LEGACY_CREDENTIALS_KEY)).toBeNull();
    expect(location.href).toBe(LOGOUT_ROUTE);
  });

  it('should clear the token and redirect on 401 for hadesApi too', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-expired');
    hadesApi.defaults.adapter = rejectWith(401) as Adapter;

    await expect(hadesApi.get('/modules')).rejects.toBeInstanceOf(AxiosError);

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(location.href).toBe(LOGOUT_ROUTE);
  });

  it('should not redirect on a 401 coming from the login request itself', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-from-previous-session');
    api.defaults.adapter = rejectWith(401) as Adapter;

    await expect(api.post('/auth/login', { email: 'a@b.c', password: 'x' })).rejects.toBeInstanceOf(
      AxiosError
    );

    // El formulario tiene que poder pintar su error, así que no se toca el storage ni se navega.
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-from-previous-session');
    expect(location.href).toBe('/portfolio');
  });

  it('should not redirect on a 401 from account confirmation', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-valid');
    api.defaults.adapter = rejectWith(401) as Adapter;

    await expect(api.put('/auth/confirm-account', { code: '000' })).rejects.toBeInstanceOf(
      AxiosError
    );

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-valid');
    expect(location.href).toBe('/portfolio');
  });

  it('should not redirect when the request opted out with skipAuthRedirect', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-expired');
    api.defaults.adapter = rejectWith(401) as Adapter;

    await expect(
      api.get('/users/user-info', { skipAuthRedirect: true })
    ).rejects.toBeInstanceOf(AxiosError);

    expect(location.href).toBe('/portfolio');
  });

  it('should not touch the session on a 403', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-valid');
    api.defaults.adapter = rejectWith(403) as Adapter;

    await expect(api.get('/users/user-info')).rejects.toBeInstanceOf(AxiosError);

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-valid');
    expect(location.href).toBe('/portfolio');
  });

  it('should not touch the session on a 500', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-valid');
    api.defaults.adapter = rejectWith(500) as Adapter;

    await expect(api.get('/users/user-info')).rejects.toBeInstanceOf(AxiosError);

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-valid');
    expect(location.href).toBe('/portfolio');
  });

  it('should not redirect again when already on the logout route', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-expired');
    location.pathname = LOGOUT_ROUTE;
    location.href = LOGOUT_ROUTE;
    api.defaults.adapter = rejectWith(401) as Adapter;

    await expect(api.get('/users/user-info')).rejects.toBeInstanceOf(AxiosError);

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(location.href).toBe(LOGOUT_ROUTE);
  });

  it('should pass successful responses through untouched', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-valid');
    api.defaults.adapter = resolveWith({ id: 'u1' }) as Adapter;

    const response = await api.get('/users/user-info');

    expect(response.data).toEqual({ id: 'u1' });
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-valid');
    expect(location.href).toBe('/portfolio');
  });
});
