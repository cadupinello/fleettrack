import { AppSidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/context/authContext';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: LayoutDashboard,
});

function LayoutDashboard() {
  const { user } = useAuth();
  console.log('USUARIO', user);

  return (
    <SidebarProvider>
      <div className="bg-background flex min-h-screen w-full">
        <AppSidebar user={user || null} />
        <main className="flex flex-1 flex-col">
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
