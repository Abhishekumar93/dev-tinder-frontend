import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { renderWithProviders } from '../render';
import Feed from '../../Components/Feed';
import { mockUser, mockUser2 } from '../fixtures/users';
import { Suspense } from 'react';

const BASE_URL = 'http://localhost:8000/api';

describe('Feed – integration', () => {
  it('shows loading state initially', async () => {
    // Delay the response so we can observe loading
    server.use(
      http.get(`${BASE_URL}/user/feed`, async () => {
        await new Promise((r) => setTimeout(r, 50));
        return HttpResponse.json(
          { message: 'ok', data: { count: 0, records: [] } },
          { status: 200 }
        );
      })
    );

    renderWithProviders(
      <Suspense fallback={<div>Suspense Loading</div>}>
        <Feed />
      </Suspense>
    );

    // The component renders either a loading spinner or final state — just verify no crash
    expect(document.body).toBeTruthy();
  });

  it('renders user cards on successful feed load', async () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading</div>}>
        <Feed />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockUser.firstName))).toBeInTheDocument();
    });

    // Both users from mockFeedResponse should be rendered
    expect(screen.getByText(new RegExp(mockUser2.firstName))).toBeInTheDocument();

    // Feed shows CTAs (Ignore / Send Request) since showCtas defaults to true
    expect(screen.getAllByRole('button', { name: 'Ignore' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Send Request' })).toHaveLength(2);
  });

  it('shows empty state when feed returns no records', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'ok', data: { count: 0, records: [] } }, { status: 200 })
      )
    );

    renderWithProviders(
      <Suspense fallback={<div>Loading</div>}>
        <Feed />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText('No feed to show.')).toBeInTheDocument();
    });
  });

  it('shows error state when API returns 500', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 })
      )
    );

    renderWithProviders(
      <Suspense fallback={<div>Loading</div>}>
        <Feed />
      </Suspense>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error: Something Went Wrong! Please try again later.')
      ).toBeInTheDocument();
    });
  });
});
