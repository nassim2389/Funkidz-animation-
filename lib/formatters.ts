/**
 * Date and number formatting utilities
 */

import { format, formatDistance, parseISO, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format ISO date string to readable format
 * Examples: "2026-05-15" → "15 mai 2026"
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMMM yyyy', { locale: fr });
  } catch {
    return dateString;
  }
}

/**
 * Format ISO date string to short format
 * Examples: "2026-05-15" → "15/05/2026"
 */
export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch {
    return dateString;
  }
}

/**
 * Format time string
 * Examples: "14:30:00" → "14h30"
 */
export function formatTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}h${minutes}`;
  } catch {
    return timeString;
  }
}

/**
 * Format ISO datetime to relative format
 * Examples: "2026-05-15T14:30:00Z" → "dans 2 jours"
 */
export function formatRelativeDate(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return formatDistance(date, new Date(), {
      addSuffix: true,
      locale: fr,
    });
  } catch {
    return isoString;
  }
}

/**
 * Get smart date label
 * Examples: "2026-05-15" → "Aujourd'hui" / "Demain" / "15 mai 2026"
 */
export function getSmartDateLabel(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return 'Demain';
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Format price in EUR
 * Examples: 150 → "150,00 €"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format large numbers with thousand separators
 * Examples: 1000 → "1 000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Format percentage
 * Examples: 0.85 → "85 %"
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)} %`;
}

/**
 * Format booking status in French
 */
export function formatBookingStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    DONE: 'Réalisée',
    CANCELLED: 'Annulée',
  };
  return statusMap[status] || status;
}

/**
 * Format assignment status in French
 */
export function formatAssignmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'En attente',
    ACCEPTED: 'Acceptée',
    REFUSED: 'Refusée',
  };
  return statusMap[status] || status;
}

/**
 * Format payment status in French
 */
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    INITIATED: 'Initié',
    SUCCEEDED: 'Réussi',
    FAILED: 'Échoué',
    CANCELLED: 'Annulé',
  };
  return statusMap[status] || status;
}

/**
 * Format pricing type in French
 */
export function formatPricingType(type: string): string {
  const typeMap: Record<string, string> = {
    FIXED: 'Prix fixe',
    PER_CHILD: 'Par enfant',
    PER_HOUR: 'Par heure',
  };
  return typeMap[type] || type;
}

/**
 * Calculate and format duration in readable format
 * Examples: 90 → "1h 30min"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}
