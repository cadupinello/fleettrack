'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Phone,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface DriverRegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: 'Informações Pessoais', icon: User },
  { id: 2, title: 'Carteira de Motorista', icon: CreditCard },
  { id: 3, title: 'Emprego', icon: Briefcase },
  { id: 4, title: 'Veículo', icon: Car },
  { id: 5, title: 'Contato de Emergência', icon: Phone },
  { id: 6, title: 'Observações', icon: FileText },
];

export function DriverRegister({ open, onOpenChange }: DriverRegisterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseClass: '',
    employeeId: '',
    startDate: '',
    department: '',
    vehicle: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    notes: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    onOpenChange(false);
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: '',
      licenseClass: '',
      employeeId: '',
      startDate: '',
      department: '',
      vehicle: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: '',
      notes: '',
    });
  };

  const getCurrentStepIcon = (step: number) => {
    const StepIcon = steps[step - 1].icon;
    if (step < currentStep) return <Check className="h-4 w-4" />;
    return <StepIcon className="h-4 w-4" />;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  className="w-full"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Digite o nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  className="w-full"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Digite o sobrenome"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  className="w-full"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="motorista@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="w-full"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="(11) 91234-5678"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número da CNH</Label>
                <Input
                  id="licenseNumber"
                  className="w-full"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    updateFormData('licenseNumber', e.target.value)
                  }
                  placeholder="Digite o número da CNH"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">Validade</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  className="w-full"
                  value={formData.licenseExpiry}
                  onChange={(e) =>
                    updateFormData('licenseExpiry', e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseClass">Categoria</Label>
              <Select
                value={formData.licenseClass}
                onValueChange={(value) => updateFormData('licenseClass', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdl-a">Categoria A</SelectItem>
                  <SelectItem value="cdl-b">Categoria B</SelectItem>
                  <SelectItem value="cdl-c">Categoria C</SelectItem>
                  <SelectItem value="regular">CNH Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Matrícula</Label>
                <Input
                  id="employeeId"
                  className="w-full"
                  value={formData.employeeId}
                  onChange={(e) => updateFormData('employeeId', e.target.value)}
                  placeholder="Digite a matrícula"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  className="w-full"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => updateFormData('department', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Entregas</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                  <SelectItem value="logistics">Logística</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label htmlFor="vehicle">Veículo Atribuído</Label>
            <Select
              value={formData.vehicle}
              onValueChange={(value) => updateFormData('vehicle', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o veículo (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck-t001">Caminhão - T001</SelectItem>
                <SelectItem value="truck-t002">Caminhão - T002</SelectItem>
                <SelectItem value="van-v001">Van - V001</SelectItem>
                <SelectItem value="van-v002">Van - V002</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Nome do Contato</Label>
                <Input
                  id="emergencyName"
                  className="w-full"
                  value={formData.emergencyName}
                  onChange={(e) =>
                    updateFormData('emergencyName', e.target.value)
                  }
                  placeholder="Digite o nome do contato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  className="w-full"
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    updateFormData('emergencyPhone', e.target.value)
                  }
                  placeholder="(11) 91234-5678"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelation">Parentesco</Label>
              <Input
                id="emergencyRelation"
                className="w-full"
                value={formData.emergencyRelation}
                onChange={(e) =>
                  updateFormData('emergencyRelation', e.target.value)
                }
                placeholder="Ex.: Esposo(a), Pai/Mãe, Irmão(ã)"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              className="w-full"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Informações adicionais sobre o motorista..."
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-[100vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Novo Motorista</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress
            value={(currentStep / steps.length) * 100}
            className="w-full"
          />

          <div className="flex flex-wrap justify-between gap-y-2 text-sm">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  step.id === currentStep
                    ? 'text-primary font-medium'
                    : step.id < currentStep
                      ? 'text-primary'
                      : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    step.id <= currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground'
                  }`}
                >
                  {getCurrentStepIcon(step.id)}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6">
          <h3 className="mb-4 text-lg font-semibold">
            {steps[currentStep - 1].title}
          </h3>
          {renderStepContent()}
        </div>

        <div className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              className="bg-foreground hover:opacity-90"
            >
              <Check className="mr-2 h-4 w-4" />
              Registrar Motorista
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Avançar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
