/**
 * Form validation schemas and rules
 * Uses Zod for runtime type validation
 */

import { z } from 'zod';
import { VALIDATION_RULES } from '@/lib/api-config';

// Auth schemas
export const signupSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be less than 100 characters'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
    )
    .regex(
      VALIDATION_RULES.PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordResetConfirmSchema = z.object({
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
    )
    .regex(
      VALIDATION_RULES.PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Contact schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'Name is required')
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(VALIDATION_RULES.PHONE_REGEX, 'Invalid phone number'),
  message: z
    .string()
    .min(VALIDATION_RULES.MESSAGE_MIN_LENGTH, `Message must be at least ${VALIDATION_RULES.MESSAGE_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.MESSAGE_MAX_LENGTH, `Message must be less than ${VALIDATION_RULES.MESSAGE_MAX_LENGTH} characters`),
});

// Booking schema
export const bookingSchema = z.object({
  service_id: z.number().int().positive('Service is required'),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  booking_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  nb_children: z.number().int().min(1, 'At least 1 child required').max(20, 'Maximum 20 children'),
  location_address: z
    .string()
    .min(5, 'Address is required')
    .max(200, 'Address is too long'),
  location_city: z
    .string()
    .min(2, 'City is required')
    .max(50, 'City is too long'),
  selected_options: z
    .array(
      z.object({
        option_id: z.number().int().positive(),
        quantity: z.number().int().min(1),
      })
    )
    .optional()
    .default([]),
  special_instructions: z
    .string()
    .max(500, 'Instructions are too long')
    .optional(),
});

// Service schema (Admin)
export const serviceSchema = z.object({
  name: z.string().min(3, 'Service name is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  base_price: z.number().positive('Price must be positive'),
  duration_minutes: z.number().int().min(15, 'Duration must be at least 15 minutes').max(480),
  category: z.string().min(1, 'Category is required'),
  is_active: z.boolean().default(true),
});

// Option schema (Admin)
export const optionSchema = z.object({
  name: z.string().min(2, 'Option name is required').max(100),
  description: z.string().max(500).optional(),
  pricing_type: z.enum(['FIXED', 'PER_CHILD', 'PER_HOUR']),
  price: z.number().nonnegative('Price must be non-negative'),
});

// Types exported from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type OptionFormData = z.infer<typeof optionSchema>;
