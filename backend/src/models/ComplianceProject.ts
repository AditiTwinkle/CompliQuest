export interface ComplianceProject {
  id: string;
  organizationId: string;
  name: string;
  frameworkId: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
  inProgressControls: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectCreateInput {
  organizationId: string;
  name: string;
  frameworkId: string;
}

export interface ProjectResponse {
  id: string;
  organizationId: string;
  name: string;
  frameworkId: string;
  status: string;
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
  inProgressControls: number;
  createdAt: number;
  updatedAt: number;
}
