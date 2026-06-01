import { useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { useListHooks, useGetMyProfile, useActivateCreator, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { HookFeedCard } from "@/components/hooks/hook-feed-card";
import { HooksToolbar } from "@/components/hooks/hooks-toolbar";
import { HooksAppShell } from "@/components/hooks/hooks-app-shell";
import { DropHookModal } from "@/components/hooks/drop-hook-modal";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { CreatorUpgradePrompt } from "@/components/creator-upgrade-prompt";
import {
  filterFeedItems,
  resolveHooksFeed,
  type HookFilterChip,
  type HookFeedToggle,
  type HookFeedItem,
} from "@/lib/hooks-feed-data";
import { Radio, Loader2 } from "lucide-react";

export function HooksPage() {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const { data: hooks, isLoading } = useListHooks();
  const { data: myProfile } = useGetMyProfile({
    query: { queryKey: getGetMyProfileQueryKey(), enabled: isSignedIn === true, retry: false },
  });
  const activateCreator = useActivateCreator();
  const isCreator = !!myProfile?.isCreator;

  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<HookFilterChip>("All");
  const [activeToggle, setActiveToggle] = useState<HookFeedToggle>("For you");
  const [activeHook, setActiveHook] = useState<HookFeedItem | null>(null);
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);

  const { items: feedItems } = useMemo(
    () => resolveHooksFeed(hooks, isLoading),
    [hooks, isLoading],
  );

  const filtered = useMemo(
    () => filterFeedItems(feedItems, activeChip, search, activeToggle),
    [feedItems, activeChip, search, activeToggle],
  );

  const handleDropClick = () => {
    if (!isSignedIn) setGuestPromptOpen(true);
    else if (!isCreator) setUpgradePromptOpen(true);
    else setDropModalOpen(true);
  };

  return (
    <HooksAppShell activeHook={activeHook}>
      <div className="cr-hooks-page">
        <HooksToolbar
          search={search}
          onSearchChange={setSearch}
          activeChip={activeChip}
          onChipChange={setActiveChip}
          activeToggle={activeToggle}
          onToggleChange={setActiveToggle}
          onDropHook={handleDropClick}
        />

        <div className="cr-hooks-feed">
          {isLoading ? (
            <div className="cr-hooks-empty">
              <Loader2 className="w-8 h-8 animate-spin text-[#d8aa72]/60" />
              <p className="text-sm text-[#b39b85] font-light italic">Gathering hooks…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="cr-hooks-empty">
              <div className="cr-hooks-empty-icon">
                <Radio className="w-6 h-6 text-[#d8aa72]/60" />
              </div>
              <p className="text-sm text-[#b39b85] max-w-xs text-center">
                Nothing matches yet. Try another filter — or share something unfinished.
              </p>
              <button type="button" onClick={handleDropClick} className="cr-hooks-btn-primary">
                Upload hook
              </button>
            </div>
          ) : (
            <div className="cr-hooks-feed-list">
              {filtered.map((hook) => (
                <HookFeedCard
                  key={hook.id}
                  hook={hook}
                  onPlay={(h) => setActiveHook(h)}
                />
              ))}
            </div>
          )}
        </div>

        <DropHookModal open={dropModalOpen} onClose={() => setDropModalOpen(false)} />
        <GuestSignupPrompt
          open={guestPromptOpen}
          reason="share a hook"
          onClose={() => setGuestPromptOpen(false)}
        />
        <CreatorUpgradePrompt
          open={upgradePromptOpen}
          reason="share a hook"
          onClose={() => setUpgradePromptOpen(false)}
          onActivate={() => {
            activateCreator.mutate(undefined, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
                setUpgradePromptOpen(false);
              },
            });
          }}
          activating={activateCreator.isPending}
        />
      </div>
    </HooksAppShell>
  );
}
