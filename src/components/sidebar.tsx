import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { LayoutDashboard, MapPin, Users } from 'lucide-react';

const navItems = [
  { title: 'Painel', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Motoristas', url: '/drivers', icon: Users },
  { title: 'Mapa em Tempo Real', url: '/maps', icon: MapPin },
];

export function AppSidebar() {
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
    </Sidebar>
  );
}
