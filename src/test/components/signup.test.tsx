import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { renderWithProviders, resetStore } from '../render';
import Signup from '../../Components/Signup';

const BASE_URL = 'http://localhost:8000/api';

afterEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Helper: fill step 1 of the signup form
// Labels include a * span so use regex for exact matching
// ---------------------------------------------------------------------------

async function fillStepOne() {
  await userEvent.type(screen.getByLabelText(/First Name/i), 'Alice');
  await userEvent.type(screen.getByLabelText(/Last Name/i), 'Dev');
  await userEvent.type(screen.getByLabelText(/Email/i), 'alice@example.com');
  await userEvent.type(screen.getByLabelText(/Age/i), '25');
  await userEvent.selectOptions(screen.getByRole('combobox'), 'female');
  await userEvent.type(screen.getByLabelText(/Bio/i), 'Developer');
}

describe('Signup – complete integration', () => {
  it('prevents progressing to step 2 when step 1 is invalid', async () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });

    // Click Next without filling anything
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Should still be on step 1
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
  });

  it('navigates to step 2 when step 1 is fully valid', async () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });

    await fillStepOne();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      // Step 2 shows password fields and the Sign Up button
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });
    // Verify password inputs exist via placeholder text
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Re-enter your password')).toBeInTheDocument();
  });

  it('navigates back from step 2 to step 1 using the Back button', async () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });

    await fillStepOne();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument());
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
  });

  it('shows password requirements panel on step 2', async () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });

    await fillStepOne();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => expect(screen.getByText('Password requirements')).toBeInTheDocument());
    expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument();
  });

  it('toggles password visibility on step 2', async () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });

    await fillStepOne();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument());

    // Find the password field by placeholder (not label, to avoid Confirm Password ambiguity)
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // There are two show/hide buttons (password + confirm); click first one
    const showButtons = screen.getAllByRole('button', { name: 'Show password' });
    await userEvent.click(showButtons[0]);
    expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'text');
  });

  it('completes the full signup flow and redirects to /login on 201 response', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { initialEntries: ['/signup'] }
    );

    // Step 1
    await fillStepOne();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument());

    // Step 2 — use a strong password that passes the new schema validation
    await userEvent.type(screen.getByPlaceholderText('Enter password'), 'Secret@123');
    await userEvent.type(screen.getByPlaceholderText('Re-enter your password'), 'Secret@123');

    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // After successful signup the component navigates away to /login
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'Sign Up' })).not.toBeInTheDocument();
  });

  it('shows backend failure — Sign Up button re-enables', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/signup`, () =>
        HttpResponse.json({ message: 'Email already taken' }, { status: 409 })
      )
    );

    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });

    await fillStepOne();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await userEvent.type(screen.getByPlaceholderText('Enter password'), 'Secret@123');
    await userEvent.type(screen.getByPlaceholderText('Re-enter your password'), 'Secret@123');

    const signupBtn = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(signupBtn);

    // After failed signup the button should re-enable
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign Up' })).not.toBeDisabled());
  });

  it('has a link to the login page', () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] });
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
  });
});
