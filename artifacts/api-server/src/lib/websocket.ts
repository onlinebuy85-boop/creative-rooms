import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { logger } from "./logger";

/* ── Per-connection metadata ── */
interface ConnMeta {
  ws: WebSocket;
  roomId: number;
  profileId?: number;
  displayName?: string;
  inVoice: boolean;
}

const connMeta = new Map<WebSocket, ConnMeta>();
/* roomId → all connections */
const roomConns = new Map<number, Set<WebSocket>>();
/* "roomId:profileId" → ws for targeted routing */
const profileSocket = new Map<string, WebSocket>();

function profileKey(roomId: number, profileId: number) {
  return `${roomId}:${profileId}`;
}

function broadcastRoom(
  roomId: number,
  payload: unknown,
  exclude?: WebSocket,
) {
  const conns = roomConns.get(roomId);
  if (!conns) return;
  const data = JSON.stringify(payload);
  for (const ws of conns) {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

function sendTo(ws: WebSocket, payload: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function currentVoiceMembers(roomId: number) {
  const conns = roomConns.get(roomId);
  if (!conns) return [];
  const members: Array<{ profileId: number; displayName: string }> = [];
  for (const ws of conns) {
    const meta = connMeta.get(ws);
    if (meta?.inVoice && meta.profileId && meta.displayName) {
      members.push({ profileId: meta.profileId, displayName: meta.displayName });
    }
  }
  return members;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const roomId = parseInt(url.searchParams.get("roomId") ?? "0", 10);

    if (!roomId) {
      ws.close(1008, "roomId required");
      return;
    }

    if (!roomConns.has(roomId)) roomConns.set(roomId, new Set());
    roomConns.get(roomId)!.add(ws);
    connMeta.set(ws, { ws, roomId, inVoice: false });
    logger.info({ roomId }, "WS client connected");

    /* ── Incoming messages ── */
    ws.on("message", (raw) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      const meta = connMeta.get(ws)!;

      switch (msg.type) {
        /* Client registers its identity after connecting */
        case "identify": {
          const profileId = Number(msg.profileId);
          const displayName = String(msg.displayName ?? "Unknown");
          meta.profileId = profileId;
          meta.displayName = displayName;
          if (profileId) {
            profileSocket.set(profileKey(roomId, profileId), ws);
          }
          /* Announce presence to others */
          broadcastRoom(roomId, { type: "presence", action: "join", profileId, displayName }, ws);
          break;
        }

        /* Typing indicators */
        case "typing": {
          if (!meta.profileId) break;
          broadcastRoom(
            roomId,
            { type: "typing", profileId: meta.profileId, displayName: meta.displayName },
            ws,
          );
          break;
        }
        case "stop_typing": {
          if (!meta.profileId) break;
          broadcastRoom(roomId, { type: "stop_typing", profileId: meta.profileId }, ws);
          break;
        }

        /* Voice presence */
        case "voice_join": {
          meta.inVoice = true;
          const members = currentVoiceMembers(roomId);
          broadcastRoom(roomId, {
            type: "voice_presence",
            action: "join",
            profileId: meta.profileId,
            displayName: meta.displayName,
            voiceMembers: members,
          });
          break;
        }
        case "voice_leave": {
          meta.inVoice = false;
          broadcastRoom(roomId, {
            type: "voice_presence",
            action: "leave",
            profileId: meta.profileId,
            displayName: meta.displayName,
            voiceMembers: currentVoiceMembers(roomId),
          });
          break;
        }

        /* WebRTC signaling — route to specific peer */
        case "voice_signal": {
          const toProfileId = Number(msg.to);
          const targetWs = profileSocket.get(profileKey(roomId, toProfileId));
          if (targetWs) {
            sendTo(targetWs, {
              type: "voice_signal",
              from: meta.profileId,
              displayName: meta.displayName,
              signal: msg.signal,
            });
          }
          break;
        }

        default:
          break;
      }
    });

    /* ── Disconnect ── */
    ws.on("close", () => {
      const meta = connMeta.get(ws);
      if (meta) {
        roomConns.get(meta.roomId)?.delete(ws);
        if (meta.profileId) {
          profileSocket.delete(profileKey(meta.roomId, meta.profileId));
          broadcastRoom(meta.roomId, {
            type: "presence",
            action: "leave",
            profileId: meta.profileId,
            displayName: meta.displayName,
          });
          if (meta.inVoice) {
            broadcastRoom(meta.roomId, {
              type: "voice_presence",
              action: "leave",
              profileId: meta.profileId,
              displayName: meta.displayName,
              voiceMembers: currentVoiceMembers(meta.roomId),
            });
          }
        }
        connMeta.delete(ws);
      }
      logger.info({ roomId }, "WS client disconnected");
    });

    ws.on("error", (err) => {
      logger.error({ err, roomId }, "WS error");
    });
  });

  return wss;
}

export function broadcastToRoom(roomId: number, payload: unknown) {
  broadcastRoom(roomId, payload);
}
