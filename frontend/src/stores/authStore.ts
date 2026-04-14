import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginUser } from '@pcfs-demo/shared';
import apiClient from '@/lib/api';
import authService from '@/services/auth.service';

interface AuthState {
  user: LoginUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,

      initialize: () => {
        const { accessToken } = get();
        if (accessToken) {
          apiClient.setAccessToken(accessToken);
        }
      },

      login: async (email: string, password: string) => {
        try {
          const response = await authService.login({ email, password });

          apiClient.setAccessToken(response.accessToken);

          const { user } = response;
          const isAdmin = user.roles.includes('admin');

          set({
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isAdmin,
          });

          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: async () => {
        const { refreshToken, accessToken } = get();

        try {
          if (accessToken) {
            await authService.logout(refreshToken ?? undefined);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          apiClient.setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      },

      refreshTokens: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          return false;
        }

        try {
          const response = await authService.refreshTokens(refreshToken);

          apiClient.setAccessToken(response.accessToken);

          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Clear auth state on refresh failure
          apiClient.setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Restore access token to API client after rehydration
        if (state?.accessToken) {
          apiClient.setAccessToken(state.accessToken);
        }
      },
    }
  )
);
