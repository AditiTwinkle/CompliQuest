import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useNotifications } from '../contexts/NotificationContext'

function Layout() {
  const { alerts, projects } = useNotifications();

  return (
    <div className="flex h-screen bg-[var(--duo-bg)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header alerts={alerts} projects={projects} />
        <main className="flex-1 overflow-auto bg-[var(--duo-surface)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export { Layout }
export default Layout
