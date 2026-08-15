ALTER TABLE "auth_user" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "admin_notes" text;