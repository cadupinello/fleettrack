import { useGetTripById } from '@/api/queries/trip';
import { TripLiveBadge } from '@/components/trip/TripLiveBadge';
import { TripProgress } from '@/components/trip/TripProgress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTripLiveProgress } from '@/hooks/useTripSocket';
import type { TripStatus } from '@/types/trip';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Calendar, ChevronLeft, Clock, Map as MapIcon, MapPin, Package, ShieldCheck, Truck, User } from 'lucide-react';

export const Route = createFileRoute('/_app/trips/$tripId')({
  component: TripDetailsPage,
});

const statusColors: Record<TripStatus, string> = {
  PLANNED: 'bg-slate-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

const statusLabels: Record<TripStatus, string> = {
  PLANNED: 'Planejada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

function TripDetailsPage() {
  const { tripId } = Route.useParams();
  console.log(tripId);
  const { trip, isLoading, isError } = useGetTripById(tripId);
  const { isLive } = useTripLiveProgress(tripId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-[200px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !trip) {
    console.log(trip);
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Viagem não encontrada</h2>
        <Button asChild>
          <Link to="/trips">Voltar para listagem</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/trips">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">Viagem #{trip.code}</h2>
              <Badge className={`${statusColors[trip.status as TripStatus]} text-white border-none shadow-sm capitalize`}>
                {statusLabels[trip.status as TripStatus]}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              ID Externo: <span className="font-mono text-xs">{trip.id}</span>
            </p>
          </div>
        </div>

        <TripLiveBadge isLive={isLive} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video lg:aspect-auto lg:h-[400px] bg-muted rounded-2xl border overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <div className="relative text-center space-y-4">
              <div className="p-4 bg-background rounded-full shadow-lg mx-auto w-fit group-hover:scale-110 transition-transform">
                <MapIcon className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="font-bold text-lg">Visualização do Mapa</p>
                <p className="text-muted-foreground text-sm">
                  {isLive 
                    ? "Rastreamento em tempo real ativo." 
                    : "O rastreamento em tempo real estará disponível em breve."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold flex items-center gap-2 border-b pb-4 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                Rota e Itinerário
              </h3>
              <div className="space-y-6 relative pl-4 before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-border">
                <div className="relative">
                  <div className="absolute -left-[14px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Origem</p>
                  <p className="font-semibold text-lg">{trip.origin}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[14px] top-1 h-3 w-3 rounded-full border-2 border-destructive bg-background" />
                  <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Destino</p>
                  <p className="font-semibold text-lg">{trip.destination}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t text-sm">
                <span className="text-muted-foreground">Distância total</span>
                <span className="font-bold">{trip.distance} km</span>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold flex items-center gap-2 border-b pb-4 mb-2">
                <Package className="h-5 w-5 text-primary" />
                Informações da Carga
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Tipo</p>
                  <p className="font-semibold">{trip.cargo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Seguro</p>
                  <p className="font-semibold text-green-600 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    Ativo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
            <TripProgress value={trip.progress} label="Progresso" />
            <div className="flex items-center gap-4 pt-6 mt-4 border-t border-primary/10">
               <div className="flex-1 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Status Atual</p>
                  <p className="text-sm font-bold">{statusLabels[trip.status as TripStatus]}</p>
               </div>
               <div className="flex-1 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Iniciado em</p>
                  <p className="text-sm font-bold">
                    {new Intl.DateTimeFormat('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(trip.startTime))}
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-4">Recursos Atribuídos</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl">
                <div className="p-2 bg-background rounded-lg shadow-sm">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Motorista</p>
                  <p className="font-bold text-sm">{trip.driver.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl">
                <div className="p-2 bg-background rounded-lg shadow-sm">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Veículo</p>
                  <p className="font-bold text-sm mono">{trip.vehicle.plate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-4 mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Cronograma
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Data de Saída
                </span>
                <span className="font-bold">
                  {new Intl.DateTimeFormat('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                  }).format(new Date(trip.startTime))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Hora de Saída
                </span>
                <span className="font-bold">
                  {new Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(trip.startTime))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
