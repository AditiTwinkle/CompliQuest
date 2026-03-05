export interface Notification {
  id: string;
  userId: string;
  type: 'compliance_gap' | 'non_compliant' | 'urgent_task' | 'milestone' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  readAt?: number;
}

export interface NotificationCreateInput {
  userId: string;
  type: 'compliance_gap' | 'non_compliant' | 'urgent_task' | 'milestone' | 'achievement';
  title: string;
  message: string;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  readAt?: number;
}
