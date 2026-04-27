'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper, type StepperStep } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceSelector } from '@/components/booking/service-selector';
import { DateTimeSelector } from '@/components/booking/datetime-selector';
import { useBooking, BookingProvider } from '@/context/booking-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { usePriceCalculator } from '@/hooks/use-price-calculator';
import { AlertCircle } from 'lucide-react';


const BOOKING_STEPS: StepperStep[] = [
  { id: 'service', label: 'Service', description: 'Sélectionnez un service' },
  {
    id: 'datetime',
    label: 'Date & Heure',
    description: 'Choisissez une date et une heure',
  },
  { id: 'options', label: 'Options', description: 'Sélectionnez des options' },
  {
    id: 'details',
    label: 'Détails',
    description: 'Informations complémentaires',
  },
  { id: 'review', label: 'Confirmation', description: 'Vérifiez votre réservation' },
];

function BookingWizardContent() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const {
    currentStep,
    formData,
    goToStep,
    nextStep,
    prevStep,
    updateFormData,
  } = useBooking();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/booking');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <div className="py-12 text-center">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Créer une réservation</h1>
          <p className="text-muted-foreground">
            Suivez les étapes pour réserver l'animation parfaite
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12 overflow-x-auto">
          <Stepper steps={BOOKING_STEPS} currentStep={currentStep - 1} />
        </div>

        {/* Content */}
        <div className="bg-background rounded-lg border p-8 min-h-96">
          {currentStep === 1 && (
            <ServiceSelector
              selectedServiceId={formData.service_id ?? null}
              onSelect={(id) => updateFormData({ service_id: id })}
              onNext={nextStep}
            />
          )}

          {currentStep === 2 && (
            <DateTimeSelector
              serviceId={formData.service_id!}
              selectedDate={formData.booking_date ?? null}
              selectedTime={formData.booking_time ?? null}
              onDateChange={(date) => updateFormData({ booking_date: date })}
              onTimeChange={(time) => updateFormData({ booking_time: time })}
              onNext={nextStep}
            />
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Options supplémentaires</h2>
              <p className="text-muted-foreground">
                Étape 3 (options) en cours de développement...
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Détails supplémentaires</h2>
              <p className="text-muted-foreground">
                Étape 4 (détails) en cours de développement...
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Confirmez votre réservation</h2>
              <p className="text-muted-foreground">
                Étape 5 (confirmation) en cours de développement...
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => goToStep(1)}>
              Recommencer
            </Button>

            {currentStep < 5 && (
              <Button onClick={nextStep} disabled={!formData.service_id}>
                Suivant
              </Button>
            )}

            {currentStep === 5 && (
              <Button
                onClick={() => {
                  toast({
                    title: 'Réservation créée',
                    description: 'Redirection vers le paiement...',
                  });
                  router.push('/payment');
                }}
              >
                Confirmer la réservation
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <BookingProvider>
      <BookingWizardContent />
    </BookingProvider>
  );
}
