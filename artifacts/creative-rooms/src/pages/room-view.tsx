import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGetRoom,
  useGetRoomMembers,
  useGetRoomMessages,
  useGetRoomDemos,
  useSendMessage,
  useUploadDemo,
  useGetMyProfile,
  useJoinRoom,
  useLeaveRoom,
  getGetRoomMessagesQueryKey,
} from "@workspace/api-client-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useVoice } from "@/hooks/use-voice";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Send, Music2, Users, Loader2, ArrowLeft, Headphones,
  LogOut, Mic, MicOff, PhoneCall, PhoneOff,
} from "lucide-react";
import wordmarkImg from "@assets/creative-rooms-wordmark.png";
import { DemoDropzone } from "@/components/demo-dropzone";

/* ── Mood color from room vibe / genres ── */
function moodColor(vibe = "", genres: string[] = []): string {
  const t = `${vibe} ${genres.join(" ")}`.toLowerCase();
  if (/ambient|ethereal|atmospheric|dream/.test(t)) return "99,102,241";   // indigo
  if (/soul|r&b|neo-soul|blues/.test(t)) return "245,158,11";             // amber
  if (/jazz|acoustic|folk|organic/.test(t)) return "132,204,22";          // lime
  if (/electronic|synth|edm|minimal/.test(t)) return "6,182,212";        // cyan
  if (/pop|indie|alternative/.test(t)) return "236,72,153";              // pink
  return "139,92,246";                                                     // purple default
}

/* ── Animated waveform (for speaking / live indicators) ── */
function MiniWave({ color = "#d4a341", active = true }: { color?: string; active?: boolean }) {
  const bars = [3, 6, 9, 7, 5, 8, 6, 4];
  return (
    <div className="flex items-center gap-[1.5px]" style={{ height: 12 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 2,
            height: active ? h : 3,
            background: color,
            transition: "height 0.15s ease",
            animation: active ? `miniWave 1.2s ease-in-out ${i * 0.1}s infinite` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ── Typing dots ── */
function TypingDots() {
  return (
    <span className="inline-flex gap-[3px] items-center ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-white/40"
          style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

/* ── Avatar with optional presence ring ── */
function PresenceAvatar({
  name, avatarUrl, online, inVoice, speaking, size = 6,
}: {
  name: string; avatarUrl?: string | null; online?: boolean; inVoice?: boolean; speaking?: boolean; size?: number;
}) {
  const ringColor = inVoice
    ? speaking ? "#4ade80" : "#f59e0b"
    : online ? "#4ade80" : "transparent";
  return (
    <div className="relative shrink-0" style={{ width: size * 4, height: size * 4 }}>
      <Avatar style={{ width: size * 4, height: size * 4 }}>
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback
          className="text-white"
          style={{
            fontSize: size * 1.8,
            background: `hsl(${(name.charCodeAt(0) * 37) % 360}, 40%, 32%)`,
          }}
        >
          {name?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div
        className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
        style={{
          width: 9,
          height: 9,
          background: ringColor === "transparent" ? "rgba(0,0,0,0.5)" : ringColor,
          borderColor: "rgba(10,8,14,0.9)",
          boxShadow: inVoice && speaking ? `0 0 5px ${ringColor}` : "none",
        }}
      />
    </div>
  );
}

/* ── Demo audio player ── */
function DemoPlayer({ demo }: { demo: { id: number; title: string; description?: string | null; fileUrl: string; uploaderName?: string | null; createdAt: string } }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-2xl transition-all"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105"
        style={{
          background: playing ? "rgba(212,163,65,0.2)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${playing ? "rgba(212,163,65,0.4)" : "rgba(255,255,255,0.1)"}`,
          color: playing ? "#d4a341" : "rgba(255,255,255,0.55)",
        }}
      >
        {playing ? <MiniWave color="#d4a341" active /> : <Music2 className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white/85 truncate">{demo.title}</p>
        {demo.description && (
          <p className="text-[11px] italic text-white/38 truncate mt-0.5">"{demo.description}"</p>
        )}
        <p className="text-[10px] text-white/28 mt-1">
          {demo.uploaderName} · {format(new Date(demo.createdAt), "MMM d")}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={demo.fileUrl}
        onEnded={() => setPlaying(false)}
        preload="none"
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ── Main component ── */
export function RoomPage() {
  const params = useParams<{ id: string }>();
  const roomId = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: profile } = useGetMyProfile();
  const { data: room, isLoading: roomLoading } = useGetRoom(roomId, { query: { enabled: !!roomId, queryKey: ["getRoom", roomId] } });
  const { data: members } = useGetRoomMembers(roomId, { query: { enabled: !!roomId, queryKey: ["getRoomMembers", roomId] } });
  const { data: messages, isLoading: messagesLoading } = useGetRoomMessages(roomId, { query: { enabled: !!roomId, queryKey: ["getRoomMessages", roomId] } });
  const { data: demos } = useGetRoomDemos(roomId, { query: { enabled: !!roomId, queryKey: ["getRoomDemos", roomId] } });

  const joinRoom = useJoinRoom();
  const leaveRoom = useLeaveRoom();
  const sendMessage = useSendMessage();
  const uploadDemo = useUploadDemo();

  const [messageInput, setMessageInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<Map<number, string>>(new Map());
  const [onlineIds, setOnlineIds] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  /* ── WebSocket ── */
  const { isConnected, sendMessage: sendWs } = useWebSocket(
    `${basePath}/ws?roomId=${roomId}`,
    (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "message":
            if (data.roomId === roomId) {
              queryClient.invalidateQueries({ queryKey: getGetRoomMessagesQueryKey(roomId) });
            }
            break;
          case "typing":
            setTypingUsers((prev) => {
              const next = new Map(prev);
              next.set(data.profileId, data.displayName);
              return next;
            });
            /* Auto-clear after 3s */
            clearTimeout(typingTimersRef.current.get(data.profileId));
            typingTimersRef.current.set(
              data.profileId,
              setTimeout(() => {
                setTypingUsers((p) => { const n = new Map(p); n.delete(data.profileId); return n; });
              }, 3000),
            );
            break;
          case "stop_typing":
            setTypingUsers((prev) => { const n = new Map(prev); n.delete(data.profileId); return n; });
            break;
          case "presence":
            setOnlineIds((prev) => {
              const n = new Set(prev);
              if (data.action === "join") n.add(data.profileId);
              else n.delete(data.profileId);
              return n;
            });
            break;
          case "voice_presence":
            handleVoicePresence(data);
            break;
          case "voice_signal":
            handleVoiceSignal(data);
            break;
        }
      } catch {}
    },
  );

  /* ── Voice ── */
  const {
    isInVoice, isMuted, speaking, voiceMembers,
    joinVoice, leaveVoice, toggleMute,
    handleVoiceSignal, handleVoicePresence,
  } = useVoice({
    myProfileId: profile?.id,
    myDisplayName: profile?.displayName,
    sendWsMessage: sendWs,
  });

  /* Identify to WebSocket once connected */
  useEffect(() => {
    if (isConnected && profile?.id) {
      sendWs({ type: "identify", profileId: profile.id, displayName: profile.displayName });
    }
  }, [isConnected, profile?.id]);

  /* Scroll on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Typing signals */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value) {
      sendWs({ type: "typing" });
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      typingDebounceRef.current = setTimeout(() => sendWs({ type: "stop_typing" }), 2000);
    } else {
      sendWs({ type: "stop_typing" });
    }
  };

  const isMember = members?.some((m) => m.profileId === profile?.id);
  const isOwner = room?.ownerId === profile?.id;
  const isFull = (room?.memberCount || 0) >= (room?.maxMembers || 0);
  const rgb = moodColor(room?.vibe ?? undefined, room?.genres ?? undefined);

  /* Handlers */
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !isMember) return;
    sendWs({ type: "stop_typing" });
    sendMessage.mutate(
      { id: roomId, data: { content: messageInput.trim() } },
      {
        onSuccess: () => {
          setMessageInput("");
          queryClient.invalidateQueries({ queryKey: getGetRoomMessagesQueryKey(roomId) });
        },
      },
    );
  };

  const handleJoin = () => {
    joinRoom.mutate(
      { id: roomId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getRoomMembers", roomId] });
          queryClient.invalidateQueries({ queryKey: ["getRoom", roomId] });
        },
      },
    );
  };

  const handleLeave = () => {
    leaveRoom.mutate(
      { id: roomId },
      { onSuccess: () => setLocation("/discover") },
    );
  };

  const handleDemoUploaded = async (fileUrl: string, title: string, description: string) => {
    await new Promise<void>((resolve, reject) => {
      uploadDemo.mutate(
        { id: roomId, data: { title, fileUrl, description: description || undefined } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getRoomDemos", roomId] });
            resolve();
          },
          onError: reject,
        },
      );
    });
  };

  if (roomLoading || !room) {
    return (
      <div className="flex h-[100dvh] items-center justify-center" style={{ background: "#0a080c" }}>
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#d4a341" }} />
      </div>
    );
  }

  const otherTyping = [...typingUsers.entries()].filter(([id]) => id !== profile?.id);

  return (
    <div
      className="flex flex-col h-[100dvh] relative overflow-hidden"
      style={{ background: "#0a080c" }}
    >
      <div className="bg-noise pointer-events-none" />

      {/* Ambient mood glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, rgba(${rgb},0.07) 0%, transparent 55%)`,
        }}
      />

      {/* ── HEADER ── */}
      <header
        className="relative z-20 h-14 flex items-center justify-between px-4 shrink-0"
        style={{
          background: "rgba(10,8,14,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Left: back + room identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocation("/discover")}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/8"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: isConnected ? "#4ade80" : "rgba(255,255,255,0.2)",
                boxShadow: isConnected ? "0 0 5px rgba(74,222,128,0.7)" : "none",
                animation: isConnected ? "livePulse 2s ease-in-out infinite" : "none",
              }}
            />
            <h1 className="font-serif text-[17px] text-white/88 tracking-tight">{room.name}</h1>
            {room.vibe && (
              <span className="hidden sm:inline text-[11px] text-white/30 tracking-wide">
                · {room.vibe}
              </span>
            )}
          </div>
        </div>

        {/* Right: voice bar + members + leave */}
        <div className="flex items-center gap-2">
          {/* Voice presence bar */}
          {voiceMembers.length > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
              style={{
                background: "rgba(212,163,65,0.08)",
                border: "1px solid rgba(212,163,65,0.2)",
                color: "rgba(212,163,65,0.8)",
              }}
            >
              <MiniWave color="#d4a341" active />
              <span>{voiceMembers.length} in voice</span>
            </div>
          )}

          {/* Join/Leave voice */}
          {isMember && (
            isInVoice ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-105"
                  style={{
                    background: isMuted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isMuted ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)"}`,
                    color: isMuted ? "#ef4444" : "rgba(255,255,255,0.6)",
                  }}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={leaveVoice}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-all hover:scale-105"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                  }}
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leave voice</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={joinVoice}
                className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Join voice</span>
              </button>
            )
          )}

          {/* Member count */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.38)",
            }}
          >
            <Users className="w-3 h-3" />
            <span>{room.memberCount}/{room.maxMembers}</span>
          </div>

          {/* Join / Leave room */}
          {isMember ? (
            <button
              type="button"
              onClick={handleLeave}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] transition-colors hover:text-red-400"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleJoin}
              disabled={joinRoom.isPending || isFull}
              className="h-8 px-4 rounded-lg text-[12px] font-medium transition-all hover:brightness-110 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #e0b050, #c89030)",
                color: "#1a0f00",
              }}
            >
              {joinRoom.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : isFull ? "Full" : "Join"}
            </button>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <DemoDropzone
        enabled={!!isMember}
        onUpload={handleDemoUploaded}
        className="flex flex-1 overflow-hidden z-10"
      >

        {/* ── Sidebar ── */}
        <aside
          className="w-64 hidden md:flex flex-col shrink-0 overflow-y-auto"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Cover */}
          <div
            className="relative h-36 shrink-0"
            style={{
              background: `linear-gradient(145deg, rgba(${rgb},0.3) 0%, rgba(${rgb},0.08) 100%)`,
            }}
          >
            {room.coverImageUrl && (
              <img src={room.coverImageUrl} alt={room.name} className="absolute inset-0 w-full h-full object-cover opacity-55" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="font-serif text-[15px] text-white/90 leading-tight">{room.name}</p>
              {room.vibe && <p className="text-[11px] mt-0.5" style={{ color: `rgba(${rgb},0.85)` }}>{room.vibe}</p>}
            </div>
          </div>

          <div className="flex-1 p-4 space-y-5">
            {/* Description */}
            {room.description && (
              <p className="text-[12px] italic leading-relaxed text-white/38">
                "{room.description}"
              </p>
            )}

            {/* Voice members in session */}
            {voiceMembers.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-white/28 mb-2">
                  In voice
                </p>
                <div className="flex flex-wrap gap-2">
                  {voiceMembers.map((vm) => (
                    <div key={vm.profileId} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: "#f59e0b",
                          boxShadow: "0 0 6px rgba(245,158,11,0.6)",
                          animation: "livePulse 1.5s ease-in-out infinite",
                        }}
                      />
                      <span className="text-[11px] text-white/55">{vm.displayName}</span>
                      {vm.speaking && <MiniWave color="#4ade80" active />}
                    </div>
                  ))}
                  {isInVoice && (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: "#4ade80",
                          boxShadow: speaking ? "0 0 8px rgba(74,222,128,0.7)" : "none",
                        }}
                      />
                      <span className="text-[11px] text-white/55">You</span>
                      {speaking && <MiniWave color="#4ade80" active />}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Members */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white/28 mb-3 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Members ({members?.length || 0})
              </p>
              <div className="space-y-2.5">
                {members?.map((member) => {
                  const isOnline = onlineIds.has(member.profileId) || member.profileId === profile?.id;
                  const inVoice = voiceMembers.some((v) => v.profileId === member.profileId) ||
                    (isInVoice && member.profileId === profile?.id);
                  return (
                    <div key={member.id} className="flex items-center gap-2.5">
                      <PresenceAvatar
                        name={member.displayName || "?"}
                        avatarUrl={member.avatarUrl}
                        online={isOnline}
                        inVoice={inVoice}
                        speaking={voiceMembers.find((v) => v.profileId === member.profileId)?.speaking || (isInVoice && member.profileId === profile?.id && speaking)}
                        size={6}
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] text-white/75 truncate leading-tight">
                          {member.displayName}
                          {member.profileId === profile?.id && (
                            <span className="text-white/30 ml-1 text-[10px]">you</span>
                          )}
                        </p>
                        {member.role && (
                          <p className="text-[10px] text-white/28 truncate">{member.role}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wordmark at bottom of sidebar */}
          <div className="p-4 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <img
              src={wordmarkImg}
              alt="Creative Rooms"
              style={{ height: 18, width: "auto", opacity: 0.28 }}
            />
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-w-0 relative">

          {/* Not-a-member gate */}
          {!isMember && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(10,8,14,0.85)", backdropFilter: "blur(12px)" }}
            >
              <div
                className="max-w-sm w-full text-center p-8 rounded-3xl space-y-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Headphones className="w-10 h-10 mx-auto" style={{ color: "rgba(212,163,65,0.7)" }} />
                <div>
                  <h3 className="font-serif text-xl text-white/82 mb-2">Outside looking in</h3>
                  <p className="text-[13px] text-white/38 font-light leading-relaxed">
                    Join to enter the conversation, share demos, and create together.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={joinRoom.isPending || isFull}
                  className="w-full h-12 rounded-full font-medium text-[14px] transition-all hover:brightness-110 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #e0b050, #c89030)",
                    color: "#1a0f00",
                  }}
                >
                  {joinRoom.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isFull ? "Room is at capacity" : "Join Session"}
                </button>
              </div>
            </div>
          )}

          <Tabs defaultValue="chat" className="flex flex-col h-full overflow-hidden">
            {/* Tab bar */}
            <div
              className="px-5 pt-0 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <TabsList className="bg-transparent border-none p-0 h-auto gap-6">
                {(["chat", "demos"] as const).map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="bg-transparent border-none px-0 pb-3 pt-3 text-[13px] rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent text-white/35 data-[state=active]:text-white/82"
                    style={{ borderBottom: "2px solid transparent" }}
                    onFocus={(e) => e.currentTarget.style.outline = "none"}
                  >
                    {tab === "chat" ? "Conversation" : (
                      <span>Demos & Ideas
                        {(demos?.length || 0) > 0 && (
                          <span
                            className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(212,163,65,0.15)", color: "#d4a341" }}
                          >
                            {demos?.length}
                          </span>
                        )}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* ── CHAT ── */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 outline-none data-[state=inactive]:hidden overflow-hidden">
              <ScrollArea className="flex-1 px-5 py-5">
                <div className="space-y-5 max-w-3xl mx-auto pb-2">
                  {messagesLoading ? (
                    <div className="space-y-4 pt-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-20 rounded-full bg-white/5" />
                            <div className="h-10 w-56 rounded-2xl bg-white/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !messages?.length ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <Music2 className="w-5 h-5 text-white/20" />
                      </div>
                      <p className="text-[13px] text-white/28 font-light">The room is silent. Start the conversation.</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.profileId === profile?.id;
                      const prev = messages[i - 1];
                      const showHeader = !prev || prev.profileId !== msg.profileId ||
                        new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() > 300000;

                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          {showHeader ? (
                            <Avatar className="w-8 h-8 shrink-0 mt-1" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                              <AvatarImage src={msg.senderAvatarUrl || undefined} />
                              <AvatarFallback className="text-[11px]" style={{ background: `hsl(${(msg.senderName || "").charCodeAt(0) * 37 % 360},40%,28%)`, color: "white" }}>
                                {msg.senderName?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                          ) : <div className="w-8 shrink-0" />}

                          <div className={`flex flex-col max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                            {showHeader && (
                              <div className="flex items-baseline gap-2 mb-1 px-1">
                                <span className="text-[11px] font-medium text-white/55">{msg.senderName}</span>
                                <span className="text-[10px] text-white/25">{format(new Date(msg.createdAt), "h:mm a")}</span>
                              </div>
                            )}
                            <div
                              className="px-4 py-2.5 text-[13px] leading-relaxed"
                              style={{
                                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                background: isMe
                                  ? "linear-gradient(135deg, rgba(212,163,65,0.22), rgba(180,130,40,0.18))"
                                  : "rgba(255,255,255,0.06)",
                                border: isMe
                                  ? "1px solid rgba(212,163,65,0.2)"
                                  : "1px solid rgba(255,255,255,0.07)",
                                color: isMe ? "rgba(255,220,150,0.92)" : "rgba(255,255,255,0.78)",
                              }}
                            >
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Typing indicator */}
              <div className="px-5 max-w-3xl mx-auto w-full" style={{ minHeight: 22 }}>
                {otherTyping.length > 0 && (
                  <p className="text-[11px] text-white/35 italic">
                    {otherTyping.map(([, name]) => name).join(", ")} {otherTyping.length === 1 ? "is" : "are"} typing
                    <TypingDots />
                  </p>
                )}
              </div>

              {/* Input */}
              <div
                className="px-4 pb-4 pt-2 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto">
                  <input
                    type="text"
                    placeholder={isMember ? "Share a thought, lyric, or idea…" : "Join to chat"}
                    className="flex-1 h-12 rounded-full px-5 text-[13px] outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.82)",
                    }}
                    value={messageInput}
                    onChange={handleInputChange}
                    disabled={!isMember}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(212,163,65,0.35)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.10)"; }}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || sendMessage.isPending || !isMember}
                    className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
                    style={{
                      background: "linear-gradient(135deg, #e0b050, #c89030)",
                      color: "#1a0f00",
                    }}
                  >
                    {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                  </button>
                </form>
              </div>
            </TabsContent>

            {/* ── DEMOS ── */}
            <TabsContent value="demos" className="flex-1 flex flex-col m-0 outline-none data-[state=inactive]:hidden overflow-y-auto px-5 py-5">
              <div className="max-w-3xl mx-auto w-full space-y-4">


                {/* Demo list */}
                {!demos?.length ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Music2 className="w-5 h-5 text-white/20" />
                    </div>
                    <p className="text-[13px] text-white/28 font-light">No demos yet.</p>
                    {isMember && (
                      <p className="text-[12px] text-white/18 font-light mt-1.5">
                        Drag an audio file into the room to share one.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {demos.map((demo) => (
                      <DemoPlayer key={demo.id} demo={demo} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DemoDropzone>

      <style>{`
        @keyframes miniWave {
          0%, 100% { transform: scaleY(0.4); }
          50%       { transform: scaleY(1); }
        }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-3px); opacity: 1; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.3); }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
