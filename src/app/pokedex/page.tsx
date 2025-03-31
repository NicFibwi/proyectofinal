"use client";
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { get } from "http";
import type { Key } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TypeBadge } from "~/components/ui/typebadge";
import type { PokemonList, Pokemon } from "~/types/types";
import Image from "next/image";
import PokemonCard from "~/components/pokemoncard";
import { HoverCardEffect } from "~/components/hover-card-effect";
import Link from "next/link";

const getAllPokemon = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
  );
  const pokeList = await response.json();
  return pokeList as PokemonList;
};

const getPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  return response.json();
};

export default function PokedexPage() {
  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemonlist"],
    queryFn: getAllPokemon,
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
