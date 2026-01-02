import { useFinishTrip, useStartTrip } from '@/api/mutations/trip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/authContext';
import { cn } from '@/lib/utils';
import type { Trip, TripStatus } from '@/types/trip';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, Clock, Loader2, Map as MapIcon, Package, Play, Truck, User } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

const statusColors: Record<TripStatus, string> = {
  PLANNED: 'bg-slate-500 hover:bg-slate-600',
  IN_PROGRESS: 'bg-blue-500 hover:bg-blue-600',
  COMPLETED: 'bg-green-500 hover:bg-green-600',
  CANCELLED: 'bg-red-500 hover:bg-red-600',
};

const statusLabels: Record<TripStatus, string> = {
  PLANNED: 'Planejada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

export function TripCard({ trip }: TripCardProps) {
  const { user, hasRole } = useAuth();
  const { mutate: startTrip, isPending: isStarting } = useStartTrip();
  const { mutate: finishTrip, isPending: isFinishing } = useFinishTrip();
  
  const statusColor = statusColors[trip.status as TripStatus] || 'bg-gray-500';
  const isDriver = hasRole(['DRIVER']);
  
  // No payload do JWT agora temos driverId se for motorista
  const isAssignedDriver = isDriver && user?.driverId === (trip as any).driverId;

  const handleStartTrip = () => {
    startTrip(trip.id);
  };

  const handleFinishTrip = () => {
    finishTrip(trip.id);
  };

  const isLoading = isStarting || isFinishing;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 border-l-primary/20 bg-card/50 backdrop-blur-sm group">
      <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded">
                #{trip.code}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
              {trip.cargo}
            </h3>
          </div>
          <Badge className={cn(statusColor, "text-white border-none shadow-sm font-semibold")}>
            {statusLabels[trip.status as TripStatus]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 pt-5">
        <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl border border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-background rounded-lg shadow-sm">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-tight">Motorista</span>
              <span className="text-xs font-bold truncate">{trip.driver.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-background rounded-lg shadow-sm">
              <Truck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-tight">Veículo</span>
              <span className="text-xs font-bold truncate font-mono">{trip.vehicle.plate}</span>
            </div>
          </div>
        </div>

        <div className="relative space-y-4 pl-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:to-destructive/30 before:rounded-full">
          <div className="relative flex flex-col">
            <div className="absolute -left-[14px] h-3 w-3 rounded-full border-2 border-primary bg-background shadow-sm" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Origem</span>
            <span className="text-sm font-semibold truncate">{trip.origin}</span>
          </div>
          <div className="relative flex flex-col">
            <div className="absolute -left-[14px] h-3 w-3 rounded-full border-2 border-destructive bg-background shadow-sm" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Destino</span>
            <span className="text-sm font-semibold truncate">{trip.destination}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 font-bold text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Início: {new Intl.DateTimeFormat('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(trip.startTime))}
              </span>
            </div>
            <span className="font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded tabular-nums">
              {trip.progress}%
            </span>
          </div>
          <Progress value={trip.progress} className="h-2 bg-primary/10" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="ghost" className="flex-1 font-bold text-xs h-9 hover:bg-primary/5 hover:text-primary transition-all">
            <Link to="/trips/$tripId" params={{ tripId: trip.id }}>
              Mais info
            </Link>
          </Button>

          {isDriver && isAssignedDriver && trip.status === 'PLANNED' && (
            <Button 
              onClick={handleStartTrip}
              disabled={isLoading}
              className="flex-1 bg-primary hover:opacity-90 font-bold text-xs h-9 shadow-lg shadow-primary/20"
            >
              {isStarting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 mr-1.5 fill-current" />}
              Iniciar
            </Button>
          )}

          {isDriver && isAssignedDriver && trip.status === 'IN_PROGRESS' && (
            <Button 
              onClick={handleFinishTrip}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs h-9 shadow-lg shadow-emerald-600/20"
            >
              {isFinishing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3 mr-1.5" />}
              Finalizar
            </Button>
          )}

          {!isDriver && (
            <Button variant="outline" className="flex-1 font-bold text-xs h-9 border-zinc-200 hover:border-primary/30 hover:bg-primary/5">
              <MapIcon className="h-3 w-3 mr-1.5" />
              Mapa
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
