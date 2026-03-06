import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  compliant?: number;
  nonCompliant?: number;
  inProgress?: number;
  notStarted?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  compliant = 0,
  nonCompliant = 0,
  inProgress = 0,
  notStarted = 0,
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="duo-card">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-[var(--duo-text-primary)]">Progress</h3>
          <span className="text-2xl font-bold text-[var(--duo-primary)]">
            {percentage}%
          </span>
        </div>
        <div className="duo-progress-bar">
          <div
            className="duo-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-[var(--duo-text-secondary)] mt-3 font-medium">
          {current} of {total} controls completed
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="duo-success-box text-center">
          <p className="text-xs text-[var(--duo-text-secondary)] font-bold mb-1">Compliant</p>
          <p className="text-2xl font-bold text-[var(--duo-primary)]">{compliant}</p>
        </div>
        <div className="duo-error-box text-center">
          <p className="text-xs text-[var(--duo-text-secondary)] font-bold mb-1">Non-Compliant</p>
          <p className="text-2xl font-bold text-red-600">{nonCompliant}</p>
        </div>
        <div className="bg-[var(--duo-yellow)] border-2 border-orange-400 rounded-xl p-4 text-center">
          <p className="text-xs text-[var(--duo-text-primary)] font-bold mb-1">In Progress</p>
          <p className="text-2xl font-bold text-orange-600">{inProgress}</p>
        </div>
        <div className="bg-[var(--duo-surface)] border-2 border-[var(--duo-border)] rounded-xl p-4 text-center">
          <p className="text-xs text-[var(--duo-text-secondary)] font-bold mb-1">Not Started</p>
          <p className="text-2xl font-bold text-[var(--duo-text-secondary)]">{notStarted}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;