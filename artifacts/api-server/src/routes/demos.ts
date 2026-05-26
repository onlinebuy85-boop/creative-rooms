import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, and, desc } from "drizzle-orm";
import { db, profilesTable, demosTable } from "@workspace/db";
import {
  GetRoomDemosParams,
  UploadDemoParams,
  UploadDemoBody,
  DeleteDemoParams,
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

// GET /rooms/:id/demos
router.get("/rooms/:id/demos", async (req, res): Promise<void> => {
  const params = GetRoomDemosParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const demos = await db
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
    .orderBy(desc(demosTable.createdAt));

  res.json(demos.map(d => ({
    id: d.id,
    roomId: d.roomId,
    uploaderId: d.uploaderId,
    uploaderName: d.uploaderName ?? null,
    title: d.title,
    description: d.description ?? null,
    fileUrl: d.fileUrl,
    duration: d.duration ?? null,
    createdAt: d.createdAt.toISOString(),
  })));
});

// POST /rooms/:id/demos
router.post("/rooms/:id/demos", requireAuth, async (req: any, res): Promise<void> => {
  const params = UploadDemoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UploadDemoBody.safeParse(req.body);
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

  const [demo] = await db
    .insert(demosTable)
    .values({
      roomId: params.data.id,
      uploaderId: profile.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      fileUrl: parsed.data.fileUrl,
      duration: parsed.data.duration ?? null,
    })
    .returning();

  res.status(201).json({
    id: demo.id,
    roomId: demo.roomId,
    uploaderId: demo.uploaderId,
    uploaderName: profile.displayName,
    title: demo.title,
    description: demo.description ?? null,
    fileUrl: demo.fileUrl,
    duration: demo.duration ?? null,
    createdAt: demo.createdAt.toISOString(),
  });
});

// DELETE /rooms/:roomId/demos/:demoId
router.delete("/rooms/:roomId/demos/:demoId", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteDemoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, req.clerkUserId));

  if (!profile) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [demo] = await db
    .select()
    .from(demosTable)
    .where(and(
      eq(demosTable.id, params.data.demoId),
      eq(demosTable.roomId, params.data.roomId),
    ));

  if (!demo) {
    res.status(404).json({ error: "Demo not found" });
    return;
  }

  if (demo.uploaderId !== profile.id) {
    res.status(403).json({ error: "Only the uploader can delete this demo" });
    return;
  }

  await db.delete(demosTable).where(eq(demosTable.id, params.data.demoId));
  res.sendStatus(204);
});

export default router;
