import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import {
  CreateProfileBody,
  UpdateProfileBody,
  UpdateProfileParams,
  GetProfileParams,
  GetMyProfileResponse,
  GetProfileResponse,
  UpdateProfileResponse,
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

function profileToResponse(p: typeof profilesTable.$inferSelect) {
  return {
    id: p.id,
    clerkId: p.clerkId,
    displayName: p.displayName,
    bio: p.bio ?? null,
    musicalStyle: p.musicalStyle ?? null,
    emotionalVibe: p.emotionalVibe ?? null,
    inspirations: p.inspirations ?? null,
    genres: p.genres ?? [],
    avatarUrl: p.avatarUrl ?? null,
    isCreator: p.isCreator,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

// POST /profiles/me/creator — self-activate creator membership
router.post("/profiles/me/creator", requireAuth, async (req: any, res): Promise<void> => {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [updated] = await db
    .update(profilesTable)
    .set({ isCreator: true, updatedAt: new Date() })
    .where(eq(profilesTable.clerkId, req.clerkUserId))
    .returning();

  res.json(profileToResponse(updated));
});

// GET /profiles/me
router.get("/profiles/me", requireAuth, async (req: any, res): Promise<void> => {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetMyProfileResponse.parse(profileToResponse(profile)));
});

// POST /profiles — create or upsert
router.post("/profiles", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (existing) {
    const [updated] = await db
      .update(profilesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(profilesTable.clerkId, req.clerkUserId))
      .returning();
    res.status(201).json(profileToResponse(updated));
    return;
  }

  const [profile] = await db
    .insert(profilesTable)
    .values({ ...parsed.data, clerkId: req.clerkUserId })
    .returning();

  res.status(201).json(profileToResponse(profile));
});

// GET /profiles/:id
router.get("/profiles/:id", async (req, res): Promise<void> => {
  const params = GetProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, params.data.id));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse(profileToResponse(profile)));
});

// PATCH /profiles/:id
router.patch("/profiles/:id", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  if (existing.clerkId !== req.clerkUserId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [updated] = await db
    .update(profilesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profilesTable.id, params.data.id))
    .returning();

  res.json(UpdateProfileResponse.parse(profileToResponse(updated)));
});

export default router;
