import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LSEGlingAvatar from '../components/LSEGlingAvatar';
import GradientText from '../components/GradientText';
import PolicyModal from '../components/PolicyModal';
import { determineAvatarStates } from '../utils/avatarStateMapper';
import { useNotifications } from '../contexts/NotificationContext';
import { InteractiveGridPattern } from '@/registry/magicui/interactive-grid-pattern';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const gapsRef = useRef<HTMLDivElement>(null);
  const { alerts, projects } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const openPolicyModal = (policyId: string) => {
    setSelectedPolicyId(policyId);
    setIsPolicyModalOpen(true);
  };

  const closePolicyModal = () => {
    setIsPolicyModalOpen(false);
    setSelectedPolicyId(null);
  };

  useEffect(() => {
    // Data is already loaded from context
    setLoading(false);
  }, []);

  // Scroll to gaps section if navigated from Projects page
  useEffect(() => {
    if (location.state?.scrollToGaps && gapsRef.current) {
      setTimeout(() => {
        gapsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  const urgentAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high');

  // Determine duck states based on alerts (supports multiple states)
  const duckStates = determineAvatarStates(alerts);
  const primaryState = duckStates[0] || 'happy';

  // Get speech bubble message based on state
  const getSpeechBubbleMessage = () => {
    if (duckStates.length === 0 || primaryState === 'happy') {
      return "I'm so happy! 😊";
    }

    const messages: { [key: string]: string } = {
      hungry: "I'm hungry! 🍔",
      wet: "Need shelter! 🏠",
      thirsty: "I'm thirsty! 💧",
      tired: "So tired! 😴",
    };
    return messages[primaryState] || "Help!";
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
    <div className="relative min-h-screen p-8 fade-in overflow-hidden">
      <InteractiveGridPattern
        width={20}
        height={20}
        squares={[200, 200]}
        squaresClassName="fill-gray-200/10"
      />
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            <GradientText>CompliQuest</GradientText>
          </h1>
          <p className="text-[var(--duo-text-secondary)] text-lg font-medium">Compliance has never been this cute.</p>
        </div>

        {/* Alert Section */}
        {urgentAlerts.length > 0 ? (
          <>
            <div className="duo-card">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <LSEGlingAvatar
                    states={duckStates}
                    size="large"
                    speechBubble={duckStates.length === 1 ? getSpeechBubbleMessage() : undefined}
                  />
                </div>
                <h2 className="text-2xl font-bold text-[var(--duo-text-primary)]">
                  Your LSEGling needs help! ({urgentAlerts.length} {urgentAlerts.length === 1 ? 'issue' : 'issues'})
                </h2>
              </div>
            </div>

            {/* Policies Section */}
            <div ref={gapsRef} className="bg-white rounded-2xl border-2 border-[var(--duo-border)] p-6 space-y-4">
              <h3 className="text-xl font-bold text-[var(--duo-text-primary)]">
                CompliQuest found {urgentAlerts.length} gaps unaddressed for the new regulation
              </h3>
              <div className="space-y-3">
                {urgentAlerts.map((alert) => {
                  const policyNumber = alert.id.split('-')[1];
                  const icons = ['🍔', '🏠', '😴', '💧'];
                  const iconIndex = parseInt(policyNumber) - 1;

                  return (
                    <div key={alert.id} className="duo-error-box flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl">{icons[iconIndex] || '⚠️'}</span>
                        <div>
                          <p className="font-bold text-[var(--duo-text-primary)]">Policy {policyNumber}: {alert.title}</p>
                          <p className="text-sm text-[var(--duo-text-secondary)]">{alert.message}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openPolicyModal(policyNumber)}
                        className="duo-button-primary text-sm"
                        style={{ textDecoration: 'none' }}
                      >
                        Fix Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="duo-card">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">
                ✨ Everything looks great!
              </h2>
              <div className="flex justify-center mb-4">
                <LSEGlingAvatar
                  state="happy"
                  size="large"
                  speechBubble="I'm so happy! 😊"
                />
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">Completed Project Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => {
                const hasNonCompliantIssues = project.nonCompliantControls > 0;

                return (
                  <div
                    key={project.id}
                    className={`duo-card ${hasNonCompliantIssues ? 'cursor-pointer' : ''}`}
                    onClick={hasNonCompliantIssues ? () => navigate(`/projects/${project.id}/questionnaire`) : undefined}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[var(--duo-text-primary)]">{project.name}</h3>
                        <p className="text-sm text-[var(--duo-text-secondary)] font-medium">{project.framework} Regulatory Framework</p>
                      </div>
                      <span className="text-4xl">
                        {project.complianceScore === 100 ? '✅' : '⚠️'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-[var(--duo-text-secondary)]">Compliance Status</span>
                        <span className={`text-xl font-bold ${project.complianceScore === 100
                            ? 'text-green-600'
                            : 'text-orange-600'
                          }`}>
                          {project.complianceScore}%
                        </span>
                      </div>
                      <div className="duo-progress-bar">
                        <div
                          className={`duo-progress-fill ${project.complianceScore === 100 ? 'bg-green-500' : ''
                            }`}
                          style={{ width: `${project.complianceScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-[var(--duo-text-secondary)] mt-2 font-medium">
                        {project.compliantControls}/{project.totalControls} policy requirements met
                      </p>
                    </div>

                    <div className={`mb-4 p-3 rounded-lg border ${project.complianceScore === 100
                        ? 'bg-green-50 border-green-200'
                        : 'bg-orange-50 border-orange-200'
                      }`}>
                      <p className={`text-xs font-bold mb-1 ${project.complianceScore === 100 ? 'text-green-900' : 'text-orange-900'
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
                          disabled={urgentAlerts.length === 0}
                          className={`w-full duo-button-primary ${urgentAlerts.length === 0
                              ? 'bg-gray-400 cursor-not-allowed opacity-60'
                              : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                        >
                          {urgentAlerts.length === 0 ? '✅ All Gaps Resolved' : '🔧 Resolve Compliance Issues'}
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

        {/* Achievement Section */}
        <div className="duo-success-box text-center">
          <div className="text-4xl sm:text-6xl mb-4">🏆</div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--duo-text-primary)] mb-2">
            Keep up the good work! Your LSEGling is happy and doing well.
          </h3>
          <p className="text-sm sm:text-base text-[var(--duo-text-secondary)] font-medium mb-3">
            Complete your challenges to keep your LSEGling happy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-xs sm:text-sm text-[var(--duo-text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="font-medium">12 days logged in</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="font-medium">{4 - urgentAlerts.length} issues resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      <PolicyModal
        policyId={selectedPolicyId}
        isOpen={isPolicyModalOpen}
        onClose={closePolicyModal}
      />
    </div>
  );
}
