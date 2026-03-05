export interface Achievement {
  id: string;
  userId: string;
  projectId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: number;
}

export interface AchievementCreateInput {
  userId: string;
  projectId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
}

export interface AchievementResponse {
  id: string;
  userId: string;
  projectId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: number;
}
