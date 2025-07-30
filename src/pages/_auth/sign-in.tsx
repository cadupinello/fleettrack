import { useLogin } from '@/api/mutations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const Route = createFileRoute('/_auth/sign-in')({
  beforeLoad: async ({ context }) => {
    const user =
      context.authentication.user ?? (await context.authentication.refetchMe());

    if (user) throw redirect({ to: '/dashboard' });
  },
  component: SignIn,
  head: () => ({
    meta: [{ title: 'Entrar - FleetTrack' }],
  }),
});

function SignIn() {
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending } = useLogin();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormValues) => {
    loginMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Acesse sua conta</h1>
        <p className="text-muted-foreground text-balance">
          Faça login na sua conta da FleetTrack
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            className="peer pe-9"
            disabled={isSubmitting || isPending}
            {...register('email')}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
            <MailIcon size={16} />
          </div>
        </div>
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={isVisible ? 'text' : 'password'}
            placeholder="Senha"
            className="pe-9"
            disabled={isSubmitting || isPending}
            {...register('password')}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isVisible ? 'Esconder senha' : 'Mostrar senha'}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <a
        href="#"
        className="ml-auto text-sm underline-offset-2 hover:underline"
      >
        Esqueceu sua senha?
      </a>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isPending}
      >
        {isPending ? 'Entrando...' : 'Entrar'}
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
