import apiService from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
    
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Remove confirmPassword before sending to API
    const { ...registerData } = data;
    const response = await apiService.post<AuthResponse>('/auth/register', registerData);
    
    // Store token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
    
    return response;
  }

  logout(): void {
    // Clear local storage immediately for better UX
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Optional: Call logout API in background without blocking
    apiService.post('/auth/logout').catch(error => {
      console.warn('Logout API call failed:', error);
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/refresh');
    
    // Update stored token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
    
    return response;
  }

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}

const authService = new AuthService();
export default authService;
