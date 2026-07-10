import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { RootStoreState } from './index.type';
import { createAuthSlice } from './index.slice';

export const useAppStore = create<RootStoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
      }),
      {
        name: 'dev-tinder-local',
      }
    ),
    { name: 'dev-tinder-zustand' }
  )
);
