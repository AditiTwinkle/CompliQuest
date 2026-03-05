export interface ComplianceGap {
  id: string;
  projectId: string;
  controlId: string;
  frameworkId: string;
  gapType: 'missing_control' | 'incomplete_implementation' | 'non_compliant' | 'expired_evidence';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediationSteps: string[];
  estimatedEffort?: string;
  targetDate?: number;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  createdAt: number;
  updatedAt: number;
}

export interface GapCreateInput {
  projectId: string;
  controlId: string;
  frameworkId: string;
  gapType: 'missing_control' | 'incomplete_implementation' | 'non_compliant' | 'expired_evidence';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediationSteps: string[];
  estimatedEffort?: string;
}

export interface GapUpdateInput {
  status?: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  description?: string;
  remediationSteps?: string[];
  targetDate?: number;
}

export interface GapDTO {
  id: string;
  projectId: string;
  controlId: string;
  frameworkId: string;
  gapType: string;
  severity: string;
  description: string;
  remediationSteps: string[];
  estimatedEffort?: string;
  targetDate?: number;
  status: string;
  createdAt: number;
  updatedAt: number;
}
