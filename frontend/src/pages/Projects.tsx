import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LSEGlingAvatar } from '../components/LSEGlingAvatar';
import { useNotifications } from '../contexts/NotificationContext';

export default function Projects() {
  const { projects, alerts } = useNotifications();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // All projects are completed (all questions answered)
  // We show them all in the completed section with their compliance status
  const completedProjects = projects;
  const ongoingProjects: typeof projects = []; // No ongoing projects in this demo

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
          <>
            {/* Ongoing Projects Section */}
            {ongoingProjects.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">
                  📝 Ongoing Challenges ({ongoingProjects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ongoingProjects.map((project) => {
                    const questionsAnswered = project.compliantControls + project.nonCompliantControls;
                    const questionsRemaining = project.totalControls - questionsAnswered;
                    
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
                              <div className="duo-badge-orange text-xs">
                                <span>⏳</span>
                                <span>In Progress</span>
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
                            <span className="text-2xl font-bold text-[var(--duo-primary)]">{Math.round((questionsAnswered / project.totalControls) * 100)}%</span>
                          </div>
                          <div className="duo-progress-bar">
                            <div
                              className="duo-progress-fill"
                              style={{ width: `${(questionsAnswered / project.totalControls) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-[var(--duo-text-secondary)] mt-2 font-medium">
                            {questionsAnswered}/{project.totalControls} questions answered • {questionsRemaining} remaining
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Link
                            to={`/projects/${project.id}/questionnaire`}
                            className="block w-full duo-button-primary text-center no-underline"
                          >
                            🎮 Continue Challenge
                          </Link>
                          <div className="text-center">
                            <p className="text-xs text-[var(--duo-text-secondary)] font-medium">
                              Assigned Policy Question Set
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Projects Section */}
            {completedProjects.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">
                  ✅ Completed Challenges ({completedProjects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedProjects.map((project) => {
                    const hasNonCompliantIssues = project.nonCompliantControls > 0;
                    
                    return (
                      <div
                        key={project.id}
                        className={`duo-card ${hasNonCompliantIssues ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
                        onClick={hasNonCompliantIssues ? () => window.location.href = `/projects/${project.id}/questionnaire` : undefined}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[var(--duo-text-primary)] mb-2">{project.name}</h3>
                            <div className="flex items-center gap-3">
                              <div className="duo-badge-blue text-xs">
                                <span>📋</span>
                                <span>{project.framework}</span>
                              </div>
                              <div className={`text-xs font-bold flex items-center gap-1 ${
                                hasNonCompliantIssues ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                <span>{hasNonCompliantIssues ? '⚠️' : '✅'}</span>
                                <span>{hasNonCompliantIssues ? 'Has Issues' : 'Completed'}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-4xl">
                            {hasNonCompliantIssues ? '⚠️' : '✅'}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-[var(--duo-text-secondary)]">Compliance Status</span>
                            <span className={`text-2xl font-bold ${
                              project.complianceScore === 100 
                                ? 'text-green-600' 
                                : 'text-orange-600'
                            }`}>
                              {project.complianceScore}%
                            </span>
                          </div>
                          <div className="duo-progress-bar">
                            <div
                              className={`duo-progress-fill ${
                                project.complianceScore === 100 ? 'bg-green-500' : ''
                              }`}
                              style={{ width: `${project.complianceScore}%` }}
                            />
                          </div>
                          <p className="text-xs text-[var(--duo-text-secondary)] mt-2 font-medium">
                            {project.compliantControls}/{project.totalControls} policy requirements met
                          </p>
                        </div>

                        <div className={`mb-4 p-3 rounded-lg border ${
                          project.complianceScore === 100 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-orange-50 border-orange-200'
                        }`}>
                          <p className={`text-xs font-bold mb-1 ${
                            project.complianceScore === 100 ? 'text-green-900' : 'text-orange-900'
                          }`}>
                            Regulatory Compliance Results:
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-700 font-medium">✓ {project.compliantControls} Compliant</span>
                            {hasNonCompliantIssues && (
                              <span className="text-red-700 font-bold">✗ {project.nonCompliantControls} Non-Compliant</span>
                            )}
                          </div>
                        </div>

                        {hasNonCompliantIssues ? (
                          <>
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-xs text-red-800 font-bold text-center">
                                ⚠️ Non-compliant issues are affecting your LSEGling's health
                              </p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/', { state: { scrollToGaps: true } });
                              }}
                              disabled={alerts.length === 0}
                              className={`w-full duo-button-primary ${
                                alerts.length === 0 
                                  ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                                  : 'bg-orange-600 hover:bg-orange-700'
                              }`}
                            >
                              {alerts.length === 0 ? '✅ All Gaps Resolved' : '🔧 Resolve Compliance Issues'}
                            </button>
                          </>
                        ) : (
                          <div className="w-full p-3 bg-green-100 border-2 border-green-500 rounded-xl text-center">
                            <p className="text-sm font-bold text-green-800">
                              ✅ All Requirements Met
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
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