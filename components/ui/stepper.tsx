'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  variant?: 'horizontal' | 'vertical';
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  variant = 'horizontal',
}: StepperProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'horizontal' ? 'gap-4' : 'gap-6 flex-col',
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => onStepClick?.(index)}
            disabled={index > currentStep}
            className={cn(
              'flex items-center gap-3 text-left',
              index > currentStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {/* Step circle */}
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all',
                index < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'border-primary bg-background text-primary'
                    : 'border-muted bg-background text-muted-foreground',
              )}
            >
              {index < currentStep ? <Check size={20} /> : index + 1}
            </div>

            {/* Step label */}
            <div className="flex flex-col gap-0.5">
              <div
                className={cn(
                  'font-semibold',
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              )}
            </div>
          </button>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-5 h-1 bg-muted',
                index < currentStep && 'bg-primary',
                variant === 'vertical' && 'ml-5 w-0.5 h-6',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
