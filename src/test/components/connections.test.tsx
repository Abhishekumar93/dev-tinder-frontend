import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { renderWithProviders } from '../render';
import Connections from '../../Components/Connections';
import { mockUser2 } from '../fixtures/users';
import { Suspense } from 'react';

const BASE_URL = 'http://localhost:8000/api';

describe('Connections – integration', () => {
  it('renders connection cards without Ignore/Send Request CTAs', async () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading</div>}>
        <Connections />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockUser2.firstName))).toBeInTheDocument();
    });

    // Connections passes showCtas={false} — buttons must NOT appear
    expect(screen.queryByRole('button', { name: 'Ignore' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send Request' })).not.toBeInTheDocument();
  });

  it('shows empty state when no connections exist', async () => {
    server.use(
      http.get(`${BASE_URL}/user/connections`, () =>
        HttpResponse.json({ message: 'ok', data: { count: 0, records: [] } }, { status: 200 })
      )
    );

    renderWithProviders(
      <Suspense fallback={<div>Loading</div>}>
        <Connections />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText('No feed to show.')).toBeInTheDocument();
    });
  });

  it('shows error state on API failure', async () => {
    server.use(
      http.get(`${BASE_URL}/user/connections`, () =>
        HttpResponse.json({ message: 'Error' }, { status: 500 })
      )
    );

    renderWithProviders(
      <Suspense fallback={<div>Loading</div>}>
        <Connections />
      </Suspense>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error: Something Went Wrong! Please try again later.')
      ).toBeInTheDocument();
    });
  });
});
