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
  onDemoReset?: () => void;
}

export default function Header({ alerts = [], projects = [], onDemoReset }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user)

  // Demo user fallback
  const displayName = user?.name || 'Jane';
  const displayRole = user?.role || 'Engineer';

  const handleDemoReset = () => {
    if (onDemoReset) {
      onDemoReset();
    }
  };

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

          {/* User Profile with Dropdown Menu */}
          <div className="group relative">
            <div className="bg-[var(--duo-surface)] rounded-xl px-5 py-2 border-2 border-[var(--duo-border)] flex items-center gap-3 cursor-pointer hover:border-gray-400 transition-all">
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
              {/* Dropdown Arrow */}
              <svg
                className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border-2 border-[var(--duo-border)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {/* Profile Menu Item */}
                <button
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-[var(--duo-text-primary)] hover:bg-[var(--duo-surface)] transition-colors flex items-center gap-3"
                  onClick={() => {/* Add profile navigation */ }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>

                {/* Settings Menu Item */}
                <button
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-[var(--duo-text-primary)] hover:bg-[var(--duo-surface)] transition-colors flex items-center gap-3"
                  onClick={() => {/* Add settings navigation */ }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>

                {/* Divider */}
                {onDemoReset && <div className="border-t border-[var(--duo-border)] my-2"></div>}

                {/* Demo Reset Menu Item */}
                {onDemoReset && (
                  <button
                    onClick={handleDemoReset}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-3"
                    title="Reset all policies to non-compliant for demo purposes"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Demo Reset
                  </button>
                )}

                {/* Divider */}
                <div className="border-t border-[var(--duo-border)] my-2"></div>

                {/* Logout Menu Item */}
                <button
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                  onClick={() => {/* Add logout logic */ }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
