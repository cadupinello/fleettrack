'use client';

import { useCreateTrip } from '@/api/mutations/trips';
import { useGetAllDrivers } from '@/api/queries/driver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Calendar, CheckCircle, DollarSign, MapPin, Package, Truck, User } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// Fix: useGetAllDrivers is in @/api/queries/driver

const tripSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  origin: z.string().min(1, 'Origem é obrigatória'),
  destination: z.string().min(1, 'Destino é obrigatório'),
  cargo: z.string().min(1, 'Carga é obrigatória'),
  startTime: z.string().min(1, 'Data de início é obrigatória'),
  fareValue: z.number().min(0, 'Valor do frete deve ser positivo'),
  driverId: z.string().min(1, 'Motorista é obrigatório'),
  vehicleId: z.string().min(1, 'Veículo é obrigatório'),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripRegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TripRegister({ open, onOpenChange }: TripRegisterProps) {
  const { mutateAsync: createTrip } = useCreateTrip();
  const { drivers } = useGetAllDrivers();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      code: '',
      origin: '',
      destination: '',
      cargo: '',
      startTime: new Date().toISOString().slice(0, 16),
      fareValue: 0,
      driverId: '',
      vehicleId: '',
    },
  });

  const selectedDriverId = watch('driverId');
  const selectedDriver = drivers?.find((d: any) => d.id === selectedDriverId);
  const availableVehicles = selectedDriver?.vehicles || [];

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: TripFormData) => {
    try {
      // Formata a data para o padrão ISO UTC que o backend espera (ex: 2025-12-21T10:00:00Z)
      const formattedData = {
        ...data,
        startTime: dayjs(data.startTime).toISOString(),
      };

      await createTrip(formattedData);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl space-y-0 p-0 overflow-y-auto">
        <div className="border-b bg-zinc-50 p-6">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl font-semibold text-gray-900">
                  Nova Viagem
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-600">
                  Preencha os dados para registrar uma nova viagem na frota.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Código da Viagem *
                </Label>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="code"
                      placeholder="TRIP-2025-001"
                      {...field}
                      className={cn(errors.code && 'border-red-500')}
                    />
                  )}
                />
                {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  Início Previsto *
                </Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Calendar className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="startTime"
                        type="datetime-local"
                        className={cn('pl-10', errors.startTime && 'border-red-500')}
                        {...field}
                      />
                    </div>
                  )}
                />
                {errors.startTime && <p className="text-xs text-red-600">{errors.startTime.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
                Origem *
              </Label>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="origin"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="origin"
                      placeholder="Cidade, UF"
                      className={cn('pl-10', errors.origin && 'border-red-500')}
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.origin && <p className="text-xs text-red-600">{errors.origin.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                Destino *
              </Label>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="destination"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="destination"
                      placeholder="Cidade, UF"
                      className={cn('pl-10', errors.destination && 'border-red-500')}
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.destination && <p className="text-xs text-red-600">{errors.destination.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                Carga *
              </Label>
              <div className="relative">
                <Package className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="cargo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="cargo"
                      placeholder="Ex: Carga Eletrônica"
                      className={cn('pl-10', errors.cargo && 'border-red-500')}
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.cargo && <p className="text-xs text-red-600">{errors.cargo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fareValue" className="text-sm font-medium text-gray-700">
                Valor do Frete (R$) *
              </Label>
              <div className="relative">
                <DollarSign className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="fareValue"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fareValue"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={cn('pl-10', errors.fareValue && 'border-red-500')}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  )}
                />
              </div>
              {errors.fareValue && <p className="text-xs text-red-600">{errors.fareValue.message}</p>}
            </div>

            <div className="space-y-6 pt-4 border-t">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-4 w-4" /> Atribuição de Recursos
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="driverId" className="text-sm font-medium text-gray-700">
                  Motorista *
                </Label>
                <Controller
                  name="driverId"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="driverId"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.driverId && "border-red-500"
                      )}
                      {...field}
                    >
                      <option value="">Selecione um motorista</option>
                      {drivers?.map((driver: any) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.driverId && <p className="text-xs text-red-600">{errors.driverId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleId" className="text-sm font-medium text-gray-700">
                  Veículo *
                </Label>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="vehicleId"
                      disabled={!selectedDriverId || availableVehicles.length === 0}
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.vehicleId && "border-red-500"
                      )}
                      {...field}
                    >
                      <option value="">
                        {!selectedDriverId 
                          ? "Selecione primeiro um motorista" 
                          : availableVehicles.length === 0 
                            ? "Nenhum veículo disponível para este motorista" 
                            : "Selecione um veículo"}
                      </option>
                      {availableVehicles.map((vehicle: any) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} - {vehicle.model}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.vehicleId && <p className="text-xs text-red-600">{errors.vehicleId.message}</p>}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:opacity-90 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4" />
                  Criar Viagem
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
