import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';

import {
  Car,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
} from 'lucide-react';

import { DriverRegister } from '@/components/driverRegister';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export const Route = createFileRoute('/_app/drivers')({
  component: DriversComponent,
});

function DriversComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const drivers = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      phone: '+55 (11) 91234-5678',
      vehicle: 'Caminhão - T001',
      status: 'Ativo',
      location: 'Rota Central',
      lastUpdate: 'há 2 min',
    },
    {
      id: 2,
      name: 'Sara Souza',
      email: 'sara.souza@empresa.com',
      phone: '+55 (11) 92345-6789',
      vehicle: 'Van - V002',
      status: 'Fora de serviço',
      location: 'Depósito',
      lastUpdate: 'há 15 min',
    },
    {
      id: 3,
      name: 'Miguel Santos',
      email: 'miguel.santos@empresa.com',
      phone: '+55 (11) 93456-7890',
      vehicle: 'Caminhão - T003',
      status: 'Ativo',
      location: 'Rodovia 101',
      lastUpdate: 'há 1 min',
    },
    {
      id: 4,
      name: 'Larissa Oliveira',
      email: 'larissa.oliveira@empresa.com',
      phone: '+55 (11) 94567-8901',
      vehicle: 'Van - V004',
      status: 'Em pausa',
      location: 'Ponto de descanso',
      lastUpdate: 'há 5 min',
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'default';
      case 'Em pausa':
        return 'secondary';
      case 'Fora de serviço':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Motoristas</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe de motoristas
          </p>
        </div>
        <Button
          className="bg-foreground hover:opacity-90"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar motorista
        </Button>
      </div>

      {/* Pesquisa e Filtros */}
      <div className="flex gap-4">
        <div className="relative w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Buscar motoristas por nome, e-mail ou veículo..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      {/* Grade de Motoristas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <Card
            key={driver.id}
            className="shadow-soft hover:shadow-medium transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                  <Badge
                    variant={getStatusVariant(driver.status)}
                    className="mt-1"
                  >
                    {driver.status}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Editar motorista</DropdownMenuItem>
                    <DropdownMenuItem>Ver rota</DropdownMenuItem>
                    <DropdownMenuItem>Contato</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span className="truncate">{driver.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="text-muted-foreground h-4 w-4" />
                <span>{driver.vehicle}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <span className="truncate">{driver.location}</span>
              </div>
              <div className="text-muted-foreground pt-2 text-xs">
                Última atualização: {driver.lastUpdate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DriverRegister open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
