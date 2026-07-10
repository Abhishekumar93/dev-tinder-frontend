import type { StateCreator } from 'zustand/vanilla';
import type { AuthSlice } from './auth.type';

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set
) => ({
  user: null,
  setUser: (user) => set({ user }),
  setLogout: () => set({ user: null }),
});
