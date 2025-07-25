import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignIn,
  head: () => ({
    meta: [{ title: "Sign In - FleetTrack" }],
  }),
});

function SignIn() {
  return <div>Hello "/_auth/sign-in"!</div>;
}
