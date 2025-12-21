import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Trip } from '@/types/trip';
import { Link } from '@tanstack/react-router';
import { Clock, Package, Truck, User } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

const statusColors = {
  PLANNED: 'bg-slate-500 hover:bg-slate-600',
  IN_PROGRESS: 'bg-blue-500 hover:bg-blue-600',
  COMPLETED: 'bg-green-500 hover:bg-green-600',
  CANCELLED: 'bg-red-500 hover:bg-red-600',
};

const statusLabels = {
  PLANNED: 'Planejada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

export function TripCard({ trip }: TripCardProps) {
  const statusColor = statusColors[trip.status] || 'bg-gray-500';

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 border-l-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                #{trip.code}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{trip.cargo}</h3>
          </div>
          <Badge className={`${statusColor} text-white border-none shadow-sm`}>
            {statusLabels[trip.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver and Vehicle Info */}
        <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-background rounded-md shadow-sm">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Motorista</span>
              <span className="text-sm font-medium leading-none">{trip.driver.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-background rounded-md shadow-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Veículo</span>
              <span className="text-sm font-medium leading-none font-mono">{trip.vehicle.plate}</span>
            </div>
          </div>
        </div>

        {/* Origin -> Destination Route */}
        <div className="relative space-y-3 pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border before:content-['']">
          <div className="relative flex items-center gap-3">
            <div className="absolute -left-[13px] h-3 w-3 rounded-full border-2 border-primary bg-background shadow-sm" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Origem</span>
              <span className="text-sm font-medium">{trip.origin}</span>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <div className="absolute -left-[13px] h-3 w-3 rounded-full border-2 border-destructive bg-background shadow-sm" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Destino</span>
              <span className="text-sm font-medium">{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Início: {new Intl.DateTimeFormat('pt-BR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(trip.startTime))}
              </span>
            </div>
            <span className="font-bold text-primary">{trip.progress}%</span>
          </div>
          <Progress value={trip.progress} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1 transition-colors hover:bg-primary hover:text-primary-foreground">
            <Link to="/trips/$tripId" params={{ tripId: trip.id }}>
              Ver detalhes
            </Link>
          </Button>
          <Button variant="secondary" className="flex-1 opacity-70 hover:opacity-100 transition-opacity">
            Rastrear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
