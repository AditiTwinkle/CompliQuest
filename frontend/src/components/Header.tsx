import { useSelector } from 'react-redux'
import { RootState } from '../store'
import NotificationCenter from './NotificationCenter'

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <header className="bg-white border-b-2 border-[var(--duo-border)]">
      <div className="px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="duo-badge-pink">
            <span>❤️</span>
            <span>5</span>
          </div>
          <div className="duo-badge-yellow">
            <span>🔥</span>
            <span>12</span>
          </div>
          <div className="duo-badge-blue">
            <span>💎</span>
            <span>500</span>
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
