import { useAuth } from '@/context/authContext';
import type { TripResponse, TripsResponse } from '@/types/trip';
import { useQuery } from '@tanstack/react-query';
import { api } from '../axios';

export const useGetTrips = (page = 1, limit = 10) => {
  const { user } = useAuth();
  const isDriver = user?.role === 'DRIVER';
  const endpoint = isDriver ? '/trips/me' : '/trips';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trips', user?.id, page, limit],
    queryFn: async () => {
      const response = await api.get<TripsResponse>(endpoint, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!user,
  });

  return {
    trips: data?.data || [],
    pagination: (data as any)?.pagination,
    isLoading,
    isError,
    refetch,
  };
};

export const useGetTripById = (id: string) => {
  const { data, isLoading, isError } = useQuery<TripResponse>({
    queryKey: ['trips', id],
    queryFn: async () => {
      const response = await api.get<TripResponse>(`/trips/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    trip: data,
    isLoading,
    isError,
  };
};
