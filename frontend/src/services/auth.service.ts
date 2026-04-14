import apiClient from '@/lib/api';
import type {
  UserDto,
  LoginUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@pcfs-demo/shared';

// Re-export shared types for convenience
export type {
  UserDto,
  LoginUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
};

// Aliases for backward compatibility
export type User = UserDto;
export type RefreshResponse = RefreshTokenResponse;

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async logout(refreshToken?: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  async refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },
};

export default authService;
