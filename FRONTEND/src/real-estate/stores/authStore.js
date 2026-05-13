import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));

export default useAuthStore;
