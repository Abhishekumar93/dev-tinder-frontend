import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { Toaster } from 'sonner';
import { useAppStore } from '../Store';
import type { IUserProfile } from '../interfacesAndTypes';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial URL path for MemoryRouter */
  initialEntries?: MemoryRouterProps['initialEntries'];
  /** Pre-seed the Zustand auth store with a user */
  initialUser?: IUserProfile | null;
}

/**
 * Custom render that wraps components with all real application providers:
 * - MemoryRouter (isolated route context for tests)
 * - SWRConfig (fresh per-test cache, no retries)
 * - Toaster (sonner, required for toast assertions)
 * - Zustand reset (user state seeded per test)
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    initialUser = null,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  // Seed/reset Zustand state before rendering
  if (initialUser) {
    useAppStore.setState({ user: initialUser });
  } else {
    useAppStore.setState({ user: null });
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SWRConfig
        value={{
          // Fresh cache per test — prevents cross-test contamination
          provider: () => new Map(),
          // No retries so failures are immediate
          shouldRetryOnError: false,
          // No dedup interval so each fetch is independent
          dedupingInterval: 0,
        }}
      >
        <MemoryRouter initialEntries={initialEntries}>
          <Toaster />
          {children}
        </MemoryRouter>
      </SWRConfig>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/** Reset Zustand state after each test — call in afterEach if needed */
export function resetStore() {
  useAppStore.setState({ user: null });
}
