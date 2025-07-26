import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignIn,
  head: () => ({
    meta: [{ title: 'Entrar - FleetTrack' }],
  }),
});

function SignIn() {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      clearError();
      return await login(email, password);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Acesse sua conta</h1>
        <p className="text-muted-foreground text-balance">
          Faça login na sua conta da FleetTrack
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          disabled={mutation.isPending}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Senha</Label>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-2 hover:underline"
          >
            Esqueceu sua senha?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={mutation.isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Entrando...' : 'Entrar'}
      </Button>

      <div className="text-center text-sm">
        Não tem uma conta?{' '}
        <a
          href="/sign-up"
          className="hover:text-primary underline underline-offset-4"
          onClick={(e) => {
            e.preventDefault();
            navigate({ to: '/sign-up' });
          }}
        >
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
