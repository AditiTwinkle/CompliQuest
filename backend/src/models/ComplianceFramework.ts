export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  controlCount: number;
  createdAt: number;
  updatedAt: number;
}

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

export interface FrameworkResponse {
  id: string;
  name: string;
  description: string;
  version: string;
  controlCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface ControlResponse {
  id: string;
  frameworkId: string;
  controlId: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  createdAt: number;
  updatedAt: number;
}
