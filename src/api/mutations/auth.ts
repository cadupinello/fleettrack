import { api } from "../axios";

type TAuth = {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const loginMutation = async ({ email, password }: Pick<TAuth, 'email' | 'password'>)  => {
  const response = await api.post('auth/login', { email, password });
  return response.data;
}

export const registerMutation = async ({ name, email, password, role }: TAuth) => {
  const response = await api.post('auth/register', { name, email, password, role });
  return response.data;
}

export const logoutMutation = async () => {
  const response = await api.post('auth/logout');
  return response.data;
}

export const refreshMutation = async () => {
  const response = await api.post('auth/refresh-token');
  return response.data;
}
