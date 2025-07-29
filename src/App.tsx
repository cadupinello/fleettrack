import { AuthProvider, useAuth } from '@/context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';

const query = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    authentication: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  const routerWithAuth = createRouter({
    routeTree,
    context: {
      authentication: auth,
    },
  });

  return <RouterProvider router={routerWithAuth} />;
}

function App() {
  return (
    <QueryClientProvider client={query}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
