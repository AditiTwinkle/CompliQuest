import { useState } from 'react'

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

interface Project {
  id: string;
  name: string;
  framework: string;
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
}

interface NotificationCenterProps {
  alerts?: Alert[];
  projects?: Project[];
}

export default function NotificationCenter({ alerts = [], projects = [] }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Count urgent alerts
  const urgentAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high');
  const totalNotifications = urgentAlerts.length + projects.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {totalNotifications > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {totalNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications {totalNotifications > 0 && `(${totalNotifications})`}
            </h3>
          </div>

          {totalNotifications === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Outstanding Tasks Section */}
              {urgentAlerts.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-red-500">🚨</span>
                    Outstanding Tasks ({urgentAlerts.length})
                  </h4>
                  <div className="space-y-2">
                    {urgentAlerts.map((alert) => {
                      const policyNumber = alert.id.split('-')[1];
                      const icons = ['🍔', '🏠', '😴', '💧'];
                      const iconIndex = parseInt(policyNumber) - 1;

                      return (
                        <div
                          key={alert.id}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{icons[iconIndex] || '⚠️'}</span>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">
                                Policy {policyNumber}: {alert.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {alert.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Challenge Progress Section */}
              {projects.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span>🎯</span>
                    Your Challenges ({projects.length})
                  </h4>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">
                              {project.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {project.framework} Framework
                            </p>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            {project.complianceScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${project.complianceScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {project.compliantControls}/{project.totalControls} controls completed
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
