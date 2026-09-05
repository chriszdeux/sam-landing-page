import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { act, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../tests/utils/render-with-providers';
import VerifyPage from './page';
import { registerApi, validateAccountApi, loginApi } from '../../../lib/features/auth/api';

const LEGACY_PENDING_EMAIL_KEY = 'pending_email';
const LEGACY_PENDING_PASSWORD_KEY = 'pending_password';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, back: vi.fn(), replace: vi.fn() }),
}));

vi.mock('../../../lib/features/auth/api', () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  validateAccountApi: vi.fn(),
  getProfileApi: vi.fn(),
  getUserInfoApi: vi.fn(),
}));

const registerApiMock = registerApi as Mock;
const validateAccountApiMock = validateAccountApi as Mock;
const loginApiMock = loginApi as Mock;

const registrationData = {
  name: 'Pilot',
  lastName: 'Zero',
  username: 'pilot0',
  email: 'pilot@sam.test',
  password: 'sup3r-secret-pw',
  birthday: '1990-01-01',
};

// El slice se precarga completo: un preloadedState parcial dejaría el resto de campos de
// auth en undefined, que no es un estado que la app produzca nunca.
const withRegistration = {
  auth: {
    userInfo: null,
    token: null,
    status: 'idle',
    error: null,
    walletsInfo: null,
    registrationData,
  },
} as never;

// waitFor de RTL no convive bien con los timers falsos, así que se avanza el reloj a mano
// dentro de act(): advanceTimersByTimeAsync drena también los microtasks, con lo que al
// volver el árbol ya está actualizado y las aserciones no necesitan reintentos.
const advance = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

const submitCode = (container: HTMLElement) => {
  const field = container.querySelector<HTMLInputElement>('input');
  if (!field) throw new Error('Campo de código no encontrado');
  fireEvent.change(field, { target: { value: '123456' } });
  const form = container.querySelector('form');
  if (!form) throw new Error('Formulario de verificación no encontrado');
  fireEvent.submit(form);
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.useFakeTimers();
  registerApiMock.mockResolvedValue({ message: 'registered' });
  validateAccountApiMock.mockResolvedValue({ message: 'confirmed' });
  loginApiMock.mockResolvedValue({ ...registrationData, token: 'jwt-new' });
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('VerifyPage', () => {
  it('should auto-login with the in-memory registration data, not with a stored password', async () => {
    // Un registro heredado dejó una contraseña distinta en localStorage: no debe usarse.
    localStorage.setItem(LEGACY_PENDING_EMAIL_KEY, 'attacker@sam.test');
    localStorage.setItem(LEGACY_PENDING_PASSWORD_KEY, 'stale-password-from-localstorage');

    const { container, store } = renderWithProviders(<VerifyPage />, {
      preloadedState: withRegistration,
    });

    // Paso 'registering' -> 'verifying'
    await advance(2500);
    expect(container.querySelector('form')).toBeTruthy();

    submitCode(container);
    await advance(4500);

    expect(loginApiMock).toHaveBeenCalledTimes(1);
    expect(loginApiMock).toHaveBeenCalledWith({
      email: registrationData.email,
      password: registrationData.password,
    });
    expect(store.getState().auth.token).toBe('jwt-new');
    expect(push).toHaveBeenCalledWith('/');
  });

  it('should drop the registration data from the store once verification is done', async () => {
    const { container, store } = renderWithProviders(<VerifyPage />, {
      preloadedState: withRegistration,
    });

    await advance(2500);
    expect(container.querySelector('form')).toBeTruthy();

    submitCode(container);
    await advance(4500);

    expect(store.getState().auth.registrationData).toBeUndefined();
  });

  it('should not attempt an auto-login from a stored password when the store is empty', async () => {
    // Registro abandonado y retomado tras recargar: en localStorage puede seguir habiendo
    // credenciales heredadas, pero ya no se leen.
    localStorage.setItem(LEGACY_PENDING_EMAIL_KEY, registrationData.email);
    localStorage.setItem(LEGACY_PENDING_PASSWORD_KEY, registrationData.password);

    const { container } = renderWithProviders(<VerifyPage />);

    await advance(0);
    expect(container.querySelector('form')).toBeTruthy();

    submitCode(container);
    await advance(4500);

    expect(push).toHaveBeenCalledWith('/');
    // Sin auto-login: el usuario entra por el modal de login del home.
    expect(loginApiMock).not.toHaveBeenCalled();
  });

  it('should stay on the code form when the confirmation code is rejected', async () => {
    validateAccountApiMock.mockRejectedValue({
      response: { data: { message: 'Código inválido' } },
    });

    const { container } = renderWithProviders(<VerifyPage />);

    await advance(0);
    expect(container.querySelector('form')).toBeTruthy();

    submitCode(container);
    await advance(4500);

    expect(container.querySelector('form')).toBeTruthy();
    expect(loginApiMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});
