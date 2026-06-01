import { Search, Upload, Circle } from "lucide-react";
import { Link } from "wouter";
import {
  HOOK_FILTER_CHIPS,
  HOOK_FEED_TOGGLES,
  type HookFilterChip,
  type HookFeedToggle,
} from "@/lib/hooks-feed-data";
import { cn } from "@/lib/utils";

interface HooksToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeChip: HookFilterChip;
  onChipChange: (chip: HookFilterChip) => void;
  activeToggle: HookFeedToggle;
  onToggleChange: (t: HookFeedToggle) => void;
  onDropHook?: () => void;
}

export function HooksToolbar({
  search,
  onSearchChange,
  activeChip,
  onChipChange,
  activeToggle,
  onToggleChange,
  onDropHook,
}: HooksToolbarProps) {
  return (
    <header className="cr-hooks-header shrink-0">
      <div className="cr-hooks-header-top">
        <div>
          <h1 className="cr-hooks-title font-serif">Hooks</h1>
          <p className="cr-hooks-subtitle">
            Discover, listen, and build on ideas from the community.
          </p>
        </div>
        <div className="cr-hooks-header-actions">
          {onDropHook && (
            <button type="button" onClick={onDropHook} className="cr-hooks-btn-outline">
              <Upload className="w-4 h-4" />
              Upload hook
            </button>
          )}
          <Link href="/rooms/demo" className="cr-hooks-btn-primary">
            <Circle className="w-3.5 h-3.5 fill-current" />
            Record in a room
          </Link>
        </div>
      </div>

      <div className="cr-hooks-filter-bar">
        <div className="cr-hooks-search-wrap">
          <Search className="w-4 h-4 shrink-0 opacity-50" strokeWidth={1.75} />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search hooks, moods, creators…"
            className="cr-hooks-search"
          />
        </div>
        <div className="cr-hooks-filter-selects">
          <button type="button" className="cr-hooks-filter-select">
            Key
          </button>
          <button type="button" className="cr-hooks-filter-select">
            BPM
          </button>
          <button type="button" className="cr-hooks-filter-select">
            Mood
          </button>
          <button type="button" className="cr-hooks-filter-select">
            More filters
          </button>
        </div>
        <button type="button" className="cr-hooks-sort-btn">
          Latest
        </button>
      </div>

      <div className="cr-hooks-tabs">
        {HOOK_FEED_TOGGLES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onToggleChange(t)}
            className={cn("cr-hooks-tab", activeToggle === t && "cr-hooks-tab--active")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="cr-hooks-chips-row">
        {HOOK_FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChipChange(chip)}
            className={cn("cr-hooks-chip", activeChip === chip && "cr-hooks-chip--active")}
          >
            {chip}
          </button>
        ))}
      </div>
    </header>
  );
}
