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

    // Mock projects with dynamic compliance based on resolved gaps
    // Each project has exactly 1 gap that can be resolved
    
    // GDPR has 10 controls: 9 baseline compliant + 1 gap (hungry)
    const gdprTotalCompliant = hungryCompliant ? 10 : 9;
    const gdprTotalNonCompliant = hungryCompliant ? 0 : 1;

    // HIPAA has 10 controls: 9 baseline compliant + 1 gap (wet)
    const hipaaTotalCompliant = wetCompliant ? 10 : 9;
    const hipaaTotalNonCompliant = wetCompliant ? 0 : 1;

    // SOC 2 has 8 controls: 7 baseline compliant + 1 gap (tired)
    const soc2TotalCompliant = tiredCompliant ? 8 : 7;
    const soc2TotalNonCompliant = tiredCompliant ? 0 : 1;

    // ISO 27001 has 12 controls: 11 baseline compliant + 1 gap (thirsty)
    const isoTotalCompliant = thirstyCompliant ? 12 : 11;
    const isoTotalNonCompliant = thirstyCompliant ? 0 : 1;

    const mockProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'GDPR Compliance Challenge',
        framework: 'GDPR',
        complianceScore: Math.round((gdprTotalCompliant / 10) * 100),
        totalControls: 10,
        compliantControls: gdprTotalCompliant,
        nonCompliantControls: gdprTotalNonCompliant,
      },
      {
        id: 'proj-2',
        name: 'HIPAA Security Challenge',
        framework: 'HIPAA',
        complianceScore: Math.round((hipaaTotalCompliant / 10) * 100),
        totalControls: 10,
        compliantControls: hipaaTotalCompliant,
        nonCompliantControls: hipaaTotalNonCompliant,
      },
      {
        id: 'proj-3',
        name: 'SOC 2 Compliance Challenge',
        framework: 'SOC 2',
        complianceScore: Math.round((soc2TotalCompliant / 8) * 100),
        totalControls: 8,
        compliantControls: soc2TotalCompliant,
        nonCompliantControls: soc2TotalNonCompliant,
      },
      {
        id: 'proj-4',
        name: 'ISO 27001 Challenge',
        framework: 'ISO 27001',
        complianceScore: Math.round((isoTotalCompliant / 12) * 100),
        totalControls: 12,
        compliantControls: isoTotalCompliant,
        nonCompliantControls: isoTotalNonCompliant,
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
