import { Search, Plus, SlidersHorizontal, MoreHorizontal, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import {
  ROOM_FILTER_TABS,
  type RoomFilterTab,
} from "@/lib/rooms-demo-data";
import { cn } from "@/lib/utils";

interface RoomsToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeTab: RoomFilterTab;
  onTabChange: (tab: RoomFilterTab) => void;
}

export function RoomsToolbar({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
}: RoomsToolbarProps) {
  return (
    <header className="cr-rooms-header shrink-0">
      <div className="cr-rooms-header-top">
        <div>
          <h1 className="cr-rooms-title font-serif">Rooms</h1>
          <p className="cr-rooms-subtitle">
            Jump into a room, meet creators, and make something together.
          </p>
        </div>
        <div className="cr-rooms-header-actions">
          <Link href="/rooms/new" className="cr-rooms-btn-primary">
            <Plus className="w-4 h-4" />
            Create a room
          </Link>
          <button type="button" className="cr-rooms-btn-icon" aria-label="More options">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="cr-rooms-search-wrap">
        <Search className="w-4 h-4 shrink-0 opacity-50" strokeWidth={1.75} />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search rooms, genres, or keywords…"
          className="cr-rooms-search"
        />
      </div>

      <div className="cr-rooms-tabs">
        {ROOM_FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn("cr-rooms-tab", activeTab === tab && "cr-rooms-tab--active")}
          >
            {tab === "Live now" && (
              <span className="cr-rooms-tab-live-dot" aria-hidden />
            )}
            {tab}
          </button>
        ))}
      </div>

      <div className="cr-rooms-filter-bar">
        {(["Genre", "Vibe", "People", "Status"] as const).map((label) => (
          <button key={label} type="button" className="cr-rooms-filter-select">
            {label}
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </button>
        ))}
        <button type="button" className="cr-rooms-filter-select">
          Sort by
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </button>
        <button type="button" className="cr-rooms-filter-advanced">
          <SlidersHorizontal className="w-4 h-4" />
          Advanced filters
        </button>
      </div>
    </header>
  );
}
