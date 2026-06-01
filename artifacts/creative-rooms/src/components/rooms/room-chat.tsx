import { useState } from "react";
import { Send, Hand } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_CHAT, MOCK_ROOM } from "@/lib/room-mock-data";
import { RoomVibe } from "@/components/rooms/room-vibe";
import { cn } from "@/lib/utils";

type Tab = "chat" | "people";

export function RoomChat() {
  const [tab, setTab] = useState<Tab>("chat");
  const [draft, setDraft] = useState("");

  return (
    <div className="cr-room-chat flex flex-col h-full min-h-0">
      <div className="cr-room-chat-tabs shrink-0">
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={cn("cr-room-tab", tab === "chat" && "cr-room-tab-active")}
        >
          Room chat
        </button>
        <button
          type="button"
          onClick={() => setTab("people")}
          className={cn("cr-room-tab", tab === "people" && "cr-room-tab-active")}
        >
          People {MOCK_ROOM.participantCount}
        </button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-1 py-3 space-y-3">
          {tab === "chat" ? (
            MOCK_CHAT.map((msg) =>
              msg.system ? (
                <div key={msg.id} className="cr-chat-system">
                  <p className="text-[12px] text-muted-foreground text-center">
                    {msg.senderName} joined the room
                  </p>
                  <button type="button" className="cr-wave-btn">
                    <Hand className="w-3.5 h-3.5" />
                    Wave
                  </button>
                </div>
              ) : (
                <div key={msg.id} className="cr-chat-card">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback
                      className="text-[10px]"
                      style={{ background: `hsl(${msg.hue} 32% 26%)` }}
                    >
                      {msg.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[12px] font-semibold text-foreground/85">{msg.senderName}</span>
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-foreground/70">{msg.content}</p>
                  </div>
                </div>
              ),
            )
          ) : (
            <ul className="space-y-2 px-1">
              {MOCK_CHAT.filter((m) => !m.system).map((m) => (
                <li key={m.id} className="flex items-center gap-2.5 py-2 px-2 rounded-xl hover:bg-white/[0.03]">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-[10px]" style={{ background: `hsl(${m.hue} 32% 26%)` }}>
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground/80">{m.senderName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>

      <form
        className="shrink-0 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          setDraft("");
        }}
      >
        <div className="cr-chat-input-wrap">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message the room…"
            className="cr-chat-input"
          />
          <button type="submit" className="cr-chat-send" aria-label="Send">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      <div className="shrink-0 pt-3 mt-auto">
        <RoomVibe />
      </div>
    </div>
  );
}
