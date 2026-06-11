import { uuid, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";

export const operatorToken = createTable(
  "operator_token",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    tokenHash: text("token_hash").unique().notNull(),
    tokenPrefix: text("token_prefix").notNull(),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
    scopes: jsonb("scopes").$type<string[]>().default([]),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("idx_operator_token_org").on(table.organizationId),
    activeIdx: index("idx_operator_token_active").on(table.isActive),
    hashIdx: index("idx_operator_token_hash").on(table.tokenHash),
  }),
);
