import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { renderWithProviders, resetStore } from '../render';
import Profile from '../../Components/Profile';
import { useAppStore } from '../../Store';
import { mockUser, mockProfileUpdateResponse } from '../fixtures/users';

const BASE_URL = 'http://localhost:8000/api';

afterEach(() => {
  resetStore();
});

describe('Profile – integration', () => {
  it('renders with initial values from Zustand store', () => {
    renderWithProviders(<Profile />, { initialUser: mockUser });

    expect(screen.getByLabelText<HTMLInputElement>('First Name').value).toBe('Alice');
    expect(screen.getByLabelText<HTMLInputElement>('Last Name').value).toBe('Dev');
    // Age input
    expect(screen.getByLabelText<HTMLInputElement>('Age').value).toBe('28');
  });

  it('live preview UserCard updates as user edits form fields', async () => {
    renderWithProviders(<Profile />, { initialUser: mockUser });

    const firstNameInput = screen.getByLabelText('First Name');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'UpdatedName');

    // UserCard re-renders with new value — check for updated name in heading
    await waitFor(() => {
      expect(screen.getByText(/UpdatedName/)).toBeInTheDocument();
    });
  });

  it('successful profile update: sends PATCH and updates Zustand store', async () => {
    renderWithProviders(<Profile />, { initialUser: mockUser });

    // Change first name
    const firstNameInput = screen.getByLabelText('First Name');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'AliceUpdated');

    await userEvent.click(screen.getByRole('button', { name: 'Update Profile' }));

    // After successful update, Zustand store should reflect the new user data
    await waitFor(() => {
      expect(useAppStore.getState().user?.firstName).toBe(
        mockProfileUpdateResponse.data.firstName
      );
    });
  });

  it('button is enabled initially (no resolver — validation only happens on submit)', () => {
    renderWithProviders(<Profile />, { initialUser: mockUser });
    // Profile form has no Zod resolver so the button is always enabled unless isMutating
    expect(screen.getByRole('button', { name: 'Update Profile' })).not.toBeDisabled();
  });

  it('keeps store unchanged on backend failure', async () => {
    server.use(
      http.patch(`${BASE_URL}/user`, () =>
        HttpResponse.json({ message: 'Update failed' }, { status: 500 })
      )
    );

    renderWithProviders(<Profile />, { initialUser: mockUser });

    await userEvent.click(screen.getByRole('button', { name: 'Update Profile' }));

    // Store user should remain unchanged
    await waitFor(() => {
      expect(useAppStore.getState().user?.firstName).toBe('Alice');
    });
  });

  it('renders UserCard alongside the profile form', () => {
    renderWithProviders(<Profile />, { initialUser: mockUser });
    // UserCard shows Alice's name
    expect(screen.getAllByText(/Alice/i).length).toBeGreaterThan(0);
  });
});
