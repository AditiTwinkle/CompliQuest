import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LSEGlingAvatar } from '../components/LSEGlingAvatar';

interface Progress {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  compliant: number;
  nonCompliant: number;
  complianceScore: number;
}

const ANSWER_OPTIONS = [
  'Explicit consent is obtained via a pre-processing opt-in mechanism, with records retained in a tamper-proof audit trail',
  'Consent is captured through a layered notice framework, logged with timestamp and user ID, and is freely withdrawable — meeting EU AI Act data governance requirements.',
  'Consent is inferred from platform sign-up. No separate consent record is maintained for sensitive data processing.',
  'Other',
];

const mockProgress: Progress = {
  total: 10,
  completed: 3,
  inProgress: 2,
  notStarted: 5,
  compliant: 2,
  nonCompliant: 1,
  complianceScore: 30,
};

export const Questionnaire: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [evidence, setEvidence] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    if (!selectedAnswer) return;

    setIsSubmitting(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedAnswer('');
      setEvidence('');
      setIsSubmitting(false);
    }, 1500);
  };

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* LSEGling Character */}
        <div className="mb-8 flex justify-center">
          <div className="scale-150">
            <LSEGlingAvatar state="happy" />
          </div>
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <div className="mb-6 p-6 bg-green-50 border-4 border-green-500 rounded-lg text-center animate-pulse">
            <p className="text-3xl font-bold text-green-600">✅ Great! Your answer is complete!</p>
            <p className="text-green-700 mt-2 text-lg">Your LSEGling was given shelter 🏠</p>
          </div>
        )}

        {/* Top Section - Category, Food, Regulation Info */}
        <div className="mb-8 bg-white rounded-lg p-6 border-2 border-gray-300">
          <div className="flex items-center justify-between gap-6">
            {/* Food Icon */}
            <div className="flex-shrink-0">
              <div className="text-6xl">🍔</div>
            </div>

            {/* Category & Action */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Data Management & Compliance</h2>
              <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700">
                +1 Food
              </button>
            </div>

            {/* Regulation Info Panel */}
            <div className="bg-pink-500 text-white rounded-lg p-4 text-center min-w-max">
              <p className="font-bold text-sm">What regulation is this for?</p>
              <p className="text-xs mt-2 text-pink-100">(open side panel)</p>
              <p className="text-lg font-bold mt-3">GDPR</p>
            </div>
          </div>
        </div>

        {/* Go Back Link */}
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-gray-700 font-semibold mb-6 hover:text-gray-900 flex items-center gap-2"
        >
          ← go back
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Question */}
          <div className="bg-white rounded-lg p-8 border-2 border-gray-300">
            <h3 className="text-2xl font-bold text-gray-900 text-center leading-relaxed">
              How does the AI system ensure that user consent is obtained and recorded before processing their sensitive information?
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600 uppercase">Select your answer:</p>
            <div className="space-y-3">
              {ANSWER_OPTIONS.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 rounded-lg font-semibold text-white text-left transition-all ${
                    selectedAnswer === option
                      ? 'bg-indigo-600 border-2 border-indigo-800 ring-2 ring-indigo-400'
                      : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-800'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Answer Display */}
          {selectedAnswer && (
            <div className="bg-gray-800 text-white rounded-lg p-6">
              <p className="text-sm font-semibold text-gray-300 mb-2">Your Selected Answer:</p>
              <p className="text-lg">{selectedAnswer}</p>
            </div>
          )}

          {/* Evidence Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload evidence / provide explanation
            </label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Describe how your organization implements this control..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitResponse}
            disabled={isSubmitting || !selectedAnswer}
            className="w-full bg-gray-800 text-white px-6 py-4 rounded-lg font-bold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
          >
            Submit
          </button>
        </div>

        {/* Progress Indicator - Bottom Right */}
        <div className="fixed bottom-6 right-6 bg-pink-500 text-white rounded-lg p-4 shadow-lg">
          <p className="text-xs font-semibold mb-2">Progress: {mockProgress.complianceScore}%</p>
          <div className="w-32 bg-pink-300 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${mockProgress.complianceScore}%` }}
            />
          </div>
          <p className="text-xs mt-2">
            {mockProgress.completed}/{mockProgress.total} answered
          </p>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
