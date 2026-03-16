import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      login: (user, token, remember = false) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('token', token);
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          error: null 
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      updateUser: (updates) => {
        set({ 
          user: { ...get().user, ...updates } 
        });
      },

      setUserFromStorage: () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
          // Optionally fetch user data here
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ems-auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Initialize from storage on app load
if (typeof window !== 'undefined') {
  useAuthStore.getState().setUserFromStorage();
}