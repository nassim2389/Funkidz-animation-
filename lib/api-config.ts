/**
 * API Configuration and Constants
 * Centralized configuration for Django API integration
 */

// API Endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
    REFRESH: '/auth/refresh/',
    PASSWORD_RESET: '/auth/password-reset/',
    PASSWORD_RESET_CONFIRM: '/auth/password-reset-confirm/',
  },
  // Services
  SERVICES: {
    LIST: '/services/',
    DETAIL: (id: number) => `/services/${id}/`,
    SEARCH: '/services/',
  },
  // Options
  OPTIONS: {
    LIST: '/options/',
    DETAIL: (id: number) => `/options/${id}/`,
  },
  // Reservations
  RESERVATIONS: {
    LIST: '/reservations/',
    CREATE: '/reservations/',
    DETAIL: (id: number) => `/reservations/${id}/`,
    UPDATE: (id: number) => `/reservations/${id}/`,
    CANCEL: (id: number) => `/reservations/${id}/cancel/`,
  },
  // Payments
  PAYMENTS: {
    CREATE_SESSION: '/payments/create-session/',
    CONFIRM: '/payments/confirm/',
  },
  // Admin
  ADMIN: {
    RESERVATIONS_LIST: '/admin/reservations/',
    RESERVATIONS_DETAIL: (id: number) => `/admin/reservations/${id}/`,
    RESERVATIONS_UPDATE: (id: number) => `/admin/reservations/${id}/`,
    RESERVATIONS_APPROVE: (id: number) => `/admin/reservations/${id}/approve/`,
    RESERVATIONS_REJECT: (id: number) => `/admin/reservations/${id}/reject/`,
    SERVICES_LIST: '/admin/services/',
    SERVICES_CREATE: '/admin/services/',
    SERVICES_DETAIL: (id: number) => `/admin/services/${id}/`,
    SERVICES_UPDATE: (id: number) => `/admin/services/${id}/`,
    SERVICES_DELETE: (id: number) => `/admin/services/${id}/`,
  },
  // Animator
  ANIMATOR: {
    PLANNING: '/animateurs/planning/',
    AVAILABILITIES: '/availabilities/',
    ASSIGNMENTS_ACCEPT: (id: number) => `/booking-assignments/${id}/accept/`,
    ASSIGNMENTS_REFUSE: (id: number) => `/booking-assignments/${id}/refuse/`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CURRENT_USER: 'current_user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Pricing Types
export const PRICING_TYPES = {
  FIXED: 'FIXED',
  PER_CHILD: 'PER_CHILD',
  PER_HOUR: 'PER_HOUR',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;

// Assignment Status
export const ASSIGNMENT_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REFUSED: 'REFUSED',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  INITIATED: 'INITIATED',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const;

// User Roles
export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
  ANIMATOR: 'animateur',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur réseau. Veuillez réessayer.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Veuillez vous connecter.',
  FORBIDDEN: 'Vous n\'avez pas accès à cette ressource.',
  NOT_FOUND: 'La ressource n\'a pas été trouvée.',
  VALIDATION_ERROR: 'Les données saisies sont invalides.',
  UNKNOWN_ERROR: 'Une erreur inconnue s\'est produite.',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
} as const;

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
  CURRENCY: 'eur',
  LOCALE: 'fr',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
