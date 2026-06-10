import { uuid, text, timestamp, boolean, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";
import type { OrganizationRole } from "../enums";

export const userOrganization = createTable(
  "user_organization",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role").$type<OrganizationRole>().notNull().default("MEMBER"),
    isDefault: boolean("is_default").notNull().default(false),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueUserOrg: uniqueIndex("uq_user_organization").on(table.userId, table.organizationId),
    orgIdx: index("idx_user_org_org").on(table.organizationId),
    roleIdx: index("idx_user_org_role").on(table.role),
  }),
);
