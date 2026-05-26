import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const demosTable = pgTable("demos", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  uploaderId: integer("uploader_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDemoSchema = createInsertSchema(demosTable).omit({
  id: true,
  createdAt: true,
});
export type InsertDemo = z.infer<typeof insertDemoSchema>;
export type Demo = typeof demosTable.$inferSelect;
