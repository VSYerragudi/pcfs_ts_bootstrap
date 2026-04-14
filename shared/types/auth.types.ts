export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User info returned in login response.
 * This is a subset of UserDto - only essential info for the client.
 */
export interface LoginUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: LoginUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}
