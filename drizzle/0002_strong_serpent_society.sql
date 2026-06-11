CREATE TABLE "traject_demo_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"message" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_demo_request_email" ON "traject_demo_request" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_demo_request_status" ON "traject_demo_request" USING btree ("status");