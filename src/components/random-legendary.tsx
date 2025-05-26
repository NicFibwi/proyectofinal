"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { Pokemon, PokemonSpecies } from "~/types/types";
import { Card, CardHeader } from "./ui/card";

import { PokemonStatsChart } from "./pokemon-stat-chart";
import { TypeBadge } from "./ui/typebadge";
import Link from "next/link";
import { Button } from "./ui/button";
import { PromisePool } from "@supercharge/promise-pool";
import { RefreshCw } from "lucide-react";

const getAllLegendaries = async (): Promise<Pokemon[]> => {
  const allPokemon = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1025",
  );

  const allPokemonData = (await allPokemon.json()) as {
    results: { name: string; url: string }[];
  };

  const allLegendaries: Pokemon[] = [];

  await PromisePool.for(allPokemonData.results)
    .withConcurrency(100)
    .process(async (pokemon) => {
      const pokemonDetails = await fetch(pokemon.url);
      const pokemonSpecies = await fetch(
        pokemon.url.replace("pokemon", "pokemon-species"),
      );

      const speciesData = (await pokemonSpecies.json()) as PokemonSpecies;
      const detailsData = (await pokemonDetails.json()) as Pokemon;

      if (speciesData.is_legendary || speciesData.is_mythical) {
        allLegendaries.push({
          ...detailsData,
        });
      }
    });

  return allLegendaries;
};

export default function RandomLegendary({ onLegendarySelected }: { onLegendarySelected: (name: string) => void }) {
  const [legendary, setLegendary] = useState<Pokemon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: legendaryList,
    isLoading: isLoadingList,
    isError: isErrorList,
  } = useQuery({
    queryKey: ["pokemonList"],
    queryFn: () => getAllLegendaries(),
    staleTime: Infinity, // 1 day
  });

  // Load legendary from localStorage when component mounts
  useEffect(() => {
    const savedLegendary = localStorage.getItem("randomLegendaryState");
    const savedIsInitialized = localStorage.getItem("isInitializedState");

    if (savedLegendary) {
      try {
        const parsedLegendary = JSON.parse(savedLegendary) as Pokemon;
        if (parsedLegendary?.name) {
          setLegendary(parsedLegendary);
        }
      } catch (error) {
        console.error("Error parsing saved legendary state:", error);
        localStorage.removeItem("randomLegendaryState");
      }
    }

    if (savedIsInitialized) {
      try {
        const parsedIsInitialized = JSON.parse(savedIsInitialized) as boolean;
        setIsInitialized(parsedIsInitialized);
      } catch (error) {
        console.error("Error parsing saved isInitialized state:", error);
        localStorage.removeItem("isInitializedState");
      }
    }
  }, []);

  // Save legendary and isInitialized to localStorage when they change
  useEffect(() => {
    if (legendary) {
      localStorage.setItem("randomLegendaryState", JSON.stringify(legendary));
      onLegendarySelected(legendary.name); // Pass the legendary's name to the parent
    }
    localStorage.setItem("isInitializedState", JSON.stringify(isInitialized));
  }, [legendary, isInitialized, onLegendarySelected]);

  const getRandomLegendary = async () => {
    if (legendaryList && legendaryList.length > 0) {
      const randomIndex = Math.floor(Math.random() * legendaryList.length);
      const selectedLegendary = legendaryList[randomIndex];

      if (selectedLegendary) {
        const speciesData = (await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${selectedLegendary.id}`,
        ).then((res) => res.json())) as PokemonSpecies;

        if (speciesData.varieties.length > 1) {
          const randomForm = Math.floor(
            Math.random() * speciesData.varieties.length,
          );
          const varietyName = speciesData.varieties[randomForm]?.pokemon?.name;

          if (varietyName) {
            const varietyData = (await fetch(
              `https://pokeapi.co/api/v2/pokemon/${varietyName}`,
            ).then((res) => res.json())) as Pokemon;

            setLegendary(varietyData);
            console.log(
              `Selected Legendary Variety: ${varietyData.name} (${varietyData.id})`,
            );
          }
        } else {
          setLegendary(selectedLegendary);
          console.log(
            `Selected Legendary: ${selectedLegendary.name} (${selectedLegendary.id})`,
          );
        }
      }
    }
  };

  // Only get a random legendary if we don't have one and we haven't tried to load one from localStorage
  if (
    !legendary &&
    legendaryList &&
    !isLoadingList &&
    !isErrorList &&
    !isInitialized
  ) {
    void getRandomLegendary();
    setIsInitialized(true);
  }

  const formattedStats = legendary
    ? legendary.stats.map((stat) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
        color: "#FFFFFF",
      }))
    : [];

  return (
    <>
      {legendary && (
        <Card className="mb-6 flex h-auto w-full flex-col items-center justify-around md:flex-row">
          <CardHeader className="flex h-auto w-full items-center justify-center md:hidden">
            <h1 className="text-muted-foreground font-bold">
              OPPONENT POKEMON:
            </h1>
          </CardHeader>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold">OPPONENT:</h1>
            <div>
              <Button onClick={getRandomLegendary} className="w-full md:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                New Opponent
              </Button>
            </div>
          </div>

          <div className="flex h-70 w-70 flex-col items-center justify-center">
            <h3 className="mb-2 text-lg font-bold capitalize">
              {legendary.name.includes("-") &&
              !legendary.name.startsWith("tapu") &&
              (legendary.name.split("-")[1] ?? "").length > 3
                ? `${legendary.name.split("-")[0]} (${legendary.name.split("-").slice(1).join(" ")})`.replaceAll(
                    "-",
                    " ",
                  )
                : legendary.name.replaceAll("-", " ")}
            </h3>
            <Link href={`/pokedex/${legendary.name}/`} target="_blank">
              <img
                src={legendary.sprites.front_default || "/placeholder.svg"}
                alt={legendary.name}
                style={{ imageRendering: "pixelated" }}
                className="h-60 w-60"
              />
            </Link>
            <div className="mb-2 block lg:hidden">
              <Button onClick={getRandomLegendary}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Opponent
              </Button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-2">
            {legendary.types.map((type) => (
              <TypeBadge
                key={type.type.name}
                type={{ slot: 0, type: type.type }}
              />
            ))}
          </div>

          <div className="flex h-70 w-70 items-center justify-center">
            <PokemonStatsChart
              stats={formattedStats}
              id={legendary.id}
              name={legendary.name}
            />
          </div>
        </Card>
      )}
    </>
  );
}
