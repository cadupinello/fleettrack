import { tripsApi } from '@/api/trips.api';
import { useQuery } from '@tanstack/react-query';

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getTrips,
  });
};

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripsApi.getTripById(id),
    enabled: !!id,
  });
};
