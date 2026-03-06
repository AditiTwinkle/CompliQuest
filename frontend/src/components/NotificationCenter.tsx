import { useState } from 'react'

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications] = useState<any[]>([])

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative duo-button-outline p-3 text-[var(--duo-text-secondary)] hover:text-[var(--duo-text-primary)]"
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
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-[var(--duo-pink)] text-white text-xs font-bold flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 duo-card z-50 fade-in">
                    <div className="p-4 border-b-2 border-[var(--duo-border)]">
                        <h3 className="text-sm font-bold text-[var(--duo-text-primary)]">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-[var(--duo-text-secondary)] font-medium">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    className="p-4 border-b border-[var(--duo-border)] hover:bg-[var(--duo-surface)] transition-all duration-200"
                                >
                                    <p className="text-sm text-[var(--duo-text-primary)] font-bold">{notification.message}</p>
                                    <p className="text-xs text-[var(--duo-text-secondary)] mt-1 font-medium">{notification.time}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}