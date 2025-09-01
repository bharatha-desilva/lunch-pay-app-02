import '@testing-library/jest-dom';

// Mock localStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
});

// Mock console.error to prevent noise in tests unless we're specifically testing error scenarios
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  mockStorage.getItem.mockClear();
  mockStorage.setItem.mockClear();
  mockStorage.removeItem.mockClear();
  mockStorage.clear.mockClear();
});

// Mock window.confirm for testing
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
  writable: true,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});
