import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { logger } from "./logger";

const roomConnections = new Map<number, Set<WebSocket>>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const roomId = parseInt(url.searchParams.get("roomId") ?? "0", 10);

    if (!roomId) {
      ws.close(1008, "roomId required");
      return;
    }

    if (!roomConnections.has(roomId)) {
      roomConnections.set(roomId, new Set());
    }
    roomConnections.get(roomId)!.add(ws);
    logger.info({ roomId }, "WS client connected");

    ws.on("close", () => {
      roomConnections.get(roomId)?.delete(ws);
      logger.info({ roomId }, "WS client disconnected");
    });

    ws.on("error", (err) => {
      logger.error({ err, roomId }, "WS error");
    });
  });

  return wss;
}

export function broadcastToRoom(roomId: number, payload: unknown) {
  const connections = roomConnections.get(roomId);
  if (!connections || connections.size === 0) return;

  const data = JSON.stringify(payload);
  for (const ws of connections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}
