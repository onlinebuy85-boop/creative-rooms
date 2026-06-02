import { Redirect } from "wouter";

/** No marketing landing — app opens on the dense 3-column home */
export function LandingPage() {
  return <Redirect to="/discover" />;
}
