import { useQuery } from '@tanstack/react-query';
import { api } from '../axios';

export const useGetAllDrivers = (page = 1, limit = 10) => {
  const { data, isLoading } = useQuery({
    queryKey: ['drivers', page, limit],
    queryFn: async () => {
      const response = await api.get('/drivers', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    },
  });

  return {
    drivers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
  };
};
