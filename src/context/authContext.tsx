import { api } from '@/api/axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: IUser | null | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refetchMe: () => Promise<IUser | null>;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const refetchMe = useCallback(async (): Promise<IUser | null> => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await api.post('/auth/login', { email, password });
      await refetchMe();
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password });
    await refetchMe();
  };

  useEffect(() => {
    refetchMe().finally(() => setIsLoading(false));
  }, [refetchMe]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, register, refetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
