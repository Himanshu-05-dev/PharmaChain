import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false, // Start false since we removed Firebase
  setAuth: (user: User | null) => set({ 
    isAuthenticated: !!user, 
    user,
    isLoading: false 
  }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: () => set({ isAuthenticated: false, user: null, isLoading: false })
}));
