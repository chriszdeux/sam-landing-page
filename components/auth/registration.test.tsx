import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../tests/utils/render-with-providers';
import { RegisterForm } from './RegisterForm';
import { AuthModal } from './AuthModal';

const LEGACY_PENDING_EMAIL_KEY = 'pending_email';
const LEGACY_PENDING_PASSWORD_KEY = 'pending_password';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, back: vi.fn(), replace: vi.fn() }),
}));

const PASSWORD = 'sup3r-secret-pw';

const formValues: Record<string, string> = {
  name: 'Pilot',
  lastName: 'Zero',
  username: 'pilot0',
  email: 'pilot@sam.test',
  password: PASSWORD,
  birthday: '1990-01-01',
};

const fillAndSubmit = (container: HTMLElement) => {
  Object.entries(formValues).forEach(([name, value]) => {
    const field = container.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!field) throw new Error(`Campo "${name}" no encontrado en el formulario de registro`);
    fireEvent.change(field, { target: { value } });
  });

  const form = container.querySelector('form');
  if (!form) throw new Error('Formulario de registro no encontrado');
  fireEvent.submit(form);
};

const storedValues = () =>
  Object.keys(localStorage).map((key) => localStorage.getItem(key) || '');

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
});

describe.each([
  ['RegisterForm', () => <RegisterForm />],
  ['AuthModal', () => <AuthModal initialMode="register" />],
])('%s registration submit', (_name, renderForm) => {
  it('should not persist the password in localStorage', async () => {
    const { container, store } = renderWithProviders(renderForm());

    fillAndSubmit(container);

    // El registro queda en Redux (en memoria), que es de donde lo lee /auth/verify.
    await waitFor(() => {
      expect(store.getState().auth.registrationData?.email).toBe(formValues.email);
    });

    expect(localStorage.getItem(LEGACY_PENDING_PASSWORD_KEY)).toBeNull();
    expect(storedValues().some((value) => value.includes(PASSWORD))).toBe(false);
  });

  it('should not persist the email in localStorage either', async () => {
    const { container, store } = renderWithProviders(renderForm());

    fillAndSubmit(container);

    await waitFor(() => {
      expect(store.getState().auth.registrationData?.email).toBe(formValues.email);
    });

    // 'pending_email' solo existía para acompañar a la contraseña en el auto-login. Sin
    // ella no la lee nadie, así que se queda sin escribir en lugar de dejar una clave
    // huérfana en el navegador.
    expect(localStorage.getItem(LEGACY_PENDING_EMAIL_KEY)).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('should keep sending the user to the verification screen', async () => {
    const { container } = renderWithProviders(renderForm());

    fillAndSubmit(container);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/auth/verify');
    });
  });
});
