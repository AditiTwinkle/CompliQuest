import { useState } from 'react';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  earnedAt: number;
  animate?: boolean;
}

export default function AchievementBadge({
  title,
  description,
  icon,
  earnedAt,
  animate = false,
}: AchievementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const earnedDate = new Date(earnedAt).toLocaleDateString();

  return (
    <div
      className={`relative ${animate ? 'animate-float' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-20 h-20 liquid-gradient-warning rounded-full flex items-center justify-center text-4xl shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 cursor-pointer animate-glow">
        {icon}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 glass-strong px-4 py-3 rounded-2xl text-sm whitespace-nowrap z-10 shadow-2xl animate-slide-up">
          <p className="font-bold text-gray-800">{title}</p>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-1">Earned: {earnedDate}</p>
        </div>
      )}
    </div>
  );
}
