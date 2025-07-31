import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';

import { useAuth } from '@/context/authContext';
import { QueryClient } from '@tanstack/react-query';

export const Route = createRootRouteWithContext<{
  authentication: ReturnType<typeof useAuth>;
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
