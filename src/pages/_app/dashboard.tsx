import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return <div>Hello "/_app/dashboard"!</div>;
}
