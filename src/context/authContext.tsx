import { api } from '@/api/axios';
import { createContext, useContext, useEffect, useState } from 'react';

interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
}

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  refetchMe: () => Promise<IUser | null>;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchMe = async () => {
    try {
      const response = await api.get('auth/me');
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    refetchMe().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    await api.post('auth/login', { email, password });
    await refetchMe();
  };

  const logout = async () => {
    await api.post('auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refetchMe,
        isLoading,
        register: async (name, email, password) => {
          await api.post('/register', { name, email, password });
          await refetchMe();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
