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

const getAllPokemon = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
  );
  const pokeList = await response.json();
  return pokeList as PokemonList;
};

const getPokemon = async (apiUrl: string) => {
  const response = await fetch(apiUrl);
  const pokemon = await response.json();
  return pokemon as Pokemon;
}

export default function PokedexPage() {

  const getPokemonList = useQuery({
    queryKey: ["pokemonlist"],
    queryFn: getAllPokemon,
  });

  const { data } = getPokemonList;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
        <p className="text-muted-foreground">
          Database of essential information about Pokémon and game mechanics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data?.results.map((p) => (

          
          
          <Card key={p.name}>
            <CardHeader>
              <CardTitle className="capitalize">{p.name}</CardTitle>
            </CardHeader>
            {/* <CardContent>
              <img src={} alt={data.name} className="mx-auto h-24 w-24" />
              <div className="flex-center flex">
                <span className="text-muted-foreground">#{data.id}</span>
              </div>
            </CardContent>
            <CardDescription>
              <div className="flex gap-2">
                {pokemon.types.map((type, index) => (
                  <TypeBadge key={index} type={type} />
                ))}
              </div>
            </CardDescription> */}
          </Card>
        ))}
      </div>
    </div>
  );
}
