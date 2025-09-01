import { User } from './auth.types';

export interface Group {
  id: string;
  name: string;
  description?: string;
  members?: User[];
  adminId: string;
  createdAt: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
}

export interface AddMemberData {
  groupId: string;
  email: string;
}
