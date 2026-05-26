import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hooksTable = pgTable("hooks", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  vibe: text("vibe"),
  tags: text("tags").array().notNull().default([]),
  lookingFor: text("looking_for").array().notNull().default([]),
  maxSeats: integer("max_seats").notNull().default(3),
  roomId: integer("room_id"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHookSchema = createInsertSchema(hooksTable).omit({
  id: true,
  createdAt: true,
});
export type InsertHook = z.infer<typeof insertHookSchema>;
export type Hook = typeof hooksTable.$inferSelect;
