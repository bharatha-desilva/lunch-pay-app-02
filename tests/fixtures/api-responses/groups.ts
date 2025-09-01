import { Group, AddMemberData } from '../../../src/types/group.types';
import { mockGroups, mockCreateGroupData } from '../mock-data/groups';
import { mockUsers } from '../test-users';

export const mockGroupsApiResponse = {
  success: mockGroups,
  empty: [],
  single: mockGroups[0],
};

export const mockCreateGroupResponse: Group = {
  ...mockCreateGroupData,
  id: 'new-group-123',
  adminId: 'user-1',
  members: [mockUsers[0]],
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockAddMemberData: AddMemberData = {
  groupId: 'group-1',
  email: 'newmember@example.com',
};

export const mockAddMemberResponse: Group = {
  ...mockGroups[0],
  members: [...mockGroups[0].members!, mockUsers[3]],
};

export const mockGroupErrors = {
  notFound: {
    message: 'Group not found',
    status: 404,
  },
  unauthorized: {
    message: 'Not authorized to access this group',
    status: 403,
  },
  memberExists: {
    message: 'User is already a member of this group',
    status: 409,
  },
  invalidGroupData: {
    message: 'Invalid group data',
    status: 400,
  },
  serverError: {
    message: 'Internal server error',
    status: 500,
  },
};

export const mockUserSearchResponse = [
  {
    id: 'user-5',
    email: 'search.user@example.com',
    name: 'Search User',
    createdAt: '2024-01-15T10:00:00Z',
  },
];
