import { useQuery } from '@tanstack/react-query';
import { api } from '../axios';

export const useGetAllDrivers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const response = await api.get('/drivers');
      return response.data;
    },
  });

  return {
    drivers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
  };
};
