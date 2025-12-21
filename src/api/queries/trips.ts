import type { TripResponse, TripsResponse } from '@/types/trip';
import { useQuery } from '@tanstack/react-query';
import { api } from '../axios';

export const useGetTrips = (page = 1, limit = 10) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trips', page, limit],
    queryFn: async () => {
      const response = await api.get<TripsResponse>('/trips', {
        params: { page, limit },
      });
      return response.data;
    },
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ['trips', id],
    queryFn: async () => {
      const response = await api.get<TripResponse>(`/trips/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    trip: data?.data,
    isLoading,
    isError,
  };
};
