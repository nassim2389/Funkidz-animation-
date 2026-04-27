'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate, getSmartDateLabel } from '@/lib/formatters';

interface DateTimeSelectorProps {
  serviceId: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  availableSlots?: Array<{ date: string; times: string[] }>;
  loading?: boolean;
}

/**
 * Time slots available for selection (business hours example)
 */
const DEFAULT_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export function DateTimeSelector({
  serviceId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onNext,
  availableSlots = [],
  loading = false,
}: DateTimeSelectorProps) {
  const [error, setError] = useState<string | null>(null);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get available times for selected date
  const availableTimes =
    availableSlots.find((slot) => slot.date === selectedDate)?.times ||
    DEFAULT_TIME_SLOTS;

  const handleDateChange = (date: string) => {
    onDateChange(date);
    // Reset time when date changes
    onTimeChange('');
    setError(null);
  };

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      setError('Veuillez sélectionner une date et une heure');
      return;
    }
    setError(null);
    onNext();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>{error}</div>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="booking-date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sélectionnez une date
          </Label>
          <Input
            id="booking-date"
            type="date"
            value={selectedDate || ''}
            onChange={(e) => handleDateChange(e.target.value)}
            min={today}
            className="cursor-pointer"
          />
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              {getSmartDateLabel(selectedDate)}
            </p>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sélectionnez une heure
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeChange(time)}
                  className={`rounded-lg border-2 py-2 px-3 font-semibold transition-all ${
                    selectedTime === time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {selectedDate && selectedTime && (
          <Card className="bg-secondary/50">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heure:</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedDate || !selectedTime}
        className="w-full"
        size="lg"
      >
        Continuer vers les options
      </Button>
    </div>
  );
}
