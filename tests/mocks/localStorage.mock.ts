import { jest } from '@jest/globals';

export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const setupLocalStorageMocks = () => {
  mockLocalStorage.getItem.mockImplementation((key: string) => {
    switch (key) {
      case 'auth_token':
        return 'mock-jwt-token-12345';
      case 'user_data':
        return JSON.stringify({
          id: 'user-1',
          email: 'john.doe@example.com',
          name: 'John Doe',
          createdAt: '2024-01-01T10:00:00Z',
        });
      default:
        return null;
    }
  });
};

export const setupEmptyLocalStorage = () => {
  mockLocalStorage.getItem.mockReturnValue(null);
};

export const resetLocalStorageMocks = () => {
  Object.values(mockLocalStorage).forEach(mock => mock.mockReset());
};
