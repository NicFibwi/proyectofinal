"use client";

import type { AbilityInfo } from "~/types/types";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AbilityPokemonList from "./ability-pokemon-list";

const getAbilityInfo = async (name: string): Promise<AbilityInfo> => {
  const response = await fetch("https://pokeapi.co/api/v2/ability/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch ability data");
  }
  return response.json() as Promise<AbilityInfo>;
};

export default function AbilityDetailCard({ name }: { name: string }) {
  const router = useRouter();

  const {
    data: abilityInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["abilityInfo", name],
    queryFn: () => getAbilityInfo(name),
    staleTime: 1000 * 60 * 15,
  });

  // Filter English flavor text entries
  const englishEntries = useMemo(() => {
    return (
      abilityInfo?.flavor_text_entries
        ?.filter((entry) => entry.language.name === "en")
        .map((entry) => ({
          version: entry.version_group.name,
          text: entry.flavor_text.replace(/\f/g, " "),
        })) ?? []
    );
  }, [abilityInfo?.flavor_text_entries]);

  // Get the first tab to use as default
  const defaultTab =
    englishEntries.length > 0 ? englishEntries[0]?.version : "";

  if (isLoading) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">Loading...</div>
      </Card>
    );
  }

  if (isError || !abilityInfo) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">
          Error loading ability.
        </div>
      </Card>
    );
  }

  return (
    <div className="container h-full w-full">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="ml-6 flex flex-row items-center lg:w-1/5">
          <Button onClick={() => router.back()}>Back</Button>
        </div>
        <div className="flex flex-row items-center justify-around lg:w-1/5">
          <Button
            onClick={() => {
              const prevAbilityId = abilityInfo.id - 1;
              router.push(`${prevAbilityId}`);
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              const nextAbilityId = abilityInfo.id + 1;
              router.push(`${nextAbilityId}`);
            }}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="container flex flex-col items-start lg:flex-row">
        {/* Sidebar Content */}
        <div className="flex w-full flex-col items-center justify-center sm:m-6 lg:w-1/3">
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <h5 className="text-lg font-bold capitalize">{abilityInfo.name}</h5>
          </Card>
          {/* Pokémon with this Ability */}
          <div className="hidden w-full sm:block">
            {abilityInfo.pokemon.length > 0 && (
              <AbilityPokemonList ability={abilityInfo} />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col sm:m-6 md:w-full lg:w-2/3">
          {/* Effect Entries */}
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <p className="p-4">
              {abilityInfo.effect_entries.find(
                (entry) => entry.language.name === "en",
              )?.effect ?? "No detailed effect available."}
            </p>
            <p className="text-sm italic">
              {abilityInfo.effect_entries.find(
                (entry) => entry.language.name === "en",
              )?.short_effect ?? "No short effect available."}
            </p>
          </Card>

          {/* Flavor Text Entries */}
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <Tabs defaultValue={defaultTab} className="h-full w-full p-4">
              <TabsList className="mb-4 grid h-auto w-full grid-cols-3 flex-wrap">
                {englishEntries.map((entry) => (
                  <TabsTrigger
                    key={entry.version}
                    value={entry.version}
                    className="text-xs capitalize hover:bg-gray-500"
                  >
                    {entry.version
                      .replace(/-/g, " ")
                      .replace(/Lets Go\s*/gi, "LG ")
                      .replace(/Ultra\s*/gi, "U ")
                      .replace(/Omega\s*/gi, "O ")
                      .replace(/Alpha\s*/gi, "A ")}
                  </TabsTrigger>
                ))}
              </TabsList>
              {englishEntries.map((entry) => (
                <TabsContent
                  key={entry.version}
                  value={entry.version}
                  className="mt-0"
                >
                  <Card className="w-full border-none bg-transparent shadow-none">
                    <CardContent className="p-4">
                      <p>{entry.text}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          <div className="block w-full sm:hidden">
            {abilityInfo.pokemon.length > 0 && (
              <AbilityPokemonList ability={abilityInfo} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
