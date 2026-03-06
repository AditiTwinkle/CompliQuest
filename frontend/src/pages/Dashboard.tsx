import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LSEGlingAvatar from '../components/LSEGlingAvatar';
import { determineAvatarStates } from '../utils/avatarStateMapper';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDemoReset = () => {
    // Reset all policy compliance states to non-compliant
    localStorage.removeItem('hungry-compliant');
    localStorage.removeItem('wet-compliant');
    localStorage.removeItem('tired-compliant');
    localStorage.removeItem('thirsty-compliant');

    // Reload the data to show all policies again
    fetchData();
  };

  const fetchData = async () => {
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
    setLoading(false);
  };

  const urgentAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high');

  // Determine duck states based on alerts (supports multiple states)
  const duckStates = determineAvatarStates(alerts);
  const primaryState = duckStates[0] || 'happy';

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
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold text-[var(--duo-text-primary)] flex-1">
              🎮 CompliQuest
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleDemoReset}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all"
                title="Reset all policies to non-compliant for demo purposes"
              >
                🔄 Demo Reset
              </button>
            </div>
          </div>
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
              {urgentAlerts.map((alert) => {
                const policyNumber = alert.id.split('-')[1];
                const icons = ['🍔', '🏠', '😴', '💧'];
                const iconIndex = parseInt(policyNumber) - 1;

                return (
                  <div key={alert.id} className="duo-error-box flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{icons[iconIndex] || '⚠️'}</span>
                      <div>
                        <p className="font-bold text-[var(--duo-text-primary)]">Policy {policyNumber}: {alert.title}</p>
                        <p className="text-sm text-[var(--duo-text-secondary)]">{alert.message}</p>
                      </div>
                    </div>
                    <Link
                      to={`/policy/${policyNumber}`}
                      className="duo-button-primary text-sm inline-block no-underline"
                      style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                      Fix Now
                    </Link>
                  </div>
                );
              })}
            </div>
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
