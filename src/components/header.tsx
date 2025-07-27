import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/50 h-18 shadow-sm backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-foreground text-xl font-semibold">
              FleetTracker
            </h1>
            <p className="text-muted-foreground text-sm">
              Sistema de Gerenciamento de Motoristas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
