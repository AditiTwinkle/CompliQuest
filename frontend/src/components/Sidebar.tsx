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
