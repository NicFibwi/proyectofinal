import { db } from "~/db"; // Assuming db is the database instance
import {
  users,
  pokemonteams,
  customPokemon,
  items,
  abilities,
  natures,
  moves,
  evSpreads,
  basePokemon,
  pokemonAbilities,
  pokemonMoves,
} from "~/db/schema";
import { eq, and } from "drizzle-orm";
import type {
  Ability,
  AbilityInfo,
  ItemInfo,
  MoveInfo,
  Nature,
} from "~/types/types";
import { useMemo } from "react";

// Add user to the database
export async function addUser(userId: string, username: string) {
  await db
    .insert(users)
    .values({ user_id: userId, username })
    .onConflictDoNothing();
}

// Delete user from the database
export async function deleteUser(userId: string) {
  return await db.delete(users).where(eq(users.user_id, userId));
}

// Get user by ID
export async function getUserById(userId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.user_id, userId))
    .limit(1);
  return result[0];
}

// Get all teams for a user
export async function getTeams(userId: string) {
  return await db
    .select()
    .from(pokemonteams)
    .where(eq(pokemonteams.user_id, userId));
}

// Create a new team
export async function createTeam(userId: string, teamName: string) {
  return await db
    .insert(pokemonteams)
    .values({ user_id: userId, team_name: teamName });
}

// Update a team
export async function updateTeam(teamId: number, teamName: string) {
  return await db
    .update(pokemonteams)
    .set({ team_name: teamName })
    .where(eq(pokemonteams.team_id, teamId));
}

//Get team by id
export async function getTeamByIdAndUserId(teamId: number, userId: string) {
  const result = await db
    .select()
    .from(pokemonteams)
    .where(
      and(eq(pokemonteams.team_id, teamId), eq(pokemonteams.user_id, userId)),
    )
    .limit(1);

  return result[0];
}

// Delete a team
export async function deleteTeam(teamId: number) {
  // Get all custom Pokémon for the team
  const customMons = await db
    .select()
    .from(customPokemon)
    .where(eq(customPokemon.team_id, teamId));

  // Delete all moves and ev spreads for each custom Pokémon
  for (const mon of customMons) {
    await db
      .delete(pokemonMoves)
      .where(
        and(
          eq(pokemonMoves.team_id, teamId),
          eq(pokemonMoves.pokemon_id, mon.pokemon_id),
        ),
      );
    await db
      .delete(evSpreads)
      .where(
        and(
          eq(evSpreads.team_id, teamId),
          eq(evSpreads.pokemon_id, mon.pokemon_id),
        ),
      );
  }

  // Delete all custom Pokémon for the team
  await db.delete(customPokemon).where(eq(customPokemon.team_id, teamId));

  // Finally, delete the team
  return await db.delete(pokemonteams).where(eq(pokemonteams.team_id, teamId));
}

// Get custom pokemon by team ID
export async function getCustomPokemonByTeamId(teamId: number) {
  return await db
    .select()
    .from(customPokemon)
    .where(eq(customPokemon.team_id, teamId));
}

// Add Item to DB
export async function createItem(itemObject: ItemInfo) {
  const description =
    itemObject?.flavor_text_entries
      ?.find((entry) => entry.language.name === "en")
      ?.text?.replace(/\f/g, " ") || "";

  await db.insert(items).values({
    item_id: itemObject.id,
    name: itemObject.name,
    description: description || "",
  });
}

// Get item by id
export async function getItemById(itemId: number) {
  const result = await db
    .select()
    .from(items)
    .where(eq(items.item_id, itemId))
    .limit(1);

  return result[0];
}

//Create natrue in DB
export async function createNature(natureObject: Nature) {
  return await db.insert(natures).values({
    nature_id: natureObject.id,
    name: natureObject.name,
    boost_stat: natureObject.increased_stat?.name || null,
    nerf_stat: natureObject.decreased_stat?.name || null,
  });
}

// Get nature by id
export async function getNatureById(natureId: number) {
  const result = await db
    .select()
    .from(natures)
    .where(eq(natures.nature_id, natureId))
    .limit(1);
  return result[0];
}

// Create Ability in DB
export async function createAbility(abilityObject: AbilityInfo) {
  const description =
    abilityObject?.flavor_text_entries
      ?.find((entry) => entry.language.name === "en")
      ?.text?.replace(/\f/g, " ") || "";

  return await db.insert(abilities).values({
    ability_id: abilityObject.id,
    name: abilityObject.name,
    description: description || "",
  });
}

//Get ability by id
export async function getAbilityById(abilityId: number) {
  const result = await db
    .select()
    .from(abilities)
    .where(eq(abilities.ability_id, abilityId))
    .limit(1);
  return result[0];
}

//Create move
export async function createMove(moveData: MoveInfo) {
  const description =
    moveData?.flavor_text_entries
      ?.find((entry) => entry.language.name === "en")
      ?.text?.replace(/\f/g, " ") || "";

  return await db
    .insert(moves)
    .values({
      move_id: moveData.id,
      name: moveData.name,
      typing: moveData.type.name,
      power: moveData.power || 0,
      accuracy: moveData.accuracy || 0,
      PP: moveData.pp || 0,
      effect: description || "",
    })
    .onConflictDoNothing();
}

//Get move by id
export async function getMoveById(moveId: number) {
  const result = await db
    .select()
    .from(moves)
    .where(eq(moves.move_id, moveId))
    .limit(1);
  return result[0];
}

//Create ev spread
export async function createEvSpread(
  teamId: number,
  pokemonId: number,
  hp: number,
  atk: number,
  def: number,
  spa: number,
  spd: number,
  spe: number,
) {
  return await db.insert(evSpreads).values({
    pokemon_id: pokemonId,
    team_id: teamId,
    hp: hp,
    attack: atk,
    defense: def,
    sp_attack: spa,
    sp_defense: spd,
    speed: spe,
  });
}

export async function getEvSpreadByTeamIdAndPokemonId(
  teamId: number,
  pokemonId: number,
) {
  const result = await db
    .select()
    .from(evSpreads)
    .where(
      and(eq(evSpreads.team_id, teamId), eq(evSpreads.pokemon_id, pokemonId)),
    )
    .limit(1);
  return result[0];
}

// Update ev spread
export async function updateEvSpread(
  teamId: number,
  pokemonId: number,
  hp: number,
  atk: number,
  def: number,
  spa: number,
  spd: number,
  spe: number,
) {
  return await db
    .update(evSpreads)
    .set({
      hp: hp,
      attack: atk,
      defense: def,
      sp_attack: spa,
      sp_defense: spd,
      speed: spe,
    })
    .where(
      and(eq(evSpreads.team_id, teamId), eq(evSpreads.pokemon_id, pokemonId)),
    );
}

// Delete ev spread
export async function deleteEvSpread(teamId: number, pokemonId: number) {
  return await db
    .delete(evSpreads)
    .where(
      and(eq(evSpreads.team_id, teamId), eq(evSpreads.pokemon_id, pokemonId)),
    );
}

// Create base Pokemon
export async function createBasePokemon(
  pokedex_entry_n: number,
  name: string,
  type1: string,
  type2: string,
  base_stats: Record<string, number>,
) {
  return await db.insert(basePokemon).values({
    pokedex_entry_n: pokedex_entry_n,
    name: name,
    type1: type1,
    type2: type2,
    base_stats: base_stats,
  });
}

// Get base Pokemon by ID
export async function getBasePokemonById(pokedexId: number) {
  const result = await db
    .select()
    .from(basePokemon)
    .where(eq(basePokemon.pokedex_entry_n, pokedexId))
    .limit(1);
  return result[0];
}

//Create custom Pokemon
export async function createCustomPokemon(
  teamId: number,
  pokedex_entry_n: number,
  nickname: string,
  natureId: number,
  itemId: number,
) {
  return await db.insert(customPokemon).values({
    team_id: teamId,
    pokedex_n: pokedex_entry_n,
    nickname: nickname,
    item_id: itemId,
    nature_id: natureId,
  });
}

// Get custom Pokemon by team ID and Pokemon ID
export async function getCustomPokemonByTeamIdAndPokemonId(
  teamId: number,
  pokemonId: number,
) {
  const result = await db
    .select()
    .from(customPokemon)
    .where(
      and(
        eq(customPokemon.team_id, teamId),
        eq(customPokemon.pokemon_id, pokemonId),
      ),
    )
    .limit(1);
  return result[0];
}

// Update custom Pokemon
export async function updateCustomPokemon(
  teamId: number,
  pokemonId: number,
  pokedex_entry_n: number,
  nickname: string,
  natureId: number,
  itemId: number,
) {
  return await db
    .update(customPokemon)
    .set({
      pokedex_n: pokedex_entry_n,
      nickname: nickname,
      nature_id: natureId,
      item_id: itemId,
    })
    .where(
      and(
        eq(customPokemon.team_id, teamId),
        eq(customPokemon.pokemon_id, pokemonId),
      ),
    );
}
// Delete custom Pokemon
export async function deleteCustomPokemon(teamId: number, pokemonId: number) {
  return await db
    .delete(customPokemon)
    .where(
      and(
        eq(customPokemon.team_id, teamId),
        eq(customPokemon.pokemon_id, pokemonId),
      ),
    );
}

//create pokemon - ability
export async function createPokemonAbility(
  pokemonEntry: number,
  abilityId: number,
  isHidden: boolean,
) {
  return await db.insert(pokemonAbilities).values({
    pokemon_entry_n: pokemonEntry,
    ability_id: abilityId,
    is_hidden: isHidden,
  });
}

// get abilities by pokemon entry number
export async function getPokemonAbilitiesByIds(
  pokedexEntry: number,
  ability_id: number,
) {
  return await db
    .select()
    .from(pokemonAbilities)
    .where(
      and(
        eq(pokemonAbilities.pokemon_entry_n, pokedexEntry),
        eq(pokemonAbilities.ability_id, ability_id),
      ),
    );
}

// create pokemon - move
export async function addPokemonMove(
  pokemonId: number,
  teamId: number,
  moveId: number,
  slot: number,
) {
  return await db.insert(pokemonMoves).values({
    pokemon_id: pokemonId,
    team_id: teamId,
    move_id: moveId,
    slot: slot,
  });
}

// get moves by pokemon id and team id
export async function getMovesByPokemonId(pokemonId: number, teamId: number) {
  return await db
    .select()
    .from(pokemonMoves)
    .where(
      and(
        eq(pokemonMoves.pokemon_id, pokemonId),
        eq(pokemonMoves.team_id, teamId),
      ),
    );
}

export async function deletePokemonMoves(teamId: number, pokemonId: number) {
  return await db
    .delete(pokemonMoves)
    .where(
      and(
        eq(pokemonMoves.team_id, teamId),
        eq(pokemonMoves.pokemon_id, pokemonId),
      ),
    );
}

// Get all moves for a custom Pokémon (returns move objects)
export async function getPokemonMovesFull(pokemonId: number, teamId: number) {
  const moves = await getMovesByPokemonId(pokemonId, teamId);
  return Promise.all(
    moves.map(async (m) => {
      const move = await getMoveById(m.move_id);
      return move;
    }),
  );
}

// Get all abilities for a base Pokémon (returns ability objects)
export async function getAllAbilitiesForPokemon(pokedex_n: number) {
  const relations = await db
    .select()
    .from(pokemonAbilities)
    .where(eq(pokemonAbilities.pokemon_entry_n, pokedex_n));
  return Promise.all(
    relations.map(async (rel) => {
      const ability = await getAbilityById(rel.ability_id);
      return { ...ability, is_hidden: rel.is_hidden };
    }),
  );
}
