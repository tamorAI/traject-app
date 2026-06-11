import { uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { compiledGraph } from "./compiled-graph";

export const gatewayDeployment = createTable(
  "gateway_deployment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    compiledGraphId: uuid("compiled_graph_id").references(() => compiledGraph.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    version: text("version"),
    status: text("status").notNull().default("OFFLINE"),
    lastHeartbeatAt: timestamp("last_heartbeat_at", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("idx_gateway_deployment_org").on(table.organizationId),
    statusIdx: index("idx_gateway_deployment_status").on(table.status),
    graphIdx: index("idx_gateway_deployment_graph").on(table.compiledGraphId),
  }),
);
