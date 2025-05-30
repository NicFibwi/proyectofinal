import {
  pgTable,
  serial,
  timestamp,
  text,
  integer,
  varchar,
  boolean,
  json,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// USER TABLE
export const users = pgTable("users", {
  user_id: varchar("user_id").primaryKey(),
  username: varchar("username").notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  pokemonteams: many(pokemonteams),
}));

// POKEMONTEAM TABLE
export const pokemonteams = pgTable("pokemonteams", {
  team_id: serial("team_id").primaryKey(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => users.user_id),
  team_name: varchar("team_name").notNull(),
});

export const pokemonteamRelations = relations(
  pokemonteams,
  ({ one, many }) => ({
    user: one(users, {
      fields: [pokemonteams.user_id],
      references: [users.user_id],
    }),
    customPokemon: many(customPokemon),
  }),
);

// MOVE TABLE
export const moves = pgTable("moves", {
  move_id: integer("move_id").primaryKey(),
  name: varchar("name").notNull(),
  typing: varchar("typing").notNull(),
  power: integer("power").notNull(),
  accuracy: integer("accuracy").notNull(),
  PP: integer("PP").notNull(),
  effect: text("effect").notNull(),
});

export const moveRelations = relations(moves, ({ many }) => ({
  pokemonMoves: many(pokemonMoves),
}));

// BASE_POKEMON TABLE
export const basePokemon = pgTable("base_pokemon", {
  pokedex_entry_n: integer("pokedex_entry_n").primaryKey(),
  name: varchar("name").notNull(),
  type1: varchar("type1").notNull(),
  type2: varchar("type2"),
  base_stats: json("base_stats").notNull(),
});

export const basePokemonRelations = relations(basePokemon, ({ many }) => ({
  customPokemon: many(customPokemon),
  pokemonAbilities: many(pokemonAbilities),
}));

// ABILITY TABLE
export const abilities = pgTable("abilities", {
  ability_id: integer("ability_id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
});

export const abilityRelations = relations(abilities, ({ many }) => ({
  pokemonAbilities: many(pokemonAbilities),
}));

// POKEMON-ABILITY JUNCTION TABLE
export const pokemonAbilities = pgTable(
  "pokemon_abilities",
  {
    pokemon_entry_n: integer("pokemon_entry_n")
      .notNull()
      .references(() => basePokemon.pokedex_entry_n),
    ability_id: integer("ability_id")
      .notNull()
      .references(() => abilities.ability_id),
    is_hidden: boolean("is_hidden").notNull(),
  },
  (table) => [
    primaryKey({
      name: "pokemon_abilities_pk",
      columns: [table.pokemon_entry_n, table.ability_id],
    }),
  ],
);

export const pokemonAbilitiesRelations = relations(
  pokemonAbilities,
  ({ one }) => ({
    ability: one(abilities, {
      fields: [pokemonAbilities.ability_id],
      references: [abilities.ability_id],
    }),
    basePokemon: one(basePokemon, {
      fields: [pokemonAbilities.pokemon_entry_n],
      references: [basePokemon.pokedex_entry_n],
    }),
  }),
);

// NATURE TABLE
export const natures = pgTable("natures", {
  nature_id: integer("nature_id").primaryKey(),
  name: varchar("name").notNull(),
  boost_stat: varchar("boost_stat"),
  nerf_stat: varchar("nerf_stat"),
});

export const natureRelations = relations(natures, ({ many }) => ({
  customPokemon: many(customPokemon),
}));

// ITEM TABLE
export const items = pgTable("items", {
  item_id: integer("item_id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
});

export const itemRelations = relations(items, ({ many }) => ({
  customPokemon: many(customPokemon),
}));

// CUSTOM_POKEMON TABLE
export const customPokemon = pgTable(
  "custom_pokemon",
  {
    pokemon_id: serial("pokemon_id").notNull(),
    team_id: integer("team_id")
      .notNull()
      .references(() => pokemonteams.team_id),
    pokedex_n: integer("pokedex_n")
      .notNull()
      .references(() => basePokemon.pokedex_entry_n),
    nickname: varchar("nickname").notNull(),
    item_id: integer("item_id")
      .notNull()
      .references(() => items.item_id),
    nature_id: integer("nature_id")
      .notNull()
      .references(() => natures.nature_id),
  },
  (table) => [
    primaryKey({
      name: "custom_pokemon_pk",
      columns: [table.pokemon_id, table.team_id],
    }),
  ],
);

export const customPokemonRelations = relations(
  customPokemon,
  ({ one, many }) => ({
    team: one(pokemonteams, {
      fields: [customPokemon.team_id],
      references: [pokemonteams.team_id],
    }),
    basePokemon: one(basePokemon, {
      fields: [customPokemon.pokedex_n],
      references: [basePokemon.pokedex_entry_n],
    }),
    nature: one(natures, {
      fields: [customPokemon.nature_id],
      references: [natures.nature_id],
    }),
    item: one(items, {
      fields: [customPokemon.item_id],
      references: [items.item_id],
    }),
    moves: many(pokemonMoves),
    evSpread: one(evSpreads),
  }),
);

// POKEMON-MOVE JUNCTION TABLE
export const pokemonMoves = pgTable(
  "pokemon_moves",
  {
    pokemon_id: integer("pokemon_id").notNull(),
    team_id: integer("team_id").notNull(),
    move_id: integer("move_id")
      .notNull()
      .references(() => moves.move_id),
    slot: integer("slot").notNull(),
  },
  (table) => [
    primaryKey({
      name: "pokemon_moves_pk",
      columns: [table.pokemon_id, table.team_id, table.move_id],
    }),
    foreignKey({
      columns: [table.pokemon_id, table.team_id],
      foreignColumns: [customPokemon.pokemon_id, customPokemon.team_id],
      name: "pokemon_moves_pokemon_fk",
    }),
  ],
);

export const pokemonMovesRelations = relations(pokemonMoves, ({ one }) => ({
  customPokemon: one(customPokemon, {
    fields: [pokemonMoves.pokemon_id, pokemonMoves.team_id],
    references: [customPokemon.pokemon_id, customPokemon.team_id],
  }),
  move: one(moves, {
    fields: [pokemonMoves.move_id],
    references: [moves.move_id],
  }),
}));

// EV TABLE
export const evSpreads = pgTable(
  "ev_spreads",
  {
    pokemon_id: integer("pokemon_id").notNull(),
    team_id: integer("team_id").notNull(),
    hp: integer("hp").notNull(),
    attack: integer("attack").notNull(),
    defense: integer("defense").notNull(),
    sp_attack: integer("sp_attack").notNull(),
    sp_defense: integer("sp_defense").notNull(),
    speed: integer("speed").notNull(),
  },
  (table) => [
    primaryKey({
      name: "ev_spreads_pk",
      columns: [table.pokemon_id, table.team_id],
    }),
    foreignKey({
      columns: [table.pokemon_id, table.team_id],
      foreignColumns: [customPokemon.pokemon_id, customPokemon.team_id],
      name: "ev_spreads_pokemon_fk",
    }),
  ],
);

export const evSpreadsRelations = relations(evSpreads, ({ one }) => ({
  customPokemon: one(customPokemon, {
    fields: [evSpreads.pokemon_id, evSpreads.team_id],
    references: [customPokemon.pokemon_id, customPokemon.team_id],
  }),
}));
