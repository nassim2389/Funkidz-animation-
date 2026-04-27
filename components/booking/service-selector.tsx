'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/use-api';
import { formatPrice, formatDuration } from '@/lib/formatters';
import { Check } from 'lucide-react';

interface ServiceSelectorProps {
  selectedServiceId: number | null;
  onSelect: (serviceId: number) => void;
  onNext: () => void;
}

export function ServiceSelector({
  selectedServiceId,
  onSelect,
  onNext,
}: ServiceSelectorProps) {
  const { data: services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
        Erreur lors du chargement des services. Veuillez réessayer.
      </div>
    );
  }

  const activeServices = services?.filter((s) => s.is_active) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeServices.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className="text-left transition-all hover:shadow-lg"
          >
            <Card
              className={`cursor-pointer transition-all ${
                selectedServiceId === service.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  {selectedServiceId === service.id && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check size={16} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {service.category}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm line-clamp-2">{service.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durée:</span>
                    <span className="font-semibold">
                      {formatDuration(service.duration_minutes)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Prix de base:
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(service.base_price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedServiceId}
        className="w-full"
        size="lg"
      >
        Continuer vers la sélection de date
      </Button>
    </div>
  );
}
