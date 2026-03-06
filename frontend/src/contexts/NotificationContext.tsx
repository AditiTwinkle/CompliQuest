import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

interface PolicyConfig {
  id: string;
  title: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  complianceProperty: string;
  icon: string;
  successMessage: string;
  severity?: string;
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
  policies: PolicyConfig[];
  setAlerts: (alerts: Alert[]) => void;
  setProjects: (projects: Project[]) => void;
  setPolicies: (policies: PolicyConfig[]) => void;
  refreshData: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [policies, setPolicies] = useState<PolicyConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from regulatory compliance agent
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const organizationId = 'org-demo-bank-001'; // Demo organization
      
      try {
        const response = await fetch(`${apiUrl}/compliance-agent/analyze/${organizationId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Use agent-generated alerts and policies
          setAlerts(data.alerts || []);
          setPolicies(data.policies || []);
          
          // Keep mock projects for now
          const mockProjects: Project[] = [
            {
              id: 'proj-1',
              name: 'DORA Compliance Challenge',
              framework: 'DORA',
              complianceScore: data.metadata?.compliance?.overallPercentage || 0,
              totalControls: 10,
              compliantControls: Math.round((data.metadata?.compliance?.overallPercentage || 0) / 10),
              nonCompliantControls: 10 - Math.round((data.metadata?.compliance?.overallPercentage || 0) / 10),
            },
          ];
          setProjects(mockProjects);
          setLoading(false);
          return;
        }
      } catch (agentError) {
        console.warn('Failed to fetch from compliance agent, falling back to localStorage:', agentError);
      }
      
      // Fallback to localStorage-based alerts
      const hungryCompliant = localStorage.getItem('hungry-compliant') === 'true';
      const wetCompliant = localStorage.getItem('wet-compliant') === 'true';
      const tiredCompliant = localStorage.getItem('tired-compliant') === 'true';
      const thirstyCompliant = localStorage.getItem('thirsty-compliant') === 'true';

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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return (
    <NotificationContext.Provider value={{ alerts, projects, policies, setAlerts, setProjects, setPolicies, refreshData }}>
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
