import { TripRegister } from '@/components/tripRegister';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { LayoutGrid, Plus } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/trips')({
  beforeLoad: ({ context }) => {
    // Permitir ADMIN, MANAGER e DRIVER
    if (!context.authentication.hasRole(['ADMIN', 'MANAGER', 'DRIVER'])) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: TripsLayout,
});

function TripsLayout() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { hasRole } = useAuth();
  
  const isAdmin = hasRole(['ADMIN', 'MANAGER']);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-primary" />
            Viagens
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            {isAdmin 
              ? 'Gerencie e monitore todas as operações da frota' 
              : 'Visualize e gerencie suas viagens designadas'}
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="lg"
            className="bg-primary hover:opacity-90 shadow-lg shadow-primary/20 h-11 px-6 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Viagem
          </Button>
        )}
      </div>

      <Outlet />

      <TripRegister open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
