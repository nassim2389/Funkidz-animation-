/**
 * Custom React hooks for Django API calls
 * Handle loading, error, and data states automatically
 */

import { useState, useCallback, useEffect } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): UseAsyncState<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return state;
}

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useMutation<T, P>(
  asyncFunction: (params: P) => Promise<T>
): [UseMutationState<T>, (params: P) => Promise<T>] {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (params: P) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await asyncFunction(params);
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    [asyncFunction]
  );

  return [state, mutate];
}

/**
 * Hook to fetch services
 * Usage: const { data: services, loading, error } = useServices();
 */
export function useServices() {
  return useAsync(
    async () => {
      const { servicesAPI } = await import('@/lib/api-client');
      return servicesAPI.list();
    },
    true
  );
}

/**
 * Hook to fetch a single service
 * Usage: const { data: service, loading, error } = useService(serviceId);
 */
export function useService(id: number) {
  return useAsync(
    async () => {
      const { servicesAPI } = await import('@/lib/api-client');
      return servicesAPI.get(id);
    },
    !!id
  );
}

/**
 * Hook to fetch options
 * Usage: const { data: options, loading, error } = useOptions();
 */
export function useOptions() {
  return useAsync(
    async () => {
      const { optionsAPI } = await import('@/lib/api-client');
      return optionsAPI.list();
    },
    true
  );
}

/**
 * Hook to fetch current user
 * Usage: const { data: user, loading, error } = useCurrentUser();
 */
export function useCurrentUser() {
  return useAsync(
    async () => {
      const { authAPI } = await import('@/lib/api-client');
      return authAPI.me();
    },
    true
  );
}

/**
 * Hook to fetch reservations
 * Usage: const { data: reservations, loading, error } = useReservations();
 */
export function useReservations() {
  return useAsync(
    async () => {
      const { reservationsAPI } = await import('@/lib/api-client');
      return reservationsAPI.list();
    },
    true
  );
}

/**
 * Hook to fetch a single reservation
 * Usage: const { data: reservation, loading, error } = useReservation(bookingId);
 */
export function useReservation(id: number) {
  return useAsync(
    async () => {
      const { reservationsAPI } = await import('@/lib/api-client');
      return reservationsAPI.get(id);
    },
    !!id
  );
}

/**
 * Hook to create a reservation
 * Usage: const [{ loading, error }, createBooking] = useCreateReservation();
 *        await createBooking({ service_id: 1, ... });
 */
export function useCreateReservation() {
  return useMutation(async (data: unknown) => {
    const { reservationsAPI } = await import('@/lib/api-client');
    return reservationsAPI.create(data);
  });
}

/**
 * Hook to login
 * Usage: const [{ loading, error }, login] = useLogin();
 *        await login({ email: '...', password: '...' });
 */
export function useLogin() {
  return useMutation(async (data: { email: string; password: string }) => {
    const { authAPI, apiClient } = await import('@/lib/api-client');
    const response = await authAPI.login(data);
    apiClient.setToken(response.token);
    return response;
  });
}

/**
 * Hook to register
 * Usage: const [{ loading, error }, register] = useRegister();
 */
export function useRegister() {
  return useMutation(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => {
      const { authAPI, apiClient } = await import('@/lib/api-client');
      const response = await authAPI.register(data);
      apiClient.setToken(response.token);
      return response;
    }
  );
}

/**
 * Hook to cancel reservation
 * Usage: const [{ loading, error }, cancelReservation] = useCancelReservation();
 *        await cancelReservation(bookingId);
 */
export function useCancelReservation() {
  return useMutation(async (id: number) => {
    const { reservationsAPI } = await import('@/lib/api-client');
    return reservationsAPI.cancel(id);
  });
}

/**
 * Hook to fetch admin reservations (with filters)
 * Usage: const { data: reservations, loading, error } = useAdminReservations({ status: 'PENDING' });
 */
export function useAdminReservations(filters?: Record<string, string | number | boolean>) {
  return useAsync(
    async () => {
      const { adminReservationsAPI } = await import('@/lib/api-client');
      return adminReservationsAPI.list(filters);
    },
    true
  );
}
