import { uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";

export const compiledGraph = createTable(
  "compiled_graph",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    version: text("version").notNull(),
    hmacDigest: text("hmac_digest").unique().notNull(),
    status: text("status").notNull().default("ACTIVE"),
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("idx_compiled_graph_org").on(table.organizationId),
    statusIdx: index("idx_compiled_graph_status").on(table.status),
    hmacIdx: index("idx_compiled_graph_hmac").on(table.hmacDigest),
  }),
);
