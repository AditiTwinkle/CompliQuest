import React from 'react';
import { ComplianceControl } from '../types/compliance';

interface QuestionDisplayProps {
  control: ComplianceControl;
  isLoading?: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ control, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{control.title}</h2>
        <p className="text-sm text-gray-500">
          Category: <span className="font-semibold">{control.category}</span>
        </p>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed">{control.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              control.severity === 'critical'
                ? 'bg-red-100 text-red-800'
                : control.severity === 'high'
                ? 'bg-orange-100 text-orange-800'
                : control.severity === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {control.severity.charAt(0).toUpperCase() + control.severity.slice(1)} Severity
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
