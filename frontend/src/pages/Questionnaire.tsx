import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LSEGlingAvatar } from '../components/LSEGlingAvatar';

const ANSWER_OPTIONS = [
  'Explicit consent is obtained via a pre-processing opt-in mechanism',
  'Consent is captured through a layered notice framework',
  'Consent is inferred from platform sign-up',
  'Other',
];

export const Questionnaire: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress] = useState(30);

  const handleSubmitResponse = async () => {
    if (!selectedAnswer) return;

    setIsSubmitting(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedAnswer('');
      setIsSubmitting(false);
    }, 2000);
  };

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-bold">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="duo-progress-bar h-4">
            <div className="duo-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <div className="mb-8 duo-success-box text-center bounce-in">
            <div className="text-6xl mb-4 pulse-glow">✅</div>
            <p className="text-2xl font-bold text-[var(--duo-primary)] mb-2">Correct!</p>
            <p className="text-[var(--duo-text-secondary)] font-medium">Your LSEGling was given shelter 🏠</p>
          </div>
        )}

        {/* Question Section */}
        {!showSuccess && (
          <>
            {/* LSEGling Character */}
            <div className="mb-8 flex justify-center">
              <LSEGlingAvatar state="happy" size="large" />
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="duo-badge-blue mb-4 inline-block">
                <span>📚</span>
                <span>SECTION 4, UNIT 4</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--duo-text-primary)] mb-6">
                How does the AI system ensure that user consent is obtained and recorded?
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {ANSWER_OPTIONS.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 rounded-xl font-bold text-left transition-all duration-200 border-2 ${selectedAnswer === option
                      ? 'bg-[var(--duo-secondary)] text-white border-[var(--duo-secondary)] shadow-lg transform scale-105'
                      : 'bg-white text-[var(--duo-text-primary)] border-[var(--duo-border)] hover:bg-[var(--duo-surface)]'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {selectedAnswer && (
                <button
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting}
                  className="w-full duo-button-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Checking...' : 'Check Answer'}
                </button>
              )}

              <button
                onClick={() => navigate('/projects')}
                className="w-full duo-button-outline"
              >
                Skip
              </button>
            </div>
          </>
        )}

        {/* Show Continue Button After Success */}
        {showSuccess && (
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowSuccess(false);
                setSelectedAnswer('');
              }}
              className="w-full duo-button-primary"
            >
              Continue
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="w-full duo-button-outline"
            >
              Back to Projects
            </button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="text-center">
            <div className="duo-badge-pink mb-2">
              <span>❤️</span>
              <span>5</span>
            </div>
            <p className="text-xs text-[var(--duo-text-secondary)] font-bold">Lives</p>
          </div>
          <div className="text-center">
            <div className="duo-badge-yellow mb-2">
              <span>⚡</span>
              <span>+15</span>
            </div>
            <p className="text-xs text-[var(--duo-text-secondary)] font-bold">Energy</p>
          </div>
          <div className="text-center">
            <div className="duo-badge-blue mb-2">
              <span>💎</span>
              <span>500</span>
            </div>
            <p className="text-xs text-[var(--duo-text-secondary)] font-bold">Gems</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
