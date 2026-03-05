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

export interface ControlResponseCreateInput {
  projectId: string;
  controlId: string;
  frameworkId: string;
  userResponse?: string;
  evidenceIds?: string[];
}

export interface ControlResponseUpdateInput {
  userResponse?: string;
  status?: 'compliant' | 'non_compliant' | 'in_progress' | 'not_started';
  evidenceIds?: string[];
  validationErrors?: string[];
}

export interface ControlResponseDTO {
  id: string;
  projectId: string;
  controlId: string;
  frameworkId: string;
  userResponse?: string;
  status: string;
  evidenceIds?: string[];
  aiGuidance?: string;
  validationErrors?: string[];
  submittedAt?: number;
  createdAt: number;
  updatedAt: number;
}
