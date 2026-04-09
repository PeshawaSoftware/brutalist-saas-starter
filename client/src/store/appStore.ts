import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, Subscription } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

export interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  isNavOpen: boolean;
  toggleNav: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isDarkMode: false,
        toggleDarkMode: () =>
          set((state) => ({
            isDarkMode: !state.isDarkMode,
          })),

        user: null,
        setUser: (user: User | null) => set({ user }),
        isAuthenticated: false,

        subscription: null,
        setSubscription: (subscription: Subscription | null) => set({ subscription }),

        isNavOpen: false,
        toggleNav: () =>
          set((state) => ({
            isNavOpen: !state.isNavOpen,
          })),

        isLoading: false,
        setLoading: (loading: boolean) => set({ isLoading: loading }),

        error: null,
        setError: (error: string | null) => set({ error }),
      }),
      {
        name: STORAGE_KEYS.preferences,
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          user: state.user,
          subscription: state.subscription,
        }),
      }
    )
  )
);
