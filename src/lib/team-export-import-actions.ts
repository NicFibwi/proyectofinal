"use server";

import { db } from "~/db";
import { pokemonteams, customPokemon } from "~/db/schema";
import { eq, and } from "drizzle-orm";
import {
  getCustomPokemonByTeamId,
  getMovesByPokemonId,
  getEvSpreadByTeamIdAndPokemonId,
  createTeam,
  createCustomPokemon,
  addPokemonMove,
  createEvSpread,
} from "./team-builder-actions";

export interface ExportedTeam {
  teamName: string;
  pokemon: Array<{
    pokedex_n: number;
    nickname: string;
    item_id: number;
    nature_id: number;
    moves: Array<{
      move_id: number;
      slot: number;
    }>;
    evs: {
      hp: number;
      attack: number;
      defense: number;
      sp_attack: number;
      sp_defense: number;
      speed: number;
    } | null;
  }>;
  exportedAt: string;
  exportedBy: string;
}

export async function exportTeam(
  teamId: number,
  userId: string,
): Promise<string> {
  try {
    // Get team details
    const team = await db
      .select()
      .from(pokemonteams)
      .where(
        and(eq(pokemonteams.team_id, teamId), eq(pokemonteams.user_id, userId)),
      )
      .limit(1);

    if (!team[0]) {
      throw new Error("Team not found or access denied");
    }

    // Get all custom Pokémon in the team
    const teamPokemon = await getCustomPokemonByTeamId(teamId);

    // Get detailed data for each Pokémon
    const pokemonData = await Promise.all(
      teamPokemon.map(async (poke) => {
        const moves = await getMovesByPokemonId(poke.pokemon_id, teamId);
        const evs = await getEvSpreadByTeamIdAndPokemonId(
          teamId,
          poke.pokemon_id,
        );

        return {
          pokedex_n: poke.pokedex_n,
          nickname: poke.nickname,
          item_id: poke.item_id,
          nature_id: poke.nature_id,
          moves: moves.map((m) => ({
            move_id: m.move_id,
            slot: m.slot,
          })),
          evs: evs
            ? {
                hp: evs.hp,
                attack: evs.attack,
                defense: evs.defense,
                sp_attack: evs.sp_attack,
                sp_defense: evs.sp_defense,
                speed: evs.speed,
              }
            : null,
        };
      }),
    );

    const exportData: ExportedTeam = {
      teamName: team[0].team_name,
      pokemon: pokemonData,
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Error exporting team:", error);
    throw new Error("Failed to export team");
  }
}

export async function importTeam(
  teamData: string,
  userId: string,
  newTeamName?: string,
): Promise<number> {
  try {
    const parsedData = JSON.parse(teamData) as ExportedTeam;

    if (!parsedData.teamName || !Array.isArray(parsedData.pokemon)) {
      throw new Error("Invalid team data format");
    }

    const teamName = newTeamName ?? `${parsedData.teamName} (Imported)`;
    const newTeamResult = await createTeam(userId, teamName);

    const newTeams = await db
      .select()
      .from(pokemonteams)
      .where(eq(pokemonteams.user_id, userId))
      .orderBy(pokemonteams.team_id);

    const newTeamId = newTeams[newTeams.length - 1]!.team_id;

    // Import each Pokémon
    for (const pokemonData of parsedData.pokemon) {
      // Create custom Pokémon
      const newPokemonResult = await createCustomPokemon(
        newTeamId,
        pokemonData.pokedex_n,
        pokemonData.nickname,
        pokemonData.nature_id,
        pokemonData.item_id,
      );

      // Get the new Pokémon ID
      const newPokemon = await db
        .select()
        .from(customPokemon)
        .where(eq(customPokemon.team_id, newTeamId))
        .orderBy(customPokemon.pokemon_id);

      const newPokemonId = newPokemon[newPokemon.length - 1]!.pokemon_id;

      // Import moves
      for (const move of pokemonData.moves) {
        await addPokemonMove(newPokemonId, newTeamId, move.move_id, move.slot);
      }

      // Import EVs if they exist
      if (pokemonData.evs) {
        await createEvSpread(
          newTeamId,
          newPokemonId,
          pokemonData.evs.hp,
          pokemonData.evs.attack,
          pokemonData.evs.defense,
          pokemonData.evs.sp_attack,
          pokemonData.evs.sp_defense,
          pokemonData.evs.speed,
        );
      }
    }

    return newTeamId;
  } catch (error) {
    console.error("Error importing team:", error);
    throw new Error(
      "Failed to import team. Please check the team data format.",
    );
  }
}
