import { useState, useEffect } from 'react';

export type AvatarState = 'happy' | 'neutral' | 'urgent' | 'celebrating';

interface LSEGlingAvatarProps {
  state?: AvatarState;
  showBadge?: boolean;
  badgeText?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

function LSEGlingAvatar({
  state = 'neutral',
  showBadge = false,
  badgeText = '',
  onClick,
  size = 'medium',
}: LSEGlingAvatarProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (state === 'celebrating') {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16';
      case 'large':
        return 'w-40 h-40';
      default:
        return 'w-24 h-24';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative cursor-pointer transition-transform ${
          animating ? 'animate-bounce' : ''
        } ${getSizeClasses()}`}
        onClick={onClick}
      >
        {/* Animated Duck SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Duck Body */}
          <ellipse cx="100" cy="120" rx="60" ry="50" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />

          {/* Duck Head */}
          <circle cx="100" cy="60" r="35" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />

          {/* Duck Beak */}
          <ellipse cx="130" cy="55" rx="20" ry="12" fill="#FF8C00" stroke="#FF6347" strokeWidth="1" />

          {/* Duck Eyes */}
          <circle cx="110" cy="50" r="6" fill="#000" />
          <circle cx="112" cy="48" r="2" fill="#fff" />

          {/* Duck Wing */}
          <path
            d="M 70 110 Q 50 100 60 130"
            stroke="#FFA500"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Duck Feet */}
          <g>
            <line x1="85" y1="165" x2="85" y2="180" stroke="#FF8C00" strokeWidth="3" />
            <line x1="115" y1="165" x2="115" y2="180" stroke="#FF8C00" strokeWidth="3" />
            <path d="M 80 180 L 90 180" stroke="#FF8C00" strokeWidth="2" />
            <path d="M 110 180 L 120 180" stroke="#FF8C00" strokeWidth="2" />
          </g>

          {/* Animation - bobbing motion */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -5; 0 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </svg>

        {/* Badge */}
        {showBadge && (
          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            ✓
          </div>
        )}
      </div>

      {badgeText && <p className="text-sm font-medium text-gray-700">{badgeText}</p>}

      <div className="text-xs text-gray-500 text-center">
        {state === 'celebrating' && 'Achievement Unlocked!'}
        {state === 'happy' && 'Keep it up!'}
        {state === 'urgent' && 'Needs attention'}
        {state === 'neutral' && 'Ready to help'}
      </div>
    </div>
  );
}

export { LSEGlingAvatar };
export default LSEGlingAvatar;
