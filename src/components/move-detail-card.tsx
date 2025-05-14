"use client";
import type { MoveInfo } from "~/types/types";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import MoveInfoCard from "./move-info-card";

import StatChangeDialog from "./stat-change-dialog";
import MovePokemonList from "./move-pokemon-list";
import { cn, formatGenerationName, GenTextColors } from "~/lib/utils";
import NavigationButtons from "./navigation-buttons";

const getMoveData = async (name: string): Promise<MoveInfo> => {
  const response = await fetch("https://pokeapi.co/api/v2/move/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch item data");
  }
  return response.json() as Promise<MoveInfo>;
};

export default function MoveDetailCard({ name }: { name: string }) {
  const {
    data: move,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movedata", name],
    queryFn: () => getMoveData(name),
    staleTime: 1000 * 60 * 15,
  });

  // Filter English flavor text entries
  const englishEntries = useMemo(() => {
    return (
      move?.flavor_text_entries
        ?.filter((entry) => entry.language.name === "en")
        .map((entry) => ({
          version: entry.version_group.name,
          text: entry.flavor_text.replace(/\f/g, " "),
        })) ?? []
    );
  }, [move?.flavor_text_entries]);

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

  if (isError || !move) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">
          Error loading move.
        </div>
      </Card>
    );
  }

  return (
    <div className="container h-full w-full">
      <NavigationButtons id={move.id} route={"/docs/moves"} limit={816} />

      <div className="container flex flex-col items-start lg:flex-row">
        {/* Sidebar Content */}
        <div className="flex w-full flex-col items-center justify-center sm:m-6 lg:w-1/3">
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <h5 className="text-lg font-bold capitalize">{move.name}</h5>
          </Card>
          <MoveInfoCard move={move} />
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col sm:m-6 md:w-full lg:w-2/3">
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <p className="p-4">
              {move.effect_entries[0]?.effect ?? "No entry found for this move"}
            </p>
            <p className="text-sm italic">
              {move.effect_entries[0]?.short_effect ??
                "No short entry found for this move"}
            </p>
            <StatChangeDialog />
          </Card>

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
                      key={entry.version}
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

          {move.learned_by_pokemon.length > 0 && (
            <MovePokemonList move={move} />
          )}
        </div>
      </div>
    </div>
  );
}
