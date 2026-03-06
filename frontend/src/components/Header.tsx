import { useSelector } from 'react-redux'
import { RootState } from '../store'
import NotificationCenter from './NotificationCenter'

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

interface Project {
  id: string;
  name: string;
  framework: string;
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
}

interface HeaderProps {
  alerts?: Alert[];
  projects?: Project[];
}

export default function Header({ alerts = [], projects = [] }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  
  // Demo user fallback
  const displayName = user?.name || 'Jane';
  const displayRole = user?.role || 'Engineer';

  return (
    <header className="bg-white border-b-2 border-[var(--duo-border)]">
      <div className="px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          {/* Hearts Badge */}
          <div className="group relative">
            <div className="flex items-center gap-1.5 px-2 py-1 transition-all duration-200 hover:scale-105 cursor-pointer">
              <span className="text-lg">❤️</span>
              <span className="font-bold text-sm text-[var(--duo-text-primary)]">5</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Lives
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>

          {/* Fire Badge */}
          <div className="group relative">
            <div className="flex items-center gap-1.5 px-2 py-1 transition-all duration-200 hover:scale-105 cursor-pointer">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-sm text-[var(--duo-text-primary)]">12</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Day Streak
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>

          {/* Gems Badge */}
          <div className="group relative">
            <div className="flex items-center gap-1.5 px-2 py-1 transition-all duration-200 hover:scale-105 cursor-pointer">
              <span className="text-lg">💎</span>
              <span className="font-bold text-sm text-[var(--duo-text-primary)]">500</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Total XP
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <NotificationCenter alerts={alerts} projects={projects} />
          <div className="bg-[var(--duo-surface)] rounded-xl px-5 py-2 border-2 border-[var(--duo-border)] flex items-center gap-3">
            {/* User Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            {/* User Info */}
            <div>
              <p className="text-sm font-bold text-[var(--duo-text-primary)]">{displayName}</p>
              <p className="text-xs text-[var(--duo-text-secondary)] capitalize font-medium">{displayRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
