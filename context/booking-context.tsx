'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BookingFormData } from '@/lib/validators';

export type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingContextType {
  // State
  currentStep: BookingStep;
  formData: Partial<BookingFormData>;

  // Navigation
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Form management
  updateFormData: (data: Partial<BookingFormData>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const INITIAL_FORM_DATA: Partial<BookingFormData> = {
  service_id: 0,
  booking_date: '',
  booking_time: '',
  nb_children: 1,
  location_address: '',
  location_city: '',
  selected_options: [],
  special_instructions: '',
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>(
    INITIAL_FORM_DATA
  );

  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(Math.min(5, Math.max(1, step)) as BookingStep);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(5, prev + 1) as BookingStep);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as BookingStep);
  }, []);

  const updateFormData = useCallback((data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetBooking = useCallback(() => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const value: BookingContextType = {
    currentStep,
    formData,
    goToStep,
    nextStep,
    prevStep,
    updateFormData,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
