import { uuid, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import type { UserType } from "../enums";

export const user = createTable("user",  {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	isActive: boolean("is_active").notNull().default(true),
	onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
    emailIdx: index("idx_user_email").on(table.email),
    activeIdx: index("idx_user_active").on(table.isActive),
}));
