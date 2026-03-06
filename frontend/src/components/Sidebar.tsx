import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { RootState } from '../store'

export default function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside className="w-64 bg-white flex flex-col h-screen border-r-2 border-[var(--duo-border)]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[var(--duo-primary)]">
          CompliQuest
        </h2>
        <p className="text-[var(--duo-text-secondary)] text-sm mt-1 font-medium">Compliance Made Easy</p>
      </div>

      <nav className="flex-1 mt-2 px-3 space-y-2">
        <Link
          to="/"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/')
              ? 'bg-[var(--duo-primary)] text-white shadow-lg'
              : 'text-[var(--duo-text-secondary)] hover:bg-[var(--duo-surface)]'
            }`}
        >
          <span className="text-xl">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link
          to="/projects"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/projects')
              ? 'bg-[var(--duo-primary)] text-white shadow-lg'
              : 'text-[var(--duo-text-secondary)] hover:bg-[var(--duo-surface)]'
            }`}
        >
          <span className="text-xl">🎯</span>
          <span>Projects</span>
        </Link>
      </nav>

      <div className="p-3 space-y-3">
        <div className="bg-[var(--duo-surface)] rounded-xl p-3 border-2 border-[var(--duo-border)]">
          <p className="font-bold text-[var(--duo-text-primary)] text-sm">{user?.name}</p>
          <p className="text-[var(--duo-text-secondary)] text-xs mt-0.5">{user?.email}</p>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[var(--duo-text-secondary)] hover:bg-[var(--duo-surface)] transition-all duration-200 text-sm font-bold"
        >
          <span>👤</span>
          <span>Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full duo-button-outline text-sm flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
