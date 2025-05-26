// functions/getTypeEffectiveness.ts
import { z } from "zod";

// attacking type {defending type -> effectiveness multiplier}
const typeEffectivenessChart: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    grass: 2,
    ice: 2,
    bug: 2,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    rock: 0.5,
    dragon: 0.5,
  },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, ground: 0 },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    grass: 2,
    ground: 2,
    flying: 2,
    dragon: 2,
    fire: 0.5,
    water: 0.5,
    ice: 0.5,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: {
    grass: 2,
    fairy: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
  },
  ground: {
    fire: 2,
    electric: 2,
    poison: 2,
    rock: 2,
    steel: 2,
    grass: 0.5,
    bug: 0.5,
    flying: 0,
  },
  flying: {
    grass: 2,
    fighting: 2,
    bug: 2,
    electric: 0.5,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: {
    grass: 2,
    psychic: 2,
    dark: 2,
    fire: 0.5,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    flying: 2,
    bug: 2,
    fighting: 0.5,
    ground: 0.5,
    steel: 0.5,
  },
  ghost: { psychic: 2, ghost: 2, normal: 0, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: {
    ice: 2,
    rock: 2,
    fairy: 2,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    steel: 0.5,
  },
  fairy: {
    fighting: 2,
    dragon: 2,
    dark: 2,
    fire: 0.5,
    poison: 0.5,
    steel: 0.5,
  },
};

const allTypes = Object.keys(typeEffectivenessChart);

export const getTypeEffectiveness = {
  name: "getTypeEffectiveness",
  description:
    "Calculates a Pokémon's type effectiveness, including 4× weaknesses and ¼× resistances.",
  parameters: z.object({
    types: z
      .array(z.string())
      .min(1)
      .max(2)
      .describe("A list of one or two Pokémon types."),
  }),
  execute: async ({ types }: { types: string[] }) => {
    const effectiveness: Record<string, number> = {};

    for (const attackType of allTypes) {
      let multiplier = 1;
      for (const defenseType of types) {
        const chart = typeEffectivenessChart[attackType.toLowerCase()];
        const typeEffect = chart?.[defenseType.toLowerCase()] ?? 1;
        multiplier *= typeEffect;
      }
      effectiveness[attackType] = multiplier;
    }

    const categorized = {
      "4x_weak": [] as string[],
      "2x_weak": [] as string[],
      neutral: [] as string[],
      "0.5x_resist": [] as string[],
      "0.25x_resist": [] as string[],
      immune: [] as string[],
    };

    for (const [type, mult] of Object.entries(effectiveness)) {
      if (mult === 4) categorized["4x_weak"].push(type);
      else if (mult === 2) categorized["2x_weak"].push(type);
      else if (mult === 1) categorized.neutral.push(type);
      else if (mult === 0.5) categorized["0.5x_resist"].push(type);
      else if (mult === 0.25) categorized["0.25x_resist"].push(type);
      else if (mult === 0) categorized.immune.push(type);
    }

    return categorized;
  },
};
