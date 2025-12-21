import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Trip } from '@/types/trip';
import { AlertCircle, PackageX } from 'lucide-react';
import { TripCard } from './TripCard';

interface TripsListProps {
  trips?: Trip[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function TripsList({ trips, isLoading, isError, onRetry }: TripsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border rounded-xl overflow-hidden p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20 border-dashed">
        <div className="p-4 bg-destructive/10 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-destructive mb-2">Erro ao carregar viagens</h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Não foi possível conectar ao servidor. Por favor, verifique sua conexão ou tente novamente.
        </p>
        <Button onClick={onRetry} variant="destructive" className="px-8">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <PackageX className="h-10 w-10 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Sem viagens por aqui</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Não encontramos nenhuma viagem que corresponda aos filtros selecionados ou ainda não há viagens cadastradas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
