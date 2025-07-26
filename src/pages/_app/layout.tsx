import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: LayoutDashboard,
});

function LayoutDashboard() {
  return (
    <div>
      Hello "/_app"! <Outlet />
    </div>
  );
}
