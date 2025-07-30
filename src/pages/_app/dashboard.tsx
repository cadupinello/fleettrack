import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboard')({
  beforeLoad: async ({ context }) => {
    const user =
      context.authentication.user ?? (await context.authentication.refetchMe());

    if (!user) throw redirect({ to: '/sign-in' });
  },
  component: Dashboard,
});

function Dashboard() {
  const estatisticas = [
    {
      title: 'Total de Motoristas',
      value: '24',
      icon: 'Users',
      trend: '+2 nesta semana',
      variant: 'default' as const,
    },
    {
      title: 'Veículos Ativos',
      value: '18',
      icon: 'Car',
      trend: '75% de utilização',
      variant: 'default' as const,
    },
    {
      title: 'Em Rota',
      value: '12',
      icon: 'MapPin',
      trend: '8 concluídas hoje',
      variant: 'default' as const,
    },
    {
      title: 'Alertas',
      value: '3',
      icon: 'AlertTriangle',
      trend: '2 resolvidos',
      variant: 'destructive' as const,
    },
  ];

  const atividadesRecentes = [
    {
      driver: 'João Silva',
      status: 'Em Rota',
      location: 'Centro',
      time: '10:30',
    },
    {
      driver: 'Sarah Oliveira',
      status: 'Entregue',
      location: 'Aeroporto',
      time: '10:15',
    },
    {
      driver: 'Miguel Santos',
      status: 'Carregando',
      location: 'Depósito',
      time: '09:45',
    },
    {
      driver: 'Larissa Costa',
      status: 'Pausa',
      location: 'Parada de Descanso',
      time: '09:30',
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Painel</h1>
          <p className="text-muted-foreground">
            Monitore suas operações de frota em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {estatisticas.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atividadesRecentes.map((atividade, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{atividade.driver}</p>
                      <p className="text-muted-foreground text-sm">
                        {atividade.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          atividade.status === 'Entregue'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {atividade.status}
                      </Badge>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {atividade.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <TrendingUp className="h-5 w-5" /> */}
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                {/* <Users className="h-4 w-4 mr-2" /> */}
                Adicionar Novo Motorista
              </Button>
              <Button className="w-full justify-start" variant="outline">
                {/* <MapPin className="h-4 w-4 mr-2" /> */}
                Ver Mapa Ao Vivo
              </Button>
              <Button className="w-full justify-start" variant="outline">
                {/* <Car className="h-4 w-4 mr-2" /> */}
                Status dos Veículos
              </Button>
              <Button className="w-full justify-start" variant="outline">
                {/* <CheckCircle className="h-4 w-4 mr-2" /> */}
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
