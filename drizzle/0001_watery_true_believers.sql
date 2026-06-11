CREATE TABLE "traject_approval_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_id" uuid,
	"deployment_id" uuid,
	"requested_action" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"resolved_by_token" uuid,
	"resolved_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"context" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_compiled_graph" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"version" text NOT NULL,
	"hmac_digest" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"uploaded_by" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_compiled_graph_hmac_digest_unique" UNIQUE("hmac_digest")
);
--> statement-breakpoint
CREATE TABLE "traject_enforcement_decision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"deployment_id" uuid,
	"compiled_graph_id" uuid,
	"tool_name" text NOT NULL,
	"verdict" text NOT NULL,
	"reason" text,
	"latency_us" integer,
	"trajectory_ref" text,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_gateway_deployment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"compiled_graph_id" uuid,
	"name" text NOT NULL,
	"version" text,
	"status" text DEFAULT 'OFFLINE' NOT NULL,
	"last_heartbeat_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traject_operator_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"token_hash" text NOT NULL,
	"token_prefix" text NOT NULL,
	"owner_id" text,
	"scopes" jsonb DEFAULT '[]'::jsonb,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traject_operator_token_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "traject_approval_request" ADD CONSTRAINT "traject_approval_request_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_approval_request" ADD CONSTRAINT "traject_approval_request_decision_id_traject_enforcement_decision_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."traject_enforcement_decision"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_approval_request" ADD CONSTRAINT "traject_approval_request_deployment_id_traject_gateway_deployment_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."traject_gateway_deployment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_approval_request" ADD CONSTRAINT "traject_approval_request_resolved_by_token_traject_operator_token_id_fk" FOREIGN KEY ("resolved_by_token") REFERENCES "public"."traject_operator_token"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_compiled_graph" ADD CONSTRAINT "traject_compiled_graph_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_compiled_graph" ADD CONSTRAINT "traject_compiled_graph_uploaded_by_traject_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_enforcement_decision" ADD CONSTRAINT "traject_enforcement_decision_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_enforcement_decision" ADD CONSTRAINT "traject_enforcement_decision_deployment_id_traject_gateway_deployment_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."traject_gateway_deployment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_enforcement_decision" ADD CONSTRAINT "traject_enforcement_decision_compiled_graph_id_traject_compiled_graph_id_fk" FOREIGN KEY ("compiled_graph_id") REFERENCES "public"."traject_compiled_graph"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_gateway_deployment" ADD CONSTRAINT "traject_gateway_deployment_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_gateway_deployment" ADD CONSTRAINT "traject_gateway_deployment_compiled_graph_id_traject_compiled_graph_id_fk" FOREIGN KEY ("compiled_graph_id") REFERENCES "public"."traject_compiled_graph"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_operator_token" ADD CONSTRAINT "traject_operator_token_organization_id_traject_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."traject_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traject_operator_token" ADD CONSTRAINT "traject_operator_token_owner_id_traject_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."traject_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_approval_request_org" ON "traject_approval_request" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_approval_request_org_status" ON "traject_approval_request" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_approval_request_decision" ON "traject_approval_request" USING btree ("decision_id");--> statement-breakpoint
CREATE INDEX "idx_approval_request_expires" ON "traject_approval_request" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_compiled_graph_org" ON "traject_compiled_graph" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_compiled_graph_status" ON "traject_compiled_graph" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_compiled_graph_hmac" ON "traject_compiled_graph" USING btree ("hmac_digest");--> statement-breakpoint
CREATE INDEX "idx_enforcement_decision_org" ON "traject_enforcement_decision" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_enforcement_decision_org_created" ON "traject_enforcement_decision" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_enforcement_decision_verdict" ON "traject_enforcement_decision" USING btree ("verdict");--> statement-breakpoint
CREATE INDEX "idx_enforcement_decision_deployment" ON "traject_enforcement_decision" USING btree ("deployment_id");--> statement-breakpoint
CREATE INDEX "idx_enforcement_decision_trajectory" ON "traject_enforcement_decision" USING btree ("trajectory_ref");--> statement-breakpoint
CREATE INDEX "idx_gateway_deployment_org" ON "traject_gateway_deployment" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_gateway_deployment_status" ON "traject_gateway_deployment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_gateway_deployment_graph" ON "traject_gateway_deployment" USING btree ("compiled_graph_id");--> statement-breakpoint
CREATE INDEX "idx_operator_token_org" ON "traject_operator_token" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_operator_token_active" ON "traject_operator_token" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_operator_token_hash" ON "traject_operator_token" USING btree ("token_hash");