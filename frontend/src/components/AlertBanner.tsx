import { useState } from 'react';

export interface AlertBannerProps {
  type: 'urgent' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

export default function AlertBanner({
  type,
  title,
  message,
  onDismiss,
  dismissible = true,
}: AlertBannerProps) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  const getStyles = () => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '🚨',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️',
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.bg} border ${styles.border} ${styles.text} px-4 py-4 rounded-lg flex items-start gap-3`}>
      <span className="text-xl flex-shrink-0">{styles.icon}</span>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm mt-1">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-lg hover:opacity-70 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}
