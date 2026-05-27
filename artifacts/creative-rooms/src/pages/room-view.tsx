import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/react";
import { useParams, useLocation, Link } from "wouter";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { CreatorUpgradePrompt } from "@/components/creator-upgrade-prompt";
import {
  useGetRoom, useGetRoomMembers, useGetRoomMessages,
  useGetRoomDemos, useSendMessage, useUploadDemo,
  useGetMyProfile, useJoinRoom, useLeaveRoom, useDeleteMessage, useEditMessage,
  useListRooms, useActivateCreator, getGetRoomMessagesQueryKey, getGetMyProfileQueryKey,
} from "@workspace/api-client-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useVoice } from "@/hooks/use-voice";
import { useRecorder, mimeToExt } from "@/hooks/use-recorder";
import { RoomManageMenu } from "@/components/rooms/room-manage-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DemoDropzone } from "@/components/demo-dropzone";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Compass, User, Music2, Mic, MicOff, Video,
  Circle, Square, Monitor, LogOut, Play, Heart,
  MoreHorizontal, Plus, Send, Loader2,
  Crown, CloudUpload, RefreshCw, CheckCircle, AlertCircle, X,
} from "lucide-react";
import logoImg from "../assets/images/creative-rooms-logo-v4.png";

/* ── Helpers ── */
function moodColor(vibe = "", genres: string[] = []): string {
  const t = `${vibe} ${genres.join(" ")}`.toLowerCase();
  if (/ambient|ethereal|atmospheric|dream/.test(t)) return "99,102,241";
  if (/soul|r&b|neo-soul|blues/.test(t))            return "245,158,11";
  if (/jazz|acoustic|folk|organic/.test(t))          return "132,204,22";
  if (/electronic|synth|edm|minimal/.test(t))        return "6,182,212";
  if (/pop|indie|alternative/.test(t))               return "236,72,153";
  return "139,92,246";
}

function seededWave(id: number, bars = 44): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return 0.15 + (s / 0xffffffff) * 0.85;
  });
}

function fmtDur(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ── Animated speaking bars ── */
function MiniWave({
  color = "#4ade80", active = true, bars = 5,
}: { color?: string; active?: boolean; bars?: number }) {
  return (
    <div className="flex items-end gap-[1.5px]" style={{ height: 14 }}>
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: 2.5,
            height: active ? "100%" : "30%",
            background: color,
            opacity: active ? 0.9 : 0.35,
            transformOrigin: "bottom",
            animation: active ? `miniWave 0.9s ease-in-out ${i * 0.13}s infinite` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <span className="inline-flex gap-[3px] items-center ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-white/35"
          style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

/* ── Nav link (left sidebar) ── */
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const [loc] = useLocation();
  const active = loc === href;
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
        style={{
          background: active ? "rgba(255,255,255,0.07)" : "transparent",
          color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)",
        }}
      >
        {icon}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
    </Link>
  );
}

/* ── Action button (bottom bar) ── */
function ActionBtn({
  icon, label, active, activeColor = "#4ade80", danger = false, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  activeColor?: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 transition-all hover:opacity-80 min-w-[56px]"
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          background: active
            ? `rgba(${activeColor.startsWith("#") ? hexToRgb(activeColor) : activeColor},0.12)`
            : danger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${
            active
              ? `rgba(${activeColor.startsWith("#") ? hexToRgb(activeColor) : activeColor},0.35)`
              : danger ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.1)"
          }`,
          color: active ? activeColor : danger ? "#ef4444" : "rgba(255,255,255,0.45)",
        }}
      >
        {icon}
      </div>
      <span
        className="text-[10px] font-medium"
        style={{
          color: active ? activeColor : danger ? "rgba(239,68,68,0.65)" : "rgba(255,255,255,0.28)",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "255,255,255";
}

/* ── Demo row ── */
function DemoRow({
  demo, isPlaying, onPlayToggle,
}: {
  demo: { id: number; title: string; description?: string | null; fileUrl: string; uploaderName?: string | null; createdAt: string };
  isPlaying: boolean;
  onPlayToggle: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const wave = seededWave(demo.id);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
      style={{
        background: isPlaying ? "rgba(212,163,65,0.06)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${isPlaying ? "rgba(212,163,65,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {/* Play button */}
      <button
        type="button"
        onClick={onPlayToggle}
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105"
        style={{
          background: isPlaying ? "rgba(212,163,65,0.15)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${isPlaying ? "rgba(212,163,65,0.35)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        {isPlaying
          ? <MiniWave color="#d4a341" active bars={4} />
          : <Play className="w-4 h-4 ml-0.5" style={{ color: "rgba(255,255,255,0.55)" }} />
        }
      </button>

      {/* Meta */}
      <div className="flex-none w-40 min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: "rgba(255,255,255,0.88)" }}>
          {demo.title}
        </p>
        <p className="text-[11px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>
          {demo.uploaderName} · {format(new Date(demo.createdAt), "MMM d, HH:mm")}
        </p>
      </div>

      {/* Waveform */}
      <div className="flex-1 flex items-center gap-[2px] overflow-hidden" style={{ height: 28 }}>
        {wave.map((v, i) => (
          <div
            key={i}
            className="rounded-full shrink-0"
            style={{
              width: 2.5,
              height: Math.max(2, v * 28),
              background: isPlaying
                ? `rgba(212,163,65,${0.3 + v * 0.7})`
                : `rgba(255,255,255,${0.1 + v * 0.22})`,
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span className="text-[11px] shrink-0 w-9 text-right" style={{ color: "rgba(255,255,255,0.28)" }}>
        {duration ? fmtDur(duration) : "—"}
      </span>

      {/* Heart */}
      <button
        type="button"
        onClick={() => setLiked((p) => !p)}
        className="flex items-center gap-1 shrink-0 transition-all hover:scale-110"
        style={{ color: liked ? "#f87171" : "rgba(255,255,255,0.2)" }}
      >
        <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
      </button>

      {/* More */}
      <button
        type="button"
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <audio
        ref={audioRef}
        src={demo.fileUrl}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onEnded={onPlayToggle}
        preload="metadata"
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export function RoomPage() {
  const params = useParams<{ id: string }>();
  const roomId = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const browseRef = useRef<HTMLInputElement | null>(null);

  /* ── Auth ── */
  const { isSignedIn } = useUser();
  const { toast } = useToast();

  /* ── Data ── */
  const { data: profile } = useGetMyProfile({ query: { enabled: !!isSignedIn, queryKey: getGetMyProfileQueryKey() } });
  const { data: room, isLoading: roomLoading } = useGetRoom(roomId, {
    query: { enabled: !!roomId, queryKey: ["getRoom", roomId] },
  });
  const { data: members } = useGetRoomMembers(roomId, {
    query: { enabled: !!roomId, queryKey: ["getRoomMembers", roomId] },
  });
  const { data: messages } = useGetRoomMessages(roomId, {
    query: { enabled: !!roomId, queryKey: ["getRoomMessages", roomId] },
  });
  const { data: demos } = useGetRoomDemos(roomId, {
    query: { enabled: !!roomId, queryKey: ["getRoomDemos", roomId] },
  });
  const { data: allRooms } = useListRooms();

  const joinRoom      = useJoinRoom();
  const leaveRoom     = useLeaveRoom();
  const sendMessage   = useSendMessage();
  const uploadDemo    = useUploadDemo();
  const deleteMessage = useDeleteMessage();
  const editMessage   = useEditMessage();

  /* ── Recorder ── */
  const recorder = useRecorder();
  const [uploadingRecording, setUploadingRecording] = useState(false);

  /* ── UI state ── */
  const [messageInput, setMessageInput]     = useState("");
  const [typingUsers, setTypingUsers]       = useState<Map<number, string>>(new Map());
  const [onlineIds, setOnlineIds]           = useState<Set<number>>(new Set());
  const [guestPromptReason, setGuestPromptReason] = useState<string | null>(null);
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);
  const activateCreator = useActivateCreator();

  const isCreator = !!profile?.isCreator;

  const requireCreator = (reason: string, action: () => void) => {
    if (!isSignedIn) { setGuestPromptReason(reason); return; }
    if (!isCreator) { setUpgradeReason(reason); return; }
    action();
  };
  const [playingId, setPlayingId]           = useState<number | null>(null);
  const messagesEndRef                       = useRef<HTMLDivElement>(null);
  const typingTimersRef                      = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const typingDebounceRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileTab, setMobileTab]            = useState<"chat" | "studio" | "people">("chat");

  /* ── Message management ── */
  const [editingMsgId, setEditingMsgId]   = useState<number | null>(null);
  const [editContent, setEditContent]     = useState("");
  const [msgMenuOpenId, setMsgMenuOpenId] = useState<number | null>(null);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  /* ── WebSocket ── */
  const { isConnected, sendMessage: sendWs } = useWebSocket(
    `${basePath}/ws?roomId=${roomId}`,
    (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "message":
            if (data.roomId === roomId)
              queryClient.invalidateQueries({ queryKey: getGetRoomMessagesQueryKey(roomId) });
            break;
          case "typing":
            setTypingUsers((prev) => {
              const next = new Map(prev);
              next.set(data.profileId, data.displayName);
              return next;
            });
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
          case "voice_presence": handleVoicePresence(data); break;
          case "voice_signal":   handleVoiceSignal(data);   break;
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
    onMicError: (msg) => toast({ title: "Microphone error", description: msg, variant: "destructive" }),
  });

  /* Identify on connect */
  useEffect(() => {
    if (isConnected && profile?.id)
      sendWs({ type: "identify", profileId: profile.id, displayName: profile.displayName });
  }, [isConnected, profile?.id]);

  /* Auto-scroll chat */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Typing debounce */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value) {
      sendWs({ type: "typing" });
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      typingDebounceRef.current = setTimeout(() => sendWs({ type: "stop_typing" }), 2000);
    } else {
      sendWs({ type: "stop_typing" });
    }
  }, [sendWs]);

  const isMember = members?.some((m) => m.profileId === profile?.id);
  const isOwner  = !!profile?.id && profile.id === room?.ownerId;
  const rgb      = moodColor(room?.vibe ?? undefined, room?.genres ?? undefined);

  /* ── Handlers ── */
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
    joinRoom.mutate({ id: roomId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getRoomMembers", roomId] });
        queryClient.invalidateQueries({ queryKey: ["getRoom", roomId] });
      },
    });
  };

  const handleLeave = () => {
    if (isInVoice) leaveVoice();
    leaveRoom.mutate({ id: roomId }, { onSuccess: () => setLocation("/discover") });
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

  const handlePlayToggle = (id: number) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  /* ── Message management handlers ── */
  const handleDeleteMessage = useCallback((msgId: number) => {
    deleteMessage.mutate(
      { id: roomId, msgId },
      {
        onSuccess: () => {
          queryClient.setQueryData(
            ["getRoomMessages", roomId],
            (old: any) => Array.isArray(old) ? old.filter((m: any) => m.id !== msgId) : old,
          );
          toast({ title: "Message deleted." });
          setMsgMenuOpenId(null);
        },
        onError: () => toast({ title: "Could not delete message", variant: "destructive" }),
      },
    );
  }, [deleteMessage, roomId, queryClient, toast]);

  const handleEditSave = useCallback((msgId: number) => {
    const content = editContent.trim();
    if (!content) return;
    editMessage.mutate(
      { id: roomId, msgId, data: { content } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(
            ["getRoomMessages", roomId],
            (old: any) => Array.isArray(old) ? old.map((m: any) => m.id === msgId ? updated : m) : old,
          );
          setEditingMsgId(null);
        },
        onError: () => toast({ title: "Could not edit message", variant: "destructive" }),
      },
    );
  }, [editMessage, roomId, editContent, queryClient]);

  /* ── Upload a recorded take as a demo ── */
  const handleUploadRecording = useCallback(async () => {
    if (!recorder.audioBlob) return;
    if (recorder.audioBlob.size === 0) {
      toast({ title: "Empty recording", description: "No audio was captured. Please try again.", variant: "destructive" });
      return;
    }
    setUploadingRecording(true);
    try {
      const ext  = mimeToExt(recorder.audioBlob.type);
      const file = new File(
        [recorder.audioBlob],
        `recording-${Date.now()}${ext}`,
        { type: recorder.audioBlob.type },
      );
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upload failed ${res.status}: ${text}`);
      }
      const data: { url: string } = await res.json();
      const fileUrl = `/api${data.url}`;
      await handleDemoUploaded(fileUrl, `Take — ${format(new Date(), "MMM d, HH:mm")}`, "");
      toast({ title: "Take saved", description: "Your recording has been added to the studio." });
      recorder.reset();
    } catch (err) {
      console.error("[uploadRecording]", err);
      toast({ title: "Upload failed", description: "Could not save the recording. Please try again.", variant: "destructive" });
    } finally {
      setUploadingRecording(false);
    }
  }, [recorder, handleDemoUploaded, toast]);

  /* ── Loading ── */
  if (roomLoading || !room) {
    return (
      <div className="flex h-[100dvh] items-center justify-center" style={{ background: "#0b0910" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#d4a341" }} />
      </div>
    );
  }

  const myRooms = allRooms?.slice(0, 8) ?? [];

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  const TABS = [
    { id: "chat",    label: "Chat" },
    { id: "studio",  label: "Studio" },
    { id: "people",  label: "People" },
  ] as const;

  return (
    <>
    {/* ══════════════════════════════════════════
        MOBILE LAYOUT  (hidden on md+)
    ══════════════════════════════════════════ */}
    <div
      className="flex flex-col md:hidden overflow-hidden"
      style={{ height: "100dvh", background: "#0b0910" }}
    >
      {/* Mobile header */}
      <header
        className="flex-shrink-0 flex items-center gap-3 px-4 h-14"
        style={{
          background: "rgba(9,7,14,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/discover">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-[14px] font-semibold truncate leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
            {room.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isConnected ? "#4ade80" : "rgba(255,255,255,0.2)", animation: isConnected ? "pulse-dot 2s ease-in-out infinite" : "none" }}
            />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
              {isConnected
                ? onlineIds.size > 1
                  ? `${onlineIds.size} in the room`
                  : "Open studio"
                : "Connecting…"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex -space-x-1.5">
            {members?.filter((m) => onlineIds.has(m.profileId)).slice(0, 3).map((m) => (
              <Avatar key={m.profileId} className="w-7 h-7 border" style={{ borderColor: "#0b0910" }}>
                <AvatarImage src={m.avatarUrl || undefined} />
                <AvatarFallback className="text-[9px]" style={{ background: `hsl(${(m.profileId * 47) % 360},32%,28%)` }}>
                  {m.displayName?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {(isOwner || isMember) && (
            <RoomManageMenu
              roomId={roomId}
              roomName={room.name}
              isOwner={isOwner}
              isMember={!!isMember}
              onSuccess={(redirect) => { if (redirect) setLocation("/discover"); }}
            />
          )}
        </div>
      </header>

      {/* Tab bar */}
      <div
        className="flex-shrink-0 flex items-center px-4 gap-1 h-11"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMobileTab(t.id)}
            className="flex-1 h-8 rounded-full text-[12px] font-medium transition-all"
            style={
              mobileTab === t.id
                ? { background: "rgba(212,163,65,0.14)", color: "#d4a341", border: "1px solid rgba(212,163,65,0.28)" }
                : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* CHAT TAB */}
        {mobileTab === "chat" && (
          <>
            <ScrollArea className="flex-1">
              <div className="px-4 py-4 space-y-5">
                {messages?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.22)" }}>No messages yet. Say something.</p>
                  </div>
                )}
                {messages?.map((msg) => {
                  const isOwn  = msg.profileId === profile?.id;
                  const isMenu = msgMenuOpenId === msg.id;
                  const isEdit = editingMsgId  === msg.id;
                  return (
                    <div key={msg.id} className="flex gap-3 group">
                      <Avatar className="w-9 h-9 shrink-0 mt-0.5">
                        <AvatarFallback className="text-[10px]" style={{ background: `hsl(${((msg.profileId || 0) * 47) % 360},32%,26%)` }}>
                          {msg.senderName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>{msg.senderName}</span>
                          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>{format(new Date(msg.createdAt), "HH:mm")}</span>
                          {isOwn && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setMsgMenuOpenId(isMenu ? null : msg.id); }}
                              className="ml-auto opacity-40 active:opacity-100 transition-opacity shrink-0"
                              style={{ color: "rgba(255,255,255,0.6)" }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {isEdit ? (
                          <form onSubmit={(e) => { e.preventDefault(); handleEditSave(msg.id); }} className="flex flex-col gap-1.5">
                            <input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              autoFocus
                              className="w-full bg-transparent border-b outline-none text-[14px]"
                              style={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(212,163,65,0.4)" }}
                            />
                            <div className="flex gap-3">
                              <button type="submit" className="text-[12px] font-semibold" style={{ color: "#d4a341" }}>Save</button>
                              <button type="button" onClick={() => setEditingMsgId(null)} className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{msg.content}</p>
                        )}
                        {isMenu && !isEdit && (
                          <div className="flex gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => { setEditingMsgId(msg.id); setEditContent(msg.content); setMsgMenuOpenId(null); }}
                              className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                              style={{ color: "#d4a341", background: "rgba(212,163,65,0.08)", border: "1px solid rgba(212,163,65,0.15)" }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              disabled={deleteMessage.isPending}
                              className="text-[11px] px-2.5 py-1 rounded-lg font-medium disabled:opacity-50"
                              style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {typingUsers.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                      {Array.from(typingUsers.values()).join(", ")} typing
                    </span>
                    <TypingDots />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <form
              onSubmit={handleSend}
              className="flex-shrink-0 px-4 pb-3 pt-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex items-center gap-3 h-12 px-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <input
                  type="text"
                  placeholder={isMember && isCreator ? "Type a message…" : !isSignedIn ? "Enter to listen" : !isCreator ? "Become a creator to chat" : "Join room to chat"}
                  value={messageInput}
                  onChange={handleInputChange}
                  disabled={!isMember || !isCreator}
                  readOnly={!isSignedIn || !isCreator}
                  onClick={!isSignedIn ? () => setGuestPromptReason("write in chat") : !isCreator ? () => setUpgradeReason("write in chat") : undefined}
                  className="flex-1 bg-transparent outline-none text-[14px] disabled:opacity-40"
                  style={{ color: "rgba(255,255,255,0.85)", cursor: (!isSignedIn || !isCreator) ? "pointer" : "text" }}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !isMember}
                  className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-25 shrink-0"
                  style={{ background: "rgba(212,163,65,0.2)", color: "#d4a341" }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        )}

        {/* STUDIO TAB */}
        {mobileTab === "studio" && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {isMember && isCreator ? (
              <button
                type="button"
                onClick={() => browseRef.current?.click()}
                className="w-full rounded-3xl flex flex-col items-center justify-center py-10 gap-4 transition-all active:scale-[0.98]"
                style={{
                  background: `linear-gradient(160deg,rgba(${rgb},0.08) 0%,rgba(10,8,14,0.85) 100%)`,
                  border: `1px dashed rgba(${rgb},0.28)`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.22)` }}
                >
                  <CloudUpload className="w-7 h-7" style={{ color: `rgb(${rgb})` }} />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.78)" }}>Tap to upload audio</p>
                  <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>MP3 · WAV · M4A up to 50MB</p>
                </div>
              </button>
            ) : !isSignedIn ? (
              <div className="flex flex-col items-center justify-center py-14 rounded-3xl text-center" style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
                <p className="text-[14px] mb-3" style={{ color: "rgba(255,255,255,0.38)" }}>You're listening as a guest.</p>
                <button type="button" onClick={() => setGuestPromptReason("share demos")} className="h-11 px-7 rounded-full text-[14px] font-medium" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}>
                  Create an account
                </button>
              </div>
            ) : !isCreator ? (
              <div className="flex flex-col items-center justify-center py-14 rounded-3xl text-center" style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
                <p className="text-[14px] mb-3" style={{ color: "rgba(255,255,255,0.38)" }}>Creators can upload and share demos.</p>
                <button type="button" onClick={() => setUpgradeReason("share demos")} className="h-11 px-7 rounded-full text-[14px] font-semibold" style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}>
                  Become a Creator
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 rounded-3xl text-center" style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
                <p className="text-[14px] mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>Join the room to share demos.</p>
                <button type="button" onClick={handleJoin} disabled={joinRoom.isPending} className="h-11 px-7 rounded-full text-[14px] font-medium disabled:opacity-50" style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}>
                  {joinRoom.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Room"}
                </button>
              </div>
            )}
            {demos && demos.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold tracking-widest uppercase px-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Room Demos · {demos.length}
                </p>
                {demos.map((demo) => (
                  <DemoRow key={demo.id} demo={demo} isPlaying={playingId === demo.id} onPlayToggle={() => handlePlayToggle(demo.id)} />
                ))}
              </div>
            )}
            {(!demos || demos.length === 0) && isMember && (
              <p className="text-center text-[13px] py-4" style={{ color: "rgba(255,255,255,0.2)" }}>No demos yet — be the first to drop a riff.</p>
            )}
          </div>
        )}

        {/* PEOPLE TAB */}
        {mobileTab === "people" && (
          <ScrollArea className="flex-1">
            <div className="px-4 py-4 space-y-2">
              {members?.map((m) => {
                const isOnline   = onlineIds.has(m.profileId);
                const voiceMember = voiceMembers.find((v) => v.profileId === m.profileId);
                const isInV      = !!voiceMember;
                const isSpeaking = voiceMember?.speaking ?? false;
                const isMe       = m.profileId === profile?.id;
                return (
                  <div
                    key={m.profileId}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                    style={{
                      background: isMe ? "rgba(212,163,65,0.05)" : "rgba(255,255,255,0.025)",
                      border: `1px solid ${isMe ? "rgba(212,163,65,0.12)" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={m.avatarUrl || undefined} />
                        <AvatarFallback className="text-[12px]" style={{ background: `hsl(${(m.profileId * 47) % 360},32%,28%)` }}>
                          {m.displayName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ borderColor: "#0b0910", background: "#4ade80" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                        {m.displayName}
                        {isMe && <span className="ml-2 text-[11px] font-normal" style={{ color: "rgba(212,163,65,0.6)" }}>you</span>}
                      </p>
                      {(isSpeaking || isInV || isOnline) && (
                        <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                          {isSpeaking ? "Talking" : isInV ? "In voice" : "In the room"}
                        </p>
                      )}
                    </div>
                    <MiniWave color={isSpeaking ? "#4ade80" : isInV ? "#f59e0b" : "rgba(255,255,255,0.1)"} active={isSpeaking || isInV} bars={5} />
                  </div>
                );
              })}
              {!isMember && (
                <div className="pt-4 text-center">
                  {!isSignedIn ? (
                    <button type="button" onClick={() => setGuestPromptReason("join the room")} className="h-11 px-7 rounded-full text-[14px] font-semibold" style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}>
                      Sign up to join
                    </button>
                  ) : (
                    <button type="button" onClick={handleJoin} disabled={joinRoom.isPending} className="h-11 px-7 rounded-full text-[14px] font-medium disabled:opacity-50" style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}>
                      {joinRoom.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Room"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Mobile action bar */}
      <div
        className="flex-shrink-0 flex items-center justify-around px-6 py-3"
        style={{
          background: "rgba(9,7,14,0.96)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          type="button"
          onClick={() => requireCreator("join voice", isInVoice ? toggleMute : joinVoice)}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: isInVoice && !isMuted ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${isInVoice && !isMuted ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: isInVoice && !isMuted ? "#4ade80" : "rgba(255,255,255,0.45)",
            }}
          >
            {isInVoice && isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </div>
          <span className="text-[10px] font-medium" style={{ color: isInVoice && !isMuted ? "#4ade80" : "rgba(255,255,255,0.28)" }}>
            {isInVoice ? (isMuted ? "Unmute" : "Voice") : "Voice"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => requireCreator("record audio",
            recorder.state === "recording" ? recorder.stop
            : recorder.state === "idle" || recorder.state === "error" ? recorder.start
            : () => {}
          )}
          disabled={recorder.state === "requesting" || recorder.state === "processing"}
          className="flex flex-col items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.5)", boxShadow: "0 0 28px rgba(239,68,68,0.2)" }}
          >
            <Circle className="w-7 h-7 fill-current" style={{ color: "#ef4444" }} />
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(239,68,68,0.6)" }}>Record</span>
        </button>

        <button
          type="button"
          onClick={isMember ? handleLeave : () => setLocation("/discover")}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(239,68,68,0.5)" }}>Leave</span>
        </button>
      </div>

      <GuestSignupPrompt open={!!guestPromptReason} reason={guestPromptReason ?? ""} onClose={() => setGuestPromptReason(null)} />
      <CreatorUpgradePrompt
        open={!!upgradeReason}
        reason={upgradeReason ?? ""}
        onClose={() => setUpgradeReason(null)}
        onActivate={() => {
          activateCreator.mutate(undefined, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
              setUpgradeReason(null);
            },
          });
        }}
        activating={activateCreator.isPending}
      />
    </div>

    {/* ══════════════════════════════════════════
        DESKTOP LAYOUT  (hidden below md)
    ══════════════════════════════════════════ */}
    <div className="hidden md:flex h-[100dvh] overflow-hidden" style={{ background: "#0b0910" }}>

      {/* ═══════ LEFT SIDEBAR ═══════ */}
      <aside
        className="w-[210px] flex flex-col shrink-0 overflow-y-auto"
        style={{ background: "#09070e", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4">
          <Link href="/discover">
            <img
              src={logoImg}
              alt="Creative Room"
              style={{
                height: 28,
                width: "auto",
                objectFit: "contain",
                filter: "brightness(1.12) drop-shadow(0 0 10px rgba(212,163,65,0.32))",
              }}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          <NavLink href="/discover" icon={<Compass className="w-4 h-4" />} label="Discover" />
          <NavLink href="/profile"  icon={<User className="w-4 h-4" />}    label="Profile"  />
        </nav>

        {/* Your Rooms */}
        <div className="mt-5 px-5">
          <p
            className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Your Rooms
          </p>
          <div className="space-y-0.5">
            {myRooms.map((r) => {
              const rRgb   = moodColor(r.vibe ?? undefined, r.genres ?? undefined);
              const active = r.id === roomId;
              return (
                <Link key={r.id} href={`/rooms/${r.id}`}>
                  <div
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: active ? "rgba(255,255,255,0.07)" : "transparent",
                      color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: `rgb(${rRgb})` }}
                    />
                    <span className="text-[12.5px] font-medium truncate">{r.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <Link href="/discover">
            <button
              type="button"
              className="flex items-center gap-1.5 mt-2 px-3 py-2 text-[12px] rounded-xl w-full transition-all hover:bg-white/[0.04] cursor-pointer"
              style={{ color: "rgba(255,255,255,0.24)" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Room
            </button>
          </Link>
        </div>

        <div className="flex-1" />

        {/* User */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={profile?.avatarUrl || undefined} />
              <AvatarFallback
                className="text-[11px]"
                style={{ background: "hsl(270,28%,28%)" }}
              >
                {profile?.displayName?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium truncate" style={{ color: "rgba(255,255,255,0.75)" }}>
                {profile?.displayName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80" }} />
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>Online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════ CENTER ═══════ */}
      <DemoDropzone
        enabled={!!isMember}
        onUpload={handleDemoUploaded}
        fileInputRef={browseRef}
        className="flex-1 flex flex-col min-w-0 min-h-0"
      >
        <div className="flex-1 flex flex-col min-w-0 min-h-0">

          {/* Room header */}
          <header
            className="shrink-0 px-6 py-4 flex items-center gap-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Room colour avatar */}
            <div
              className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg,rgba(${rgb},0.35),rgba(${rgb},0.1))`,
                border: `1px solid rgba(${rgb},0.22)`,
              }}
            >
              <Music2 className="w-5 h-5" style={{ color: `rgb(${rgb})` }} />
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-[15px] font-semibold leading-tight truncate"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                {room.name}
              </h1>
              {(room.description || room.vibe || (room.genres?.length ?? 0) > 0) && (
                <p className="text-[12px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.36)" }}>
                  {room.description || [room.vibe, ...(room.genres ?? [])].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            {/* Avatar stack — live users only */}
            {(() => {
              const live = (members ?? []).filter((m) => onlineIds.has(m.profileId));
              return live.length > 0 ? (
                <div className="flex -space-x-2 shrink-0">
                  {live.slice(0, 4).map((m) => (
                    <Avatar
                      key={m.profileId}
                      className="w-7 h-7 border-2"
                      style={{ borderColor: "#0b0910" }}
                    >
                      <AvatarImage src={m.avatarUrl || undefined} />
                      <AvatarFallback
                        className="text-[9px]"
                        style={{ background: `hsl(${(m.profileId * 47) % 360},32%,28%)` }}
                      >
                        {m.displayName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {live.length > 4 && (
                    <div
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                      style={{ borderColor: "#0b0910", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}
                    >
                      +{live.length - 4}
                    </div>
                  )}
                </div>
              ) : null;
            })()}

            {/* Invite */}
            {isMember && (
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href).catch(() => {})}
                className="flex items-center gap-1.5 h-8 px-4 rounded-full text-[12px] font-medium transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Invite
              </button>
            )}
          </header>

          {/* Scrollable main area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* ── Upload zone (members only) ── */}
            {isMember ? (
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(160deg,rgba(${rgb},0.07) 0%,rgba(10,8,14,0.85) 100%)`,
                  border: "1px dashed rgba(255,255,255,0.09)",
                }}
              >
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: `rgba(${rgb},0.1)`,
                      border: `1px solid rgba(${rgb},0.2)`,
                    }}
                  >
                    <CloudUpload className="w-6 h-6" style={{ color: `rgb(${rgb})` }} />
                  </div>
                  <p
                    className="text-[15px] font-medium mb-1.5"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    Drag &amp; drop your audio here
                  </p>
                  <p className="text-[12px] mb-5" style={{ color: "rgba(255,255,255,0.26)" }}>
                    MP3, WAV, M4A up to 50MB
                  </p>
                  <button
                    type="button"
                    onClick={() => browseRef.current?.click()}
                    className="flex items-center gap-2 h-10 px-6 rounded-full text-[13px] font-medium transition-all hover:brightness-110"
                    style={{
                      background: `rgba(${rgb},0.13)`,
                      border: `1px solid rgba(${rgb},0.28)`,
                      color: `rgb(${rgb})`,
                    }}
                  >
                    <Music2 className="w-4 h-4" />
                    Browse Files
                  </button>
                </div>
              </div>
            ) : !isSignedIn ? (
              /* Guest gate */
              <div
                className="flex flex-col items-center justify-center py-16 rounded-3xl text-center"
                style={{ border: "1px dashed rgba(255,255,255,0.07)" }}
              >
                <p className="text-[14px] mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>
                  You're listening as a guest.
                </p>
                <p className="text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.22)" }}>
                  Create an account to share your music here.
                </p>
                <button
                  type="button"
                  onClick={() => setGuestPromptReason("share demos")}
                  className="h-10 px-6 rounded-full text-[13px] font-medium hover:brightness-110 transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}
                >
                  Create an account
                </button>
              </div>
            ) : !isCreator ? (
              /* Listener upgrade gate */
              <div
                className="flex flex-col items-center justify-center py-16 rounded-3xl text-center"
                style={{ border: "1px dashed rgba(255,255,255,0.07)" }}
              >
                <p className="text-[14px] mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Creators can upload and share demos.
                </p>
                <p className="text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.22)" }}>
                  You're listening as a member.
                </p>
                <button
                  type="button"
                  onClick={() => setUpgradeReason("share demos")}
                  className="h-10 px-6 rounded-full text-[13px] font-semibold hover:brightness-110 transition-all"
                  style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
                >
                  Become a Creator
                </button>
              </div>
            ) : (
              /* Non-member creator gate */
              <div
                className="flex flex-col items-center justify-center py-16 rounded-3xl text-center"
                style={{ border: "1px dashed rgba(255,255,255,0.07)" }}
              >
                <p className="text-[14px] mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Join the room to share demos and collaborate.
                </p>
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={joinRoom.isPending}
                  className="h-10 px-6 rounded-full text-[13px] font-medium disabled:opacity-50 hover:brightness-110 transition-all"
                  style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
                >
                  {joinRoom.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Room"}
                </button>
              </div>
            )}

            {/* ── Demo list ── */}
            {demos && demos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.32)" }}>
                    Room Demos
                    <span className="ml-2 font-normal normal-case" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {demos.length}
                    </span>
                  </h2>
                </div>
                <div className="space-y-2">
                  {demos.map((demo) => (
                    <DemoRow
                      key={demo.id}
                      demo={demo}
                      isPlaying={playingId === demo.id}
                      onPlayToggle={() => handlePlayToggle(demo.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {(!demos || demos.length === 0) && isMember && (
              <p
                className="text-center text-[12px] py-4"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                No demos shared yet — be the first to drop a riff.
              </p>
            )}
          </div>

          {/* ── Action bar ── */}
          <div
            className="shrink-0 px-8 py-4 flex items-center justify-around"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(9,7,14,0.85)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Voice Chat */}
            <ActionBtn
              icon={isInVoice ? (isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />) : <Mic className="w-5 h-5" />}
              label={isInVoice ? (isMuted ? "Unmute" : "Voice On") : "Voice Chat"}
              active={isInVoice && !isMuted}
              activeColor="#4ade80"
              onClick={isSignedIn ? (isInVoice ? toggleMute : joinVoice) : () => setGuestPromptReason("join voice")}
            />

            {/* Video (placeholder) */}
            <ActionBtn
              icon={<Video className="w-5 h-5" />}
              label="Video"
              active={false}
              onClick={() => {}}
            />

            {/* Record — large, prominent */}
            <button
              type="button"
              onClick={
                !isSignedIn ? () => setGuestPromptReason("record audio")
                : !isMember ? handleJoin
                : recorder.state === "recording" ? recorder.stop
                : recorder.state === "idle" ? recorder.start
                : undefined
              }
              disabled={recorder.state === "requesting" || recorder.state === "processing"}
              className="flex flex-col items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: recorder.state === "recording"
                    ? "rgba(239,68,68,0.22)"
                    : "rgba(239,68,68,0.12)",
                  border: `2px solid ${recorder.state === "recording" ? "rgba(239,68,68,0.7)" : "rgba(239,68,68,0.45)"}`,
                  boxShadow: recorder.state === "recording"
                    ? "0 0 28px rgba(239,68,68,0.4)"
                    : "0 0 22px rgba(239,68,68,0.18)",
                  animation: recorder.state === "recording" ? "pulse-dot 1.2s ease-in-out infinite" : "none",
                }}
              >
                {recorder.state === "requesting" && <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#ef4444" }} />}
                {recorder.state === "recording" && <Square className="w-5 h-5 fill-current" style={{ color: "#ef4444" }} />}
                {(recorder.state === "idle" || recorder.state === "error") && <Circle className="w-6 h-6 fill-current" style={{ color: "#ef4444" }} />}
                {(recorder.state === "processing" || recorder.state === "done") && <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#ef4444" }} />}
              </div>
              <span className="text-[10px] font-medium" style={{ color: "rgba(239,68,68,0.55)" }}>
                {recorder.state === "requesting" ? "Starting…"
                  : recorder.state === "recording" ? "Stop"
                  : recorder.state === "processing" ? "Saving…"
                  : "Record"}
              </span>
            </button>

            {/* Share Screen (placeholder) */}
            <ActionBtn
              icon={<Monitor className="w-5 h-5" />}
              label="Share Screen"
              active={false}
              onClick={() => {}}
            />

            {/* Leave Room */}
            <ActionBtn
              icon={<LogOut className="w-5 h-5" />}
              label="Leave Room"
              active={false}
              danger
              onClick={handleLeave}
            />
          </div>
        </div>
      </DemoDropzone>

      {/* ═══════ RIGHT SIDEBAR ═══════ */}
      <aside
        className="w-[268px] flex flex-col shrink-0"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >

        {/* People section */}
        <div className="flex flex-col" style={{ height: "44%" }}>
          <div
            className="shrink-0 px-5 py-4 flex items-center gap-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
              People
            </span>
            {onlineIds.size > 0 ? (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.08)", color: "rgba(74,222,128,0.7)", border: "1px solid rgba(74,222,128,0.15)" }}>
                {onlineIds.size} in the room
              </span>
            ) : (
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                Open studio
              </span>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="px-3 py-3 space-y-0.5">
              {members?.map((m) => {
                const isOnline    = onlineIds.has(m.profileId);
                const voiceMember = voiceMembers.find((v) => v.profileId === m.profileId);
                const isInV       = !!voiceMember;
                const isSpeaking  = voiceMember?.speaking ?? false;
                return (
                  <div
                    key={m.profileId}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors hover:bg-white/[0.03]"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={m.avatarUrl || undefined} />
                        <AvatarFallback
                          className="text-[11px]"
                          style={{ background: `hsl(${(m.profileId * 47) % 360},32%,26%)` }}
                        >
                          {m.displayName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[1.5px]"
                          style={{ background: "#4ade80", borderColor: "#0b0910" }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[12.5px] font-medium truncate"
                          style={{ color: "rgba(255,255,255,0.82)" }}
                        >
                          {m.displayName}
                        </span>
                        {m.profileId === room.ownerId && (
                          <Crown className="w-3 h-3 shrink-0" style={{ color: "#d4a341" }} />
                        )}
                      </div>
                      {(isSpeaking || isInV || isOnline) && (
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                          {isSpeaking ? "Talking" : isInV ? "Listening" : "In the room"}
                        </span>
                      )}
                    </div>

                    {/* Waveform indicator */}
                    <MiniWave
                      color={isSpeaking ? "#4ade80" : isInV ? "#f59e0b" : "rgba(255,255,255,0.1)"}
                      active={isSpeaking || isInV}
                      bars={5}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat section */}
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="shrink-0 px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
              Room Chat
            </span>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-4 py-3 space-y-3.5">
              {messages?.map((msg) => {
                const isOwn  = msg.profileId === profile?.id;
                const isMenu = msgMenuOpenId === msg.id;
                const isEdit = editingMsgId  === msg.id;
                return (
                  <div key={msg.id} className="flex gap-2.5 group">
                    <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                      <AvatarFallback
                        className="text-[9px]"
                        style={{ background: `hsl(${((msg.profileId || 0) * 47) % 360},32%,26%)` }}
                      >
                        {msg.senderName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11.5px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                          {msg.senderName}
                        </span>
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                          {format(new Date(msg.createdAt), "HH:mm")}
                        </span>
                        {isOwn && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setMsgMenuOpenId(isMenu ? null : msg.id); }}
                            className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity shrink-0"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {isEdit ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleEditSave(msg.id); }} className="flex flex-col gap-1.5">
                          <input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            autoFocus
                            className="w-full bg-transparent border-b outline-none text-[12.5px]"
                            style={{ color: "rgba(255,255,255,0.82)", borderColor: "rgba(212,163,65,0.4)" }}
                          />
                          <div className="flex gap-3">
                            <button type="submit" className="text-[11px] font-semibold" style={{ color: "#d4a341" }}>Save</button>
                            <button type="button" onClick={() => setEditingMsgId(null)} className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                          {msg.content}
                        </p>
                      )}
                      {isMenu && !isEdit && (
                        <div className="flex gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => { setEditingMsgId(msg.id); setEditContent(msg.content); setMsgMenuOpenId(null); }}
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                            style={{ color: "#d4a341", background: "rgba(212,163,65,0.08)", border: "1px solid rgba(212,163,65,0.15)" }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            disabled={deleteMessage.isPending}
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium disabled:opacity-50"
                            style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.size > 0 && (
                <div className="flex items-center gap-1.5 py-0.5">
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                    {Array.from(typingUsers.values()).join(", ")} typing
                  </span>
                  <TypingDots />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat input */}
          <form onSubmit={handleSend} className="shrink-0 px-4 pb-4 pt-2">
            <div
              className="flex items-center gap-2 h-10 px-3.5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <input
                type="text"
                placeholder={
                  isMember && isCreator
                    ? "Type a message…"
                    : !isSignedIn
                    ? "Enter to listen"
                    : !isCreator
                    ? "Become a creator to chat"
                    : "Join room to chat"
                }
                value={messageInput}
                onChange={handleInputChange}
                disabled={!isMember || !isCreator}
                readOnly={!isSignedIn || !isCreator}
                onClick={!isSignedIn ? () => setGuestPromptReason("write in chat") : !isCreator ? () => setUpgradeReason("write in chat") : undefined}
                className="flex-1 bg-transparent outline-none text-[12.5px] disabled:opacity-40"
                style={{ color: "rgba(255,255,255,0.82)", cursor: (!isSignedIn || !isCreator) ? "pointer" : "text" }}
              />
              <button
                type="submit"
                disabled={!messageInput.trim() || !isMember || !isCreator}
                className="w-6 h-6 rounded-full flex items-center justify-center disabled:opacity-25 transition-all hover:brightness-110 shrink-0"
                style={{ background: "rgba(212,163,65,0.18)", color: "#d4a341" }}
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      </aside>

      <GuestSignupPrompt
        open={!!guestPromptReason}
        reason={guestPromptReason ?? ""}
        onClose={() => setGuestPromptReason(null)}
      />
      <CreatorUpgradePrompt
        open={!!upgradeReason}
        reason={upgradeReason ?? ""}
        onClose={() => setUpgradeReason(null)}
        onActivate={() => {
          activateCreator.mutate(undefined, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
              setUpgradeReason(null);
            },
          });
        }}
        activating={activateCreator.isPending}
      />

      {/* ── Recording overlay portal ── */}
      {recorder.state !== "idle" && createPortal(
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-end",
            padding: "0 0 calc(env(safe-area-inset-bottom, 0px) + 12px)",
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              width: "100%", maxWidth: "min(480px, 100vw)",
              background: "hsl(270 18% 7%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px 24px 0 0",
              overflow: "hidden",
              paddingBottom: 8,
            }}
          >
            {/* Gold accent bar */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#e0b050,#c89030)", flexShrink: 0 }} />

            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
            </div>

            <div style={{ padding: "8px 24px 20px" }}>
              {/* requesting */}
              {recorder.state === "requesting" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 8 }}>
                  <Loader2 size={36} style={{ color: "#ef4444", animation: "spin 1s linear infinite" }} />
                  <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                    Connecting to microphone…
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                    Allow microphone access when your browser asks
                  </p>
                  <button
                    onClick={recorder.reset}
                    style={{ marginTop: 4, fontSize: 13, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* recording */}
              {recorder.state === "recording" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                  {/* Timer */}
                  <p style={{ fontSize: 42, fontWeight: 700, color: "#ef4444", letterSpacing: "-1px", marginTop: 4 }}>
                    {String(Math.floor(recorder.seconds / 60)).padStart(2, "0")}:{String(recorder.seconds % 60).padStart(2, "0")}
                  </p>

                  {/* Animated waveform */}
                  <div style={{ display: "flex", alignItems: "center", gap: 3, height: 40 }}>
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 3, borderRadius: 99,
                          background: "#ef4444",
                          opacity: 0.7,
                          animation: `miniWave ${0.9 + (i % 5) * 0.18}s ease-in-out infinite`,
                          animationDelay: `${i * 0.055}s`,
                          height: `${20 + (i % 7) * 9}px`,
                        }}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>
                    Recording in progress
                  </p>

                  <div style={{ display: "flex", gap: 12, width: "100%" }}>
                    <button
                      onClick={recorder.reset}
                      style={{
                        flex: 1, height: 48, borderRadius: 99,
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.45)", cursor: "pointer",
                      }}
                    >
                      Discard
                    </button>
                    <button
                      onClick={recorder.stop}
                      style={{
                        flex: 2, height: 48, borderRadius: 99,
                        background: "linear-gradient(135deg,rgba(239,68,68,0.85),rgba(220,38,38,0.85))",
                        border: "none",
                        fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}
                    >
                      <Square size={14} className="fill-current" /> Stop Recording
                    </button>
                  </div>
                </div>
              )}

              {/* processing */}
              {recorder.state === "processing" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "16px 0" }}>
                  <Loader2 size={32} style={{ color: "#d4a341", animation: "spin 1s linear infinite" }} />
                  <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Saving your take…</p>
                </div>
              )}

              {/* done */}
              {recorder.state === "done" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
                    <CheckCircle size={20} color="#4ade80" />
                    <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>Take recorded</p>
                  </div>

                  {recorder.localUrl && (
                    <audio
                      src={recorder.localUrl}
                      controls
                      style={{ width: "100%", height: 36, borderRadius: 12, opacity: 0.9, accentColor: "#d4a341" }}
                    />
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => { recorder.reset(); }}
                      style={{
                        flex: 1, height: 48, borderRadius: 99,
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      <RefreshCw size={14} /> Try again
                    </button>
                    <button
                      onClick={handleUploadRecording}
                      disabled={uploadingRecording}
                      style={{
                        flex: 2, height: 48, borderRadius: 99,
                        background: "linear-gradient(135deg,#e0b050,#c89030)",
                        border: "none",
                        fontSize: 14, fontWeight: 700, color: "#1a0f00",
                        cursor: uploadingRecording ? "default" : "pointer",
                        opacity: uploadingRecording ? 0.7 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      {uploadingRecording
                        ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Uploading…</>
                        : <><CloudUpload size={14} /> Add as Demo</>}
                    </button>
                  </div>
                  <button
                    onClick={recorder.reset}
                    style={{
                      textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.25)",
                      background: "none", border: "none", cursor: "pointer", paddingBottom: 4,
                    }}
                  >
                    Discard take
                  </button>
                </div>
              )}

              {/* error */}
              {recorder.state === "error" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "8px 0" }}>
                  <AlertCircle size={32} color="#ef4444" />
                  <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
                    {recorder.error ?? "Could not start recording."}
                  </p>
                  <div style={{ display: "flex", gap: 10, width: "100%" }}>
                    <button
                      onClick={recorder.reset}
                      style={{
                        flex: 1, height: 44, borderRadius: 99,
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        fontSize: 14, color: "rgba(255,255,255,0.4)", cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={recorder.start}
                      style={{
                        flex: 1, height: 44, borderRadius: 99,
                        background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
                        fontSize: 14, fontWeight: 600, color: "#ef4444", cursor: "pointer",
                      }}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}

      <style>{`
        @keyframes miniWave {
          0%, 100% { transform: scaleY(0.35); }
          50%       { transform: scaleY(1); }
        }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          50%       { transform: translateY(-3px); opacity: 1; }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
    </>
  );
}
