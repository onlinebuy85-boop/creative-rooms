import { useState } from "react";
import {
  Mic, MicOff, Video, Monitor, UserPlus, Circle, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomControls() {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [recording, setRecording] = useState(true);

  const items = [
    {
      id: "mute",
      label: muted ? "Unmute" : "Mute",
      icon: muted ? MicOff : Mic,
      active: !muted,
      onClick: () => setMuted((m) => !m),
    },
    {
      id: "video",
      label: videoOn ? "Stop video" : "Start video",
      icon: Video,
      active: videoOn,
      onClick: () => setVideoOn((v) => !v),
    },
    {
      id: "screen",
      label: "Share screen",
      icon: Monitor,
      active: false,
      onClick: () => {},
    },
    {
      id: "collab",
      label: "Add collaborator",
      icon: UserPlus,
      active: false,
      onClick: () => {},
    },
  ] as const;

  return (
    <div className="cr-room-controls">
      {items.map(({ id, label, icon: Icon, active, onClick }) => (
        <button
          key={id}
          type="button"
          onClick={onClick}
          className={cn("cr-room-control-btn", active && "cr-room-control-btn--active")}
        >
          <Icon className="w-5 h-5" strokeWidth={1.75} />
          <span>{label}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => setRecording((r) => !r)}
        className={cn("cr-room-control-btn cr-room-control-btn--record", recording && "is-recording")}
      >
        <span className="cr-record-dot-wrap">
          <Circle className="w-2.5 h-2.5 fill-current" />
        </span>
        <span>Record</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </button>
    </div>
  );
}
