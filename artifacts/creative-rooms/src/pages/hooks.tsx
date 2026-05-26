import { useState } from "react";
import { useUser } from "@clerk/react";
import { useListHooks } from "@workspace/api-client-react";
import { HookCard } from "@/components/hooks/hook-card";
import { DropHookModal } from "@/components/hooks/drop-hook-modal";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { Button } from "@/components/ui/button";
import { Loader2, Radio } from "lucide-react";

export function HooksPage() {
  const { isSignedIn } = useUser();
  const { data: hooks, isLoading } = useListHooks();
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);

  const handleDropClick = () => {
    if (!isSignedIn) {
      setGuestPromptOpen(true);
    } else {
      setDropModalOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,163,65,0.15)", border: "1px solid rgba(212,163,65,0.3)" }}
            >
              <Radio className="w-4 h-4" style={{ color: "#d4a341" }} />
            </div>
            <h1 className="font-serif text-2xl text-foreground">Creative Hooks</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            Unfinished ideas looking for someone to hear them. Drop a signal — see who shows up.
          </p>
        </div>

        <Button
          onClick={handleDropClick}
          className="flex-shrink-0 h-9 px-5 font-semibold rounded-full transition-all hover:brightness-110 text-sm"
          style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00", border: "none" }}
        >
          Drop a Hook
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !hooks || hooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
            style={{ background: "rgba(212,163,65,0.08)", border: "1px solid rgba(212,163,65,0.15)" }}
          >
            <Radio className="w-7 h-7" style={{ color: "rgba(212,163,65,0.4)" }} />
          </div>
          <p className="text-muted-foreground text-base">No hooks dropped yet.</p>
          <p className="text-muted-foreground/60 text-sm max-w-xs">
            Be the first to send a signal into the world.
          </p>
          <Button
            onClick={handleDropClick}
            className="mt-2 h-9 px-6 font-semibold rounded-full transition-all hover:brightness-110 text-sm"
            style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00", border: "none" }}
          >
            Drop the first hook
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hooks.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      )}

      {/* Modals */}
      <DropHookModal open={dropModalOpen} onClose={() => setDropModalOpen(false)} />
      <GuestSignupPrompt
        open={guestPromptOpen}
        reason="drop a hook"
        onClose={() => setGuestPromptOpen(false)}
      />
    </div>
  );
}
