type ExtractSchema<T extends readonly any[]> = T[number];

export const USER_TYPES = ["ADMIN", "TENANT_ADMIN", "USER"] as const;
export type UserType = ExtractSchema<typeof USER_TYPES>;

export const ORGANIZATION_ROLES = ["ROLE_OWNER", "ROLE_ADMIN", "ROLE_MEMBER", "ROLE_VIEWER"] as const;
export type OrganizationRole = ExtractSchema<typeof ORGANIZATION_ROLES>;

export const SUBSCRIPTION_TIERS = ["FREE", "STARTER", "PRO", "ENTERPRISE"] as const;
export type SubscriptionTier = ExtractSchema<typeof SUBSCRIPTION_TIERS>;

export const SUBSCRIPTION_STATUSES = ["ACTIVE", "CANCELED", "PAST_DUE", "TRIALING", "EXPIRED"] as const;
export type SubscriptionStatus = ExtractSchema<typeof SUBSCRIPTION_STATUSES>;

export const BILLING_CYCLES = ["MONTHLY", "YEARLY"] as const;
export type BillingCycle = ExtractSchema<typeof BILLING_CYCLES>;

export const AI_PROVIDERS = ["OPENAI", "ANTHROPIC", "GOOGLE", "CUSTOM"] as const;
export type AiProvider = ExtractSchema<typeof AI_PROVIDERS>;

export const INVITATION_STATUSES = ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"] as const;
export type InvitationStatus = ExtractSchema<typeof INVITATION_STATUSES>;

export const GRAPH_STATUSES = ["ACTIVE", "REVOKED", "SUPERSEDED"] as const;
export type GraphStatus = ExtractSchema<typeof GRAPH_STATUSES>;

export const DEPLOYMENT_STATUSES = ["ONLINE", "STALE", "OFFLINE"] as const;
export type DeploymentStatus = ExtractSchema<typeof DEPLOYMENT_STATUSES>;

export const DECISION_VERDICTS = ["ALLOW", "BLOCK", "ASK", "WARN"] as const;
export type DecisionVerdict = ExtractSchema<typeof DECISION_VERDICTS>;

export const APPROVAL_STATUSES = ["PENDING", "APPROVED", "DENIED", "EXPIRED"] as const;
export type ApprovalStatus = ExtractSchema<typeof APPROVAL_STATUSES>;
