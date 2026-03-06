import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useNotifications } from '../contexts/NotificationContext'

function Layout() {
  const { alerts, projects, refreshData } = useNotifications();

  const handleDemoReset = () => {
    // Reset all policy compliance states to non-compliant
    localStorage.removeItem('hungry-compliant');
    localStorage.removeItem('wet-compliant');
    localStorage.removeItem('tired-compliant');
    localStorage.removeItem('thirsty-compliant');

    // Reload the data
    refreshData();
  };

  return (
    <div className="flex h-screen bg-[var(--duo-bg)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header alerts={alerts} projects={projects} onDemoReset={handleDemoReset} />
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
