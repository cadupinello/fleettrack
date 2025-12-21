import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";


export const useCreateDriver = () => {

  return useMutation({
    mutationFn: async ({ name, phone, licenseNumber, licenseType, licenseExpiry, vehicles }: any) => {
      return await api.post('/drivers', { name, phone, licenseNumber, licenseType, licenseExpiry, vehicles })
    },
    onSuccess: () => {
      console.log('Motorista criado com sucesso');
    },
    onError: (error) => {
      console.error(error);
    },
  })
}
