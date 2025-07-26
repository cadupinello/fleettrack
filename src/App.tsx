import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const query = new QueryClient();
  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
