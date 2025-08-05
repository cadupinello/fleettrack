import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SettingsIcon } from 'lucide-react';

export const Route = createFileRoute('/_app/settings')({
  component: LayoutSettings,
});

function LayoutSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Geral
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Outlet />
        </TabsContent>
      </Tabs>
    </div>
  );
}
