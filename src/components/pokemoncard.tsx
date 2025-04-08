import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TypeBadge } from "~/components/ui/typebadge";
import type { Pokemon } from "~/types/types";
import Image from "next/image";
import { HoverCardEffect } from "./hover-card-effect";
import Link from "next/link";

const getPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon details");
  }
  return response.json() as Promise<Pokemon>;
};

export default function PokemonCard({ url }: { url: string }) {
  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemon", url],
    queryFn: () => getPokemonDetails(url),
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
    <HoverCardEffect>
      <Link href={`/pokedex/${pokemon.name}/`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between capitalize">
              <div>{pokemon.name}</div>
              <div className="text-muted-foreground">#{pokemon.id}</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {/* <Image
              src={
                pokemon.sprites.other?.["official-artwork"].front_default ??
                "/placeholder.png"
              }
              alt={pokemon.name}
              width={100}
              height={100}
              loading="lazy"
            /> */}
            <img
              src={
                pokemon.sprites.other?.["official-artwork"].front_default ??
                "/placeholder.png"
              }
              alt={pokemon.name}
              loading="lazy"
              width={100}
              height={100}
              style={{ imageRendering: "auto" }} // Ensures the image is upscaled without blurring
            />
          </CardContent>
          <CardDescription className="flex flex-row items-center justify-around">
            <div className="flex gap-2">
              {pokemon.types.map((type, index) => (
                <TypeBadge key={index} type={type} />
              ))}
            </div>
          </CardDescription>
        </Card>
      </Link>
    </HoverCardEffect>
  );
}
