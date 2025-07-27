import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import {
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  Search,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/maps')({
  component: MapsComponent,
});

function MapsComponent() {
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const activeDrivers = [
    {
      id: 1,
      name: 'John Smith',
      vehicle: 'T001',
      status: 'A caminho',
      lat: 37.7749,
      lng: -122.4194,
    },
    {
      id: 2,
      name: 'Mike Davis',
      vehicle: 'T003',
      status: 'Carregando',
      lat: 37.7849,
      lng: -122.4094,
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      vehicle: 'V002',
      status: 'Entregue',
      lat: 37.7649,
      lng: -122.4294,
    },
  ];

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      // Aqui você inicializaria o mapa com o token
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Mapas Ao Vivo</h1>
          <p className="text-muted-foreground">
            Acompanhe seus motoristas em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Layers className="mr-2 h-4 w-4" />
            Camadas
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      {showTokenInput && (
        <Card className="shadow-soft border-warning">
          <CardHeader>
            <CardTitle className="text-warning">
              Configuração do Mapbox Necessária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Para usar o recurso de mapas ao vivo, insira seu token público do
              Mapbox. Você pode obter um em{' '}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Insira seu token público do Mapbox..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleTokenSubmit}
                disabled={!mapboxToken.trim()}
              >
                Inicializar Mapa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Painel de Motoristas */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Motoristas Ativos
            </CardTitle>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input placeholder="Buscar motoristas..." className="h-8 pl-10" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeDrivers.map((driver) => (
              <div
                key={driver.id}
                className="border-border hover:bg-muted/50 cursor-pointer rounded-lg border p-3 transition-colors"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{driver.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {driver.vehicle}
                    </p>
                  </div>
                  <Badge
                    variant={
                      driver.status === 'A caminho' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {driver.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span>
                    Lat: {driver.lat.toFixed(4)}, Lng: {driver.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Container do Mapa */}
        <Card className="shadow-soft lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Rastreamento em Tempo Real
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-muted/20 border-border flex h-[600px] items-center justify-center rounded-lg border">
              {showTokenInput ? (
                <div className="space-y-4 text-center">
                  <MapPin className="text-muted-foreground mx-auto h-16 w-16" />
                  <div>
                    <h3 className="text-foreground text-lg font-semibold">
                      Inicialização do Mapa Necessária
                    </h3>
                    <p className="text-muted-foreground">
                      Insira seu token do Mapbox acima para visualizar o mapa ao
                      vivo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                  <p className="text-muted-foreground">Carregando mapa...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legenda do Mapa */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-success h-4 w-4 rounded-full"></div>
              <span className="text-sm">A caminho</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-warning h-4 w-4 rounded-full"></div>
              <span className="text-sm">Carregando/Descarregando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-info h-4 w-4 rounded-full"></div>
              <span className="text-sm">Pausa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted h-4 w-4 rounded-full"></div>
              <span className="text-sm">Fora de serviço</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
