import { uuid, text, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import type { AiProvider } from "../enums";

export const aiModel = createTable(
  "ai_model",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    modelId: text("model_id").unique().notNull(),
    provider: text("provider").$type<AiProvider>().notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    maxTokens: integer("max_tokens"),
    pricing: jsonb("pricing").$type<{
      inputPer1K?: number;
      outputPer1K?: number;
      currency?: string;
    }>(),
    capabilities: jsonb("capabilities").$type<string[]>().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    providerIdx: index("idx_ai_model_provider").on(table.provider),
    activeIdx: index("idx_ai_model_active").on(table.isActive),
  }),
);
