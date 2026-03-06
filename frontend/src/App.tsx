import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import store from './store'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import Projects from './pages/Projects'
import Questionnaire from './pages/Questionnaire'
import Presentation from './pages/Presentation'
import { NotificationProvider } from './contexts/NotificationContext'

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Main app routes - with layout */}
              <Route
                element={
                  <Layout />
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:projectId/questionnaire" element={<Questionnaire />} />
                <Route path="/presentation" element={<Presentation />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
