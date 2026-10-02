import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  articlesAmount: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // true після першої перевірки сесії: до цього не знаємо, гість чи ні
  isHydrated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  setHydrated: () => set({ isHydrated: true }),
}));
