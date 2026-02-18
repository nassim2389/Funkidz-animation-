// Service de notifications pour les toasts et alerts
let notificationQueue = []
let listeners = []

const notificationService = {
  // Subscribe to notifications
  subscribe: (callback) => {
    listeners.push(callback)
    return () => {
      listeners = listeners.filter(l => l !== callback)
    }
  },

  // Envoyer une notification
  notify: (type, message, duration = 5000) => {
    const id = Date.now()
    const notification = { id, type, message, timestamp: new Date() }
    
    notificationQueue.push(notification)
    listeners.forEach(listener => listener(notification, 'add'))

    if (duration > 0) {
      setTimeout(() => {
        notificationQueue = notificationQueue.filter(n => n.id !== id)
        listeners.forEach(listener => listener(notification, 'remove'))
      }, duration)
    }

    return id
  },

  // Notifications spécifiques
  success: (message, duration) => {
    return notificationService.notify('success', message, duration)
  },

  error: (message, duration) => {
    return notificationService.notify('error', message, duration)
  },

  warning: (message, duration) => {
    return notificationService.notify('warning', message, duration)
  },

  info: (message, duration) => {
    return notificationService.notify('info', message, duration)
  },

  // Retirer une notification
  remove: (id) => {
    const notification = notificationQueue.find(n => n.id === id)
    if (notification) {
      notificationQueue = notificationQueue.filter(n => n.id !== id)
      listeners.forEach(listener => listener(notification, 'remove'))
    }
  },

  // Obtenir les notifications actuelles
  getNotifications: () => [...notificationQueue],

  // Vider toutes les notifications
  clear: () => {
    notificationQueue.forEach(notification => {
      listeners.forEach(listener => listener(notification, 'remove'))
    })
    notificationQueue = []
  }
}

export default notificationService
