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
      className={`relative ${animate ? 'animate-bounce' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-3xl shadow-lg hover:shadow-xl transition cursor-pointer">
        {icon}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-gray-300">{description}</p>
          <p className="text-xs text-gray-400 mt-1">Earned: {earnedDate}</p>
        </div>
      )}
    </div>
  );
}
