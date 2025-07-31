import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/settings/profile/$userId')({
  component: Profile,
});

function Profile() {
  return <div>Hello "/_app/settings/$userId/profile"!</div>;
}
