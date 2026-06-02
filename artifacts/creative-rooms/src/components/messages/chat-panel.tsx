import {
  Video,
  Phone,
  MoreHorizontal,
  Info,
} from "lucide-react";
import type { DemoConversation, DemoMessage } from "@/lib/messages-demo-data";
import { AudioMessageCard } from "@/components/messages/audio-message-card";
import { MessageComposer } from "@/components/messages/message-composer";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  conversation: DemoConversation;
  messages: DemoMessage[];
}

function ReplyThread({
  count,
  avatars,
}: {
  count: number;
  avatars: string[];
}) {
  return (
    <div className="cr-msg-replies">
      <div className="cr-msg-reply-avatars">
        {avatars.map((a, i) => (
          <span key={i} className="cr-msg-reply-avatar">
            {a}
          </span>
        ))}
      </div>
      <span className="cr-msg-reply-count">{count} replies</span>
    </div>
  );
}

function SeenRow({ count, avatars }: { count: number; avatars: string[] }) {
  return (
    <div className="cr-msg-seen">
      <span>Seen by {count}</span>
      <div className="cr-msg-seen-avatars">
        {avatars.map((a, i) => (
          <span key={i} className="cr-msg-seen-avatar">
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({ conversation, messages }: ChatPanelProps) {
  const initials = conversation.avatarInitials ?? ["L", "N", "E"];

  return (
    <section className="cr-msg-chat">
      <header className="cr-msg-chat-header">
        <div className="cr-msg-chat-header-left">
          <div className="cr-msg-chat-avatar-stack">
            {initials.slice(0, 3).map((init, i) => (
              <span key={i} className="cr-msg-chat-avatar-chip">
                {init}
              </span>
            ))}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="cr-msg-chat-title truncate">{conversation.title}</h2>
              {conversation.isOnline && <span className="cr-msg-online-dot cr-msg-online-dot--sm" />}
            </div>
            {conversation.memberCount != null && (
              <p className="cr-msg-chat-members">{conversation.memberCount} members</p>
            )}
          </div>
        </div>
        <div className="cr-msg-chat-actions">
          <button type="button" className="cr-msg-chat-action" aria-label="Voice call">
            <Phone className="w-4 h-4" />
          </button>
          <button type="button" className="cr-msg-chat-action" aria-label="Video">
            <Video className="w-4 h-4" />
          </button>
          <button type="button" className="cr-msg-chat-action" aria-label="Info">
            <Info className="w-4 h-4" />
          </button>
          <button type="button" className="cr-msg-chat-action" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="cr-msg-chat-scroll">
        {messages.map((msg) => {
          if (msg.type === "audio") {
            return (
              <div
                key={msg.id}
                className={cn("cr-msg-row", msg.incoming ? "cr-msg-row--in" : "cr-msg-row--out")}
              >
                <div className="cr-msg-bubble-wrap">
                  <AudioMessageCard
                    audio={msg.audio}
                    incoming={msg.incoming}
                    seed={msg.id.charCodeAt(1)}
                  />
                  {msg.replyCount && msg.replyAvatars && (
                    <ReplyThread count={msg.replyCount} avatars={msg.replyAvatars} />
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={cn("cr-msg-row", msg.incoming ? "cr-msg-row--in" : "cr-msg-row--out")}
            >
              <div className="cr-msg-bubble-wrap">
                <div
                  className={cn(
                    "cr-msg-bubble",
                    msg.incoming ? "cr-msg-bubble--in" : "cr-msg-bubble--out",
                  )}
                >
                  <p>{msg.body}</p>
                  {msg.reactions?.map((r) => (
                    <span key={r} className="cr-msg-reaction">
                      {r}
                    </span>
                  ))}
                </div>
                {msg.replyCount && msg.replyAvatars && (
                  <ReplyThread count={msg.replyCount} avatars={msg.replyAvatars} />
                )}
                {msg.seenBy && msg.seenAvatars && (
                  <SeenRow count={msg.seenBy} avatars={msg.seenAvatars} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MessageComposer placeholder={`Message ${conversation.title}…`} />
    </section>
  );
}
