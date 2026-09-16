import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { useApiQuery } from '../../Hooks/useApiQuery';
import { Toaster } from 'sonner';

const BASE_URL = 'http://localhost:8000/api';

// Simple test component that exercises useApiQuery
function QueryTestComponent({ url }: { url: string }) {
  const { data, isLoading, error } = useApiQuery<unknown>({
    url,
    displayErrorToast: true,
    displaySuccessToast: true,
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error occurred</div>;
  if (data) return <div>Data: {(data as { message: string }).message}</div>;
  return <div>No data</div>;
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), shouldRetryOnError: false, dedupingInterval: 0 }}>
      <Toaster />
      {children}
    </SWRConfig>
  );
}

describe('useApiQuery', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('shows loading state initially then renders data on success', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'Feed loaded', data: { records: [] } }, { status: 200 })
      )
    );

    render(
      <Wrapper>
        <QueryTestComponent url="/user/feed" />
      </Wrapper>
    );

    // Should show loading first
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    // Then data
    await waitFor(() => expect(screen.getByText('Data: Feed loaded')).toBeInTheDocument());
  });

  it('shows error state on API failure', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 })
      )
    );

    render(
      <Wrapper>
        <QueryTestComponent url="/user/feed" />
      </Wrapper>
    );

    await waitFor(() => expect(screen.getByText('Error occurred')).toBeInTheDocument());
  });
});
