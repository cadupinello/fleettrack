import { useAuth } from "@/context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authService, type LoginCredentials, type RegisterCredentials } from "../services/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await login(credentials);
    },
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      return await authService.register(credentials);
    },
    onSuccess: () => {
      navigate({ to: '/sign-in' });
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
}

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate({ to: '/sign-in' });
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
}

export const useRefresh = () => {
  return useMutation({
    mutationFn: async () => {
      throw new Error("Refresh manual não implementado");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
