import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import type { IUser } from '@/context/authContext';
import { Link } from '@tanstack/react-router';
import {
  Bell,
  LayoutDashboard,
  MapPin,
  Settings,
  User,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { title: 'Painel', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Motoristas', url: '/drivers', icon: Users },
  { title: 'Mapa em Tempo Real', url: '/maps', icon: MapPin },
];

export function AppSidebar({ user }: { user: IUser | null }) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-card border-border border-r">
        <div className="p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <div>
                <h2 className="text-foreground flex items-center font-semibold">
                  <span className="text-green-600">Fleet</span>Tracker
                </h2>
                <p className="text-muted-foreground text-xs">
                  Gerenciamento de Motoristas
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-card">
        <div className="border-border rounded-md border p-1">
          <div
            className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${collapsed ? 'h-8 w-8 p-0' : 'h-8 justify-start gap-3'}`}
                >
                  <div className="bg-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                    <User className="h-3 w-3 text-zinc-50" />
                  </div>
                  {!collapsed && (
                    <span className="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {user?.name}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <Link
                    to={'/settings/profile/$userId'}
                    params={{ userId: String(user?.id) }}
                    className="flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
