import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fetchHooks } from "@/lib/supabase/hooks";

export const supabaseHooksQueryKey = ["supabase", "hooks"] as const;

export function useSupabaseHooksList() {
  const enabled = isSupabaseConfigured();

  return useQuery({
    queryKey: supabaseHooksQueryKey,
    queryFn: () => fetchHooks(true),
    enabled,
    staleTime: 30_000,
  });
}
