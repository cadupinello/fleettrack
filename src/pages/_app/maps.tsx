import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import {
  Activity,
  ArrowRight,
  DollarSign,
  Gauge,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  RefreshCw,
  Router,
  Send,
  Target,
  Timer,
  Truck,
  User,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface TripInfo {
  id: string;
  driver: string;
  phone: string;
  vehicle: string;
  status: 'En Route' | 'Loading' | 'Delivered' | 'Break';
  origin: string;
  destination: string;
  freight: string;
  estimatedTime: string;
  distance: string;
  progress: number;
}

export const Route = createFileRoute('/_app/maps')({
  component: MapsComponent,
});

function MapsComponent() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSent, setLocationSent] = useState(false);

  const [tripInfo] = useState<TripInfo>({
    id: 'TRP-001',
    driver: 'João Silva',
    phone: '+55 11 99999-9999',
    vehicle: 'Mercedes-Benz Actros',
    status: 'En Route',
    origin: 'São Paulo, SP',
    destination: 'Rio de Janeiro, RJ',
    freight: 'R$ 2.500,00',
    estimatedTime: '2h 30min',
    distance: '429 km',
    progress: 65,
  });

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador');
      return;
    }

    setIsTracking(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationSent(true);
        setIsTracking(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setIsTracking(false);
        alert('Erro ao obter sua localização');
      }
    );
  };

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Hero Header */}
      <div className="relative px-6 pt-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-gradient-primary shadow-elegant rounded-xl p-3">
                    <Activity className="text-primary-foreground h-8 w-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-green-400"></div>
                </div>
                <div>
                  <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
                    Rastreamento em Tempo Real
                  </h1>
                  <p className="text-muted-foreground">
                    Monitoramento completo da viagem {tripInfo.id}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={startTracking}
              disabled={isTracking}
              size="lg"
              className="bg-gradient-primary shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl"
            >
              {isTracking ? (
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {isTracking ? 'Localizando...' : 'Enviar Localização'}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Quick Stats Row */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {tripInfo.progress}%
                    </p>
                    <p className="text-muted-foreground text-sm">Progresso</p>
                  </div>
                  <Gauge className="text-primary h-8 w-8" />
                </div>
                <div
                  className="bg-gradient-primary absolute bottom-0 left-0 h-1"
                  style={{ width: `${tripInfo.progress}%` }}
                ></div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {tripInfo.estimatedTime}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Tempo Restante
                    </p>
                  </div>
                  <Timer className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {tripInfo.distance}
                    </p>
                    <p className="text-muted-foreground text-sm">Distância</p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-2xl font-bold">
                      {tripInfo.freight}
                    </p>
                    <p className="text-muted-foreground text-sm">Valor Frete</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {/* Main Route Display */}
            <div className="space-y-6 xl:col-span-2">
              {/* Enhanced Route Progress */}
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="from-primary/5 to-primary/10 border-b bg-gradient-to-r">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Router className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Rota da Viagem</h3>
                      <p className="text-muted-foreground text-sm font-normal">
                        {tripInfo.origin} → {tripInfo.destination}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Enhanced Route Visualization */}
                  <div className="relative mb-8">
                    <div className="flex items-center justify-between">
                      {/* Origin */}
                      <div className="relative z-10 flex flex-col items-center space-y-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">
                            {tripInfo.origin}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            Origem
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Line */}
                      <div className="relative mx-8 flex-1">
                        <div className="bg-muted h-3 overflow-hidden rounded-full shadow-inner">
                          <div
                            className="bg-gradient-primary relative h-full overflow-hidden rounded-full transition-all duration-2000 ease-out"
                            style={{ width: `${tripInfo.progress}%` }}
                          >
                            <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
                          </div>
                        </div>

                        {/* Vehicle Position */}
                        <div
                          className="absolute top-1/2 z-20 -translate-y-1/2 transition-all duration-2000 ease-out"
                          style={{
                            left: `${Math.max(5, Math.min(95, tripInfo.progress))}%`,
                            transform: 'translateX(-50%) translateY(-50%)',
                          }}
                        >
                          <div className="relative">
                            <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
                              <Truck className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                              <Badge className="border-blue-300 bg-blue-100 text-xs font-bold text-blue-700">
                                {tripInfo.progress}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="relative z-10 flex flex-col items-center space-y-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">
                            {tripInfo.destination}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            Destino
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Status */}
                  <div className="bg-muted/30 flex items-center justify-center rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Status:</span>
                      </div>
                      <Badge className="border-green-300 bg-green-100 px-3 py-1 text-green-700">
                        {tripInfo.status}
                      </Badge>
                      <ArrowRight className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm">
                        Chegada prevista em {tripInfo.estimatedTime}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Status */}
              {locationSent && userLocation && (
                <Card className="animate-fade-in border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader className="border-b border-green-200">
                    <CardTitle className="flex items-center gap-3 text-green-700">
                      <div className="rounded-lg bg-green-100 p-2">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      Localização Registrada com Sucesso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between rounded-xl border border-green-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                          <Navigation className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">
                            Coordenadas GPS Ativas
                          </p>
                          <p className="font-mono text-sm text-green-600">
                            {userLocation.lat.toFixed(6)},{' '}
                            {userLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <Badge className="border-green-300 bg-green-100 px-3 py-1 text-green-700">
                        Em Tempo Real
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Driver Card */}
              <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader className="from-primary/5 to-primary/10 border-b bg-gradient-to-r">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <User className="text-primary h-5 w-5" />
                    </div>
                    Informações do Motorista
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="bg-gradient-primary flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
                      <span className="text-primary-foreground text-lg font-bold">
                        {tripInfo.driver
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {tripInfo.driver}
                      </h3>
                      <p className="text-muted-foreground">{tripInfo.phone}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Motorista Ativo
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="transition-colors hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Ligar
                    </Button>
                    <Button
                      variant="outline"
                      className="transition-colors hover:border-green-300 hover:bg-green-50"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Info */}
              <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader className="from-primary/5 to-primary/10 border-b bg-gradient-to-r">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Truck className="text-primary h-5 w-5" />
                    </div>
                    Detalhes do Veículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-4">
                    <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
                      <span className="text-muted-foreground text-sm font-medium">
                        ID Viagem
                      </span>
                      <Badge variant="outline" className="font-mono text-sm">
                        {tripInfo.id}
                      </Badge>
                    </div>

                    <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
                      <span className="text-muted-foreground text-sm font-medium">
                        Modelo
                      </span>
                      <span className="text-sm font-semibold">
                        {tripInfo.vehicle}
                      </span>
                    </div>

                    <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
                      <span className="text-muted-foreground text-sm font-medium">
                        Status Atual
                      </span>
                      <Badge className="border-green-300 bg-green-100 text-green-700">
                        {tripInfo.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-green-700">
                          ORIGEM
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-green-800">
                        {tripInfo.origin}
                      </p>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-xs font-medium text-red-700">
                          DESTINO
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-red-800">
                        {tripInfo.destination}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
