import { Search, SlidersHorizontal, PenSquare } from "lucide-react";
import { MessageList } from "@/components/messages/message-list";
import {
  MESSAGE_TABS,
  type DemoConversation,
  type MessageTab,
} from "@/lib/messages-demo-data";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  conversations: DemoConversation[];
  activeId: string;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  activeTab: MessageTab;
  onTabChange: (tab: MessageTab) => void;
  unreadTotal: number;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  unreadTotal,
}: ConversationSidebarProps) {
  return (
    <aside className="cr-msg-sidebar">
      <header className="cr-msg-sidebar-header">
        <h1 className="cr-msg-page-title font-serif">Messages</h1>
        <button type="button" className="cr-msg-new-btn">
          <PenSquare className="w-4 h-4" />
          New message
        </button>
      </header>

      <div className="cr-msg-search-wrap">
        <Search className="w-4 h-4 shrink-0 opacity-50" strokeWidth={1.75} />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search messages…"
          className="cr-msg-search"
        />
        <button type="button" className="cr-msg-search-filter" aria-label="Filter">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="cr-msg-tabs" role="tablist">
        {MESSAGE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
            className={cn("cr-msg-tab", activeTab === tab && "cr-msg-tab--active")}
          >
            {tab}
            {tab === "Unread" && unreadTotal > 0 && (
              <span className="cr-msg-tab-badge">{unreadTotal}</span>
            )}
          </button>
        ))}
      </div>

      <MessageList
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
      />
    </aside>
  );
}
