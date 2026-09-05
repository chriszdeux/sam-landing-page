import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './reducer';
import { login, checkAuth } from './actions';
import { loginApi, getUserInfoApi } from './api';
import { AUTH_STORAGE_KEY } from '../../api';

// Claves heredadas escritas con su nombre literal a propósito: son el contrato con los
// navegadores que ya las tienen guardadas, no un detalle interno que pueda renombrarse.
const LEGACY_CREDENTIALS_KEY = '_c';
const LEGACY_PENDING_EMAIL_KEY = 'pending_email';
const LEGACY_PENDING_PASSWORD_KEY = 'pending_password';
const LEGACY_CREDENTIAL_KEYS = [
  LEGACY_CREDENTIALS_KEY,
  LEGACY_PENDING_EMAIL_KEY,
  LEGACY_PENDING_PASSWORD_KEY,
];

vi.mock('./api', () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  validateAccountApi: vi.fn(),
  getProfileApi: vi.fn(),
  getUserInfoApi: vi.fn(),
}));

const loginApiMock = loginApi as Mock;
const getUserInfoApiMock = getUserInfoApi as Mock;

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

const userInfo = { id: 'u1', email: 'pilot@sam.test', name: 'Pilot' };

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      userInfo: null,
      token: null,
      status: 'idle',
      error: null,
      walletsInfo: null,
    });
  });
});

describe('auth credential storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should not persist the password in localStorage when login succeeds', async () => {
    loginApiMock.mockResolvedValue({ ...userInfo, token: 'jwt-from-backend' });
    const store = makeStore();

    await store.dispatch(login({ email: 'pilot@sam.test', password: 'sup3r-secret' }));

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-from-backend');
    expect(localStorage.getItem(LEGACY_CREDENTIALS_KEY)).toBeNull();
    // Ninguna clave de localStorage debe contener la contraseña, codificada ni en claro.
    const stored = Object.keys(localStorage).map((key) => localStorage.getItem(key) || '');
    expect(stored.some((value) => value.includes('sup3r-secret'))).toBe(false);
    expect(stored.some((value) => atobSafe(value).includes('sup3r-secret'))).toBe(false);
  });

  it('should delete the legacy "_c" key on startup even when there is no session', async () => {
    localStorage.setItem(LEGACY_CREDENTIALS_KEY, btoa('pilot@sam.test:sup3r-secret'));
    const store = makeStore();

    await store.dispatch(checkAuth());

    expect(localStorage.getItem(LEGACY_CREDENTIALS_KEY)).toBeNull();
  });

  it('should delete every legacy credential key on startup, with no session', async () => {
    localStorage.setItem(LEGACY_CREDENTIALS_KEY, btoa('pilot@sam.test:sup3r-secret'));
    localStorage.setItem(LEGACY_PENDING_EMAIL_KEY, 'pilot@sam.test');
    localStorage.setItem(LEGACY_PENDING_PASSWORD_KEY, 'sup3r-secret');
    const store = makeStore();

    await store.dispatch(checkAuth());

    LEGACY_CREDENTIAL_KEYS.forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  it('should delete the legacy "pending_password" left by an abandoned registration', async () => {
    // El borrado antiguo dependía de completar la verificación, así que en un registro
    // abandonado la contraseña se quedaba ahí para siempre.
    localStorage.setItem(LEGACY_PENDING_EMAIL_KEY, 'pilot@sam.test');
    localStorage.setItem(LEGACY_PENDING_PASSWORD_KEY, 'sup3r-secret');
    const store = makeStore();

    await store.dispatch(checkAuth());

    expect(localStorage.getItem(LEGACY_PENDING_PASSWORD_KEY)).toBeNull();
    expect(localStorage.getItem(LEGACY_PENDING_EMAIL_KEY)).toBeNull();
  });

  it('should delete the legacy keys on logout as well', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt');
    LEGACY_CREDENTIAL_KEYS.forEach((key) => localStorage.setItem(key, 'leftover'));
    const store = makeStore();

    store.dispatch(logout());

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    LEGACY_CREDENTIAL_KEYS.forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  it('should delete the legacy "_c" key on startup when a token is present', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-still-valid');
    localStorage.setItem(LEGACY_CREDENTIALS_KEY, btoa('pilot@sam.test:sup3r-secret'));
    getUserInfoApiMock.mockResolvedValue(userInfo);
    const store = makeStore();

    await store.dispatch(checkAuth());

    expect(localStorage.getItem(LEGACY_CREDENTIALS_KEY)).toBeNull();
  });
});

describe('checkAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should validate the stored token against the backend instead of re-logging in', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-still-valid');
    getUserInfoApiMock.mockResolvedValue(userInfo);
    const store = makeStore();

    const result = await store.dispatch(checkAuth());

    expect(getUserInfoApiMock).toHaveBeenCalledTimes(1);
    expect(loginApiMock).not.toHaveBeenCalled();
    expect(result.type).toBe('auth/checkAuth/fulfilled');
    expect(store.getState().auth.status).toBe('succeeded');
    expect(store.getState().auth.userInfo).toEqual(userInfo);
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-still-valid');
  });

  it('should not re-login even if a legacy "_c" credential blob is still present', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-still-valid');
    localStorage.setItem(LEGACY_CREDENTIALS_KEY, btoa('pilot@sam.test:sup3r-secret'));
    getUserInfoApiMock.mockResolvedValue(userInfo);
    const store = makeStore();

    await store.dispatch(checkAuth());

    expect(loginApiMock).not.toHaveBeenCalled();
    expect(getUserInfoApiMock).toHaveBeenCalledTimes(1);
  });

  it('should clear the token and reject when the backend answers 401', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-expired');
    getUserInfoApiMock.mockRejectedValue({ response: { status: 401 } });
    const store = makeStore();

    const result = await store.dispatch(checkAuth());

    expect(result.type).toBe('auth/checkAuth/rejected');
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.userInfo).toBeNull();
  });

  it('should keep the token when validation fails for a non-auth reason (network error)', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-still-valid');
    getUserInfoApiMock.mockRejectedValue({ message: 'Network Error' });
    const store = makeStore();

    const result = await store.dispatch(checkAuth());

    expect(result.type).toBe('auth/checkAuth/rejected');
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe('jwt-still-valid');
  });

  it('should reject without calling the backend when there is no token', async () => {
    const store = makeStore();

    const result = await store.dispatch(checkAuth());

    expect(result.type).toBe('auth/checkAuth/rejected');
    expect(getUserInfoApiMock).not.toHaveBeenCalled();
    expect(loginApiMock).not.toHaveBeenCalled();
  });

  it('should let the startup validation handle its own 401 without the global redirect', async () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'jwt-expired');
    getUserInfoApiMock.mockRejectedValue({ response: { status: 401 } });
    const store = makeStore();

    await store.dispatch(checkAuth());

    expect(getUserInfoApiMock).toHaveBeenCalledWith({ skipAuthRedirect: true });
  });
});

// Decodifica base64 tolerando cadenas que no lo son, para poder afirmar que la contraseña
// no quedó guardada "ofuscada" en ninguna clave.
function atobSafe(value: string) {
  try {
    return atob(value);
  } catch {
    return '';
  }
}
