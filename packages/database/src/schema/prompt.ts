import { uuid, text, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";

export const prompt = createTable(
  "prompt",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organization.id, {
      onDelete: "cascade",
    }),
    createdBy: uuid("created_by").references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    content: text("content").notNull(),
    description: text("description"),
    variables: jsonb("variables").$type<string[]>().default([]),
    category: text("category"),
    isTemplate: boolean("is_template").notNull().default(false),
    isPublic: boolean("is_public").notNull().default(false),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("idx_prompt_org").on(table.organizationId),
    categoryIdx: index("idx_prompt_category").on(table.category),
    templateIdx: index("idx_prompt_template").on(table.isTemplate),
    publicIdx: index("idx_prompt_public").on(table.isPublic),
    createdByIdx: index("idx_prompt_created_by").on(table.createdBy),
  }),
);
