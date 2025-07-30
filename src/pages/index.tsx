import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const user =
      context.authentication.user ?? (await context.authentication.refetchMe());
    console.log(user);
    if (!user) throw redirect({ to: '/sign-in' });
  },
  component: () => null,
});
