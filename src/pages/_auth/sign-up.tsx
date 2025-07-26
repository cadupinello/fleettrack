import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-muted-foreground text-balance">
          Cadastre-se para sua conta da FleetTrack
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="João Doe"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
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
