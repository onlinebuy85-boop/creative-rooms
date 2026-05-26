import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, desc, sql } from "drizzle-orm";
import { db, profilesTable, hooksTable, roomsTable, roomMembersTable } from "@workspace/db";
import { GetHookParams, JoinHookParams, CreateHookBody } from "@workspace/api-zod";

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

async function enrichHook(hook: typeof hooksTable.$inferSelect) {
  const [creator] = await db
    .select({ displayName: profilesTable.displayName, avatarUrl: profilesTable.avatarUrl })
    .from(profilesTable)
    .where(eq(profilesTable.id, hook.creatorId));

  let seatsLeft = hook.maxSeats - 1; // creator counts as 1
  if (hook.roomId) {
    const [{ cnt }] = await db
      .select({ cnt: sql<number>`count(*)` })
      .from(roomMembersTable)
      .where(eq(roomMembersTable.roomId, hook.roomId));
    seatsLeft = Math.max(0, hook.maxSeats - Number(cnt));
  }

  return {
    id: hook.id,
    creatorId: hook.creatorId,
    creatorName: creator?.displayName ?? null,
    creatorAvatarUrl: creator?.avatarUrl ?? null,
    title: hook.title,
    description: hook.description ?? null,
    audioUrl: hook.audioUrl,
    vibe: hook.vibe ?? null,
    tags: hook.tags ?? [],
    lookingFor: hook.lookingFor ?? [],
    maxSeats: hook.maxSeats,
    seatsLeft,
    roomId: hook.roomId ?? null,
    isActive: hook.isActive,
    createdAt: hook.createdAt.toISOString(),
  };
}

// GET /hooks
router.get("/hooks", async (req, res): Promise<void> => {
  const hooks = await db
    .select()
    .from(hooksTable)
    .where(eq(hooksTable.isActive, true))
    .orderBy(desc(hooksTable.createdAt))
    .limit(50);

  const enriched = await Promise.all(hooks.map(enrichHook));
  res.json(enriched);
});

// GET /hooks/:id
router.get("/hooks/:id", async (req, res): Promise<void> => {
  const params = GetHookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hook] = await db.select().from(hooksTable).where(eq(hooksTable.id, params.data.id));
  if (!hook) {
    res.status(404).json({ error: "Hook not found" });
    return;
  }

  res.json(await enrichHook(hook));
});

// POST /hooks
router.post("/hooks", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateHookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found. Please create a profile first." });
    return;
  }

  const [hook] = await db
    .insert(hooksTable)
    .values({
      creatorId: profile.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      audioUrl: parsed.data.audioUrl,
      vibe: parsed.data.vibe ?? null,
      tags: parsed.data.tags ?? [],
      lookingFor: parsed.data.lookingFor ?? [],
      maxSeats: parsed.data.maxSeats ?? 3,
    })
    .returning();

  res.status(201).json(await enrichHook(hook));
});

// PATCH /hooks/:id
router.patch("/hooks/:id", requireAuth, async (req: any, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [hook] = await db.select().from(hooksTable).where(eq(hooksTable.id, id));
  if (!hook) { res.status(404).json({ error: "Hook not found" }); return; }

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkId, req.clerkUserId));
  if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
  if (hook.creatorId !== profile.id) { res.status(403).json({ error: "Not authorized" }); return; }

  const { isActive } = req.body as { isActive?: boolean };
  const [updated] = await db
    .update(hooksTable)
    .set({ isActive: isActive !== undefined ? isActive : hook.isActive })
    .where(eq(hooksTable.id, id))
    .returning();

  res.json(await enrichHook(updated));
});

// DELETE /hooks/:id
router.delete("/hooks/:id", requireAuth, async (req: any, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [hook] = await db.select().from(hooksTable).where(eq(hooksTable.id, id));
  if (!hook) { res.status(404).json({ error: "Hook not found" }); return; }

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkId, req.clerkUserId));
  if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
  if (hook.creatorId !== profile.id) { res.status(403).json({ error: "Not authorized" }); return; }

  await db.delete(hooksTable).where(eq(hooksTable.id, id));
  res.status(204).end();
});

// POST /hooks/:id/join
router.post("/hooks/:id/join", requireAuth, async (req: any, res): Promise<void> => {
  const params = GetHookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }

  const [hook] = await db.select().from(hooksTable).where(eq(hooksTable.id, params.data.id));
  if (!hook) {
    res.status(404).json({ error: "Hook not found." });
    return;
  }

  if (!hook.isActive) {
    res.status(400).json({ error: "This hook is no longer active." });
    return;
  }

  // Don't let the creator join their own hook via this endpoint
  if (hook.creatorId === profile.id) {
    // Creator is auto-joined — just return the hook
    res.json(await enrichHook(hook));
    return;
  }

  let roomId = hook.roomId;

  // Create room on first join
  if (!roomId) {
    const [room] = await db
      .insert(roomsTable)
      .values({
        name: hook.title,
        description: hook.description ?? null,
        vibe: hook.vibe ?? null,
        genres: hook.tags ?? [],
        maxMembers: hook.maxSeats,
        ownerId: hook.creatorId,
      })
      .returning();

    // Auto-join creator as owner
    await db.insert(roomMembersTable).values({
      roomId: room.id,
      profileId: hook.creatorId,
      role: "owner",
    });

    roomId = room.id;
    await db.update(hooksTable).set({ roomId }).where(eq(hooksTable.id, hook.id));
  }

  // Check seats
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(roomMembersTable)
    .where(eq(roomMembersTable.roomId, roomId));

  const currentCount = Number(cnt);
  if (currentCount >= hook.maxSeats) {
    // Lock the hook
    await db.update(hooksTable).set({ isActive: false }).where(eq(hooksTable.id, hook.id));
    res.status(400).json({ error: "This hook session is full." });
    return;
  }

  // Add joiner to room (upsert)
  await db
    .insert(roomMembersTable)
    .values({ roomId, profileId: profile.id, role: "member" })
    .onConflictDoNothing();

  // Re-check and lock if now full
  const [{ cnt: newCnt }] = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(roomMembersTable)
    .where(eq(roomMembersTable.roomId, roomId));

  if (Number(newCnt) >= hook.maxSeats) {
    await db.update(hooksTable).set({ isActive: false }).where(eq(hooksTable.id, hook.id));
  }

  const [updated] = await db.select().from(hooksTable).where(eq(hooksTable.id, hook.id));
  res.json(await enrichHook(updated));
});

export default router;
