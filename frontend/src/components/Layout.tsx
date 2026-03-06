import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useNotifications } from '../contexts/NotificationContext'

function Layout() {
  const { alerts, projects, refreshData } = useNotifications();

  const handleDemoReset = () => {
    // Clear all localStorage keys that end with '-compliant'
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('-compliant')) {
        keysToRemove.push(key);
      }
    }

    // Remove all compliance keys
    keysToRemove.forEach(key => {
      console.log('Removing localStorage key:', key);
      localStorage.removeItem(key);
    });

    console.log('Demo reset: cleared', keysToRemove.length, 'compliance keys');

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
