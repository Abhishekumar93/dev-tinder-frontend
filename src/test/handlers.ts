import { http, HttpResponse } from 'msw';
import {
  mockFeedResponse,
  mockConnectionsResponse,
  mockLoginResponse,
  mockSignupResponse,
  mockProfileUpdateResponse,
  mockLogoutResponse,
} from './fixtures/users';

// Matches VITE_API_BASE_URL from .env: http://localhost:8000/api/
const BASE = 'http://localhost:8000/api';

export const handlers = [
  // Auth: login
  http.post(`${BASE}/auth/login`, () =>
    HttpResponse.json(mockLoginResponse, { status: 200 })
  ),

  // Auth: signup
  http.post(`${BASE}/auth/signup`, () =>
    HttpResponse.json(mockSignupResponse, { status: 201 })
  ),

  // Auth: logout
  http.post(`${BASE}/auth/logout`, () =>
    HttpResponse.json(mockLogoutResponse, { status: 200 })
  ),

  // User: feed
  http.get(`${BASE}/user/feed`, () =>
    HttpResponse.json(mockFeedResponse, { status: 200 })
  ),

  // User: connections
  http.get(`${BASE}/user/connections`, () =>
    HttpResponse.json(mockConnectionsResponse, { status: 200 })
  ),

  // User: profile update
  http.patch(`${BASE}/user`, () =>
    HttpResponse.json(mockProfileUpdateResponse, { status: 200 })
  ),
];
