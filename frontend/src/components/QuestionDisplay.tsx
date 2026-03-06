import React from 'react';
import { ComplianceControl } from '../types/compliance';

interface QuestionDisplayProps {
  control: ComplianceControl;
  isLoading?: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ control, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="duo-card">
        <div className="h-6 bg-[var(--duo-surface)] rounded-xl w-3/4 mb-4"></div>
        <div className="h-4 bg-[var(--duo-surface)] rounded-xl w-full mb-2"></div>
        <div className="h-4 bg-[var(--duo-surface)] rounded-xl w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="duo-card">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[var(--duo-text-primary)] mb-2">{control.title}</h2>
        <div className="duo-badge-blue inline-block">
          <span>📋</span>
          <span>{control.category}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[var(--duo-text-primary)] leading-relaxed font-medium">{control.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`duo-badge font-bold ${control.severity === 'critical'
                ? 'bg-red-500 text-white'
                : control.severity === 'high'
                  ? 'bg-orange-500 text-white'
                  : control.severity === 'medium'
                    ? 'bg-[var(--duo-yellow)] text-[var(--duo-text-primary)]'
                    : 'bg-[var(--duo-secondary)] text-white'
              }`}
          >
            {control.severity.charAt(0).toUpperCase() + control.severity.slice(1)} Priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;