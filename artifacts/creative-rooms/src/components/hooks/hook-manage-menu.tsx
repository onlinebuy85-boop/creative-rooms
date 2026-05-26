import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteHook, useUpdateHook, getListHooksQueryKey } from "@workspace/api-client-react";
import { MoreHorizontal, Trash2, EyeOff, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HookManageMenuProps {
  hookId: number;
  hookTitle: string;
  isActive: boolean;
}

export function HookManageMenu({ hookId, hookTitle, isActive }: HookManageMenuProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openSheet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const closeSheet = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      setConfirmDelete(false);
    }, 280);
  }, []);

  const deleteMutation = useDeleteHook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHooksQueryKey() });
        toast({ title: "Hook deleted." });
        closeSheet();
      },
      onError: () => {
        toast({ title: "Could not delete hook.", variant: "destructive" });
      },
    },
  });

  const closeMutation = useUpdateHook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHooksQueryKey() });
        toast({ title: "Hook closed." });
        closeSheet();
      },
      onError: () => {
        toast({ title: "Could not close hook.", variant: "destructive" });
      },
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate({ id: hookId });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeMutation.mutate({ id: hookId, data: { isActive: false } });
  };

  const isPending = deleteMutation.isPending || closeMutation.isPending;

  return (
    <>
      <button
        onClick={openSheet}
        aria-label="Manage hook"
        style={{
          width: 30,
          height: 30,
          borderRadius: 99,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.45)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.22s ease",
            pointerEvents: "auto",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={closeSheet}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Sheet */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "min(480px, 100vw)",
              background: "hsl(270 16% 8%)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px 20px 0 0",
              overflow: "hidden",
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)",
              paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            {/* Gold accent line */}
            <div style={{ height: 2.5, background: "linear-gradient(90deg,#e0b050,#c89030)" }} />

            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
            </div>

            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 20px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                  Manage Hook
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "3px 0 0" }}>
                  {hookTitle}
                </p>
              </div>
              <button
                onClick={closeSheet}
                style={{
                  width: 34, height: 34, borderRadius: 99, cursor: "pointer",
                  background: "rgba(255,255,255,0.07)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                <X size={17} />
              </button>
            </div>

            {!confirmDelete ? (
              /* Action list */
              <div style={{ padding: "10px 14px 4px" }}>
                {isActive && (
                  <button
                    onClick={handleClose}
                    disabled={isPending}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      width: "100%",
                      padding: "14px 10px",
                      borderRadius: 12,
                      border: "none",
                      background: "transparent",
                      cursor: isPending ? "not-allowed" : "pointer",
                      opacity: isPending ? 0.5 : 1,
                      transition: "background 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: "rgba(255,200,100,0.1)", border: "1px solid rgba(255,200,100,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <EyeOff size={16} color="rgba(255,200,100,0.8)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                        Close Hook
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "2px 0 0" }}>
                        Stop accepting new collaborators
                      </p>
                    </div>
                  </button>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    width: "100%",
                    padding: "14px 10px",
                    borderRadius: 12,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,74,74,0.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "rgba(212,74,74,0.1)", border: "1px solid rgba(212,74,74,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Trash2 size={16} color="rgba(212,100,100,0.9)" />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(212,100,100,0.9)", margin: 0 }}>
                      Delete Hook
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "2px 0 0" }}>
                      Permanently remove this hook
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              /* Confirm delete */
              <div style={{ padding: "20px 20px 8px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px",
                  borderRadius: 14,
                  background: "rgba(212,74,74,0.07)",
                  border: "1px solid rgba(212,74,74,0.2)",
                  marginBottom: 20,
                }}>
                  <AlertTriangle size={20} color="rgba(212,100,100,0.8)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>
                    This will permanently delete <strong style={{ color: "rgba(255,255,255,0.9)" }}>"{hookTitle}"</strong>. This cannot be undone.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                    style={{
                      flex: 1, height: 46, borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)",
                      fontSize: 14, fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    style={{
                      flex: 1, height: 46, borderRadius: 12, border: "none",
                      background: isPending ? "rgba(212,74,74,0.4)" : "linear-gradient(135deg,#c85050,#a03030)",
                      color: "#fff",
                      fontSize: 14, fontWeight: 600, cursor: isPending ? "not-allowed" : "pointer",
                    }}
                  >
                    {isPending ? "Deleting…" : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
