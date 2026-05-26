import { useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRoom, useUpdateRoom, useLeaveRoom } from "@workspace/api-client-react";
import { MoreHorizontal, Trash2, EyeOff, LogOut, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Confirm portal ──────────────────────────────────────────────────────────── */
interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ title, body, confirmLabel, danger = false, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10001,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 20px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative", zIndex: 1,
          background: "hsl(270 16% 9%)",
          border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 20,
          padding: "28px 24px 20px",
          width: "100%",
          maxWidth: 360,
          boxShadow: danger ? "0 0 48px rgba(239,68,68,0.12)" : "0 8px 48px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: 99,
            background: danger ? "rgba(239,68,68,0.12)" : "rgba(212,163,65,0.1)",
            border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "rgba(212,163,65,0.2)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <AlertTriangle size={20} color={danger ? "#ef4444" : "#d4a341"} />
        </div>

        <p style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 8 }}>
          {title}
        </p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 24 }}>
          {body}
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, height: 44, borderRadius: 99, fontSize: 14, fontWeight: 500,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, height: 44, borderRadius: 99, fontSize: 14, fontWeight: 700,
              background: danger ? "rgba(239,68,68,0.85)" : "linear-gradient(135deg,#e0b050,#c89030)",
              border: "none",
              color: danger ? "#fff" : "#1a0f00",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */
interface RoomManageMenuProps {
  roomId: number;
  roomName: string;
  isOwner: boolean;
  isMember: boolean;
  onSuccess: (redirect?: boolean) => void;
  /** Forwarded from room list to invalidate on close */
  onRoomListInvalidate?: () => void;
}

export function RoomManageMenu({
  roomId, roomName, isOwner, isMember, onSuccess, onRoomListInvalidate,
}: RoomManageMenuProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirm, setConfirm] = useState<"delete" | "close" | "leave" | null>(null);

  const deleteRoom = useDeleteRoom({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
        onRoomListInvalidate?.();
        toast({ title: "Room deleted", description: "The room has been removed." });
        onSuccess(true);
      },
      onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
    },
  });

  const updateRoom = useUpdateRoom({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getRoom", roomId] });
        toast({ title: "Room closed", description: "The room is no longer accepting new members." });
        closeMenu();
        onSuccess();
      },
      onError: () => toast({ title: "Failed to close room", variant: "destructive" }),
    },
  });

  const leaveRoom = useLeaveRoom({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast({ title: "You left the room" });
        onSuccess(true);
      },
      onError: () => toast({ title: "Failed to leave", variant: "destructive" }),
    },
  });

  const isLoading = deleteRoom.isPending || updateRoom.isPending || leaveRoom.isPending;

  const openMenu = () => {
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const closeMenu = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 260);
  };

  const handleConfirm = () => {
    if (confirm === "delete") deleteRoom.mutate({ id: roomId });
    else if (confirm === "close") updateRoom.mutate({ id: roomId, data: { isActive: false } });
    else if (confirm === "leave") leaveRoom.mutate({ id: roomId });
  };

  const confirmConfig = {
    delete: {
      title: "Delete this room?",
      body: `"${roomName}" and all its messages and demos will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
    },
    close: {
      title: "Close this room?",
      body: `"${roomName}" will be marked as inactive. Members can still view it but no new creators can join.`,
      confirmLabel: "Close room",
      danger: false,
    },
    leave: {
      title: "Leave this room?",
      body: `You'll be removed from "${roomName}". You can re-join later if there's space.`,
      confirmLabel: "Leave",
      danger: false,
    },
  };

  return (
    <>
      {/* ••• trigger */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openMenu(); }}
        title="Room options"
        style={{
          width: 36, height: 36, borderRadius: 99, flexShrink: 0,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "rgba(255,255,255,0.45)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Bottom-sheet menu (portal) */}
      {open && createPortal(
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-end",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.22s ease",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Sheet */}
          <div
            style={{
              position: "relative", zIndex: 1,
              width: "100%", maxWidth: "min(440px, 100vw)",
              background: "hsl(270 16% 8%)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px 20px 0 0",
              overflow: "hidden",
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            {/* Gold line */}
            <div style={{ height: 2.5, background: "linear-gradient(90deg,#e0b050,#c89030)", flexShrink: 0 }} />
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 20px 16px" }}>
              <div>
                <p style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
                  Room Options
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
                  {roomName}
                </p>
              </div>
              <button
                onClick={closeMenu}
                style={{
                  width: 32, height: 32, borderRadius: 99,
                  background: "rgba(255,255,255,0.06)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "rgba(255,255,255,0.4)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Options */}
            <div style={{ padding: "0 12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
              {isOwner && (
                <>
                  <button
                    onClick={() => { closeMenu(); setTimeout(() => setConfirm("close"), 280); }}
                    style={{
                      width: "100%", height: 52, borderRadius: 14,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "0 18px", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <EyeOff size={18} color="rgba(255,255,255,0.45)" />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0 }}>
                        Close Room
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>
                        Mark as inactive — no new members
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => { closeMenu(); setTimeout(() => setConfirm("delete"), 280); }}
                    style={{
                      width: "100%", height: 52, borderRadius: 14,
                      background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)",
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "0 18px", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <Trash2 size={18} color="rgba(239,68,68,0.6)" />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(239,68,68,0.82)", margin: 0 }}>
                        Delete Room
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(239,68,68,0.4)", margin: "2px 0 0" }}>
                        Permanently removes all messages and demos
                      </p>
                    </div>
                  </button>
                </>
              )}

              {isMember && !isOwner && (
                <button
                  onClick={() => { closeMenu(); setTimeout(() => setConfirm("leave"), 280); }}
                  style={{
                    width: "100%", height: 52, borderRadius: 14,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "0 18px", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <LogOut size={18} color="rgba(255,255,255,0.45)" />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0 }}>
                      Leave Room
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>
                      You can re-join later if there's space
                    </p>
                  </div>
                </button>
              )}

              <button
                onClick={closeMenu}
                style={{
                  width: "100%", height: 48, borderRadius: 14,
                  background: "transparent", border: "none",
                  fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.35)",
                  cursor: "pointer", marginTop: 4,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Confirmation dialog */}
      {confirm && (
        <ConfirmDialog
          {...confirmConfig[confirm]}
          loading={isLoading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
