import { apiClient, ApiResponse } from './client';

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

class AuthAPI {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>('/auth/me');
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/logout');
  }

  /**
   * Save auth tokens to localStorage
   */
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Save user to localStorage
   */
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get saved user from localStorage
   */
  getSavedUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Clear auth data from localStorage
   */
  clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export const authAPI = new AuthAPI();
