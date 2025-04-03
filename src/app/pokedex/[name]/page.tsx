"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TypeEffectivenessTable from "~/components/type-effectiveness";
import { Card } from "~/components/ui/card";
import { PokemonStatsChart } from "~/components/pokemon-stat-chart";
import type { Pokemon, PokemonSpecies } from "~/types/types";
import Image from "next/image";
import { SpriteCarousel } from "~/components/sprite-carousel";
import PokemonSpeciesInfo from "~/components/pokemon-species-info";
import PokemonEvolutionChain from "~/components/pokemon-evolution-chain";

const getPokemonData = async (name: string): Promise<Pokemon> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  return response.json() as Promise<Pokemon>;
};

const getPokemonSpeciesData = async (name: string): Promise<PokemonSpecies> => {
  const response = await fetch(name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon species data");
  }
  return response.json() as Promise<PokemonSpecies>;
};

export default function PokemonDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ name: string }>;
}) {
  const params = React.use(paramsPromise); // Unwrap the params Promise
  const { name } = params;

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokedata", name],
    queryFn: () => getPokemonData(name),
  });

  const {
    data: species,
    isLoading: isLoadingSpecies,
    isError: isErrorSpecies,
  } = useQuery({
    queryKey: ["speciesdata", name],
    queryFn: () => getPokemonSpeciesData(pokemon!.species.url),
  });

  if (isLoading) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">Loading...</div>
      </Card>
    );
  }

  if (isError || !pokemon) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">
          Error loading Pokémon.
        </div>
      </Card>
    );
  }

  const formattedStats = pokemon.stats.map((stat) => ({
    name: stat.stat.name,
    base_stat: stat.base_stat,
    color: "#FFFFFF", // Default color, can be customized
  }));
  const spriteImages = [
    pokemon.sprites.other?.["official-artwork"].front_default,
    pokemon.sprites.other?.["official-artwork"].front_shiny,
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter((image): image is string => Boolean(image)); // Filter out null or undefined sprites

  return (
    <div className="container flex flex-col md:flex-row">
      {/* Sidebar Content */}
      <div className="m-6 flex flex-col items-center justify-center sm:w-full md:w-1/3">
        <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
          <h5 className="text-lg font-bold capitalize">{pokemon.name}</h5>
        </Card>
        <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
          <SpriteCarousel images={spriteImages} />
        </Card>
        <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
          <PokemonStatsChart
            stats={formattedStats}
            id={pokemon.id}
            name={pokemon.name}
          />
        </Card>
        <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
          <TypeEffectivenessTable
            pokemonTypes={pokemon.types.map((typeInfo) => typeInfo.type.name)}
          />
        </Card>
        <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
          {species?.evolution_chain.url && (
            <PokemonEvolutionChain url={species.evolution_chain.url} />
          )}
        </Card>
      </div>

      {/* Main Content */}
      <div className="m-6 flex flex-col items-start justify-center sm:w-full md:w-2/3">
        <Card className="mb-6 flex h-full w-full flex-col items-start justify-center">
          {species && <PokemonSpeciesInfo speciesInfo={species} />}
        </Card>
      </div>
    </div>
  );
}
