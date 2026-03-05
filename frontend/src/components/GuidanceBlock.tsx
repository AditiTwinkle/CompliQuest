import React, { useState } from 'react';

interface GuidanceBlockProps {
  guidance: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const GuidanceBlock: React.FC<GuidanceBlockProps> = ({
  guidance,
  isLoading = false,
  onRefresh,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-blue-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-blue-200 rounded w-full"></div>
          <div className="h-4 bg-blue-200 rounded w-5/6"></div>
          <div className="h-4 bg-blue-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
          </svg>
          <h3 className="text-lg font-semibold text-blue-900">AI Guidance</h3>
        </div>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-blue-200 bg-white">
          <div className="prose prose-sm max-w-none text-gray-700 mb-4">
            {guidance.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Guidance
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidanceBlock;
