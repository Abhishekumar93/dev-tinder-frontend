import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { http, HttpResponse } from 'msw';
import { server } from '../server';
import { useAppStore } from '../../Store';
import { ProtectedRoute, PublicRoute } from '../../Routes';
import Body from '../../Body';
import Login from '../../Components/Login';
import Signup from '../../Components/Signup';
import Feed from '../../Components/Feed';
import App from '../../App';
import { mockUser, mockLoginResponse } from '../fixtures/users';

const BASE_URL = 'http://localhost:8000/api';

afterEach(() => {
  useAppStore.setState({ user: null });
});

/** Full app wrapper mimicking App.tsx but using MemoryRouter for test control */
function TestApp({ initialEntries = ['/'] }: { initialEntries?: string[] }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), shouldRetryOnError: false, dedupingInterval: 0 }}>
      <MemoryRouter initialEntries={initialEntries}>
        <Suspense fallback={<div>Loading…</div>}>
          <Toaster />
          <Routes>
            <Route path="/" element={<Body />}>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/" element={<Navigate to="/feed" replace />} />
              </Route>
            </Route>
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </Suspense>
      </MemoryRouter>
    </SWRConfig>
  );
}

describe('Application-level integration', () => {
  it('unauthenticated visitor is redirected to /login when accessing /', async () => {
    render(<TestApp initialEntries={['/']} />);

    // Root → ProtectedRoute → navigate to /feed → ProtectedRoute → /login
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    });
  });

  it('login form submits and sets user in store on success', async () => {
    render(<TestApp initialEntries={['/login']} />);

    await waitFor(() => expect(screen.getByLabelText('Email')).toBeInTheDocument());

    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Secret@123');

    // Use the submit button specifically (not the Navbar "Login" button)
    const loginBtn = screen.getAllByRole('button', { name: 'Login' }).find(
      (btn) => btn.getAttribute('type') === 'submit'
    );
    expect(loginBtn).toBeTruthy();
    await userEvent.click(loginBtn!);

    // After login, store should have the user
    await waitFor(() => {
      expect(useAppStore.getState().user?._id).toBe(mockLoginResponse.data._id);
    });
  });

  it('authenticated user sees Logout button in Navbar', async () => {
    useAppStore.setState({ user: mockUser });
    render(<TestApp initialEntries={['/feed']} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });

  it('logout clears store and Navbar switches from Logout to Login', async () => {
    useAppStore.setState({ user: mockUser });
    render(<TestApp initialEntries={['/feed']} />);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(useAppStore.getState().user).toBeNull();
    });
    // After logout, Navbar shows 'Login' button (not 'Logout')
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('authenticated user accessing /login is redirected to /feed', async () => {
    useAppStore.setState({ user: mockUser });
    render(<TestApp initialEntries={['/login']} />);

    // PublicRoute should redirect to /feed
    await waitFor(() => {
      // Feed will try to load; at minimum Login page should not appear
      expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument();
    });
  });

  it('unauthorized 401 response clears the Zustand store', async () => {
    // Pre-seed store
    useAppStore.setState({ user: mockUser });

    server.use(
      http.get(`${BASE_URL}/user/feed`, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )
    );

    render(<TestApp initialEntries={['/feed']} />);

    // The interceptor fires logoutUser() on 401
    await waitFor(() => {
      expect(useAppStore.getState().user).toBeNull();
    });
  });

  it('renders root App component without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    });
  });
});
