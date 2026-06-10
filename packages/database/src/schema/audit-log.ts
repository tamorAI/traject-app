import { uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";

export const auditLog = createTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    changes: jsonb("changes").$type<{
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
    }>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orgIdx: index("idx_audit_log_org").on(table.organizationId),
    orgCreatedIdx: index("idx_audit_log_org_created").on(
      table.organizationId,
      table.createdAt,
    ),
    actionIdx: index("idx_audit_log_action").on(table.action),
    entityIdx: index("idx_audit_log_entity").on(table.entityType, table.entityId),
    actorIdx: index("idx_audit_log_actor").on(table.actorId),
  }),
);
