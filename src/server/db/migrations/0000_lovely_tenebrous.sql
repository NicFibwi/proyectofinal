CREATE TABLE "abilities" (
	"ability_id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "base_pokemon" (
	"pokedex_entry_n" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type1" varchar NOT NULL,
	"type2" varchar,
	"base_stats" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_pokemon" (
	"pokemon_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"pokedex_n" integer NOT NULL,
	"nickname" varchar NOT NULL,
	"item_id" integer NOT NULL,
	"nature_id" integer NOT NULL,
	CONSTRAINT "custom_pokemon_pk" PRIMARY KEY("pokemon_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "ev_spreads" (
	"pokemon_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"hp" integer NOT NULL,
	"attack" integer NOT NULL,
	"defense" integer NOT NULL,
	"sp_attack" integer NOT NULL,
	"sp_defense" integer NOT NULL,
	"speed" integer NOT NULL,
	CONSTRAINT "ev_spreads_pk" PRIMARY KEY("pokemon_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moves" (
	"move_id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"typing" varchar NOT NULL,
	"power" integer NOT NULL,
	"accuracy" integer NOT NULL,
	"PP" integer NOT NULL,
	"effect" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "natures" (
	"nature_id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"boost_stat" varchar,
	"nerf_stat" varchar
);
--> statement-breakpoint
CREATE TABLE "pokemon_abilities" (
	"pokemon_entry_n" integer NOT NULL,
	"ability_id" integer NOT NULL,
	"is_hidden" boolean NOT NULL,
	CONSTRAINT "pokemon_abilities_pk" PRIMARY KEY("pokemon_entry_n","ability_id")
);
--> statement-breakpoint
CREATE TABLE "pokemon_moves" (
	"pokemon_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"move_id" integer NOT NULL,
	"slot" integer NOT NULL,
	CONSTRAINT "pokemon_moves_pk" PRIMARY KEY("pokemon_id","team_id","move_id")
);
--> statement-breakpoint
CREATE TABLE "pokemonteams" (
	"team_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"team_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_pokemon" ADD CONSTRAINT "custom_pokemon_team_id_pokemonteams_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."pokemonteams"("team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_pokemon" ADD CONSTRAINT "custom_pokemon_pokedex_n_base_pokemon_pokedex_entry_n_fk" FOREIGN KEY ("pokedex_n") REFERENCES "public"."base_pokemon"("pokedex_entry_n") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_pokemon" ADD CONSTRAINT "custom_pokemon_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_pokemon" ADD CONSTRAINT "custom_pokemon_nature_id_natures_nature_id_fk" FOREIGN KEY ("nature_id") REFERENCES "public"."natures"("nature_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ev_spreads" ADD CONSTRAINT "ev_spreads_pokemon_fk" FOREIGN KEY ("pokemon_id","team_id") REFERENCES "public"."custom_pokemon"("pokemon_id","team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_pokemon_entry_n_base_pokemon_pokedex_entry_n_fk" FOREIGN KEY ("pokemon_entry_n") REFERENCES "public"."base_pokemon"("pokedex_entry_n") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_ability_id_abilities_ability_id_fk" FOREIGN KEY ("ability_id") REFERENCES "public"."abilities"("ability_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_move_id_moves_move_id_fk" FOREIGN KEY ("move_id") REFERENCES "public"."moves"("move_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_pokemon_fk" FOREIGN KEY ("pokemon_id","team_id") REFERENCES "public"."custom_pokemon"("pokemon_id","team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemonteams" ADD CONSTRAINT "pokemonteams_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;