CREATE TABLE "ai_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"last_modified_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"prompt" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;