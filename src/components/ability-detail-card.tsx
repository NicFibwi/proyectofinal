"use client";

import type { AbilityInfo } from "~/types/types";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AbilityPokemonList from "./ability-pokemon-list";
import { cn, formatGenerationName, GenTextColors } from "~/lib/utils";
import NavigationButtons from "./navigation-buttons";

const getAbilityInfo = async (name: string): Promise<AbilityInfo> => {
  const response = await fetch("https://pokeapi.co/api/v2/ability/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch ability data");
  }
  return response.json() as Promise<AbilityInfo>;
};

export default function AbilityDetailCard({ name }: { name: string }) {
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
      <NavigationButtons
        id={abilityInfo.id}
        route={"/docs/abilities"}
        limit={367}
      />

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
                {englishEntries.map((entry) => {
                  const color = GenTextColors[entry.version.toLowerCase()];
                  if (!color) {
                    console.log(
                      `No color mapping found for version: ${entry.version}`,
                    );
                  }
                  return (
                    <TabsTrigger
                      key={entry.text + entry.version}
                      value={entry.version}
                      className={cn(
                        "text-xs capitalize hover:bg-gray-500",
                        color, // Apply the color dynamically
                      )}
                    >
                      {formatGenerationName(entry.version)}
                    </TabsTrigger>
                  );
                })}
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
