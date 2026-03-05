export interface ComplianceControl {
  id: string;
  frameworkId: string;
  controlId: string;
  title: string;
  description: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  createdAt: number;
  updatedAt: number;
}

export interface ComplianceControlResponse {
  id: string;
  projectId: string;
  controlId: string;
  frameworkId: string;
  userResponse?: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_started';
  evidenceIds?: string[];
  aiGuidance?: string;
  validationErrors?: string[];
  submittedAt?: number;
  createdAt: number;
  updatedAt: number;
}

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

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  controlCount: number;
  createdAt: number;
  updatedAt: number;
}
