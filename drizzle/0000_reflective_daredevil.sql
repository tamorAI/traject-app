CREATE TABLE "traject_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_ai_model" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"model_id" text NOT NULL,
	"provider" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"max_tokens" integer,
	"pricing" jsonb,
	"capabilities" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_ai_model_model_id_unique" UNIQUE("model_id")
);
--> statement-breakpoint
CREATE TABLE "traject_ai_usage_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" text,
	"model_id" uuid,
	"request_type" text DEFAULT 'chat' NOT NULL,
	"prompt_tokens" integer DEFAULT 0 NOT NULL,
	"completion_tokens" integer DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"cost" numeric(12, 8) DEFAULT '0' NOT NULL,
	"duration_ms" integer,
	"endpoint" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_api_key" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_by" text,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_api_key_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "traject_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"changes" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"token" text NOT NULL,
	"invited_by" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "traject_organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"website_url" text,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "traject_prompt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"created_by" text,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"variables" jsonb DEFAULT '[]'::jsonb,
	"category" text,
	"is_template" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "traject_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "traject_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"plan_tier" text NOT NULL,
	"status" text DEFAULT 'TRIALING' NOT NULL,
	"billing_cycle" text,
	"current_period_start" timestamp with time zone DEFAULT now() NOT NULL,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"trial_end" timestamp with time zone,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_subscription_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "traject_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "traject_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "traject_user_organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "traject_account" ADD CONSTRAINT "traject_account_user_id_traject_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."traject_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_ai_usage_log" ADD CONSTRAINT "traject_ai_usage_log_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_ai_usage_log" ADD CONSTRAINT "traject_ai_usage_log_user_id_traject_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_ai_usage_log" ADD CONSTRAINT "traject_ai_usage_log_model_id_traject_ai_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."traject_ai_model"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_api_key" ADD CONSTRAINT "traject_api_key_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_api_key" ADD CONSTRAINT "traject_api_key_created_by_traject_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_audit_log" ADD CONSTRAINT "traject_audit_log_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_audit_log" ADD CONSTRAINT "traject_audit_log_actor_id_traject_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_invitation" ADD CONSTRAINT "traject_invitation_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_invitation" ADD CONSTRAINT "traject_invitation_invited_by_traject_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_prompt" ADD CONSTRAINT "traject_prompt_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_prompt" ADD CONSTRAINT "traject_prompt_created_by_traject_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_session" ADD CONSTRAINT "traject_session_user_id_traject_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."traject_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_subscription" ADD CONSTRAINT "traject_subscription_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_user_organization" ADD CONSTRAINT "traject_user_organization_user_id_traject_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."traject_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_user_organization" ADD CONSTRAINT "traject_user_organization_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ai_model_provider" ON "traject_ai_model" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "idx_ai_model_active" ON "traject_ai_model" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_ai_usage_org" ON "traject_ai_usage_log" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_ai_usage_org_created" ON "traject_ai_usage_log" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_ai_usage_user" ON "traject_ai_usage_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_usage_model" ON "traject_ai_usage_log" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "idx_ai_usage_type" ON "traject_ai_usage_log" USING btree ("request_type");--> statement-breakpoint
CREATE INDEX "idx_api_key_org" ON "traject_api_key" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_api_key_active" ON "traject_api_key" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_api_key_hash" ON "traject_api_key" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX "idx_audit_log_org" ON "traject_audit_log" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_audit_log_org_created" ON "traject_audit_log" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_log_action" ON "traject_audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_log_entity" ON "traject_audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_audit_log_actor" ON "traject_audit_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "idx_invitation_org" ON "traject_invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_invitation_email" ON "traject_invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_invitation_status" ON "traject_invitation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_invitation_token" ON "traject_invitation" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_org_active" ON "traject_organization" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_org_slug" ON "traject_organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_prompt_org" ON "traject_prompt" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_prompt_category" ON "traject_prompt" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_prompt_template" ON "traject_prompt" USING btree ("is_template");--> statement-breakpoint
CREATE INDEX "idx_prompt_public" ON "traject_prompt" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_prompt_created_by" ON "traject_prompt" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_subscription_org" ON "traject_subscription" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_subscription_status" ON "traject_subscription" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_subscription_stripe_customer" ON "traject_subscription" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "idx_user_email" ON "traject_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_user_active" ON "traject_user" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_organization" ON "traject_user_organization" USING btree ("user_id","organization_id");--> statement-breakpoint
CREATE INDEX "idx_user_org_org" ON "traject_user_organization" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_user_org_role" ON "traject_user_organization" USING btree ("role");