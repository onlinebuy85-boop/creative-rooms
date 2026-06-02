import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ConversationSidebar } from "@/components/messages/conversation-sidebar";
import { ChatPanel } from "@/components/messages/chat-panel";
import { DetailsPanel } from "@/components/messages/details-panel";
import {
  DEMO_CONVERSATIONS,
  DEMO_MESSAGES,
  DEMO_DETAILS,
  filterConversations,
  getDefaultConversationId,
  type MessageTab,
} from "@/lib/messages-demo-data";

const FALLBACK_DETAIL = DEMO_DETAILS["late-night"];

export function MessagesPage() {
  const [activeId, setActiveId] = useState(getDefaultConversationId);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<MessageTab>("All");

  const filtered = useMemo(
    () => filterConversations(DEMO_CONVERSATIONS, activeTab, search),
    [activeTab, search],
  );

  const unreadTotal = useMemo(
    () => DEMO_CONVERSATIONS.reduce((n, c) => n + c.unreadCount, 0),
    [],
  );

  const activeConversation =
    DEMO_CONVERSATIONS.find((c) => c.id === activeId) ?? DEMO_CONVERSATIONS[0];

  const messages = DEMO_MESSAGES[activeConversation.id] ?? DEMO_MESSAGES["late-night"] ?? [];

  const detail = DEMO_DETAILS[activeConversation.id] ?? FALLBACK_DETAIL;

  return (
    <PageShell
      className="cr-page--messages"
      flush
      mainClassName="cr-page-main--messages"
      rail={
        <DetailsPanel conversation={activeConversation} detail={detail} />
      }
    >
      <div className="cr-messages-split">
        <ConversationSidebar
          conversations={filtered}
          activeId={activeConversation.id}
          onSelect={setActiveId}
          search={search}
          onSearchChange={setSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadTotal={unreadTotal}
        />
        <ChatPanel conversation={activeConversation} messages={messages} />
      </div>
    </PageShell>
  );
}
