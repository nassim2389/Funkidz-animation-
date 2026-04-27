/**
 * TypeScript types for Django API responses
 * Auto-generated from Django models via API schema
 */

export type UserRole = 'client' | 'admin' | 'animateur';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AnimateurProfile {
  id: number;
  user: number;
  bio: string;
  phone: string;
  avatar_url?: string;
  rating: number;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  image_url?: string;
  created_at: string;
}

export interface Option {
  id: number;
  name: string;
  description: string;
  pricing_type: 'FIXED' | 'PER_CHILD' | 'PER_HOUR';
  price: number;
}

export interface ServiceOption {
  id: number;
  service: number;
  option: number;
  is_required: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DONE' | 'CANCELLED';

export interface Booking {
  id: number;
  user: number;
  service: number;
  booking_date: string;
  booking_time: string;
  estimated_price: number;
  final_price?: number;
  status: BookingStatus;
  nb_children: number;
  location_address: string;
  location_city: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingOption {
  id: number;
  booking: number;
  option: number;
  quantity: number;
  price_at_time: number;
}

export interface BookingAssignment {
  id: number;
  booking: number;
  animateur: number;
  status: 'PENDING' | 'ACCEPTED' | 'REFUSED';
  assigned_at: string;
}

export interface Payment {
  id: number;
  booking: number;
  stripe_session_id: string;
  stripe_payment_intent: string;
  amount: number;
  currency: string;
  status: 'INITIATED' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: number;
  animateur: number;
  date: string;
  start_time: string;
  end_time: string;
  is_blocked: boolean;
  created_at: string;
}

export interface MediaGallery {
  id: number;
  service?: number;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO';
  title?: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface PasswordResetRequest {
  email: string;
}

// Booking creation/update types
export interface CreateBookingRequest {
  service_id: number;
  booking_date: string;
  booking_time: string;
  nb_children: number;
  location_address: string;
  location_city: string;
  selected_options: Array<{ option_id: number; quantity: number }>;
  special_instructions?: string;
}

export interface UpdateBookingRequest {
  booking_date?: string;
  booking_time?: string;
  nb_children?: number;
  location_address?: string;
  location_city?: string;
  special_instructions?: string;
}

// Admin types
export interface AdminUpdateReservationRequest {
  final_price?: number;
  status?: BookingStatus;
}

// API Error type
export interface APIError {
  detail: string;
  errors?: Record<string, string[]>;
}
