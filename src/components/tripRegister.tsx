'use client';

import { useCreateTrip } from '@/api/mutations/trip';
import { useGetAllDrivers } from '@/api/queries/driver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  if (Object.keys(errors).length > 0) {
    console.warn('Current Form Errors:', errors);
  }

  const selectedDriverId = watch('driverId');
  const selectedDriver = drivers?.find((d: any) => d.id === selectedDriverId);
  const availableVehicles = selectedDriver?.vehicles || [];

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onInvalid = (errors: any) => {
    console.error('Form Validation Failed:', errors);
  };

  const onSubmit = async (data: TripFormData) => {
    console.log('Submitting Form Data:', data);
    try {
      const formattedData = {
        ...data,
        startTime: dayjs(data.startTime).toISOString(),
      };

      await createTrip(formattedData);
      onOpenChange(false);
      reset();
    } catch (error: any) {
      console.error('Submit Error:', error);
      if (error.response) {
        console.error('Server Response:', error.response.data);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl sm:max-w-xl space-y-0 p-0 overflow-y-auto border-l shadow-2xl">
        <div className="border-b bg-zinc-50/50 backdrop-blur-sm p-6 sticky top-0 z-10">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold tracking-tight text-gray-900">
                  Nova Viagem
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-gray-500">
                  Preencha os dados abaixo para registrar uma nova operação.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="code" className="text-sm font-semibold text-gray-700">
                  Código da Viagem <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }: { field: any }) => (
                    <Input
                      id="code"
                      placeholder="TRIP-2025-001"
                      {...field}
                      className={cn(
                        "h-11 transition-all focus:ring-2 focus:ring-primary/20",
                        errors.code && 'border-red-500 bg-red-50/30'
                      )}
                    />
                  )}
                />
                {errors.code && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.code.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="startTime" className="text-sm font-semibold text-gray-700">
                  Início Previsto <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }: { field: any }) => (
                    <div className="relative group">
                      <Calendar className="absolute top-3 left-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="startTime"
                        type="datetime-local"
                        className={cn(
                          'pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20',
                          errors.startTime && 'border-red-500 bg-red-50/30'
                        )}
                        {...field}
                      />
                    </div>
                  )}
                />
                {errors.startTime && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.startTime.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="origin" className="text-sm font-semibold text-gray-700">
                  Origem <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <MapPin className="absolute top-3.5 left-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Controller
                    name="origin"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Input
                        id="origin"
                        placeholder="Cidade, UF"
                        className={cn(
                          'pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20',
                          errors.origin && 'border-red-500 bg-red-50/30'
                        )}
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.origin && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.origin.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="destination" className="text-sm font-semibold text-gray-700">
                  Destino <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <MapPin className="absolute top-3.5 left-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Controller
                    name="destination"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Input
                        id="destination"
                        placeholder="Cidade, UF"
                        className={cn(
                          'pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20',
                          errors.destination && 'border-red-500 bg-red-50/30'
                        )}
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.destination && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.destination.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="cargo" className="text-sm font-semibold text-gray-700">
                  Carga <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <Package className="absolute top-3.5 left-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Controller
                    name="cargo"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Input
                        id="cargo"
                        placeholder="Ex: Carga Eletrônica"
                        className={cn(
                          'pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20',
                          errors.cargo && 'border-red-500 bg-red-50/30'
                        )}
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.cargo && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.cargo.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="fareValue" className="text-sm font-semibold text-gray-700">
                  Valor do Frete (R$) <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <DollarSign className="absolute top-3.5 left-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Controller
                    name="fareValue"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Input
                        id="fareValue"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={cn(
                          'pl-10 h-11 transition-all focus:ring-2 focus:ring-emerald-500/20',
                          errors.fareValue && 'border-red-500 bg-red-50/30'
                        )}
                        {...field}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                      />
                    )}
                  />
                </div>
                {errors.fareValue && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.fareValue.message}</p>}
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-dashed">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                </div>
                Atribuição de Recursos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="driverId" className="text-sm font-semibold text-gray-700">
                    Motorista <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="driverId"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={cn("h-11", errors.driverId && "border-red-500 bg-red-50/30")}>
                          <SelectValue placeholder="Selecione um motorista" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers?.map((driver: any) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.driverId && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.driverId.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="vehicleId" className="text-sm font-semibold text-gray-700">
                    Veículo <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="vehicleId"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedDriverId || availableVehicles.length === 0}
                      >
                        <SelectTrigger className={cn("h-11", errors.vehicleId && "border-red-500 bg-red-50/30")}>
                          <SelectValue placeholder={
                            !selectedDriverId 
                              ? "Escolha um motorista" 
                              : availableVehicles.length === 0 
                                ? "Nenhum veículo disponível" 
                                : "Escolha o veículo"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVehicles.map((vehicle: any) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.plate} - {vehicle.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.vehicleId && <p className="text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{errors.vehicleId.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-8 sticky bottom-0 bg-white/80 backdrop-blur-sm -mx-8 px-8 pb-8">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="h-11 px-6 font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-8 bg-primary hover:opacity-90 shadow-lg shadow-primary/20 font-bold transition-all hover:translate-y-[-2px] active:translate-y-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Criar Viagem
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
