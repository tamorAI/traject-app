import { uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { enforcementDecision } from "./enforcement-decision";
import { gatewayDeployment } from "./gateway-deployment";
import { operatorToken } from "./operator-token";

export const approvalRequest = createTable(
  "approval_request",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    decisionId: uuid("decision_id").references(() => enforcementDecision.id, { onDelete: "set null" }),
    deploymentId: uuid("deployment_id").references(() => gatewayDeployment.id, { onDelete: "set null" }),
    requestedAction: text("requested_action").notNull(),
    status: text("status").notNull().default("PENDING"),
    resolvedByToken: uuid("resolved_by_token").references(() => operatorToken.id, { onDelete: "set null" }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    context: jsonb("context").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("idx_approval_request_org").on(table.organizationId),
    orgStatusIdx: index("idx_approval_request_org_status").on(table.organizationId, table.status),
    decisionIdx: index("idx_approval_request_decision").on(table.decisionId),
    expiresIdx: index("idx_approval_request_expires").on(table.expiresAt),
  }),
);
