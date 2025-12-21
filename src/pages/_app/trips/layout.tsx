import { TripRegister } from '@/components/tripRegister';
import { Button } from '@/components/ui/button';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/trips')({
  beforeLoad: ({ context }) => {
    if (!context.authentication.hasRole(['ADMIN', 'MANAGER'])) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: TripsLayout,
});

function TripsLayout() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Viagens
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitore e gerencie o progresso de toda a frota em tempo real.
          </p>
        </div>
        
        <Button 
          size="lg" 
          className="rounded-full shadow-lg shadow-primary/20 gap-2 font-bold px-6"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nova Viagem
        </Button>
      </div>

      <Outlet />

      <TripRegister open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
