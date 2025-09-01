import { Group, CreateGroupData } from '../../../src/types/group.types';
import { mockUsers } from '../test-users';

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Lunch Squad',
    description: 'Daily lunch expenses',
    adminId: 'user-1',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'group-2',
    name: 'Weekend Trip',
    description: 'Cabin trip expenses',
    adminId: 'user-2',
    members: [mockUsers[1], mockUsers[3]],
    createdAt: '2024-01-05T15:30:00Z',
  },
  {
    id: 'group-3',
    name: 'Office Snacks',
    adminId: 'user-1',
    members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    createdAt: '2024-01-10T09:00:00Z',
  },
];

export const mockCreateGroupData: CreateGroupData = {
  name: 'Test Group',
  description: 'A test group for unit testing',
};

export const createMockGroup = (overrides: Partial<Group> = {}): Group => ({
  id: 'test-group-' + Date.now(),
  name: 'Test Group',
  description: 'Test group description',
  adminId: 'user-1',
  members: [mockUsers[0]],
  createdAt: new Date().toISOString(),
  ...overrides,
});
