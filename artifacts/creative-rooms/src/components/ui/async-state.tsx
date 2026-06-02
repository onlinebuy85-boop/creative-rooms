import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AsyncState = "loading" | "error" | "idle";

export function AsyncStateBanner({
  state,
  message,
  className,
}: {
  state: AsyncState;
  message?: string;
  className?: string;
}) {
  if (state === "idle") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
        state === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border/60 bg-muted/20 text-muted-foreground",
        className,
      )}
      role={state === "error" ? "alert" : "status"}
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>{message ?? (state === "loading" ? "Loading…" : "Something went wrong.")}</span>
    </div>
  );
}

export function AsyncStateInline({
  state,
  message,
}: {
  state: AsyncState;
  message?: string;
}) {
  if (state === "idle") return null;

  return (
    <p
      className={cn(
        "text-sm py-8 text-center",
        state === "error" ? "text-destructive" : "text-[#b39b85]",
      )}
    >
      {state === "loading" && (
        <Loader2 className="inline h-4 w-4 animate-spin mr-2 align-[-2px]" aria-hidden />
      )}
      {message ?? (state === "loading" ? "Loading…" : "Could not load data.")}
    </p>
  );
}
