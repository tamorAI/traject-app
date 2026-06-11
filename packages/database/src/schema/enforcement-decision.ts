import { uuid, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { gatewayDeployment } from "./gateway-deployment";
import { compiledGraph } from "./compiled-graph";

export const enforcementDecision = createTable(
  "enforcement_decision",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    deploymentId: uuid("deployment_id").references(() => gatewayDeployment.id, { onDelete: "set null" }),
    compiledGraphId: uuid("compiled_graph_id").references(() => compiledGraph.id, { onDelete: "set null" }),
    toolName: text("tool_name").notNull(),
    verdict: text("verdict").notNull(),
    reason: text("reason"),
    latencyUs: integer("latency_us"),
    trajectoryRef: text("trajectory_ref"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orgIdx: index("idx_enforcement_decision_org").on(table.organizationId),
    orgCreatedIdx: index("idx_enforcement_decision_org_created").on(
      table.organizationId,
      table.createdAt,
    ),
    verdictIdx: index("idx_enforcement_decision_verdict").on(table.verdict),
    deploymentIdx: index("idx_enforcement_decision_deployment").on(table.deploymentId),
    trajectoryRefIdx: index("idx_enforcement_decision_trajectory").on(table.trajectoryRef),
  }),
);
