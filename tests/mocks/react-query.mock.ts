import { jest } from '@jest/globals';
import { QueryClient } from '@tanstack/react-query';

export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Disable caching in tests
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  });
};

export const mockQueryClient = {
  invalidateQueries: jest.fn(),
  setQueryData: jest.fn(),
  getQueryData: jest.fn(),
  removeQueries: jest.fn(),
  clear: jest.fn(),
};

export const resetQueryClientMocks = () => {
  Object.values(mockQueryClient).forEach(mock => {
    if (typeof mock === 'function' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
};
