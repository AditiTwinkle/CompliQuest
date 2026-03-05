import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: 'admin' | 'auditor' | 'compliance_officer' | 'user';
  passwordHash: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  organizationId: string;
  role?: 'admin' | 'auditor' | 'compliance_officer' | 'user';
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

export function userToResponse(user: User): UserResponse {
  const { passwordHash, ...rest } = user;
  return rest;
}
