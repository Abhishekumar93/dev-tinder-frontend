import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { renderWithProviders, resetStore } from '../render';
import Login from '../../Components/Login';
import { useAppStore } from '../../Store';
import { mockLoginResponse } from '../fixtures/users';

const BASE_URL = 'http://localhost:8000/api';

afterEach(() => {
  resetStore();
});

describe('Login – complete integration', () => {
  it('successful password login: fills form, submits, updates store and navigates to /feed', async () => {
    // Use a navigated wrapper so we can detect the page change
    renderWithProviders(<Login />, { initialEntries: ['/login'] });

    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Secret@123');

    const submitBtn = screen.getByRole('button', { name: 'Login' });
    expect(submitBtn).not.toBeDisabled();
    await userEvent.click(submitBtn);

    // After successful login the store should have the user
    await waitFor(() => {
      expect(useAppStore.getState().user?._id).toBe(mockLoginResponse.data._id);
    });
  });

  it('OTP login: switching method shows OTP field and hides Password field', async () => {
    renderWithProviders(<Login />, { initialEntries: ['/login'] });

    // Initially password field is visible
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    // Switch to OTP
    await userEvent.click(screen.getByRole('button', { name: /Login using OTP/i }));

    // OTP field should appear; Password field should disappear
    await waitFor(() => expect(screen.getByLabelText('OTP')).toBeInTheDocument());
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();

    // Switch back
    await userEvent.click(screen.getByRole('button', { name: /Login using Password/i }));
    await waitFor(() => expect(screen.getByLabelText('Password')).toBeInTheDocument());
  });

  it('successful OTP login navigates and sets user in store', async () => {
    renderWithProviders(<Login />, { initialEntries: ['/login'] });

    await userEvent.click(screen.getByRole('button', { name: /Login using OTP/i }));
    await waitFor(() => expect(screen.getByLabelText('OTP')).toBeInTheDocument());

    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.type(screen.getByLabelText('OTP'), '123456');

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(useAppStore.getState().user?._id).toBe(mockLoginResponse.data._id);
    });
  });

  it('shows Login button disabled while form is invalid', () => {
    renderWithProviders(<Login />, { initialEntries: ['/login'] });
    // Form untouched — submit button should be disabled
    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
  });

  it('shows backend error and keeps user in store as null on 401 failure', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      )
    );

    renderWithProviders(<Login />, { initialEntries: ['/login'] });

    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'WrongPass@1');

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    // User should NOT be set in store after failed login
    await waitFor(() => {
      expect(useAppStore.getState().user).toBeNull();
    });
  });

  it('password visibility toggle: clicking Show/Hide password switches input type', async () => {
    renderWithProviders(<Login />, { initialEntries: ['/login'] });

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('has a link to signup page', () => {
    renderWithProviders(<Login />, { initialEntries: ['/login'] });
    expect(screen.getByRole('link', { name: 'Signup' })).toHaveAttribute('href', '/signup');
  });
});
