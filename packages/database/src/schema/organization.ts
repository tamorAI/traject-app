import { uuid, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";

export const organization = createTable(
  "organization",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    activeOrgIdx: index("idx_org_active").on(table.isActive),
    slugIdx: index("idx_org_slug").on(table.slug),
  }),
);
