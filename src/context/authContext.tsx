import {
  authService,
  type LoginCredentials,
} from '@/api/services/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { destroyCookie, setCookie } from 'nookies';
import { createContext, useCallback, useContext } from 'react';

export type AppRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

export type IUser = User;

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: AppRole[]) => boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refetchMe: () => Promise<any>;
}

export const AuthContext = createContext({} as AuthContextType);

export const AUTH_KEYS = {
  me: ['me'] as const,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authService.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { token } = await authService.login(credentials);

      if (token) {
        setCookie(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        
        // Garantia extra para o browser
        if (typeof window !== 'undefined') {
          document.cookie = `token=${token}; max-age=${30 * 24 * 60 * 60}; path=/`;
        }
      }

      await queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignorar erros na API de logout para garantir limpeza local
    } finally {
      destroyCookie(null, 'token', { path: '/' });
      
      // Garantia extra para o browser
      if (typeof window !== 'undefined') {
        document.cookie = 'token=; max-age=0; path=/';
      }
      
      queryClient.setQueryData(AUTH_KEYS.me, null);
    }
  }, [queryClient]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await authService.register({ name, email, password });
      await queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
    [queryClient]
  );

  const hasRole = useCallback(
    (roles: AppRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const isAdmin = user?.role === 'ADMIN';

  // Wrapper para refetch que mantém compatibilidade com o esperado pelos guards de rota
  // 1. Retorna os dados (usuário) diretamente ou null, em vez do QueryObserverResult
  // 2. Não lança erro em caso de falha (ex: 401), retorna null
  const refetchMeWrapper = useCallback(async () => {
    try {
      const { data } = await refetch();
      return data || null;
    } catch (error) {
      return null;
    }
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        hasRole,
        isAdmin,
        login,
        logout,
        register,
        refetchMe: refetchMeWrapper,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
