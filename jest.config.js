export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/tests/**/*.test.(ts|tsx)',
  ],
  collectCoverageFrom: [
    'tests/**/*.{ts,tsx}',
    '!tests/**/*.d.ts',
    '!tests/setup.ts',
    '!tests/mocks/**/*',
    '!tests/fixtures/**/*',
    '!tests/utils/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true,
};
