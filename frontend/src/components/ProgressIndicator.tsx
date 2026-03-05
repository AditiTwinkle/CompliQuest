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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {current} of {total} controls completed
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-semibold">Compliant</p>
          <p className="text-2xl font-bold text-green-600">{compliant}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-semibold">Non-Compliant</p>
          <p className="text-2xl font-bold text-red-600">{nonCompliant}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-semibold">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{inProgress}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-semibold">Not Started</p>
          <p className="text-2xl font-bold text-gray-600">{notStarted}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
