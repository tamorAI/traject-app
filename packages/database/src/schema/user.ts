import { uuid, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import type { UserType } from "../enums";

export const user = createTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique().notNull(),
    passwordHash: text("password_hash"),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    userType: text("user_type").$type<UserType>().notNull().default("USER"),
    isSuperAdmin: boolean("is_super_admin").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    timezone: text("timezone").notNull().default("UTC"),
    locale: text("locale").notNull().default("en"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: index("idx_user_email").on(table.email),
    activeIdx: index("idx_user_active").on(table.isActive),
  }),
);
