"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import type {
  SpeciesEvolutionChain,
  Chain,
  Pokemon,
  Sprites,
} from "~/types/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

// Fetch the evolution chain data
export const getPokemonChain = async (
  url: string,
): Promise<SpeciesEvolutionChain> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  return response.json() as Promise<SpeciesEvolutionChain>;
};

// Fetch the sprite for a Pokémon by name
const getPokemonSpriteFromName = async (
  name: string,
): Promise<Sprites["front_default"]> => {
  if (name.toLowerCase() === "darmanitan") {
    name += "-standard";
  }
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  const pokemon = response.json() as Promise<Pokemon>;
  const sprite = await pokemon.then((data) => data.sprites);
  return sprite.front_default;
};

// Define a type for the evolution data
interface EvolutionData {
  name: string;
  sprite: string;
  reason?: string;
}

// Recursively process the evolution chain
const getEvolvesToChain = async (chain: Chain): Promise<EvolutionData[]> => {
  const evolutionData: EvolutionData[] = [];

  // Get the current Pokémon's name and sprite
  let name = chain.species.name;

  const suffixMap: Record<string, string> = {
    thundurus: "-Incarnate",
    landorus: "-Incarnate",
    tornadus: "-Incarnate",
    darmanitan: "-Standard",
    giratina: "-Altered",
    shaymin: "-Land",
    wormadam: "-Plant",
    deoxys: "-Normal",
    squawkabilly: "-Green-Plumage",
    dudunsparce: "-Two-Segment",
    tatsugiri: "-Curly",
    palafin: "-Zero",
    maushold: "-Family-Of-Four",
    meowstic: "-Male",
    indeedee: "-Male",
    basculegion: "-Male",
    oinkologne: "-Male",
    urshifu: "-Single-Strike",
    morpeko: "-Full-Belly",
    eiscue: "-Ice",
    toxtricity: "-Amped",
    mimikyu: "-Disguised",
    minior: "-Red-Meteor",
    wishiwashi: "-Solo",
    lycanroc: "-Midday",
    oricorio: "-Baile",
    zygarde: "-50",
    pumpkaboo: "-Average",
    gourgeist: "-Average",
    aegislash: "-Shield",
    meloetta: "-Aria",
    keldeo: "-Ordinary",
    basculin: "-White-Striped",
  };

  if (suffixMap[name.toLowerCase()]) {
    name += suffixMap[name.toLowerCase()];
  }
  const sprite = await getPokemonSpriteFromName(name);
  evolutionData.push({ name, sprite });

  // Check if there are further evolutions
  if (chain.evolves_to?.length > 0) {
    for (const evolvesTo of chain.evolves_to) {
      const evolutionDetails = evolvesTo.evolution_details
        .map((detail) => {
          const readableDetails: string[] = [];

          // Map gender to readable format
          if (detail.gender === 1) {
            readableDetails.push("Female");
          } else if (detail.gender === 2) {
            readableDetails.push("Male");
          }

          // Map item to readable format
          if (detail.item?.name) {
            readableDetails.push(`using ${capitalize(detail.item.name)}`);
          }

          // Map held item to readable format
          if (detail.held_item?.name) {
            readableDetails.push(
              `while holding ${capitalize(detail.held_item.name)}`,
            );
          }

          // Map known move to readable format
          if (detail.known_move?.name) {
            readableDetails.push(
              `knowing the move ${capitalize(detail.known_move.name)}`,
            );
          }

          // Map known move type to readable format
          if (detail.known_move_type?.name) {
            readableDetails.push(
              `knowing a ${capitalize(detail.known_move_type.name)}-type move`,
            );
          }

          // Map location to readable format
          if (detail.location?.name) {
            readableDetails.push(`at ${capitalize(detail.location.name)}`);
          }

          // Map minimum affection
          if (detail.min_affection) {
            readableDetails.push(
              `with at least ${detail.min_affection} affection`,
            );
          }

          // Map minimum beauty
          if (detail.min_beauty) {
            readableDetails.push(`with at least ${detail.min_beauty} beauty`);
          }

          // Map minimum happiness
          if (detail.min_happiness) {
            readableDetails.push(
              `with at least ${detail.min_happiness} happiness`,
            );
          }

          // Map minimum level
          if (detail.min_level) {
            readableDetails.push(`at level ${detail.min_level}`);
          }

          // Map overworld rain condition
          if (detail.needs_overworld_rain) {
            readableDetails.push("while it's raining in the overworld");
          }

          // Map time of day
          if (detail.time_of_day) {
            readableDetails.push(`at ${capitalize(detail.time_of_day)} time`);
          }

          // Map trade species
          if (detail.trade_species?.name) {
            readableDetails.push(
              `when traded for ${capitalize(detail.trade_species.name)}`,
            );
          }

          // Map trigger to readable format
          if (detail.trigger?.name) {
            if (detail.trigger.name === "use-item") {
              readableDetails.push("by using an item");
            } else if (detail.trigger.name === "level-up") {
              readableDetails.push("by leveling up");
            } else if (detail.trigger.name === "trade") {
              readableDetails.push("by trading");
            } else {
              readableDetails.push(
                `trigger: ${capitalize(detail.trigger.name)}`,
              );
            }
          }

          // Map upside-down condition
          if (detail.turn_upside_down) {
            readableDetails.push("while holding the console upside down");
          }

          return readableDetails.join(", ");
        })
        .join(" or "); // Join multiple evolution methods with " or "

      const nextEvolutions = await getEvolvesToChain(evolvesTo);
      evolutionData.push({
        reason: evolutionDetails,
        name: "",
        sprite: "",
      });
      evolutionData.push(...nextEvolutions);
    }
  }

  return evolutionData;
};

// Helper function to capitalize the first letter of a string
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default function PokemonEvolutionChain({ url }: { url: string }) {
  // Fetch the evolution chain using React Query
  const {
    data: baseChain,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["evochain"],
    queryFn: () => getPokemonChain(url),
  });

  const { data: evolutionChain = [] } = useQuery({
    queryKey: ["evolutionChain", baseChain?.chain],
    queryFn: async () => {
      if (baseChain) {
        return getEvolvesToChain(baseChain.chain);
      }
      return [];
    },
    enabled: !!baseChain,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading evolution chain.</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h3 className="text-lg font-bold">Evolution Chain</h3>
      <div className="flex flex-col items-center justify-center gap-4">
        {evolutionChain.map((evolution, index) => (
          <div key={index} className="flex flex-col items-center">
            {evolution.name && (
              <Link href={`/pokedex/${evolution.name}`}>
                <Card className="flex h-auto w-auto flex-col items-center justify-center">
                  <CardContent className="mb-4 flex flex-col items-center justify-center">
                    <CardTitle className="capitalize">
                      {evolution.name}
                    </CardTitle>
                    <Image
                      src={evolution.sprite}
                      alt={evolution.name}
                      className="object-contain"
                      height={24}
                      width={24}
                    />
                  </CardContent>
                </Card>
              </Link>
            )}
            {evolution.reason && (
              <p className="text-center text-gray-500">
                ( {evolution.reason} )
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
