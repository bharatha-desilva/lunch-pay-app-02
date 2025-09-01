import { AuthResponse, LoginCredentials, RegisterData } from '../../../src/types/auth.types';
import { mockCurrentUser } from '../test-users';

export const mockAuthResponse: AuthResponse = {
  user: mockCurrentUser,
  token: 'mock-jwt-token-12345',
};

export const mockLoginCredentials: LoginCredentials = {
  email: 'john.doe@example.com',
  password: 'password123',
};

export const mockRegisterData: RegisterData = {
  email: 'new.user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  name: 'New User',
};

export const mockInvalidCredentials: LoginCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};

export const mockAuthErrors = {
  invalidCredentials: {
    message: 'Invalid credentials',
    status: 401,
  },
  emailExists: {
    message: 'Email already exists',
    status: 409,
  },
  serverError: {
    message: 'Internal server error',
    status: 500,
  },
  networkError: {
    message: 'Network Error',
    code: 'NETWORK_ERROR',
  },
};
