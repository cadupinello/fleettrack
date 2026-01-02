import type { Trip, TripResponse } from '@/types/trip';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../axios';

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Trip>) => {
      const response = await api.post<TripResponse>('/trips', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Trip> & { id: string }) => {
      const response = await api.patch<TripResponse>(`/trips/${id}`, data);
      return response.data;
    },
    onSuccess: (data: TripResponse) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', data.data.id] });
    },
  });
};

export const useUpdateTripStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Trip['status'] }) => {
      const response = await api.patch<TripResponse>(`/trips/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (data: TripResponse) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', data.data.id] });
    },
  });
};
export const useStartTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<TripResponse>(`/trips/${id}/start`);
      return response.data;
    },
    onSuccess: (data: TripResponse) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', data.data.id] });
    },
  });
};

export const useFinishTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<TripResponse>(`/trips/${id}/finish`);
      return response.data;
    },
    onSuccess: (data: TripResponse) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', data.data.id] });
    },
  });
};

export const useReportLocation = () => {
  return useMutation({
    mutationFn: async ({ id, latitude, longitude, speed }: { id: string; latitude: number; longitude: number; speed?: number }) => {
      const response = await api.post(`/trips/${id}/report-location`, { latitude, longitude, speed });
      return response.data;
    },
  });
};
