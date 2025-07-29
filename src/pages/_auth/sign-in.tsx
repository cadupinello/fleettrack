import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/sign-in')({
  beforeLoad: async ({ context }) => {
    const user = await context.authentication.refetchMe();
    if (user) throw redirect({ to: '/dashboard' });
  },
  component: SignIn,
  head: () => ({
    meta: [{ title: 'Entrar - FleetTrack' }],
  }),
});

function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await login(email, password);
    },
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
        <div className="*:not-first:mt-2">
          <Label>Email</Label>
          <div className="relative">
            <Input
              className="peer pe-9"
              placeholder="Email"
              type="email"
              disabled={mutation.isPending}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
              <MailIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="*:not-first:mt-2">
          <Label>Senha</Label>

          <div className="relative">
            <Input
              className="pe-9"
              placeholder="Senha"
              type={isVisible ? 'text' : 'password'}
              disabled={mutation.isPending}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <a
        href="#"
        className="ml-auto text-sm underline-offset-2 hover:underline"
      >
        Esqueceu sua senha?
      </a>

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
