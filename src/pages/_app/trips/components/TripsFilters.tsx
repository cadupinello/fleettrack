import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TripStatus } from '@/types/trip';
import { Filter, Search } from 'lucide-react';

interface TripsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: TripStatus | 'all';
  setStatusFilter: (value: TripStatus | 'all') => void;
}

export function TripsFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: TripsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Buscar por código, motorista ou placa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
          <Filter className="h-4 w-4" />
          Status:
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TripStatus | 'all')}
        >
          <SelectTrigger className="w-[180px] h-11 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PLANNED">Planejada</SelectItem>
            <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
            <SelectItem value="COMPLETED">Concluída</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
