/**
 * Booking price calculator hook
 * Calculates dynamic pricing based on service, options, and pricing types
 */

import { useMemo } from 'react';
import type { Service, Option, BookingOption, BookingFormData } from '@/lib/types';

interface PriceCalculatorInput {
  service: Service | null;
  selectedOptions: Array<{ option: Option; quantity: number }>;
  nbChildren: number;
  durationHours: number;
}

interface PricingBreakdown {
  basePrice: number;
  optionsPrice: number;
  totalPrice: number;
  details: Array<{
    label: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

/**
 * Calculate price based on service, options, and pricing types
 */
export function usePriceCalculator({
  service,
  selectedOptions,
  nbChildren,
  durationHours,
}: PriceCalculatorInput): PricingBreakdown {
  return useMemo(() => {
    const details: PricingBreakdown['details'] = [];
    let basePrice = service?.base_price ?? 0;
    let optionsPrice = 0;

    // Add base service price
    details.push({
      label: `${service?.name || 'Service'}`,
      quantity: 1,
      unitPrice: basePrice,
      totalPrice: basePrice,
    });

    // Calculate options pricing
    selectedOptions.forEach(({ option, quantity }) => {
      let optionTotal = 0;

      switch (option.pricing_type) {
        case 'FIXED':
          // Fixed price regardless of quantity
          optionTotal = option.price * quantity;
          break;

        case 'PER_CHILD':
          // Price per child
          optionTotal = option.price * nbChildren * quantity;
          break;

        case 'PER_HOUR':
          // Price per hour
          optionTotal = option.price * durationHours * quantity;
          break;
      }

      optionsPrice += optionTotal;

      details.push({
        label: `${option.name} (${option.pricing_type === 'PER_CHILD' ? `×${nbChildren} enfants` : option.pricing_type === 'PER_HOUR' ? `×${durationHours}h` : ''})`,
        quantity,
        unitPrice: option.price,
        totalPrice: optionTotal,
      });
    });

    return {
      basePrice,
      optionsPrice,
      totalPrice: basePrice + optionsPrice,
      details,
    };
  }, [service, selectedOptions, nbChildren, durationHours]);
}

/**
 * Format pricing breakdown for display
 */
export function formatPricingBreakdown(breakdown: PricingBreakdown): string {
  return breakdown.details
    .map((item) => `${item.label}: ${item.totalPrice.toFixed(2)}€`)
    .join('\n');
}
