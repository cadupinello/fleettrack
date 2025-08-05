import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createFileRoute } from '@tanstack/react-router';
import {
  Badge,
  Calendar,
  Clock,
  MapPin,
  Package,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/trips')({
  component: TripsComponent,
});

function TripsComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const trips = [
    {
      id: 'T001',
      driver: 'João Silva',
      vehicle: 'ABC-1234',
      origin: 'São Paulo, SP',
      destination: 'Rio de Janeiro, RJ',
      status: 'in_progress',
      freight: 'Eletrônicos',
      startTime: '08:30',
      estimatedTime: '14:00',
      distance: '450 km',
      progress: 65,
    },
    {
      id: 'T002',
      driver: 'Maria Santos',
      vehicle: 'XYZ-5678',
      origin: 'Belo Horizonte, MG',
      destination: 'Salvador, BA',
      status: 'completed',
      freight: 'Medicamentos',
      startTime: '06:00',
      estimatedTime: '18:00',
      distance: '1200 km',
      progress: 100,
    },
    {
      id: 'T003',
      driver: 'Carlos Oliveira',
      vehicle: 'DEF-9012',
      origin: 'Brasília, DF',
      destination: 'Goiânia, GO',
      status: 'pending',
      freight: 'Alimentos',
      startTime: '10:00',
      estimatedTime: '13:30',
      distance: '210 km',
      progress: 0,
    },
    {
      id: 'T004',
      driver: 'Ana Costa',
      vehicle: 'GHI-3456',
      origin: 'Fortaleza, CE',
      destination: 'Recife, PE',
      status: 'in_progress',
      freight: 'Roupas',
      startTime: '07:15',
      estimatedTime: '15:45',
      distance: '800 km',
      progress: 30,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Viagens</h1>
          <p className="text-muted-foreground">
            Gerencie todas as viagens e entregas
          </p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Nova Viagem
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Buscar por motorista, veículo ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Viagem {trip.id}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {trip.driver}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      {trip.vehicle}
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(trip.status)}>
                  {getStatusText(trip.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Origem:</span>
                    <span className="text-muted-foreground">{trip.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Destino:</span>
                    <span className="text-muted-foreground">
                      {trip.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Carga:</span>
                    <span className="text-muted-foreground">
                      {trip.freight}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Início:</span>
                    <span className="text-muted-foreground">
                      {trip.startTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Previsão:</span>
                    <span className="text-muted-foreground">
                      {trip.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Distância:</span>
                    <span className="text-muted-foreground">
                      {trip.distance}
                    </span>
                  </div>
                </div>
              </div>

              {trip.status === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progresso da Viagem</span>
                    <span className="text-muted-foreground">
                      {trip.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
                <Button variant="outline" size="sm">
                  Rastrear
                </Button>
                {trip.status === 'pending' && (
                  <Button variant="default" size="sm">
                    Iniciar Viagem
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">
            Nenhuma viagem encontrada
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando uma nova viagem'}
          </p>
        </Card>
      )}
    </div>
  );
}
