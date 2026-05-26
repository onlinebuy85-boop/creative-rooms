import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, and, count, desc, sql } from "drizzle-orm";
import { db, profilesTable, roomsTable, roomMembersTable, messagesTable, demosTable } from "@workspace/db";
import { getRoomPresenceCounts } from "../lib/websocket";
import {
  ListRoomsQueryParams,
  CreateRoomBody,
  GetRoomParams,
  UpdateRoomParams,
  UpdateRoomBody,
  DeleteRoomParams,
  JoinRoomParams,
  LeaveRoomParams,
  GetRoomMembersParams,
  GetRoomActivityParams,
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

async function getProfileByClerkId(clerkId: string) {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, clerkId));
  return profile ?? null;
}

async function getRoomWithMemberCount(roomId: number) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) return null;

  const [{ value }] = await db
    .select({ value: count() })
    .from(roomMembersTable)
    .where(eq(roomMembersTable.roomId, roomId));

  const [owner] = await db
    .select({ displayName: profilesTable.displayName })
    .from(profilesTable)
    .where(eq(profilesTable.id, room.ownerId));

  return {
    id: room.id,
    name: room.name,
    description: room.description ?? null,
    vibe: room.vibe ?? null,
    genres: room.genres ?? [],
    maxMembers: room.maxMembers,
    ownerId: room.ownerId,
    ownerName: owner?.displayName ?? null,
    isActive: room.isActive,
    memberCount: Number(value),
    coverImageUrl: room.coverImageUrl ?? null,
    createdAt: room.createdAt.toISOString(),
  };
}

// GET /rooms
router.get("/rooms", async (req, res): Promise<void> => {
  const params = ListRoomsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.isActive, true))
    .$dynamic();

  if (params.data.vibe) {
    query = query.where(
      sql`${roomsTable.isActive} = true AND lower(${roomsTable.vibe}) LIKE ${'%' + params.data.vibe.toLowerCase() + '%'}`,
    );
  }

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.isActive, true))
    .orderBy(desc(roomsTable.createdAt));

  const enriched = await Promise.all(rooms.map(async (r) => {
    const [{ value }] = await db
      .select({ value: count() })
      .from(roomMembersTable)
      .where(eq(roomMembersTable.roomId, r.id));
    const [owner] = await db
      .select({ displayName: profilesTable.displayName })
      .from(profilesTable)
      .where(eq(profilesTable.id, r.ownerId));
    return {
      id: r.id,
      name: r.name,
      description: r.description ?? null,
      vibe: r.vibe ?? null,
      genres: r.genres ?? [],
      maxMembers: r.maxMembers,
      ownerId: r.ownerId,
      ownerName: owner?.displayName ?? null,
      isActive: r.isActive,
      memberCount: Number(value),
      coverImageUrl: r.coverImageUrl ?? null,
      createdAt: r.createdAt.toISOString(),
    };
  }));

  let filtered = enriched;
  if (params.data.genre) {
    const g = params.data.genre.toLowerCase();
    filtered = enriched.filter(r => r.genres.some(genre => genre.toLowerCase().includes(g)));
  }
  if (params.data.vibe) {
    const v = params.data.vibe.toLowerCase();
    filtered = filtered.filter(r => r.vibe?.toLowerCase().includes(v));
  }

  res.json(filtered);
});

// POST /rooms
router.post("/rooms", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const profile = await getProfileByClerkId(req.clerkUserId);
  if (!profile) {
    res.status(404).json({ error: "Profile not found. Please create a profile first." });
    return;
  }

  const [room] = await db
    .insert(roomsTable)
    .values({ ...parsed.data, ownerId: profile.id })
    .returning();

  // Auto-join as owner
  await db.insert(roomMembersTable).values({
    roomId: room.id,
    profileId: profile.id,
    role: "owner",
  });

  const result = await getRoomWithMemberCount(room.id);
  res.status(201).json(result);
});

// GET /rooms/discover
router.get("/rooms/discover", requireAuth, async (req: any, res): Promise<void> => {
  const profile = await getProfileByClerkId(req.clerkUserId);

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.isActive, true))
    .orderBy(desc(roomsTable.createdAt))
    .limit(20);

  const enriched = await Promise.all(rooms.map(async (r) => {
    const [{ value }] = await db
      .select({ value: count() })
      .from(roomMembersTable)
      .where(eq(roomMembersTable.roomId, r.id));
    const [owner] = await db
      .select({ displayName: profilesTable.displayName })
      .from(profilesTable)
      .where(eq(profilesTable.id, r.ownerId));
    return {
      id: r.id,
      name: r.name,
      description: r.description ?? null,
      vibe: r.vibe ?? null,
      genres: r.genres ?? [],
      maxMembers: r.maxMembers,
      ownerId: r.ownerId,
      ownerName: owner?.displayName ?? null,
      isActive: r.isActive,
      memberCount: Number(value),
      coverImageUrl: r.coverImageUrl ?? null,
      createdAt: r.createdAt.toISOString(),
    };
  }));

  // Sort by genre/vibe match if profile exists
  if (profile && profile.genres.length > 0) {
    enriched.sort((a, b) => {
      const aMatch = a.genres.filter(g => profile.genres.includes(g)).length;
      const bMatch = b.genres.filter(g => profile.genres.includes(g)).length;
      return bMatch - aMatch;
    });
  }

  res.json(enriched);
});

// GET /rooms/my
router.get("/rooms/my", requireAuth, async (req: any, res): Promise<void> => {
  const profile = await getProfileByClerkId(req.clerkUserId);
  if (!profile) {
    res.json([]);
    return;
  }

  const memberships = await db
    .select({ roomId: roomMembersTable.roomId })
    .from(roomMembersTable)
    .where(eq(roomMembersTable.profileId, profile.id));

  const roomIds = memberships.map(m => m.roomId);
  if (roomIds.length === 0) {
    res.json([]);
    return;
  }

  const enriched = await Promise.all(roomIds.map(id => getRoomWithMemberCount(id)));
  res.json(enriched.filter(Boolean));
});

// GET /rooms/presence — live WebSocket presence counts, no auth required
router.get("/rooms/presence", (_req, res): void => {
  res.json(getRoomPresenceCounts());
});

// GET /rooms/:id
router.get("/rooms/:id", async (req, res): Promise<void> => {
  const params = GetRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const result = await getRoomWithMemberCount(params.data.id);
  if (!result) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json(result);
});

// PATCH /rooms/:id
router.patch("/rooms/:id", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const profile = await getProfileByClerkId(req.clerkUserId);
  if (!profile) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, params.data.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (room.ownerId !== profile.id) {
    res.status(403).json({ error: "Only the owner can update this room" });
    return;
  }

  await db
    .update(roomsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(roomsTable.id, params.data.id));

  const result = await getRoomWithMemberCount(params.data.id);
  res.json(result);
});

// DELETE /rooms/:id
router.delete("/rooms/:id", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const profile = await getProfileByClerkId(req.clerkUserId);
  if (!profile) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, params.data.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (room.ownerId !== profile.id) {
    res.status(403).json({ error: "Only the owner can delete this room" });
    return;
  }

  await db.delete(roomMembersTable).where(eq(roomMembersTable.roomId, params.data.id));
  await db.delete(roomsTable).where(eq(roomsTable.id, params.data.id));

  res.sendStatus(204);
});

// POST /rooms/:id/join
router.post("/rooms/:id/join", requireAuth, async (req: any, res): Promise<void> => {
  const params = JoinRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const profile = await getProfileByClerkId(req.clerkUserId);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, params.data.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  const [{ value: memberCount }] = await db
    .select({ value: count() })
    .from(roomMembersTable)
    .where(eq(roomMembersTable.roomId, params.data.id));

  if (Number(memberCount) >= room.maxMembers) {
    res.status(400).json({ error: "Room is full" });
    return;
  }

  // Upsert membership
  const existing = await db
    .select()
    .from(roomMembersTable)
    .where(and(
      eq(roomMembersTable.roomId, params.data.id),
      eq(roomMembersTable.profileId, profile.id),
    ));

  if (existing.length > 0) {
    res.json({
      id: existing[0].id,
      roomId: existing[0].roomId,
      profileId: existing[0].profileId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl ?? null,
      role: existing[0].role,
      joinedAt: existing[0].joinedAt.toISOString(),
    });
    return;
  }

  const [member] = await db
    .insert(roomMembersTable)
    .values({ roomId: params.data.id, profileId: profile.id, role: "member" })
    .returning();

  res.json({
    id: member.id,
    roomId: member.roomId,
    profileId: member.profileId,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl ?? null,
    role: member.role,
    joinedAt: member.joinedAt.toISOString(),
  });
});

// POST /rooms/:id/leave
router.post("/rooms/:id/leave", requireAuth, async (req: any, res): Promise<void> => {
  const params = LeaveRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const profile = await getProfileByClerkId(req.clerkUserId);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  await db
    .delete(roomMembersTable)
    .where(and(
      eq(roomMembersTable.roomId, params.data.id),
      eq(roomMembersTable.profileId, profile.id),
    ));

  res.sendStatus(204);
});

// GET /rooms/:id/members
router.get("/rooms/:id/members", async (req, res): Promise<void> => {
  const params = GetRoomMembersParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const members = await db
    .select({
      id: roomMembersTable.id,
      roomId: roomMembersTable.roomId,
      profileId: roomMembersTable.profileId,
      role: roomMembersTable.role,
      joinedAt: roomMembersTable.joinedAt,
      displayName: profilesTable.displayName,
      avatarUrl: profilesTable.avatarUrl,
    })
    .from(roomMembersTable)
    .innerJoin(profilesTable, eq(roomMembersTable.profileId, profilesTable.id))
    .where(eq(roomMembersTable.roomId, params.data.id));

  res.json(members.map(m => ({
    id: m.id,
    roomId: m.roomId,
    profileId: m.profileId,
    displayName: m.displayName ?? null,
    avatarUrl: m.avatarUrl ?? null,
    role: m.role,
    joinedAt: m.joinedAt.toISOString(),
  })));
});

// GET /rooms/:id/activity
router.get("/rooms/:id/activity", async (req, res): Promise<void> => {
  const params = GetRoomActivityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [{ msgCount }] = await db
    .select({ msgCount: count() })
    .from(messagesTable)
    .where(eq(messagesTable.roomId, params.data.id));

  const [{ demoCount }] = await db
    .select({ demoCount: count() })
    .from(demosTable)
    .where(eq(demosTable.roomId, params.data.id));

  const [{ memberCount }] = await db
    .select({ memberCount: count() })
    .from(roomMembersTable)
    .where(eq(roomMembersTable.roomId, params.data.id));

  const recentMessages = await db
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
    .limit(5);

  const recentDemos = await db
    .select({
      id: demosTable.id,
      roomId: demosTable.roomId,
      uploaderId: demosTable.uploaderId,
      title: demosTable.title,
      description: demosTable.description,
      fileUrl: demosTable.fileUrl,
      duration: demosTable.duration,
      createdAt: demosTable.createdAt,
      uploaderName: profilesTable.displayName,
    })
    .from(demosTable)
    .innerJoin(profilesTable, eq(demosTable.uploaderId, profilesTable.id))
    .where(eq(demosTable.roomId, params.data.id))
    .orderBy(desc(demosTable.createdAt))
    .limit(3);

  const allDates = [
    ...recentMessages.map(m => m.createdAt),
    ...recentDemos.map(d => d.createdAt),
  ].sort((a, b) => b.getTime() - a.getTime());

  res.json({
    roomId: params.data.id,
    messageCount: Number(msgCount),
    demoCount: Number(demoCount),
    memberCount: Number(memberCount),
    lastActivityAt: allDates[0]?.toISOString() ?? null,
    recentMessages: recentMessages.map(m => ({
      id: m.id,
      roomId: m.roomId,
      profileId: m.profileId,
      senderName: m.senderName ?? null,
      senderAvatarUrl: m.senderAvatarUrl ?? null,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
    recentDemos: recentDemos.map(d => ({
      id: d.id,
      roomId: d.roomId,
      uploaderId: d.uploaderId,
      uploaderName: d.uploaderName ?? null,
      title: d.title,
      description: d.description ?? null,
      fileUrl: d.fileUrl,
      duration: d.duration ?? null,
      createdAt: d.createdAt.toISOString(),
    })),
  });
});

export default router;
