'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface DriverRegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: string;
  location: string;
}

export function DriverRegister({ open, onOpenChange }: DriverRegisterProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    status: 'Ativo',
    location: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const totalSteps = 3;
  const progressValue = (step / totalSteps) * 100;

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

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = 'E-mail inválido';
    }

    if (stepNumber === 2) {
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.vehicle.trim()) newErrors.vehicle = 'Veículo é obrigatório';
    }

    if (stepNumber === 3) {
      if (!formData.location.trim())
        newErrors.location = 'Localização é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step) && step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      // Aqui você pode processar os dados do formulário
      console.log('Dados do motorista:', formData);
      onOpenChange(false);
      // Reset form
      setStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        vehicle: '',
        status: 'Ativo',
        location: '',
      });
      setErrors({});
    }
  };

  const currentStep = steps.find((s) => s.id === step);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl space-y-0 p-0">
        {/* Header */}
        <div className="border-b bg-zinc-50 p-2">
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

        {/* Progress Steps */}
        <div className="border-b bg-white px-6 py-4">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex flex-col items-center">
                  {/* Step Circle */}
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

                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'absolute top-5 left-10 h-0.5 w-16 -translate-y-1/2 transition-colors duration-200 sm:w-20',
                          step > stepItem.id ? 'bg-green-600' : 'bg-gray-300'
                        )}
                      />
                    )}
                  </div>

                  {/* Step Label */}
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

            {/* Progress Bar */}
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

        {/* Form Content */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nome Completo *
                  </Label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className={cn(
                        'pl-10',
                        errors.name && 'border-red-500 focus:border-red-500'
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    E-mail Corporativo *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@empresa.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className={cn(
                        'pl-10',
                        errors.email && 'border-red-500 focus:border-red-500'
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Telefone *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(99) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={cn(
                        'pl-10',
                        errors.phone && 'border-red-500 focus:border-red-500'
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="vehicle"
                    className="text-sm font-medium text-gray-700"
                  >
                    Identificação do Veículo *
                  </Label>
                  <div className="relative">
                    <Car className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="vehicle"
                      placeholder="Ex: Caminhão ABC-1234"
                      value={formData.vehicle}
                      onChange={(e) =>
                        handleInputChange('vehicle', e.target.value)
                      }
                      className={cn(
                        'pl-10',
                        errors.vehicle && 'border-red-500 focus:border-red-500'
                      )}
                    />
                  </div>
                  {errors.vehicle && (
                    <p className="text-sm text-red-600">{errors.vehicle}</p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700"
                  >
                    Status do Motorista
                  </Label>
                  <div className="flex gap-2">
                    {['Ativo', 'Em pausa', 'Indisponível'].map((status) => (
                      <Badge
                        key={status}
                        variant={
                          formData.status === status ? 'default' : 'outline'
                        }
                        className={cn(
                          'cursor-pointer transition-colors',
                          formData.status === status &&
                            'bg-blue-500 hover:bg-blue-600'
                        )}
                        onClick={() => handleInputChange('status', status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Localização Atual *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Ex: São Paulo - SP, Rota BR-101"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange('location', e.target.value)
                      }
                      className={cn(
                        'pl-10',
                        errors.location && 'border-red-500 focus:border-red-500'
                      )}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium text-gray-900">
                    Resumo do Cadastro
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Nome:</span> {formData.name}
                    </p>
                    <p>
                      <span className="font-medium">E-mail:</span>{' '}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Telefone:</span>{' '}
                      {formData.phone}
                    </p>
                    <p>
                      <span className="font-medium">Veículo:</span>{' '}
                      {formData.vehicle}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      {formData.status}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            ) : null}

            {step < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Avançar
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Concluir Cadastro
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
