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
    <aside className="w-64 bg-indigo-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-indigo-800">
        <h2 className="text-2xl font-bold">CompliQuest</h2>
        <p className="text-indigo-300 text-sm mt-1">Compliance Made Easy</p>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2">
        <Link
          to="/"
          className={`block px-4 py-2 rounded-lg transition ${
            isActive('/') ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/projects"
          className={`block px-4 py-2 rounded-lg transition ${
            isActive('/projects') ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'
          }`}
        >
          Projects
        </Link>
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <div className="text-sm text-indigo-200 mb-4">
          <p className="font-medium">{user?.name}</p>
          <p className="text-indigo-300 text-xs">{user?.email}</p>
        </div>
        <Link
          to="/profile"
          className="block px-4 py-2 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm mb-2"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
