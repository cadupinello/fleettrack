import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

export interface CreateTripDTO {
  code: string;
  origin: string;
  destination: string;
  cargo: string;
  startTime: string;
  fareValue: number;
  driverId: string;
  vehicleId: string;
}

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTripDTO) => {
      const response = await api.post('/trips', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      console.log('Viagem criada com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao criar viagem:', error);
    },
  });
};
