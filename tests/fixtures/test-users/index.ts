import { User } from '../../../src/types/auth.types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'user-2', 
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    createdAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'bob.wilson@example.com',
    name: 'Bob Wilson',
    createdAt: '2024-01-03T10:00:00Z',
  },
  {
    id: 'user-4',
    email: 'alice.brown@example.com',
    name: 'Alice Brown',
    createdAt: '2024-01-04T10:00:00Z',
  },
];

export const mockCurrentUser: User = mockUsers[0];

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-' + Date.now(),
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  ...overrides,
});
