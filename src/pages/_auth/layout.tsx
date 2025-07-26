import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

export function AuthLayout({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className="min-h-screen">
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="h-screen rounded-none border-0">
          <CardContent className="grid h-full p-0 md:grid-cols-2">
            <div className="flex flex-col justify-center p-6 md:p-8">
              <div className="mx-auto w-full max-w-sm">
                <Outlet />
              </div>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Autentica o"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
          Ao clicar em continuar, você concorda com os{' '}
          <a href="#">Termos de Serviço</a> e{' '}
          <a href="#">Politica de Privacidade</a>.
        </div>
      </div>
    </div>
  );
}
