import { useSelector } from 'react-redux'
import { RootState } from '../store'
import NotificationCenter from './NotificationCenter'

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user)

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
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              Lives
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          {/* Fire Badge */}
          <div className="group relative">
            <div className="flex items-center gap-1.5 px-2 py-1 transition-all duration-200 hover:scale-105 cursor-pointer">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-sm text-[var(--duo-text-primary)]">12</span>
            </div>
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              Day Streak
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          {/* Gems Badge */}
          <div className="group relative">
            <div className="flex items-center gap-1.5 px-2 py-1 transition-all duration-200 hover:scale-105 cursor-pointer">
              <span className="text-lg">💎</span>
              <span className="font-bold text-sm text-[var(--duo-text-primary)]">500</span>
            </div>
            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              Total XP
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <NotificationCenter />
          <div className="bg-[var(--duo-surface)] rounded-xl px-5 py-2 border-2 border-[var(--duo-border)]">
            <p className="text-sm font-bold text-[var(--duo-text-primary)]">{user?.name}</p>
            <p className="text-xs text-[var(--duo-text-secondary)] capitalize font-medium">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
