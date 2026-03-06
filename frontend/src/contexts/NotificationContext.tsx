import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

interface Project {
  id: string;
  name: string;
  framework: string;
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
}

interface NotificationContextType {
  alerts: Alert[];
  projects: Project[];
  setAlerts: (alerts: Alert[]) => void;
  setProjects: (projects: Project[]) => void;
  refreshData: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchData = () => {
    // Check compliance status from localStorage
    const hungryCompliant = localStorage.getItem('hungry-compliant') === 'true';
    const wetCompliant = localStorage.getItem('wet-compliant') === 'true';
    const tiredCompliant = localStorage.getItem('tired-compliant') === 'true';
    const thirstyCompliant = localStorage.getItem('thirsty-compliant') === 'true';

    // Mock alerts representing policy compliance issues - only show non-compliant
    const mockAlerts: Alert[] = [];

    if (!hungryCompliant) {
      const wasAttempted = localStorage.getItem('hungry-compliant') === 'false';
      mockAlerts.push({
        id: 'policy-1',
        title: 'Malnutrition',
        message: wasAttempted
          ? '❌ Previous answer was incorrect. Please try again.'
          : 'Food policy not compliant',
        severity: 'high',
        status: 'active',
      });
    }

    if (!wetCompliant) {
      const wasAttempted = localStorage.getItem('wet-compliant') === 'false';
      mockAlerts.push({
        id: 'policy-2',
        title: 'Need shelter',
        message: wasAttempted
          ? '❌ Previous answer was incorrect. Please try again.'
          : 'Shelter policy not compliant',
        severity: 'high',
        status: 'active',
      });
    }

    if (!tiredCompliant) {
      const wasAttempted = localStorage.getItem('tired-compliant') === 'false';
      mockAlerts.push({
        id: 'policy-3',
        title: 'Need sleep',
        message: wasAttempted
          ? '❌ Previous answer was incorrect. Please try again.'
          : 'Sleep policy not compliant',
        severity: 'high',
        status: 'active',
      });
    }

    if (!thirstyCompliant) {
      const wasAttempted = localStorage.getItem('thirsty-compliant') === 'false';
      mockAlerts.push({
        id: 'policy-4',
        title: 'Need water',
        message: wasAttempted
          ? '❌ Previous answer was incorrect. Please try again.'
          : 'Water policy not compliant',
        severity: 'high',
        status: 'active',
      });
    }

    const mockProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'GDPR Compliance Challenge',
        framework: 'GDPR',
        complianceScore: 45,
        totalControls: 10,
        compliantControls: 4,
        nonCompliantControls: 6,
      },
      {
        id: 'proj-2',
        name: 'HIPAA Security Challenge',
        framework: 'HIPAA',
        complianceScore: 60,
        totalControls: 10,
        compliantControls: 6,
        nonCompliantControls: 4,
      },
    ];

    setAlerts(mockAlerts);
    setProjects(mockProjects);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return (
    <NotificationContext.Provider value={{ alerts, projects, setAlerts, setProjects, refreshData }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
