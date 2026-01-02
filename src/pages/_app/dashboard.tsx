import { useGetTrips } from '@/api/queries/trip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';
import type { Trip } from '@/types/trip';
import { createFileRoute, redirect } from '@tanstack/react-router';
import {
    Activity,
    AlertTriangle,
    Car,
    CheckCircle,
    Clock,
    MapPin,
    Navigation,
    TrendingUp,
    Users,
} from 'lucide-react';
import { TripCard } from './trips/components/TripCard';

export const Route = createFileRoute('/_app/dashboard')({
  beforeLoad: async ({ context }) => {
    const user =
      context?.authentication?.user ??
      (await context.authentication.refetchMe());

    if (!user) throw redirect({ to: '/sign-in' });
  },
  component: Dashboard,
});

function Dashboard() {
  const { user, hasRole } = useAuth();
  const { trips } = useGetTrips();
  const isDriver = hasRole(['DRIVER']);

  const activeTrip = trips?.find((t: Trip) => t.status === 'IN_PROGRESS' || t.status === 'PLANNED');

  const stats = [
    {
      title: 'Total Drivers',
      value: '24',
      icon: Users,
      trend: '+2 this week',
      change: '+8%',
    },
    {
      title: 'Active Vehicles',
      value: '18',
      icon: Car,
      trend: '75% utilization',
      change: '+12%',
    },
    {
      title: 'On Route',
      value: '12',
      icon: MapPin,
      trend: '8 completed today',
      change: '+5%',
    },
    {
      title: 'Alerts',
      value: '3',
      icon: AlertTriangle,
      trend: '2 resolved',
      change: '-15%',
    },
  ];

  const recentActivity = [
    {
      driver: 'John Smith',
      status: 'En Route',
      location: 'Downtown',
      time: '10:30',
    },
    {
      driver: 'Sarah Johnson',
      status: 'Delivered',
      location: 'Airport',
      time: '10:15',
    },
    {
      driver: 'Mike Davis',
      status: 'Loading',
      location: 'Warehouse',
      time: '09:45',
    },
    {
      driver: 'Lisa Wilson',
      status: 'Break',
      location: 'Rest Stop',
      time: '09:30',
    },
  ];

  const quickActions = [
    { label: 'Add Driver', icon: Users, color: 'bg-blue-500/10 text-blue-600' },
    {
      label: 'Live Map',
      icon: MapPin,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Vehicle Status',
      icon: Car,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      label: 'Generate Report',
      icon: CheckCircle,
      color: 'bg-orange-500/10 text-orange-600',
    },
  ];

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
          Olá, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {isDriver 
            ? 'Veja abaixo o status da sua viagem e comece sua jornada.' 
            : 'Bem-vindo ao painel de controle da frota.'}
        </p>
      </div>

      {isDriver && (activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Navigation className="h-5 w-5 animate-pulse" />
              <span>Sua Viagem {activeTrip.status === 'IN_PROGRESS' ? 'em Andamento' : 'Próxima'}</span>
            </div>
            <TripCard trip={activeTrip} />
          </div>
          
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 h-full flex flex-col justify-center text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Mantenha o Foco</h3>
                <p className="text-sm text-muted-foreground">
                  Lembre-se de reportar qualquer atraso ou ocorrência durante o trajeto. Sua localização é monitorada em tempo real para sua segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 border-2 border-dashed rounded-2xl p-12 text-center space-y-4">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto opacity-50">
            <Navigation className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl">Nenhuma viagem ativa</h3>
            <p className="text-muted-foreground">Você não possui viagens designadas para agora.</p>
          </div>
        </div>
      ))}

      {!isDriver && (
        <>
          {/* Stats Grid - Compact */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border-border/50 rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <stat.icon className="text-primary h-4 w-4" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      stat.change.startsWith('+')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-foreground text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-xs font-medium">
                    {stat.title}
                  </p>
                  <p className="text-muted-foreground text-xs">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Activity - Compact */}
            <div className="lg:col-span-2">
              <div className="bg-card border-border/50 rounded-xl border p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="text-primary h-5 w-5" />
                  <h3 className="text-foreground font-semibold">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted/30 flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-full">
                          <span className="text-primary-foreground text-xs font-medium">
                            {activity.driver
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {activity.driver}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {activity.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            activity.status === 'Delivered'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions - Minimal */}
            <div>
              <div className="bg-card border-border/50 rounded-xl border p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="text-primary h-5 w-5" />
                  <h3 className="text-foreground font-semibold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="hover:bg-primary/5 flex h-auto flex-col items-center gap-2 p-4"
                    >
                      <div className={`rounded-lg p-2 ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
