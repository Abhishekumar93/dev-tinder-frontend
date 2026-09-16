import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { renderWithProviders, resetStore } from '../render';
import Navbar from '../../Components/Navbar';
import { useAppStore } from '../../Store';
import { mockUser } from '../fixtures/users';

const BASE_URL = 'http://localhost:8000/api';

afterEach(() => {
  resetStore();
});

describe('Navbar – unauthenticated', () => {
  it('shows Login button when no user is in store', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows the Dev Tinder brand link', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /Dev Tinder/i })).toBeInTheDocument();
  });
});

describe('Navbar – authenticated', () => {
  it('shows Logout button when user is authenticated', () => {
    renderWithProviders(<Navbar />, { initialUser: mockUser });
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('shows profile and connections navigation links', () => {
    renderWithProviders(<Navbar />, { initialUser: mockUser });
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Connections' })).toBeInTheDocument();
  });

  it('successful logout: clears Zustand store after 200 response', async () => {
    renderWithProviders(<Navbar />, { initialUser: mockUser });

    // Store should have user before logout
    expect(useAppStore.getState().user?._id).toBe(mockUser._id);

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(useAppStore.getState().user).toBeNull();
    });
  });

  it('keeps user in store when logout API returns an error', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/logout`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 })
      )
    );

    renderWithProviders(<Navbar />, { initialUser: mockUser });

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));

    // On failure (non-200), the store should NOT be cleared
    await waitFor(() => {
      expect(useAppStore.getState().user?._id).toBe(mockUser._id);
    });
  });

  it('avatar menu button has an accessible label', () => {
    renderWithProviders(<Navbar />, { initialUser: mockUser });
    expect(screen.getByRole('button', { name: 'Open user menu' })).toBeInTheDocument();
  });
});
