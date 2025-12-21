'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { CheckCircle, Plus, Trash2, ArrowLeft, ArrowRight, User, Mail, Phone, Car, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateDriver } from '@/api/mutations/drivers';

const licenseTypes = ['A', 'B', 'C', 'D', 'E'] as const;
const vehicleTypes = ['TRUCK', 'VAN', 'CAR'] as const;

const driverSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(14, 'Telefone inválido'),
  licenseNumber: z.string().min(5, 'Número da CNH é obrigatório'),
  licenseType: z.enum(licenseTypes),
  licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data inválida'
  }),
  status: z.enum(['Ativo', 'Em pausa', 'Indisponível']),
  location: z.string().min(1, 'Localização é obrigatória'),
  vehicles: z.array(
    z.object({
      plate: z.string().min(7, 'Placa inválida'),
      model: z.string().min(1, 'Modelo é obrigatório'),
      year: z.number().min(1900).max(new Date().getFullYear()),
      type: z.enum(vehicleTypes),
    })
  ),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverRegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    id: 1,
    title: 'Dados Pessoais',
    description: 'Informações básicas do motorista',
    icon: User,
  },
  {
    id: 2,
    title: 'Contato & Veículo',
    description: 'Telefone e informações do veículo',
    icon: Car,
  },
  {
    id: 3,
    title: 'Status & Localização',
    description: 'Status atual e localização',
    icon: MapPin,
  },
];

export function DriverRegister({ open, onOpenChange }: DriverRegisterProps) {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;
  const progressValue = (step / totalSteps) * 100;
  const currentStep = steps.find((s) => s.id === step);
  const { mutateAsync: createDriver } = useCreateDriver();

  const { control, handleSubmit, reset, formState: { errors }, trigger } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseType: 'D',
      licenseExpiry: '',
      status: 'Ativo',
      location: '',
      vehicles: [
        {
          plate: '',
          model: '',
          year: new Date().getFullYear(),
          type: 'TRUCK',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vehicles',
  });

  useEffect(() => {
    if (!open) {
      reset();
      setStep(1);
    }
  }, [open, reset]);

  const onSubmit = (data: DriverFormData) => {
    console.log('Payload enviado ao backend:', data);

    createDriver(data);
    onOpenChange(false);
    reset();
  };

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['name', 'email']);
    } else if (step === 2) {
      isValid = await trigger(['phone', 'licenseNumber', 'licenseType', 'licenseExpiry', 'vehicles']);
    } else if (step === 3) {
      isValid = await trigger(['status', 'location']);
    }

    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl space-y-0 p-0 overflow-y-auto">
        <div className="border-b bg-zinc-50 p-6">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200">
                {currentStep && (
                  <currentStep.icon className="h-5 w-5 text-zinc-400" />
                )}
              </div>
              <div>
                <SheetTitle className="text-xl font-semibold text-gray-900">
                  Cadastro de Motorista
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-600">
                  {currentStep?.description}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="border-b bg-white px-6 py-4">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex flex-col items-center">
                  <div className="relative">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200',
                        step > stepItem.id
                          ? 'border-green-600 bg-green-600 text-white shadow-sm'
                          : step === stepItem.id
                            ? 'border-zinc-400 bg-zinc-400 text-white shadow-md'
                            : 'border-gray-300 bg-white text-gray-400'
                      )}
                    >
                      {step > stepItem.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        stepItem.id
                      )}
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'absolute top-5 left-10 h-0.5 w-16 -translate-y-1/2 transition-colors duration-200 sm:w-20',
                          step > stepItem.id ? 'bg-green-600' : 'bg-gray-300'
                        )}
                      />
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        'text-xs transition-colors duration-200',
                        step >= stepItem.id ? 'text-gray-900' : 'text-gray-500'
                      )}
                    >
                      {stepItem.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Progress value={progressValue} className="h-2" />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>
                  Passo {step} de {totalSteps}
                </span>
                <span>{Math.round(progressValue)}% concluído</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome Completo *
                  </Label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="name"
                          placeholder="Digite o nome completo"
                          {...field}
                          className={cn(
                            'pl-10',
                            errors.name && 'border-red-500 focus:border-red-500'
                          )}
                        />
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail Corporativo *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="exemplo@empresa.com"
                          {...field}
                          className={cn(
                            'pl-10',
                            errors.email && 'border-red-500 focus:border-red-500'
                          )}
                        />
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefone *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(99) 99999-9999"
                          value={field.value}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                          className={cn(
                            'pl-10',
                            errors.phone && 'border-red-500 focus:border-red-500'
                          )}
                        />
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
                    Número da CNH *
                  </Label>
                  <Controller
                    name="licenseNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="licenseNumber"
                        placeholder="Número da carteira"
                        {...field}
                        className={errors.licenseNumber && 'border-red-500 focus:border-red-500'}
                      />
                    )}
                  />
                  {errors.licenseNumber && (
                    <p className="text-sm text-red-600">{errors.licenseNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseType" className="text-sm font-medium text-gray-700">
                    Tipo da CNH *
                  </Label>
                  <Controller
                    name="licenseType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {licenseTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry" className="text-sm font-medium text-gray-700">
                    Validade da CNH *
                  </Label>
                  <Controller
                    name="licenseExpiry"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        {...field}
                        className={errors.licenseExpiry && 'border-red-500 focus:border-red-500'}
                      />
                    )}
                  />
                  {errors.licenseExpiry && (
                    <p className="text-sm text-red-600">{errors.licenseExpiry.message}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Veículos</h4>
                  <div className="space-y-6 mt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="space-y-3 border p-4 rounded-md relative">
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-red-500"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-2">
                          <Label>Placa *</Label>
                          <Controller
                            name={`vehicles.${index}.plate`}
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="ABC1D23" />
                            )}
                          />
                          {errors.vehicles?.[index]?.plate && (
                            <p className="text-sm text-red-600">{errors.vehicles[index]?.plate?.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Modelo *</Label>
                          <Controller
                            name={`vehicles.${index}.model`}
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Modelo do veículo" />
                            )}
                          />
                          {errors.vehicles?.[index]?.model && (
                            <p className="text-sm text-red-600">{errors.vehicles[index]?.model?.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Ano *</Label>
                          <Controller
                            name={`vehicles.${index}.year`}
                            control={control}
                            render={({ field }) => (
                              <Input type="number" {...field} />
                            )}
                          />
                          {errors.vehicles?.[index]?.year && (
                            <p className="text-sm text-red-600">{errors.vehicles[index]?.year?.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Tipo *</Label>
                          <Controller
                            name={`vehicles.${index}.type`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {vehicleTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        append({ plate: '', model: '', year: new Date().getFullYear(), type: 'TRUCK' })
                      }
                    >
                      <Plus className="w-4 h-4" /> Adicionar Veículo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Status do Motorista
                  </Label>
                  <div className="flex gap-2">
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <>
                          {['Ativo', 'Em pausa', 'Indisponível'].map((status) => (
                            <Badge
                              key={status}
                              variant={field.value === status ? 'default' : 'outline'}
                              className={cn(
                                'cursor-pointer transition-colors',
                                field.value === status && 'bg-blue-500 hover:bg-blue-600'
                              )}
                              onClick={() => field.onChange(status)}
                            >
                              {status}
                            </Badge>
                          ))}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Localização Atual *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="location"
                          placeholder="Ex: São Paulo - SP, Rota BR-101"
                          {...field}
                          className={cn(
                            'pl-10',
                            errors.location && 'border-red-500 focus:border-red-500'
                          )}
                        />
                      )}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex justify-between">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                ) : <div />}

                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Avançar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Concluir Cadastro
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
