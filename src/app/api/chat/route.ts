/* eslint-disable */
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { getLatestSystemPrompt } from "~/lib/team-builder-actions";
import {
  getPokemonData,
  getPokemonSpeciesData,
  getTypeEffectiveness,
  getTypeData,
  getAbilityData,
  getMoveData,
  getItemData,
} from "~/app/api/chat/functions";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch the latest system prompt from the database
  const latestPrompt = await getLatestSystemPrompt();
  console.log("Latest system prompt:", latestPrompt);

  const fallbackSystemMessage =
    "You are a Pokemon expert AI assistant. You have comprehensive knowledge about all Pokemon generations, game mechanics, pokemon, items, abilities, moves, machines, typings and type effectiveness, competitive strategies, anime, manga, movies, and the entire Pokemon universe. Use the provided tools to fetch accurate data about Pokemon and their type matchups when answering questions. Always provide detailed explanations about type effectiveness and matchups when relevant. If the topic the user is asking about is not related to Pokemon, politely inform them that you can only provide information about Pokemon. If asked to review a battle between a custom pokemon and a real pokemon, ask the user to provide the custom pokemon's type and moves. If asked to review a battle between two real pokemon, make sure to get the effectiveness chart of the custom pokemon's typings." +
    "- Type matchups" +
    "- Understand STAB (same type attack bonus, meaning a pokemon that uses a move that shares its typing, the move's base attack is 1.5x, except with adaptability ability that bumps it up to 2x)" +
    "- Track stat categories, meaning you know the difference between Physical, Special, and Status moves. Know which stats (Attack, Special Attack, Defense, etc.) each Pokémon excels in, and that attack attacks defense, and sp attack attacks special defense. Keep in mind if a pokemon has a hihger attack stat, it's more likely to use physical moves, so what matters is the opposing pokemon's defense (And this also goes for special attack and special defense)" +
    "- Understand status conditions (A Pokémon that is infatuated cannot attack 50% of the time, even against Pokémon other than the one it is infatuated with. The confused condition causes a Pokémon to hurt itself in its confusion 50% of the time. The damage is done as if the Pokémon attacked itself with a 40-power typeless physical attack. Sleep lasts for a randomly chosen duration of 1 to 3 turns in Pokémon Stadium and Generation V onwards. The badly poisoned condition is caused by Toxic and Poison Fang, as well as by Toxic Spikes after it is used twice. It is the same as Poison except its damage begins at 1/16 and grows an additional 1/16 every turn, taking 2/16 max hit points the second turn, then 3/16 the third turn, and 4/16 the fourth, and so on. The poison condition (PSN) causes a Pokémon to lose 1/8 of its maximum hit points every turn (in Generation I, it loses 1/16). Normally Steel- and Poison-type Pokémon and Pokémon with the Immunity Ability cannot be poisoned; however, if a Pokémon is poisoned then has its type changed to Steel or Poison or its Ability changed to Immunity, the poison will remain. In addition, in Generation II, Steel-type Pokémon can be poisoned by Twineedle. A Pokémon with the Poison Heal Ability will gradually recover health instead when poisoned. The paralysis condition (PAR) causes a Pokémon to be unable to attack ('fully paralyzed') a quarter of the time. Additionally, its Speed is reduced to 25% of its previous value (except for Pokémon with the Quick Feet Ability, where this condition raises the Speed by 50%). Many moves that cause paralysis are of the Electric type. Ground-type Pokémon can be paralyzed, but not by Electric-type moves or by the Battle Arcade. In Generation V, Pokémon glow yellow when afflicted with paralysis and their animation will be slowed significantly. As of Generation VI, Electric-type Pokémon can no longer be paralyzed. The freeze condition (FRZ) causes a Pokémon to be unable to make a move. Damaging Fire-type moves used on a frozen Pokémon will remove the freeze status. From Generation II onward, freeze has a random, 20% chance to be cured on its own on the frozen Pokémon's turn. Consequently, the frozen Pokémon may thaw out on the turn of freezing; however, in Generation I, a frozen Pokémon never thaws without external aid. Pokémon cannot be frozen in sunny weather; contrary to popular belief, sunny weather does not cause a quicker thawing. The burn condition (BRN) halves damage dealt by a Pokémon's physical moves (except for Pokémon with the Guts Ability, where this condition raises Attack by 50%). Additionally, at the end of a turn, the Pokémon loses 1/8 its maximum hit points (in Generation I or in the case of Pokémon with the Ability Heatproof, the Pokémon loses 1/16 of its maximum hit points). Normally Fire-type Pokémon and Pokémon with the Water Veil Ability cannot be burned; however, if a Pokémon is burned then has its type changed to Fire or its Ability changed to Water Veil, the burn will remain. All moves which can cause burn are Fire-type except for Tri Attack (Generation II onwards), Fling when the Flame Orb is held, Scald and Ice Burn. In Generation V, Pokémon glow red when afflicted with burn.)" +
    "- Understand battle hazards (example: stealth rock, spikes, toxic spikes, etc)" +
    "Please deliver the text in markdown, but do NOT use any headers. Instead, use **bold** for important information, and *italics* for emphasis. Use `code` blocks for code snippets or commands. Use [links](https://example.com) to reference external resources. Use emojis to enhance the user experience. Use bullet points for lists of items or steps. Use images to illustrate concepts when necessary. Use blockquotes for quoting other sources or references." +
    "When asked for a pokemon list, only give the names of the pokemon, separated by commas, and do not include any other information.";

  const systemMessage = {
    role: "system",
    content: latestPrompt || fallbackSystemMessage,
  };

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: [systemMessage, ...messages],
    maxSteps: 3,
    tools: {
      getPokemonInfo: tool({
        description: "Get detailed information about a specific Pokemon",
        parameters: z.object({
          pokemonName: z
            .string()
            .describe("The name of the Pokemon (lowercase)"),
        }),
        execute: async ({ pokemonName }) => {
          try {
            const data = await getPokemonData(pokemonName.toLowerCase());
            return {
              id: data.id,
              name: data.name,
              types: data.types.map((t) => t.type.name),
              height: data.height,
              weight: data.weight,
              abilities: data.abilities.map((a) => a.ability.name),
              stats: data.stats.map((s) => ({
                name: s.stat.name,
                base: s.base_stat,
              })),
            };
          } catch (error) {
            return { error: `Could not find Pokemon: ${pokemonName}` };
          }
        },
      }),

      getPokemonSpecies: tool({
        description: "Get species information about a specific Pokemon",
        parameters: z.object({
          pokemonName: z
            .string()
            .describe("The name of the Pokemon (lowercase)"),
        }),
        execute: async ({ pokemonName }) => {
          try {
            const data = await getPokemonSpeciesData(pokemonName.toLowerCase());
            return {
              name: data.name,
              generation: data.generation.name,
              habitat: data.habitat?.name || "unknown",
              isLegendary: data.is_legendary,
              isMythical: data.is_mythical,
              flavorText:
                data.flavor_text_entries
                  .filter((entry) => entry.language.name === "en")
                  .map((entry) => entry.flavor_text)[0] ?? "",
            };
          } catch (error) {
            return {
              error: `Could not find Pokemon species: ${pokemonName}`,
            };
          }
        },
      }),

      getTypeMatchup: tool({
        description:
          "Get type effectiveness information for a specific Pokemon",
        parameters: z.object({
          pokemonName: z
            .string()
            .describe("The name of the Pokemon (lowercase)"),
        }),
        execute: async ({ pokemonName }) => {
          try {
            const pokemon = await getPokemonData(pokemonName.toLowerCase());
            const effectiveness = await getTypeEffectiveness(pokemon);

            return {
              name: pokemon.name,
              types: pokemon.types.map((t) => t.type.name),
              weaknesses: {
                fourX: effectiveness.fourXEffectivess.map((t) => t.name),
                twoX: effectiveness.twoXEffectiveness.map((t) => t.name),
              },
              resistances: {
                halfX: effectiveness.halfXEffectiveness.map((t) => t.name),
                quarterX: effectiveness.quarterXEffectiveness.map(
                  (t) => t.name,
                ),
                zeroX: effectiveness.zeroXEffectiveness.map((t) => t.name),
              },
              neutral: effectiveness.oneXEffectiveness.map((t) => t.name),
            };
          } catch (error) {
            return {
              error: `Could not analyze type matchups for: ${pokemonName}`,
            };
          }
        },
      }),

      getTypeInfo: tool({
        description: "Get information about a specific Pokemon type",
        parameters: z.object({
          typeName: z.string().describe("The name of the type (lowercase)"),
        }),
        execute: async ({ typeName }) => {
          try {
            const typeData = await getTypeData({
              name: typeName.toLowerCase(),
              url: `https://pokeapi.co/api/v2/type/${typeName.toLowerCase()}`,
            });

            return {
              name: typeData.name,
              damageRelations: {
                doubleDamageFrom:
                  typeData.damage_relations.double_damage_from.map(
                    (t) => t.name,
                  ),
                doubleDamageTo: typeData.damage_relations.double_damage_to.map(
                  (t) => t.name,
                ),
                halfDamageFrom: typeData.damage_relations.half_damage_from.map(
                  (t) => t.name,
                ),
                halfDamageTo: typeData.damage_relations.half_damage_to.map(
                  (t) => t.name,
                ),
                noDamageFrom: typeData.damage_relations.no_damage_from.map(
                  (t) => t.name,
                ),
                noDamageTo: typeData.damage_relations.no_damage_to.map(
                  (t) => t.name,
                ),
              },
            };
          } catch (error) {
            return {
              error: `Could not find type information for: ${typeName}`,
            };
          }
        },
      }),

      compareTypeMatchup: tool({
        description: "Compare type effectiveness between two Pokemon",
        parameters: z.object({
          pokemon1: z
            .string()
            .describe("The name of the first Pokemon (lowercase)"),
          pokemon2: z
            .string()
            .describe("The name of the second Pokemon (lowercase)"),
        }),
        execute: async ({ pokemon1, pokemon2 }) => {
          try {
            const pokemon1Data = await getPokemonData(pokemon1.toLowerCase());
            const pokemon2Data = await getPokemonData(pokemon2.toLowerCase());

            const pokemon1Types = pokemon1Data.types.map((t) => t.type.name);
            const pokemon2Types = pokemon2Data.types.map((t) => t.type.name);

            const pokemon1Effectiveness =
              await getTypeEffectiveness(pokemon1Data);
            const pokemon2Effectiveness =
              await getTypeEffectiveness(pokemon2Data);

            // Calculate effectiveness of pokemon1's types against pokemon2
            const pokemon1AgainstPokemon2 = [];
            for (const type1 of pokemon1Types) {
              const typeInfo = await getTypeData({
                name: type1,
                url: `https://pokeapi.co/api/v2/type/${type1}`,
              });
              let effectiveness = 1;

              for (const type2 of pokemon2Types) {
                if (
                  typeInfo.damage_relations.double_damage_to.some(
                    (t) => t.name === type2,
                  )
                ) {
                  effectiveness *= 2;
                }
                if (
                  typeInfo.damage_relations.half_damage_to.some(
                    (t) => t.name === type2,
                  )
                ) {
                  effectiveness *= 0.5;
                }
                if (
                  typeInfo.damage_relations.no_damage_to.some(
                    (t) => t.name === type2,
                  )
                ) {
                  effectiveness = 0;
                  break;
                }
              }

              pokemon1AgainstPokemon2.push({ type: type1, effectiveness });
            }

            // Calculate effectiveness of pokemon2's types against pokemon1
            const pokemon2AgainstPokemon1 = [];
            for (const type2 of pokemon2Types) {
              const typeInfo = await getTypeData({
                name: type2,
                url: `https://pokeapi.co/api/v2/type/${type2}`,
              });
              let effectiveness = 1;

              for (const type1 of pokemon1Types) {
                if (
                  typeInfo.damage_relations.double_damage_to.some(
                    (t) => t.name === type1,
                  )
                ) {
                  effectiveness *= 2;
                }
                if (
                  typeInfo.damage_relations.half_damage_to.some(
                    (t) => t.name === type1,
                  )
                ) {
                  effectiveness *= 0.5;
                }
                if (
                  typeInfo.damage_relations.no_damage_to.some(
                    (t) => t.name === type1,
                  )
                ) {
                  effectiveness = 0;
                  break;
                }
              }

              pokemon2AgainstPokemon1.push({ type: type2, effectiveness });
            }

            return {
              pokemon1: {
                name: pokemon1Data.name,
                types: pokemon1Types,
                weaknesses: {
                  fourX: pokemon1Effectiveness.fourXEffectivess.map(
                    (t) => t.name,
                  ),
                  twoX: pokemon1Effectiveness.twoXEffectiveness.map(
                    (t) => t.name,
                  ),
                },
                attacksAgainstPokemon2: pokemon1AgainstPokemon2,
              },
              pokemon2: {
                name: pokemon2Data.name,
                types: pokemon2Types,
                weaknesses: {
                  fourX: pokemon2Effectiveness.fourXEffectivess.map(
                    (t) => t.name,
                  ),
                  twoX: pokemon2Effectiveness.twoXEffectiveness.map(
                    (t) => t.name,
                  ),
                },
                attacksAgainstPokemon1: pokemon2AgainstPokemon1,
              },
            };
          } catch (error) {
            return {
              error: `Could not compare Pokemon: ${pokemon1} and ${pokemon2}`,
            };
          }
        },
      }),

      getItemData: tool({
        description: "Get information about a specific item",
        parameters: z.object({
          itemName: z.string().describe("The name of the item (lowercase)"),
        }),
        execute: async ({ itemName }) => {
          try {
            const itemData = await getItemData(itemName.toLowerCase());
            return {
              name: itemData.name,
              effect: itemData.effect_entries
                .filter((entry) => entry.language.name === "en")
                .map((entry) => entry.effect)[0],
              flavorText:
                itemData.flavor_text_entries
                  .filter((entry) => entry.language.name === "en")
                  .map((entry) => entry.flavor_text)[0] ?? "",
            };
          } catch (error) {
            return { error: `Could not find item data for: ${itemName}` };
          }
        },
      }),

      getAbilityData: tool({
        description: "Get information about a specific ability",
        parameters: z.object({
          abilityName: z
            .string()
            .describe("The name of the ability (lowercase)"),
        }),
        execute: async ({ abilityName }) => {
          try {
            const abilityData = await getAbilityData(abilityName.toLowerCase());
            return {
              name: abilityData.name,
              effect: abilityData.effect_entries
                .filter((entry) => entry.language.name === "en")
                .map((entry) => entry.effect)[0],
              flavorText:
                abilityData.flavor_text_entries
                  .filter((entry) => entry.language.name === "en")
                  .map((entry) => entry.flavor_text)[0] ?? "",
            };
          } catch (error) {
            return { error: `Could not find ability data for: ${abilityName}` };
          }
        },
      }),

      getMoveData: tool({
        description: "Get information about a specific move",
        parameters: z.object({
          moveName: z.string().describe("The name of the move (lowercase)"),
        }),
        execute: async ({ moveName }) => {
          try {
            const moveData = await getMoveData(moveName.toLowerCase());
            return {
              name: moveData.name,
              type: moveData.type.name,
              category: moveData.damage_class.name,
              power: moveData.power,
              accuracy: moveData.accuracy,
              pp: moveData.pp,
              effect: moveData.effect_entries
                .filter((entry) => entry.language.name === "en")
                .map((entry) => entry.effect)[0],
            };
          } catch (error) {
            return { error: `Could not find move data for: ${moveName}` };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
