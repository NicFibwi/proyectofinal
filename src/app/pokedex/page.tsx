"use client";
import { useQuery } from "@tanstack/react-query";
import type { PokemonList } from "~/types/types";
import PokemonCard from "~/components/pokemoncard";

const getAllPokemon = async (): Promise<PokemonList> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
  );

  return (await response.json()) as PokemonList;
};

export default function PokedexPage() {
  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemonlist"],
    queryFn: getAllPokemon,
    staleTime: Infinity,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !pokemonList) {
    return <div>Error loading Pokémon list.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
        <p className="text-muted-foreground">
          Database of essential information about Pokémon and game mechanics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pokemonList.results.map((pokemon) => (
          <PokemonCard key={pokemon.name} url={pokemon.url} />
        ))}
      </div>
    </div>
  );
}
