import { uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import { user } from "./user";
import type { InvitationStatus, OrganizationRole } from "../enums";

export const invitation = createTable(
  "invitation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role").$type<OrganizationRole>().notNull().default("MEMBER"),
    token: text("token").unique().notNull(),
    invitedBy: uuid("invited_by").references(() => user.id, { onDelete: "set null" }),
    status: text("status").$type<InvitationStatus>().notNull().default("PENDING"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgIdx: index("idx_invitation_org").on(table.organizationId),
    emailIdx: index("idx_invitation_email").on(table.email),
    statusIdx: index("idx_invitation_status").on(table.status),
    tokenIdx: index("idx_invitation_token").on(table.token),
  }),
);
