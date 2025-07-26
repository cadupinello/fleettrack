'use client';

import { useNavigate } from '@tanstack/react-router';
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
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
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  clearError: () => void;
  optimisticUser: IUser | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [optimisticUser, setOptimisticUser] = useOptimistic<IUser | null>(user);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          localStorage.getItem('token'),
          localStorage.getItem('user'),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setOptimisticUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load auth data', err);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        setOptimisticUser({ id: 'temp', name: 'Carregando ...', email });

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        setOptimisticUser(data.user);

        navigate({ to: '/dashboard' });
      } catch (err) {
        setOptimisticUser(null);
        setError((err as Error).message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setOptimisticUser]
  );

  const logout = useCallback(async () => {
    try {
      setOptimisticUser(null);
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [navigate, setOptimisticUser]);

  const register = useCallback(
    async (name: string, email: string, password: string, role?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        setOptimisticUser({ id: 'temp', name, email });

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        await login(email, password);
      } catch (err) {
        setOptimisticUser(null);
        setError((err as Error).message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login, setOptimisticUser]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    optimisticUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export function useAuthState() {
  return use(AuthContext);
}
