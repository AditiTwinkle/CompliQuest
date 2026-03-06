import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LSEGlingAvatar } from '../components/LSEGlingAvatar';
import { useNotifications } from '../contexts/NotificationContext';

export default function Projects() {
  const { projects, alerts } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="duo-card">
          <p className="text-[var(--duo-text-secondary)] text-lg font-bold">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--duo-text-primary)] mb-2">
            🎯 Your Assigned Challenges
          </h1>
          <p className="text-lg text-[var(--duo-text-secondary)] font-medium">
            These compliance challenges have been assigned to you based on your role and responsibilities.
          </p>
          <p className="text-sm text-[var(--duo-text-secondary)] font-medium mt-2">
            Complete policy question sets to resolve issues and keep your LSEGling happy!
          </p>
        </div>

        {/* Current Status */}
        {alerts.length > 0 && (
          <div className="duo-error-box mb-8 text-center">
            <h3 className="text-lg font-bold text-red-700 mb-2">
              🚨 {alerts.length} Policy Issues Require Your Attention
            </h3>
            <p className="text-red-600 font-medium">
              Your assigned challenges below contain the policy questions needed to resolve these compliance issues.
            </p>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-20 duo-card max-w-md mx-auto">
            <div className="mb-8">
              <LSEGlingAvatar state="happy" size="large" />
            </div>
            <h3 className="text-xl font-bold text-[var(--duo-text-primary)] mb-4">No challenges assigned yet!</h3>
            <p className="text-[var(--duo-text-secondary)] mb-6 font-medium">
              Your compliance challenges will appear here when assigned by your organization.
            </p>
            <div className="text-sm text-[var(--duo-text-secondary)] font-medium">
              Contact your compliance administrator if you believe you should have assigned challenges.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const isCompleted = project.complianceScore === 100;
              const statusColor = isCompleted ? 'text-green-600' : 'text-orange-600';
              const statusIcon = isCompleted ? '✅' : '⏳';
              const statusText = isCompleted ? 'Completed' : 'In Progress';

              return (
                <div key={project.id} className="duo-card group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[var(--duo-text-primary)] mb-2">{project.name}</h3>
                      <div className="flex items-center gap-3">
                        <div className="duo-badge-blue text-xs">
                          <span>📋</span>
                          <span>{project.framework}</span>
                        </div>
                        <div className={`text-xs font-bold ${statusColor} flex items-center gap-1`}>
                          <span>{statusIcon}</span>
                          <span>{statusText}</span>
                        </div>
                        <div className="duo-badge-purple text-xs">
                          <span>👤</span>
                          <span>Assigned</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-4xl group-hover:scale-110 transition-transform">🎯</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-[var(--duo-text-secondary)]">Progress</span>
                      <span className="text-2xl font-bold text-[var(--duo-primary)]">{project.complianceScore}%</span>
                    </div>
                    <div className="duo-progress-bar">
                      <div
                        className="duo-progress-fill"
                        style={{ width: `${project.complianceScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--duo-text-secondary)] mt-2 font-medium">
                      {project.compliantControls}/{project.totalControls} policy questions completed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/projects/${project.id}/questionnaire`}
                      className="block w-full duo-button-primary text-center no-underline"
                    >
                      {isCompleted ? '🎉 Review Challenge' : '🎮 Continue Challenge'}
                    </Link>
                    <div className="text-center">
                      <p className="text-xs text-[var(--duo-text-secondary)] font-medium">
                        Assigned Policy Question Set • {project.nonCompliantControls} issues remaining
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 duo-card bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-bold text-[var(--duo-text-primary)] mb-2">
              💡 About Your Assigned Challenges
            </h3>
            <p className="text-sm text-[var(--duo-text-secondary)] font-medium">
              These challenges are specifically assigned to you based on your role and organizational requirements. 
              Each contains policy questions that must be completed to maintain compliance and keep your LSEGling healthy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}