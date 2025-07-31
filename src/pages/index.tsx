import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const user =
      context.authentication.user ?? (await context.authentication.refetchMe());
    if (!user) throw redirect({ to: '/sign-in' });
    else throw redirect({ to: '/dashboard' });
  },
  component: () => null,
});
