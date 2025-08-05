import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { createFileRoute } from '@tanstack/react-router';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_app/settings/profile/$userId')({
  component: Profile,
});

function Profile() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    tripUpdates: true,
    emergencyAlerts: true,
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: 'TransLog Brasil',
    email: 'contato@translog.com.br',
    phone: '(11) 9999-8888',
    address: 'Rua das Empresas, 123 - São Paulo, SP',
    timezone: 'America/Sao_Paulo',
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
          <CardDescription>
            Configure as informações básicas da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                value={companyInfo.name}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">E-mail</Label>
              <Input
                id="company-email"
                type="email"
                value={companyInfo.email}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefone</Label>
              <Input
                id="company-phone"
                value={companyInfo.phone}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select
                value={companyInfo.timezone}
                onValueChange={(value) =>
                  setCompanyInfo({ ...companyInfo, timezone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">
                    Brasília (UTC-3)
                  </SelectItem>
                  <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                  <SelectItem value="America/Rio_Branco">
                    Rio Branco (UTC-5)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-address">Endereço</Label>
            <Textarea
              id="company-address"
              value={companyInfo.address}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, address: e.target.value })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
