import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { swrClient } from '../../Services/swr-client';

const BASE_URL = 'http://localhost:8000/api';

// ---------------------------------------------------------------------------
// swrClient – GET (string key)
// ---------------------------------------------------------------------------

describe('swrClient – GET request', () => {
  it('fetches data via GET when key is a string and merges status', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'ok', data: { records: [] } }, { status: 200 })
      )
    );

    const result = await swrClient('/user/feed');
    expect(result.status).toBe(200);
    expect(result.message).toBe('ok');
  });

  it('propagates network error on GET failure', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () => HttpResponse.error())
    );

    await expect(swrClient('/user/feed')).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// swrClient – Mutation (array key)
// ---------------------------------------------------------------------------

describe('swrClient – mutation request', () => {
  it('sends a POST request and merges status', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: 'logged in', data: {} }, { status: 200 })
      )
    );

    const result = await swrClient(['/auth/login', 'POST', { email: 'a@b.com', password: 'pw' }]);
    expect(result.status).toBe(200);
    expect(result.message).toBe('logged in');
  });

  it('sends a PATCH request for profile update', async () => {
    server.use(
      http.patch(`${BASE_URL}/user`, () =>
        HttpResponse.json({ message: 'updated', data: {} }, { status: 200 })
      )
    );

    const result = await swrClient(['/user', 'PATCH', { firstName: 'Bob' }]);
    expect(result.status).toBe(200);
    expect(result.message).toBe('updated');
  });

  it('propagates server 500 errors', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 })
      )
    );

    await expect(swrClient(['/auth/login', 'POST', {}])).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// swrClient – 401 handling (tested at interceptor level here)
// ---------------------------------------------------------------------------

describe('swrClient – 401 response', () => {
  it('rejects with an error on 401', async () => {
    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )
    );

    await expect(swrClient('/user/feed')).rejects.toThrow();
  });
});
