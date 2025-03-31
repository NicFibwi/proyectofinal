"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Card } from "~/components/ui/card";
import type { Pokemon } from "~/types/types";

const getPokemonData = async (name: string): Promise<Pokemon> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  return response.json() as Promise<Pokemon>;
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold capitalize">{name}</h1>
      <p>ID: {pokemon.id}</p>
      <p>Height: {pokemon.height}</p>
      <div>
        <h2 className="text-2xl font-semibold">Moves:</h2>
        {pokemon.moves.map((move) => (
          <div key={move.move.name} className="capitalize">
            {move.move.name}
          </div>
        ))}
      </div>
    </div>
  );
}
