import { useAuth } from "@/context/authContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../axios";

type TAuth = {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password }: Pick<TAuth, 'email' | 'password'>) => {
      return await login(email, password);
    },
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ name, email, password, role }: TAuth) => {
      return await api.post('auth/register', { name, email, password, role })
        .then((response) => response.data);
    },
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      return await api.post('auth/logout')
        .then((response) => response.data);
    },
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export const useRefresh = () => {
  return useMutation({
    mutationFn: async () => {
      return await api.post('auth/refresh-token')
        .then((response) => response.data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
