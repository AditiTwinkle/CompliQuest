import { useSelector } from 'react-redux'
import { RootState } from '../store'
import NotificationCenter from './NotificationCenter'

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <header className="bg-white shadow">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CompliQuest</h1>
          <p className="text-sm text-gray-600">{user?.organizationId}</p>
        </div>
        <div className="flex items-center gap-6">
          <NotificationCenter />
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
