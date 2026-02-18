import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import notificationService from '../services/notificationService'

const icons = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700'
}

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification, action) => {
      if (action === 'add') {
        setNotifications(prev => [...prev, notification])
      } else if (action === 'remove') {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }
    })

    return unsubscribe
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-right-full ${colors[notification.type]}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {icons[notification.type]}
          </div>
          <p className="flex-1">{notification.message}</p>
          <button
            onClick={() => notificationService.remove(notification.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
