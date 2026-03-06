import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LSEGlingAvatar from '../components/LSEGlingAvatar';
import GradientText from '../components/GradientText';
import PolicyModal from '../components/PolicyModal';
import { determineAvatarStates } from '../utils/avatarStateMapper';
import { useNotifications } from '../contexts/NotificationContext';

export default function Dashboard() {
  const navigate = useNavigate();
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
    <div className="min-h-screen p-8 fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            <GradientText>CompliQuest</GradientText>
          </h1>
          <p className="text-[var(--duo-text-secondary)] text-lg font-medium">Compliance has never been this cute.</p>
        </div>

        {/* Alert Section */}
        {urgentAlerts.length > 0 ? (
          <div className="duo-card bounce-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-4">
                🚨 Your LSEGling needs help! ({urgentAlerts.length} {urgentAlerts.length === 1 ? 'issue' : 'issues'})
              </h2>
              <div className="flex justify-center mb-6">
                <LSEGlingAvatar
                  states={duckStates}
                  size="large"
                  speechBubble={duckStates.length === 1 ? getSpeechBubbleMessage() : undefined}
                />
              </div>
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
        ) : (
          <div className="duo-card bounce-in">
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

      {/* Policy Modal */}
      <PolicyModal
        policyId={selectedPolicyId}
        isOpen={isPolicyModalOpen}
        onClose={closePolicyModal}
      />
    </div>
  );
}
