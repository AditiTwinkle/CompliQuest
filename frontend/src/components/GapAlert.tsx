import React from 'react';

interface GapAlertProps {
  gapType: 'missing_control' | 'incomplete_implementation' | 'non_compliant' | 'expired_evidence';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  controlTitle: string;
  onDismiss?: () => void;
}

export const GapAlert: React.FC<GapAlertProps> = ({
  gapType,
  severity,
  description,
  controlTitle,
  onDismiss,
}) => {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🔵';
    }
  };

  const getGapTypeLabel = (type: string) => {
    switch (type) {
      case 'missing_control':
        return 'Missing Control';
      case 'incomplete_implementation':
        return 'Incomplete Implementation';
      case 'non_compliant':
        return 'Non-Compliant';
      case 'expired_evidence':
        return 'Expired Evidence';
      default:
        return 'Compliance Gap';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getSeverityColor(severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getSeverityIcon(severity)}</span>
          <div>
            <h3 className="font-semibold mb-1">
              {getGapTypeLabel(gapType)}: {controlTitle}
            </h3>
            <p className="text-sm mb-2">{description}</p>
            <span className="inline-block px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-semibold">
              {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
            </span>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default GapAlert;
