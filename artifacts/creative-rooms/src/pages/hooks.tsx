import { useState, useMemo } from "react";
import { useUser } from "@clerk/react";
import { useListHooks } from "@workspace/api-client-react";
import type { Hook } from "@workspace/api-client-react";
import { HookCard } from "@/components/hooks/hook-card";
import { HookRoomPanel } from "@/components/hooks/hook-room-panel";
import { DropHookModal } from "@/components/hooks/drop-hook-modal";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { Loader2, Radio, Upload, Users, Music, Layers, Sparkles } from "lucide-react";

// ── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { label: "All Hooks", value: "all" },
  { label: "Needs Vocals", value: "Vocals" },
  { label: "Needs Drums", value: "Drums" },
  { label: "Needs Lyrics", value: "Lyrics" },
  { label: "Guitar", value: "Guitar" },
  { label: "Piano", value: "Keys" },
  { label: "Electronic", value: "Production" },
  { label: "Collaborator", value: "Collaborator" },
];

function filterHooks(hooks: Hook[], tab: string) {
  if (tab === "all") return hooks;
  return hooks.filter(
    (h) =>
      (h.lookingFor ?? []).some((t) => t.toLowerCase() === tab.toLowerCase()) ||
      (h.tags ?? []).some((t) => t.toLowerCase() === tab.toLowerCase())
  );
}

// ── How Hooks Work section ────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: "1",
    icon: Upload,
    title: "Drop a Hook",
    desc: "Share a short idea with the world.",
  },
  {
    num: "2",
    icon: Radio,
    title: "People Discover",
    desc: "Others listen and feel something in it.",
  },
  {
    num: "3",
    icon: Users,
    title: "Join the Hook",
    desc: "They join if they want to create together.",
  },
  {
    num: "4",
    icon: Music,
    title: "Room Forms",
    desc: "A room is created automatically.",
  },
  {
    num: "5",
    icon: Sparkles,
    title: "Create Together",
    desc: "Ideas turn into demos, songs and something real.",
  },
];

function HowHooksWork() {
  return (
    <div
      className="rounded-2xl px-6 py-8 mt-10"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-4 h-4" style={{ color: "rgba(212,163,65,0.6)" }} />
        <p
          className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          How Hooks Work
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {HOW_STEPS.map((step, i) => (
          <div key={step.num} className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  background: "rgba(212,163,65,0.12)",
                  color: "#d4a341",
                  border: "1px solid rgba(212,163,65,0.25)",
                }}
              >
                {step.num}
              </div>
              {i < HOW_STEPS.length - 1 && (
                <div
                  className="hidden lg:block flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              )}
            </div>
            <div>
              <p
                className="text-[12px] font-semibold mb-0.5"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {step.title}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-6 pt-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]"
        style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.28)" }}
      >
        <span>· Small rooms (2–4 people)</span>
        <span>· First come, first served</span>
        <span>· Respect. Create. Connect.</span>
      </div>

      <p
        className="mt-3 text-[12px] italic"
        style={{ color: "rgba(212,163,65,0.5)" }}
      >
        This is a human creative space.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function HooksPage() {
  const { isSignedIn } = useUser();
  const { data: hooks, isLoading } = useListHooks();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);

  const filtered = useMemo(
    () => filterHooks(hooks ?? [], activeFilter),
    [hooks, activeFilter]
  );

  const handleDropClick = () => {
    if (!isSignedIn) setGuestPromptOpen(true);
    else setDropModalOpen(true);
  };

  const handleCardClick = (hook: Hook) => {
    setSelectedHook((prev) => (prev?.id === hook.id ? null : hook));
  };

  const handleJoinRequest = (hook: Hook) => {
    setSelectedHook(hook);
  };

  const hasPanel = selectedHook !== null;

  return (
    <div
      className="flex flex-col min-h-full w-full max-w-full min-w-0 overflow-x-hidden"
      style={{ animation: "pageIn 0.5s ease both" }}
    >
      {/* ── Page header ── */}
      <div
        className="flex-shrink-0 flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 sm:pt-8 pb-4 sm:pb-5 border-b w-full min-w-0"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="min-w-0 flex-1">
          <h1
            className="font-serif tracking-tight mb-1"
            style={{ fontSize: "clamp(1.6rem, 5.5vw, 2rem)", color: "rgba(255,255,255,0.92)" }}
          >
            Hooks
          </h1>
          <p className="text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>
            Creative signals from around the world.
          </p>
        </div>
        <button
          onClick={handleDropClick}
          className="flex-shrink-0 h-9 px-4 sm:px-5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
        >
          Drop a Hook
        </button>
      </div>

      {/* ── Filter tabs — isolated horizontal scroll ── */}
      <div
        className="flex-shrink-0 w-full max-w-full overflow-x-auto no-scrollbar border-b"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x proximity",
        }}
      >
        <div className="flex gap-1.5 px-4 sm:px-5 py-3 w-max">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition-all whitespace-nowrap"
              style={{
                scrollSnapAlign: "start",
                ...(activeFilter === tab.value
                  ? {
                      background: "rgba(212,163,65,0.15)",
                      color: "#d4a341",
                      border: "1px solid rgba(212,163,65,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.4)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Split body ── */}
      <div className="flex flex-1 overflow-hidden w-full min-w-0">
        {/* Hooks list */}
        <div
          className={`flex-1 min-w-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ${hasPanel ? "hidden lg:block lg:max-w-[55%]" : ""}`}
        >
          <div className="p-4 sm:p-5 space-y-2.5 w-full max-w-full">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
                  style={{
                    background: "rgba(212,163,65,0.07)",
                    border: "1px solid rgba(212,163,65,0.13)",
                  }}
                >
                  <Radio className="w-6 h-6" style={{ color: "rgba(212,163,65,0.35)" }} />
                </div>
                {activeFilter === "all" ? (
                  <>
                    <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      No hooks dropped yet.
                    </p>
                    <p className="text-[13px] max-w-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Be the first to send a signal into the world.
                    </p>
                    <button
                      onClick={handleDropClick}
                      className="mt-2 h-9 px-6 rounded-full text-[12px] font-semibold transition-all hover:brightness-110"
                      style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
                    >
                      Drop the first hook
                    </button>
                  </>
                ) : (
                  <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    No hooks match this filter.
                  </p>
                )}
              </div>
            ) : (
              filtered.map((hook) => (
                <HookCard
                  key={hook.id}
                  hook={hook}
                  selected={selectedHook?.id === hook.id}
                  onClick={() => handleCardClick(hook)}
                  onJoinRequest={() => handleJoinRequest(hook)}
                />
              ))
            )}

            {/* How Hooks Work */}
            {!isLoading && <HowHooksWork />}
          </div>
        </div>

        {/* Hook room panel (right side) */}
        {hasPanel && (
          <div
            className="w-full lg:w-[45%] min-w-0 flex-shrink-0 lg:border-l overflow-hidden flex flex-col"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "hsl(270 14% 5.5%)",
            }}
          >
            <HookRoomPanel hook={selectedHook} onClose={() => setSelectedHook(null)} />
          </div>
        )}
      </div>

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
