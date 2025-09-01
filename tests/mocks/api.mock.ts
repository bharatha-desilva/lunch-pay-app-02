import { jest } from '@jest/globals';
import { mockAuthResponse, mockAuthErrors } from '../fixtures/api-responses/auth';
import { mockGroupsApiResponse, mockCreateGroupResponse, mockGroupErrors } from '../fixtures/api-responses/groups';

// Mock the API service
export const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Auth API mocks
export const mockAuthApi = {
  login: {
    success: () => mockApiService.post.mockResolvedValue(mockAuthResponse),
    invalidCredentials: () => mockApiService.post.mockRejectedValue(mockAuthErrors.invalidCredentials),
    serverError: () => mockApiService.post.mockRejectedValue(mockAuthErrors.serverError),
  },
  register: {
    success: () => mockApiService.post.mockResolvedValue(mockAuthResponse),
    emailExists: () => mockApiService.post.mockRejectedValue(mockAuthErrors.emailExists),
    serverError: () => mockApiService.post.mockRejectedValue(mockAuthErrors.serverError),
  },
};

// Groups API mocks
export const mockGroupsApi = {
  getAll: {
    success: () => mockApiService.get.mockResolvedValue(mockGroupsApiResponse.success),
    empty: () => mockApiService.get.mockResolvedValue(mockGroupsApiResponse.empty),
    serverError: () => mockApiService.get.mockRejectedValue(mockGroupErrors.serverError),
  },
  create: {
    success: () => mockApiService.post.mockResolvedValue(mockCreateGroupResponse),
    invalid: () => mockApiService.post.mockRejectedValue(mockGroupErrors.invalidGroupData),
    serverError: () => mockApiService.post.mockRejectedValue(mockGroupErrors.serverError),
  },
  getById: {
    success: () => mockApiService.get.mockResolvedValue(mockGroupsApiResponse.single),
    notFound: () => mockApiService.get.mockRejectedValue(mockGroupErrors.notFound),
    unauthorized: () => mockApiService.get.mockRejectedValue(mockGroupErrors.unauthorized),
  },
  update: {
    success: () => mockApiService.put.mockResolvedValue(mockGroupsApiResponse.single),
    notFound: () => mockApiService.put.mockRejectedValue(mockGroupErrors.notFound),
    unauthorized: () => mockApiService.put.mockRejectedValue(mockGroupErrors.unauthorized),
  },
  delete: {
    success: () => mockApiService.delete.mockResolvedValue(undefined),
    notFound: () => mockApiService.delete.mockRejectedValue(mockGroupErrors.notFound),
    unauthorized: () => mockApiService.delete.mockRejectedValue(mockGroupErrors.unauthorized),
  },
};

// Reset all mocks
export const resetApiMocks = () => {
  Object.values(mockApiService).forEach(mock => mock.mockReset());
};
