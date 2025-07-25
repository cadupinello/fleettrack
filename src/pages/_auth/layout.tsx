import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

export function AuthLayout() {
  return (
    <div>
      <h1>Hello "/_auth/layout"!</h1>
      <Outlet />
    </div>
  );
}
