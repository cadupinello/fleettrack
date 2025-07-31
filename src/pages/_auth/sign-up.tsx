import { useRegister } from '@/api/mutations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const signUpSchema = z
  .object({
    name: z.string().min(3, 'O nome precisa ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { mutate: registerMutation, isPending } = useRegister();

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SignUpFormValues) => {
    registerMutation({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5">
      <div className="mb-4 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-muted-foreground text-balance">
          Cadastre-se para sua conta da FleetTrack
        </p>
      </div>

      <div className="grid gap-1">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="João Doe"
          disabled={isSubmitting || isPending}
          {...register('name')}
        />

        {errors.name && (
          <span className="text-[10px] text-red-500">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="grid gap-1">
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
          <span className="text-[10px] text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="grid gap-1">
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
          <span className="text-[10px] text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={isConfirmVisible ? 'text' : 'password'}
            placeholder="Confirmar Senha"
            className="pe-9"
            disabled={isSubmitting || isPending}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={toggleConfirmVisibility}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isConfirmVisible ? 'Esconder senha' : 'Mostrar senha'}
            aria-pressed={isConfirmVisible}
            aria-controls="confirmPassword"
          >
            {isConfirmVisible ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-[10px] text-red-500">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isPending}
      >
        Continuar
      </Button>

      <div className="text-center text-sm">
        Já tem uma conta?{' '}
        <a href="/sign-in" className="underline underline-offset-4">
          Entrar
        </a>
      </div>
    </form>
  );
}
