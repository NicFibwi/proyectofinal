import type {
  AbilityInfo,
  ItemInfo,
  MoveInfo,
  Pokemon,
  PokemonSpecies,
  Species,
  Typing,
} from "~/types/types";

export async function getPokemonData(pokemonName: string) {
  console.log("Fetching data for:", pokemonName);
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon data for ${pokemonName}`);
  }
  const data = (await res.json()) as Pokemon;
  return data;
}

export async function getPokemonSpeciesData(pokemonName: string) {
  console.log("Fetching species data for:", pokemonName);

  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/" + pokemonName,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon species data for ${pokemonName}`);
  }
  const data = (await res.json()) as PokemonSpecies;
  return data;
}

export async function getTypeEffectiveness(pokemon: Pokemon) {
  console.log("Fetching effectiveness data");

  const allTypesData = await fetch("https://pokeapi.co/api/v2/type/?limit=18");
  const allTypesResponse = (await allTypesData.json()) as { results: Species[] };
  const allAttackingTypes: Species[] = allTypesResponse.results;

  const firstDefendingType = pokemon.types[0]!.type;
  const secondDefendingType = pokemon.types[1]?.type;
  const fourXEffectivess: Species[] = [];
  const twoXEffectiveness: Species[] = [];
  const oneXEffectiveness: Species[] = [];
  const halfXEffectiveness: Species[] = [];
  const quarterXEffectiveness: Species[] = [];
  const zeroXEffectiveness: Species[] = [];

  // Process each attacking type
  for (const attackingType of allAttackingTypes) {
    const attackingTypeData = await getTypeData(attackingType);

    // Skip if damage relations are missing
    if (!attackingTypeData.damage_relations) continue;

    const doubleDamageTo =
      attackingTypeData.damage_relations.double_damage_to || [];
    const halfDamageTo =
      attackingTypeData.damage_relations.half_damage_to || [];
    const noDamageTo = attackingTypeData.damage_relations.no_damage_to || [];

    // Check if attacking type deals double damage to first defending type
    const isDoubleToFirst = doubleDamageTo.some(
      (type) => type.name === firstDefendingType.name,
    );

    // Check if attacking type deals double damage to second defending type (if it exists)
    const isDoubleToSecond =
      secondDefendingType &&
      doubleDamageTo.some((type) => type.name === secondDefendingType.name);

    // Check if attacking type deals half damage to first defending type
    const isHalfToFirst = halfDamageTo.some(
      (type) => type.name === firstDefendingType.name,
    );

    // Check if attacking type deals half damage to second defending type (if it exists)
    const isHalfToSecond =
      secondDefendingType &&
      halfDamageTo.some((type) => type.name === secondDefendingType.name);

    // Check if attacking type deals no damage to first defending type
    const isNoToFirst = noDamageTo.some(
      (type) => type.name === firstDefendingType.name,
    );

    // Check if attacking type deals no damage to second defending type (if it exists)
    const isNoToSecond =
      secondDefendingType &&
      noDamageTo.some((type) => type.name === secondDefendingType.name);

    // 0× effectiveness (immune)
    if (isNoToFirst || isNoToSecond) {
      zeroXEffectiveness.push(attackingType);
    }
    // 4× effectiveness (super effective against both types)
    else if (isDoubleToFirst && isDoubleToSecond) {
      fourXEffectivess.push(attackingType);
    }
    // 0.25× effectiveness (not very effective against both types)
    else if (isHalfToFirst && isHalfToSecond) {
      quarterXEffectiveness.push(attackingType);
    }
    // 2× effectiveness (super effective against one type, neutral to the other)
    else if (
      (isDoubleToFirst && !isHalfToSecond && !isNoToSecond) ||
      (isDoubleToSecond && !isHalfToFirst && !isNoToFirst)
    ) {
      twoXEffectiveness.push(attackingType);
    }
    // 0.5× effectiveness (not very effective against one type, neutral to the other)
    else if (
      (isHalfToFirst && !isDoubleToSecond && !isNoToSecond) ||
      (isHalfToSecond && !isDoubleToFirst && !isNoToFirst)
    ) {
      halfXEffectiveness.push(attackingType);
    }
    // 1× effectiveness (neutral to both types)
    else {
      oneXEffectiveness.push(attackingType);
    }
  }

  return {
    fourXEffectivess,
    twoXEffectiveness,
    oneXEffectiveness,
    halfXEffectiveness,
    quarterXEffectiveness,
    zeroXEffectiveness,
  };
}

export async function getTypeData(type: Species) {
  console.log("Fetching type data for:", type.name);
  const res = await fetch(type.url);
  if (!res.ok) {
    throw new Error(`Failed to fetch type data for ${type.name}`);
  }
  const data = (await res.json()) as Typing;
  return data;
}

export async function getMoveData(moveName: string) {
  console.log("Fetching move data for:", moveName);
  const res = await fetch("https://pokeapi.co/api/v2/move/" + moveName);
  if (!res.ok) {
    throw new Error(`Failed to fetch move data for ${moveName}`);
  }
  const data = (await res.json()) as MoveInfo;
  return data;
}

export async function getAbilityData(abilityName: string) {
  console.log("Fetching ability data for:", abilityName);
  const res = await fetch("https://pokeapi.co/api/v2/ability/" + abilityName);
  if (!res.ok) {
    throw new Error(`Failed to fetch ability data for ${abilityName}`);
  }
  const data = (await res.json()) as AbilityInfo;
  return data;
}

export async function getItemData(itemName: string) {
  console.log("Fetching item data for:", itemName);
  const res = await fetch("https://pokeapi.co/api/v2/item/" + itemName);
  if (!res.ok) {
    throw new Error(`Failed to fetch item data for ${itemName}`);
  }
  const data = (await res.json()) as ItemInfo;
  return data;
}
