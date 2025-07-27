'use client';

import { useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IUser {
  id: string;
  name: string;
  email: string;
  token?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

type AuthContextType = {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3001/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const clearError = useCallback(() => setError(null), []);

  const saveSession = (token: string, user: IUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const removeSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      clearError();

      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email,
          password,
        });

        const { token: newToken, user: newUser } = response.data;

        saveSession(newToken, newUser);
        queryClient.invalidateQueries();
      } catch (err) {
        const error = err as AxiosError;
        console.error(error);
        setError('Erro desconhecido');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Erro ao fazer logout', err);
    } finally {
      removeSession();
      queryClient.clear();
    }
  }, [queryClient, token]);

  const register = useCallback(
    async (name: string, email: string, password: string, role?: string) => {
      setIsLoading(true);
      clearError();

      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          name,
          email,
          password,
          role,
        });

        console.log(response.data);

        await login(email, password);
      } catch (err) {
        const error = err as AxiosError;
        console.error(error);
        setError('Erro desconhecido');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
}
