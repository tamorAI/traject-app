import { uuid, text, timestamp, integer, numeric, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";
import { aiModel } from "./ai-model";

export const aiUsageLog = createTable(
  "ai_usage_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
    modelId: uuid("model_id").references(() => aiModel.id, { onDelete: "set null" }),
    requestType: text("request_type").notNull().default("chat"),
    promptTokens: integer("prompt_tokens").notNull().default(0),
    completionTokens: integer("completion_tokens").notNull().default(0),
    totalTokens: integer("total_tokens").notNull().default(0),
    cost: numeric("cost", { precision: 12, scale: 8 }).notNull().default("0"),
    durationMs: integer("duration_ms"),
    endpoint: text("endpoint"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orgIdx: index("idx_ai_usage_org").on(table.organizationId),
    orgCreatedIdx: index("idx_ai_usage_org_created").on(
      table.organizationId,
      table.createdAt,
    ),
    userIdx: index("idx_ai_usage_user").on(table.userId),
    modelIdx: index("idx_ai_usage_model").on(table.modelId),
    typeIdx: index("idx_ai_usage_type").on(table.requestType),
  }),
);
