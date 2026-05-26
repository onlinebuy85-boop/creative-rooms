import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { db, profilesTable, messagesTable } from "@workspace/db";
import {
  GetRoomMessagesParams,
  SendMessageParams,
  SendMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.clerkUserId = userId;
  next();
}

// GET /rooms/:id/messages
router.get("/rooms/:id/messages", async (req, res): Promise<void> => {
  const params = GetRoomMessagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const messages = await db
    .select({
      id: messagesTable.id,
      roomId: messagesTable.roomId,
      profileId: messagesTable.profileId,
      content: messagesTable.content,
      createdAt: messagesTable.createdAt,
      senderName: profilesTable.displayName,
      senderAvatarUrl: profilesTable.avatarUrl,
    })
    .from(messagesTable)
    .innerJoin(profilesTable, eq(messagesTable.profileId, profilesTable.id))
    .where(eq(messagesTable.roomId, params.data.id))
    .orderBy(desc(messagesTable.createdAt))
    .limit(100);

  res.json(messages.reverse().map(m => ({
    id: m.id,
    roomId: m.roomId,
    profileId: m.profileId,
    senderName: m.senderName ?? null,
    senderAvatarUrl: m.senderAvatarUrl ?? null,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  })));
});

// POST /rooms/:id/messages
router.post("/rooms/:id/messages", requireAuth, async (req: any, res): Promise<void> => {
  const params = SendMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [message] = await db
    .insert(messagesTable)
    .values({
      roomId: params.data.id,
      profileId: profile.id,
      content: parsed.data.content,
    })
    .returning();

  // Broadcast via WebSocket
  const wsModule = await import("../lib/websocket").catch(() => null);
  if (wsModule) {
    wsModule.broadcastToRoom(params.data.id, {
      type: "new_message",
      message: {
        id: message.id,
        roomId: message.roomId,
        profileId: message.profileId,
        senderName: profile.displayName,
        senderAvatarUrl: profile.avatarUrl ?? null,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      },
    });
  }

  res.status(201).json({
    id: message.id,
    roomId: message.roomId,
    profileId: message.profileId,
    senderName: profile.displayName,
    senderAvatarUrl: profile.avatarUrl ?? null,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  });
});

// DELETE /rooms/:id/messages/:msgId
router.delete("/rooms/:id/messages/:msgId", requireAuth, async (req: any, res): Promise<void> => {
  const roomId = parseInt(req.params.id, 10);
  const msgId  = parseInt(req.params.msgId, 10);
  if (isNaN(roomId) || isNaN(msgId)) { res.status(400).json({ error: "Invalid params" }); return; }

  const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, msgId));
  if (!message || message.roomId !== roomId) { res.status(404).json({ error: "Message not found" }); return; }

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkId, req.clerkUserId));
  if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
  if (message.profileId !== profile.id) { res.status(403).json({ error: "Not authorized" }); return; }

  await db.delete(messagesTable).where(eq(messagesTable.id, msgId));
  res.status(204).end();
});

// PATCH /rooms/:id/messages/:msgId
router.patch("/rooms/:id/messages/:msgId", requireAuth, async (req: any, res): Promise<void> => {
  const roomId = parseInt(req.params.id, 10);
  const msgId  = parseInt(req.params.msgId, 10);
  if (isNaN(roomId) || isNaN(msgId)) { res.status(400).json({ error: "Invalid params" }); return; }

  const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, msgId));
  if (!message || message.roomId !== roomId) { res.status(404).json({ error: "Message not found" }); return; }

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkId, req.clerkUserId));
  if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
  if (message.profileId !== profile.id) { res.status(403).json({ error: "Not authorized" }); return; }

  const { content } = req.body as { content?: string };
  if (!content?.trim()) { res.status(400).json({ error: "Content is required" }); return; }

  const [updated] = await db
    .update(messagesTable)
    .set({ content: content.trim() })
    .where(eq(messagesTable.id, msgId))
    .returning();

  res.json({
    id: updated.id,
    roomId: updated.roomId,
    profileId: updated.profileId,
    senderName: profile.displayName,
    senderAvatarUrl: profile.avatarUrl ?? null,
    content: updated.content,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
