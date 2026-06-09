import { uuid, text, timestamp, boolean, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createTable } from "../helpers/create-table";
import { organization } from "./organization";
import type { SubscriptionTier, SubscriptionStatus, BillingCycle } from "../enums";

export const subscription = createTable(
  "subscription",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .unique()
      .references(() => organization.id, { onDelete: "cascade" }),
    planTier: text("plan_tier").$type<SubscriptionTier>().notNull(),
    status: text("status").$type<SubscriptionStatus>().notNull().default("TRIALING"),
    billingCycle: text("billing_cycle").$type<BillingCycle>(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true })
      .notNull()
      .defaultNow(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    trialEnd: timestamp("trial_end", { withTimezone: true }),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orgUnique: uniqueIndex("uq_subscription_org").on(table.organizationId),
    statusIdx: index("idx_subscription_status").on(table.status),
    stripeCustomerIdx: index("idx_subscription_stripe_customer").on(table.stripeCustomerId),
  }),
);
