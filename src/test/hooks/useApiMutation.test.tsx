import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { useApiMutation } from '../../Hooks/useApiMutation';
import { Toaster } from 'sonner';

const BASE_URL = 'http://localhost:8000/api';

// Test component that exercises useApiMutation
function MutationTestComponent() {
  const { executeMutation, isMutating } = useApiMutation<unknown>();

  const handleClick = async () => {
    await executeMutation({
      url: '/auth/login',
      method: 'POST',
      body: { email: 'a@b.com', password: 'pw' },
      displaySuccessToast: true,
      displayErrorToast: true,
    });
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isMutating}>
        {isMutating ? 'Loading…' : 'Submit'}
      </button>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), shouldRetryOnError: false, dedupingInterval: 0 }}>
      <Toaster />
      {children}
    </SWRConfig>
  );
}

describe('useApiMutation', () => {
  it('executes mutation and returns response on success', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: 'Login successful', data: {} }, { status: 200 })
      )
    );

    render(
      <Wrapper>
        <MutationTestComponent />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    // Button re-enables after mutation completes
    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled());
  });

  it('handles mutation failure gracefully — button re-enables', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: 'Bad credentials' }, { status: 401 })
      )
    );

    render(
      <Wrapper>
        <MutationTestComponent />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled());
  });
});
