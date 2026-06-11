import { uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";

export const demoRequest = createTable(
  "demo_request",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    message: text("message"),
    status: text("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: index("idx_demo_request_email").on(table.email),
    statusIdx: index("idx_demo_request_status").on(table.status),
  }),
);
