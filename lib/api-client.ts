/**
 * API Client for Funkidz Django Backend
 * Configure NEXT_PUBLIC_API_URL in .env.local
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>) {
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        query.append(key, String(value));
      });
      url += `?${query.toString()}`;
    }
    return url;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    const url = this.buildURL(endpoint, params);
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient();

// Services API
export const servicesAPI = {
  list: () => apiClient.get('/services/'),
  get: (id: number) => apiClient.get(`/services/${id}/`),
  search: (query: string) => apiClient.get('/services/', { params: { search: query } }),
};

// Options API
export const optionsAPI = {
  list: () => apiClient.get('/options/'),
  get: (id: number) => apiClient.get(`/options/${id}/`),
};

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
    apiClient.post('/auth/register/', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login/', data),
  logout: () => apiClient.post('/auth/logout/'),
  me: () => apiClient.get('/auth/me/'),
  refresh: (token: string) => apiClient.post('/auth/refresh/', { token }),
  passwordReset: (email: string) => apiClient.post('/auth/password-reset/', { email }),
  passwordResetConfirm: (token: string, password: string) =>
    apiClient.post('/auth/password-reset-confirm/', { token, password }),
};

// Reservations API
export const reservationsAPI = {
  list: () => apiClient.get('/reservations/'),
  create: (data: unknown) => apiClient.post('/reservations/', data),
  get: (id: number) => apiClient.get(`/reservations/${id}/`),
  update: (id: number, data: unknown) => apiClient.patch(`/reservations/${id}/`, data),
  cancel: (id: number) => apiClient.post(`/reservations/${id}/cancel/`),
};

// Admin Reservations API
export const adminReservationsAPI = {
  list: (params?: Record<string, string | number | boolean>) =>
    apiClient.get('/admin/reservations/', { params }),
  get: (id: number) => apiClient.get(`/admin/reservations/${id}/`),
  update: (id: number, data: unknown) => apiClient.patch(`/admin/reservations/${id}/`, data),
  approve: (id: number) => apiClient.post(`/admin/reservations/${id}/approve/`),
  reject: (id: number, reason: string) =>
    apiClient.post(`/admin/reservations/${id}/reject/`, { reason }),
};

// Admin Services API
export const adminServicesAPI = {
  list: () => apiClient.get('/admin/services/'),
  create: (data: unknown) => apiClient.post('/admin/services/', data),
  get: (id: number) => apiClient.get(`/admin/services/${id}/`),
  update: (id: number, data: unknown) => apiClient.patch(`/admin/services/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/admin/services/${id}/`),
};

// Payment API
export const paymentAPI = {
  createSession: (reservationId: number) =>
    apiClient.post('/payments/create-session/', { reservation_id: reservationId }),
  confirmPayment: (sessionId: string) =>
    apiClient.post('/payments/confirm/', { session_id: sessionId }),
};
