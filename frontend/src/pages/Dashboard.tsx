import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LSEGlingAvatar from '../components/LSEGlingAvatar';
import { determineAvatarStates } from '../utils/avatarStateMapper';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: string;
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock alerts - these simulate non-compliant questions
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        title: 'Malnutrition',
        message: 'Missing food resources - Click "Resolve" to mark as compliant',
        severity: 'high',
        status: 'active',
      },
      {
        id: 'alert-2',
        title: 'Shelter',
        message: 'Missing shelter resources - Click "Resolve" to mark as compliant',
        severity: 'high',
        status: 'active',
      },
      {
        id: 'alert-3',
        title: 'Water Access',
        message: 'Missing water resources - Click "Resolve" to mark as compliant',
        severity: 'medium',
        status: 'active',
      },
      {
        id: 'alert-4',
        title: 'Fatigue',
        message: 'Workload too high - Click "Resolve" to mark as compliant',
        severity: 'medium',
        status: 'active',
      },
    ];

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
    setLoading(false);
  };

  // Handle resolving an alert (marking question as compliant)
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' }
          : alert
      )
    );
  };

  // Get only active (non-resolved) alerts
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const urgentAlerts = activeAlerts.filter((a) => a.severity === 'critical' || a.severity === 'high');
  
  // Determine duck states based on active alerts (supports multiple states)
  const duckStates = determineAvatarStates(activeAlerts);
  const primaryState = duckStates[0] || 'happy';

  // Get icon for alert type
  const getAlertIcon = (title: string) => {
    if (title.toLowerCase().includes('malnutrition') || title.toLowerCase().includes('food')) return '🍔';
    if (title.toLowerCase().includes('shelter') || title.toLowerCase().includes('housing')) return '🏠';
    if (title.toLowerCase().includes('water') || title.toLowerCase().includes('thirst')) return '💧';
    if (title.toLowerCase().includes('fatigue') || title.toLowerCase().includes('tired')) return '😴';
    return '⚠️';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="duo-card">
          <p className="text-[var(--duo-text-secondary)] text-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--duo-text-primary)] mb-2">
            🎮 CompliQuest
          </h1>
          <p className="text-[var(--duo-text-secondary)] text-lg font-medium">Complete challenges to protect your community!</p>
        </div>

        {/* Alert Section */}
        {urgentAlerts.length > 0 ? (
          <div className="duo-card bounce-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">
                🚨 Your LSEGling needs help!
              </h2>
              <div className="flex justify-center mb-6">
                <LSEGlingAvatar states={duckStates} size="large" />
              </div>
              <p className="text-[var(--duo-text-secondary)] font-medium mb-4">
                {primaryState === 'hungry' && '🍔 Dilly is hungry! Help provide food resources.'}
                {primaryState === 'wet' && '🏠 Dilly needs shelter! Help find housing.'}
                {primaryState === 'thirsty' && '💧 Dilly is thirsty! Help provide water access.'}
                {primaryState === 'tired' && '😴 Dilly is tired! Help reduce workload.'}
                {duckStates.length > 1 && ` (${duckStates.length} issues need attention)`}
              </p>
            </div>

            <div className="space-y-3">
              {urgentAlerts.map((alert) => (
                <div key={alert.id} className="duo-error-box flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getAlertIcon(alert.title)}</span>
                    <div>
                      <p className="font-bold text-[var(--duo-text-primary)]">{alert.title}</p>
                      <p className="text-sm text-[var(--duo-text-secondary)]">{alert.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="duo-button-primary text-sm"
                  >
                    Resolve ✓
                  </button>
                </div>
              ))}
            </div>

            {/* Show resolved count */}
            {alerts.filter(a => a.status === 'resolved').length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium text-center">
                  ✅ {alerts.filter(a => a.status === 'resolved').length} issue(s) resolved! 
                  {activeAlerts.length === 0 && ' Dilly is happy now! 🎉'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="duo-card bounce-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">
                ✨ Everything looks great!
              </h2>
              <div className="flex justify-center mb-4">
                <LSEGlingAvatar state="happy" size="large" />
              </div>
              <p className="text-[var(--duo-text-secondary)] font-medium">
                😊 Dilly is happy! All compliance requirements are being met.
              </p>
              {alerts.filter(a => a.status === 'resolved').length > 0 && (
                <p className="text-sm text-green-600 font-medium mt-2">
                  You resolved {alerts.filter(a => a.status === 'resolved').length} issue(s)!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">Your Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="duo-card cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}/questionnaire`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--duo-text-primary)]">{project.name}</h3>
                      <p className="text-sm text-[var(--duo-text-secondary)] font-medium">{project.framework} Framework</p>
                    </div>
                    <span className="text-4xl">🎯</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-[var(--duo-text-secondary)]">Progress</span>
                      <span className="text-xl font-bold text-[var(--duo-primary)]">{project.complianceScore}%</span>
                    </div>
                    <div className="duo-progress-bar">
                      <div
                        className="duo-progress-fill"
                        style={{ width: `${project.complianceScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--duo-text-secondary)] mt-2 font-medium">
                      {project.compliantControls}/{project.totalControls} controls completed
                    </p>
                  </div>

                  <button className="w-full duo-button-primary">
                    Continue Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievement Section */}
        <div className="duo-success-box text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-[var(--duo-text-primary)] mb-2">
            Keep up the great work!
          </h3>
          <p className="text-[var(--duo-text-secondary)] font-medium">
            You're on a 12-day streak! Complete today's challenge to keep it going.
          </p>
        </div>
      </div>
    </div>
  );
}
