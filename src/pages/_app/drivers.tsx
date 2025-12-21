import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, redirect } from '@tanstack/react-router';

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
import { useAuth } from '@/context/authContext';
import { useState } from 'react';

export const Route = createFileRoute('/_app/drivers')({
  beforeLoad: ({ context }) => {
    if (!context.authentication.hasRole(['ADMIN', 'MANAGER'])) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: DriversComponent,
});

function DriversComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { drivers, pagination, isLoading } = useGetAllDrivers(page);
  const { isAdmin } = useAuth();


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
        {isAdmin && (
          <Button
            className="bg-foreground hover:opacity-90"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar motorista
          </Button>
        )}
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
              <TableHead>CNH</TableHead>
              <TableHead>Veículo Atual</TableHead>
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
                  <div className="flex flex-col">
                    <span className="font-medium">{driver.licenseNumber}</span>
                    <span className="text-muted-foreground text-xs uppercase">Categoria {driver.licenseType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {driver.vehicles?.length > 0 ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-xs bg-muted px-2 py-0.5 rounded w-fit">{driver.vehicles[0].plate}</span>
                      <span className="text-muted-foreground text-xs">{driver.vehicles[0].model}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Sem veículo</span>
                  )}
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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Anterior
          </Button>
          <div className="text-sm font-medium">
            Página {page} de {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages || isLoading}
          >
            Próxima
          </Button>
        </div>
      )}

      <DriverRegister open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
