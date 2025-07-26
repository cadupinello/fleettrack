'use client';

import { useQueryClient } from '@tanstack/react-query';
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
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao fazer login');
        }

        saveSession(data.token, data.user);
        queryClient.invalidateQueries();
      } catch (err: any) {
        setError(err.message ?? 'Erro desconhecido');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Erro ao fazer logout', err);
    } finally {
      removeSession();
      queryClient.clear();
    }
  }, [queryClient]);

  const register = useCallback(
    async (name: string, email: string, password: string, role?: string) => {
      setIsLoading(true);
      clearError();

      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao registrar');
        }

        await login(email, password);
      } catch (err: any) {
        setError(err.message ?? 'Erro desconhecido');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  useEffect(() => {
    const loadStoredSession = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const response = await fetch(`${API_BASE_URL}/validate`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Sessão inválida');
          }

          setToken(storedToken);
          setUser(parsedUser);
        } catch (err) {
          removeSession();
        }
      }

      setIsLoading(false);
    };

    loadStoredSession();
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
