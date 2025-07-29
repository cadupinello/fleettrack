import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const user = await context.authentication.refetchMe();
    if (!user) throw redirect({ to: '/sign-in' });
  },
  component: () => null,
});
