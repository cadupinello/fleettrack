import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignIn,
  head: () => ({
    meta: [{ title: 'Entrar - FleetTrack' }],
  }),
});

function SignIn() {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
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
        />
      </div>

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
        <Input id="password" name="password" type="password" required />
      </div>

      <Button type="submit" className="w-full">
        Entrando
      </Button>

      <div className="text-center text-sm">
        Não tem uma conta?{' '}
        <a href="/sign-up" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
