import { create } from 'zustand';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ConsumerUser {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: ConsumerUser | null;
  pharmaToken: string | null;
  isLoading: boolean;
  setAuth: (user: ConsumerUser, token: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  pharmaToken: null,
  isLoading: true, // Start true — _layout.tsx resolves it after session restore attempt
  setAuth: (user: ConsumerUser, token: string) => set({
    isAuthenticated: true,
    user,
    pharmaToken: token,
    isLoading: false,
  }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: () => set({
    isAuthenticated: false,
    user: null,
    pharmaToken: null,
    isLoading: false,
  }),
}));
