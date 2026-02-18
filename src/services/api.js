import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Authentication
export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login/', { email, password }),
  signup: (firstName, lastName, email, password) =>
    apiClient.post('/auth/signup/', { first_name: firstName, last_name: lastName, email, password }),
  logout: () => {
    localStorage.removeItem('token')
  },
  getCurrentUser: () =>
    apiClient.get('/auth/user/'),
  refreshToken: (refreshToken) =>
    apiClient.post('/auth/token/refresh/', { refresh: refreshToken }),
}

// Services
export const servicesService = {
  getAll: () => apiClient.get('/services/'),
  getById: (id) => apiClient.get(`/services/${id}/`),
  search: (params) => apiClient.get('/services/', { params }),
}

// Bookings (Réservations)
export const bookingsService = {
  getAll: () => apiClient.get('/bookings/'),
  getById: (id) => apiClient.get(`/bookings/${id}/`),
  create: (data) => apiClient.post('/bookings/', data),
  update: (id, data) => apiClient.put(`/bookings/${id}/`, data),
  delete: (id) => apiClient.delete(`/bookings/${id}/`),
  getUserBookings: () => apiClient.get('/bookings/my/'),
  getByStatus: (status) => apiClient.get('/bookings/', { params: { status } }),
}

// Options
export const optionsService = {
  getAll: () => apiClient.get('/options/'),
  getById: (id) => apiClient.get(`/options/${id}/`),
  getByService: (serviceId) => apiClient.get(`/options/?service=${serviceId}`),
}

// Payments
export const paymentsService = {
  getAll: () => apiClient.get('/payments/'),
  getById: (id) => apiClient.get(`/payments/${id}/`),
  create: (data) => apiClient.post('/payments/', data),
  getByBooking: (bookingId) => apiClient.get('/payments/', { params: { booking_id: bookingId } }),
  updateStatus: (id, status) => apiClient.patch(`/payments/${id}/`, { status }),
}

// Booking Options
export const bookingOptionsService = {
  getByBooking: (bookingId) => apiClient.get(`/bookings/${bookingId}/options/`),
  addOption: (bookingId, optionId, quantity) =>
    apiClient.post(`/bookings/${bookingId}/options/`, { option_id: optionId, quantity }),
}

// Contact Messages
export const contactService = {
  sendMessage: (name, email, phone, message) =>
    apiClient.post('/contact-messages/', { name, email, phone, message }),
  getAll: () => apiClient.get('/contact-messages/'),
}

// Media Gallery
export const galleryService = {
  getAll: () => apiClient.get('/media-gallery/'),
  getByService: (serviceId) => apiClient.get('/media-gallery/', { params: { service_id: serviceId } }),
  getVisible: () => apiClient.get('/media-gallery/', { params: { is_visible: true } }),
}

// Admin
export const adminService = {
  getStatistics: () => apiClient.get('/admin/statistics/'),
  getReservations: (params) => apiClient.get('/admin/reservations/', { params }),
  updateReservationStatus: (id, status) =>
    apiClient.patch(`/admin/reservations/${id}/`, { status }),
  getServices: () => apiClient.get('/admin/services/'),
  createService: (data) => apiClient.post('/admin/services/', data),
  updateService: (id, data) => apiClient.put(`/admin/services/${id}/`, data),
  deleteService: (id) => apiClient.delete(`/admin/services/${id}/`),
}

export default apiClient
