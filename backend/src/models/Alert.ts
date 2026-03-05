export interface Alert {
  id: string;
  organizationId: string;
  userId?: string;
  type: 'compliance_gap' | 'non_compliant' | 'urgent_task' | 'milestone';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  relatedControlId?: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: number;
  updatedAt: number;
}

export interface AlertCreateInput {
  organizationId: string;
  userId?: string;
  type: 'compliance_gap' | 'non_compliant' | 'urgent_task' | 'milestone';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  relatedControlId?: string;
}

export interface AlertResponse {
  id: string;
  organizationId: string;
  userId?: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  relatedControlId?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}
