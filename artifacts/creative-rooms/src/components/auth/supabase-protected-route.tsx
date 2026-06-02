/**
 * PAUSED — not used by any route. Kept for a future auth pass.
 */
import type { ComponentType, ReactNode } from "react";
import { Redirect } from "wouter";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { AsyncStateBanner } from "@/components/ui/async-state";

type SupabaseProtectedRouteProps = {
  component?: ComponentType;
  children?: ReactNode;
  hideLayout?: boolean;
  /** Wrapper when layout is shown (e.g. AppLayout). */
  layout?: ComponentType<{ children: ReactNode }>;
};

/**
 * When Supabase env is configured, requires an authenticated session.
 * When not configured, renders children unchanged (Clerk / dev bypass unchanged).
 */
export function SupabaseProtectedRoute({
  component: Component,
  children,
  layout: Layout,
}: SupabaseProtectedRouteProps) {
  const { configured, isLoading, session } = useSupabaseAuth();

  if (!configured) {
    if (Component) return <Component />;
    return <>{children}</>;
  }

  if (isLoading) {
    return <AsyncStateBanner state="loading" message="Checking session…" />;
  }

  if (!session) {
    return <Redirect to="/login" />;
  }

  const content = Component ? <Component /> : children;

  if (Layout) {
    return <Layout>{content}</Layout>;
  }

  return <>{content}</>;
}
