
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '../../Routes/protected';
import { PublicRoute } from '../../Routes/public';
import { useAppStore } from '../../Store';
import type { IUserProfile } from '../../interfacesAndTypes';

const mockUser: IUserProfile = {
  _id: 'route-user',
  firstName: 'Alice',
  lastName: 'Dev',
  email: 'alice@example.com',
  age: 25,
  gender: 'female',
  bio: 'Dev',
};

afterEach(() => {
  useAppStore.setState({ user: null });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderProtected(initialPath: string, authenticated: boolean) {
  if (authenticated) useAppStore.setState({ user: mockUser });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<div>Feed Page</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderPublic(initialPath: string, authenticated: boolean) {
  if (authenticated) useAppStore.setState({ user: mockUser });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<div>Login Page</div>} />
        </Route>
        <Route path="/feed" element={<div>Feed Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// ---------------------------------------------------------------------------
// ProtectedRoute tests
// ---------------------------------------------------------------------------

describe('ProtectedRoute', () => {
  it('allows an authenticated user to access a protected route', () => {
    renderProtected('/feed', true);
    expect(screen.getByText('Feed Page')).toBeInTheDocument();
  });

  it('redirects an unauthenticated user to /login', () => {
    renderProtected('/feed', false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Feed Page')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// PublicRoute tests
// ---------------------------------------------------------------------------

describe('PublicRoute', () => {
  it('allows an unauthenticated user to access a public route', () => {
    renderPublic('/login', false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects an authenticated user away from a public route to /feed', () => {
    renderPublic('/login', true);
    expect(screen.getByText('Feed Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Body (Outlet) layout test
// ---------------------------------------------------------------------------

describe('Body layout', () => {
  it('renders nested route content via Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/child']}>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <span>Layout</span>
                <Outlet />
              </div>
            }
          >
            <Route path="/child" element={<span>Child Content</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
