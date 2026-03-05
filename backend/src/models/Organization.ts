import { v4 as uuidv4 } from 'uuid';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrganizationCreateInput {
  name: string;
  description?: string;
  logo?: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: number;
  updatedAt: number;
}
