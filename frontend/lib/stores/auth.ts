import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { authAPI } from '@/lib/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login(email, password);
          const { user, token } = response;
          
          localStorage.setItem('auth-token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        try {
          const response = await authAPI.register(email, password, name);
          const { user, token } = response;
          
          localStorage.setItem('auth-token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        authAPI.logout().catch(() => {});
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);