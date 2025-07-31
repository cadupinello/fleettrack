import { AuthProvider, useAuth } from '@/context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { routeTree } from './route-tree.gen';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface RouterContext {
    queryClient: QueryClient;
    authentication: ReturnType<typeof useAuth>;
  }
}

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    authentication: undefined!,
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

function App() {
  const auth = useAuth();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          defaultPreload="intent"
          context={{
            authentication: auth,
            queryClient,
          }}
        />
      </QueryClientProvider>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
