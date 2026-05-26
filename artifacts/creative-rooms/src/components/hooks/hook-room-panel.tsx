import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetRoomMembers,
  useGetRoomMessages,
  useJoinHook,
  getListHooksQueryKey,
  getGetRoomMembersQueryKey,
  getGetRoomMessagesQueryKey,
} from "@workspace/api-client-react";
import type { Hook } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, X, Play, Pause, ArrowRight, Users, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function seededWave(id: number, bars = 52): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 65) + 20;
  });
}

function seededDuration(id: number): string {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  s = ((s * 1664525) + 1013904223) >>> 0;
  const total = (s % 45) + 12;
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const VIBE_COLORS: Record<string, string> = {
  melancholic: "#7da0d4",
  euphoric: "#d4a341",
  raw: "#d47a5a",
  dreamy: "#a07ed4",
  intense: "#d45a5a",
  nostalgic: "#7ed4a0",
  experimental: "#d4cc5a",
};

interface HookRoomPanelProps {
  hook: Hook;
  onClose: () => void;
}

export function HookRoomPanel({ hook, onClose }: HookRoomPanelProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bars = seededWave(hook.id);
  const duration = seededDuration(hook.id);
  const accent = VIBE_COLORS[hook.vibe?.toLowerCase() ?? ""] ?? "#d4a341";

  const { data: members } = useGetRoomMembers(hook.roomId!, {
    query: { enabled: !!hook.roomId, queryKey: getGetRoomMembersQueryKey(hook.roomId!) },
  });

  const { data: messages } = useGetRoomMessages(hook.roomId!, {
    query: { enabled: !!hook.roomId, queryKey: getGetRoomMessagesQueryKey(hook.roomId!) },
  });

  const joinMutation = useJoinHook({
    mutation: {
      onSuccess: (updated) => {
        queryClient.invalidateQueries({ queryKey: getListHooksQueryKey() });
        if (updated.roomId) {
          setLocation(`/rooms/${updated.roomId}`);
        }
      },
      onError: () => {
        toast({
          title: "Couldn't join",
          description: "This room may be full or no longer active.",
          variant: "destructive",
        });
      },
    },
  });

  const handlePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(hook.audioUrl);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const isFull = hook.seatsLeft === 0 || !hook.isActive;
  const filledSeats = hook.maxSeats - hook.seatsLeft;
  const recentMessages = messages?.slice(-3) ?? [];

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ animation: "slideInRight 0.25s ease both" }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>Hook Room</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Accent bar */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

        <div className="px-5 pt-5 pb-4 space-y-5">
          {/* Creator + fill state */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src={hook.creatorAvatarUrl ?? undefined} />
                <AvatarFallback
                  className="text-[11px]"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {hook.creatorName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {hook.creatorName}
                </p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Creator
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-medium" style={{ color: accent }}>
                {filledSeats} / {hook.maxSeats}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isFull ? "Room full" : "Room filling up"}
              </p>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2
              className="font-serif text-xl leading-snug mb-1"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              {hook.title}
            </h2>
            {hook.description && (
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {hook.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {((hook.lookingFor?.length ?? 0) > 0 || hook.vibe) && (
            <div className="flex flex-wrap gap-1.5">
              {hook.vibe && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  {hook.vibe.toLowerCase()}
                </span>
              )}
              {(hook.lookingFor ?? []).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          {/* Waveform player */}
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlay}
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                style={{
                  background: playing ? `${accent}25` : "rgba(255,255,255,0.08)",
                  border: `1px solid ${playing ? accent + "55" : "rgba(255,255,255,0.12)"}`,
                }}
              >
                {playing ? (
                  <Pause className="w-3.5 h-3.5" style={{ color: accent }} />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: "rgba(255,255,255,0.7)" }} />
                )}
              </button>
              <div className="flex-1 flex items-center gap-px h-9">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full"
                    style={{
                      minWidth: 2,
                      height: `${h}%`,
                      background: playing
                        ? `${accent}${i % 3 === 0 ? "cc" : i % 3 === 1 ? "77" : "44"}`
                        : `rgba(255,255,255,${i % 2 === 0 ? "0.18" : "0.08"})`,
                    }}
                  />
                ))}
              </div>
              <span
                className="flex-shrink-0 text-[11px] tabular-nums"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {duration}
              </span>
            </div>
          </div>
        </div>

        {/* People */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-[10px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            People ({filledSeats}/{hook.maxSeats})
          </p>
          <div className="space-y-2.5">
            {/* Creator */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={hook.creatorAvatarUrl ?? undefined} />
                  <AvatarFallback
                    className="text-[10px]"
                    style={{ background: `${accent}22`, color: accent }}
                  >
                    {hook.creatorName?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background"
                  style={{ background: "#4ade80" }}
                />
              </div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                {hook.creatorName}
              </p>
              <span
                className="text-[10px] ml-auto"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Creator
              </span>
            </div>

            {/* Other members */}
            {(members ?? [])
              .filter((m) => m.profileId !== hook.creatorId)
              .map((member) => (
                <div key={member.profileId} className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={(member as any).avatarUrl} />
                      <AvatarFallback className="text-[10px] bg-muted">
                        {((member as any).displayName ?? "?").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background"
                      style={{ background: "#4ade80" }}
                    />
                  </div>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {(member as any).displayName ?? "Someone"}
                  </p>
                  <span
                    className="text-[10px] ml-auto"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Joined
                  </span>
                </div>
              ))}

            {/* Empty seats */}
            {Array.from({ length: hook.seatsLeft }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-2.5 opacity-40"
              >
                <div
                  className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px dashed rgba(255,255,255,0.15)",
                  }}
                >
                  <Users className="w-3 h-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Empty seat
                </p>
                <span
                  className="text-[10px] ml-auto italic"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Waiting for someone
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent messages (if room exists) */}
        {hook.roomId && recentMessages.length > 0 && (
          <div
            className="px-5 py-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Room Chat
            </p>
            <div className="space-y-2.5">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="h-5 w-5 flex-shrink-0 mt-0.5">
                    <AvatarImage src={msg.senderAvatarUrl ?? undefined} />
                    <AvatarFallback className="text-[8px] bg-muted">
                      {msg.senderName?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-[11px] font-medium mr-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {msg.senderName}
                    </span>
                    <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {msg.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div
        className="flex-shrink-0 p-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {hook.roomId ? (
          <button
            onClick={() => setLocation(`/rooms/${hook.roomId}`)}
            className="w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
          >
            Go to Room <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : isFull ? (
          <div
            className="w-full py-3 rounded-xl text-[13px] flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Lock className="w-3.5 h-3.5" />
            Room is full
          </div>
        ) : (
          <button
            onClick={() => joinMutation.mutate({ id: hook.id })}
            disabled={joinMutation.isPending}
            className="w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
          >
            {joinMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Join the Hook <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
