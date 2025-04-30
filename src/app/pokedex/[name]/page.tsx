"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TypeEffectivenessTable from "~/components/type-effectiveness";
import { Card, CardTitle } from "~/components/ui/card";
import { PokemonStatsChart } from "~/components/pokemon-stat-chart";
import type { Pokemon, PokemonSpecies } from "~/types/types";
import { SpriteCarousel } from "~/components/sprite-carousel";
import PokemonSpeciesInfo from "~/components/pokemon-species-info";
import PokemonEvolutionChain from "~/components/pokemon-evolution-chain";
import PokemonMovesTable from "~/components/pokemon-move-list";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import NavigationButtons from "~/components/navigation-buttons";

const getPokemonData = async (name: string): Promise<Pokemon> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  return response.json() as Promise<Pokemon>;
};

const getPokemonSpeciesData = async (url: string): Promise<PokemonSpecies> => {
  const response = await fetch(url);
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
    isLoading: isLoadingPokemon,
    isError: isErrorPokemon,
  } = useQuery({
    queryKey: ["pokedata", name],
    queryFn: () => getPokemonData(name),
  });

  const speciesUrl = pokemon?.species.url;

  const {
    data: species,
    isLoading: isLoadingSpecies,
    isError: isErrorSpecies,
  } = useQuery({
    queryKey: ["speciesdata", speciesUrl],
    queryFn: () => getPokemonSpeciesData(speciesUrl!),
    enabled: !!speciesUrl, // Only fetch species data if the URL is available
  });

  if (isLoadingPokemon || isLoadingSpecies) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">Loading...</div>
      </Card>
    );
  }

  if (isErrorPokemon || isErrorSpecies || !pokemon || !species) {
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
    color: "#FFFFFF",
  }));

  const spriteImages = [
    pokemon.sprites.other?.["official-artwork"].front_default,
    pokemon.sprites.other?.["official-artwork"].front_shiny,
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter((image): image is string => Boolean(image));

  return (
    <div className="container h-full w-full">
      <NavigationButtons id={pokemon.id} route={`/pokedex`} limit={1025} />

      <div className="container flex flex-col items-start lg:flex-row">
        {/* Sidebar Content */}
        <div className="flex w-full flex-col items-center justify-center sm:m-6 lg:w-1/3">
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
        <div className="flex w-full flex-col sm:m-6 md:w-full lg:w-2/3">
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            {species && (
              <PokemonSpeciesInfo speciesInfo={species} pokemonInfo={pokemon} />
            )}
          </Card>

          <Card>
            <CardTitle className="flex flex-row items-center justify-around gap-4">
              <h3 className="text-lg font-bold">Movelist</h3>
            </CardTitle>
            <PokemonMovesTable pokemon={pokemon} />
          </Card>
        </div>
      </div>
    </div>
  );
}
