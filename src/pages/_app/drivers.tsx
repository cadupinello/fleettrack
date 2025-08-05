import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';

import { MoreHorizontal, Phone, Plus, Search } from 'lucide-react';

import { useGetAllDrivers } from '@/api/queries/driver';
import { DriverRegister } from '@/components/driverRegister';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

export const Route = createFileRoute('/_app/drivers')({
  component: DriversComponent,
});

function DriversComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { drivers, isLoading } = useGetAllDrivers();

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

  console.log(drivers);
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

      <div className="flex gap-4">
        <div className="relative w-full max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar motoristas por nome, e-mail ou veículo..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers?.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span>{driver.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(driver.status)}>
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar motorista</DropdownMenuItem>
                      <DropdownMenuItem>Ver rota</DropdownMenuItem>
                      <DropdownMenuItem>Contato</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DriverRegister open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
