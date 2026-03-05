export interface Evidence {
  id: string;
  controlId: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  s3Key: string;
  uploadedBy: string;
  uploadedAt: number;
  description?: string;
}

export interface EvidenceCreateInput {
  controlId: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  s3Key: string;
  uploadedBy: string;
  description?: string;
}

export interface EvidenceResponse {
  id: string;
  controlId: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  s3Key: string;
  uploadedBy: string;
  uploadedAt: number;
  description?: string;
}
