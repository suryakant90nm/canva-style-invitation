import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Doc } from "@/lib/design";

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  data: jsonb("data").$type<Doc>().notNull(),
  source: text("source").notNull().default("system"),
  featured: boolean("featured").notNull().default(false),
  uses: integer("uses").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const designs = pgTable("designs", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull().default("invitation"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  data: jsonb("data").$type<Doc>().notNull(),
  templateId: integer("template_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** key/value store for admin settings (template overrides, site config). */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type TemplateRow = typeof templates.$inferSelect;
export type DesignRow = typeof designs.$inferSelect;
