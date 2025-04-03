"use client";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useMemo } from "react";
import type { PokemonSpecies } from "../types/types";
import { Progress } from "./ui/progress";

interface PokemonSpeciesCardProps {
  speciesInfo: PokemonSpecies;
}

export default function PokemonSpeciesCard({
  speciesInfo,
}: PokemonSpeciesCardProps) {
  const englishEntries = useMemo(() => {
    const entries = speciesInfo.flavor_text_entries.filter(
      (entry) => entry.language.name === "en",
    );

    // Create a map of version name to entry
    const entriesByVersion = new Map<string, string>();

    entries.forEach((entry) => {
      entriesByVersion.set(entry.version.name, entry.flavor_text);
    });

    return Array.from(entriesByVersion.entries()).map(([version, text]) => ({
      version,
      text: text.replace(/\f/g, " "),
    }));
  }, [speciesInfo.flavor_text_entries]);

  // Format generation name for display
  const formattedGeneration = useMemo(() => {
    return speciesInfo.generation.name
      .replace("generation-", "Generation ")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [speciesInfo.generation.name]);

  // Get the first tab to use as default
  const defaultTab =
    englishEntries.length > 0 ? englishEntries[0]?.version : "";

  return (
    <Card className="mx-auto w-full max-w-3xl shadow-lg">
      <CardTitle className="flex items-center gap-3 text-2xl">
        Pokémon #{speciesInfo.id}
        {speciesInfo.is_legendary && (
          <Badge className="bg-amber-500">Legendary</Badge>
        )}
        {speciesInfo.is_mythical && (
          <Badge className="bg-purple-600">Mythical</Badge>
        )}
        {speciesInfo.is_baby && <Badge className="bg-pink-400">Baby</Badge>}
      </CardTitle>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">Basic Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Capture Rate:</span>
                  <span>{speciesInfo.capture_rate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Happiness:</span>
                  <span>{speciesInfo.base_happiness}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gender Rate:</span>
                  <div className="flex w-full items-center gap-2">
                    {speciesInfo.gender_rate === -1 ? (
                      // Genderless case
                      <div className="h-4 w-full rounded bg-gray-300">
                        <Progress value={100} className="h-4 bg-gray-500" />
                      </div>
                    ) : (
                      // Male and Female case
                      <div className="relative h-4 w-full overflow-hidden rounded bg-gray-300">
                        <div
                          className="absolute top-0 left-0 h-full bg-blue-500"
                          style={{
                            width: `${100 - (speciesInfo.gender_rate / 8) * 100}%`,
                          }}
                        />
                        <div
                          className="absolute top-0 right-0 h-full bg-pink-500"
                          style={{
                            width: `${(speciesInfo.gender_rate / 8) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                    {speciesInfo.gender_rate === -1 ? (
                      <span className="text-sm text-gray-500">Genderless</span>
                    ) : (
                      <span className="text-sm">
                        {100 - (speciesInfo.gender_rate / 8) * 100}% Male /{" "}
                        {(speciesInfo.gender_rate / 8) * 100}% Female
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold">Classification</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Generation:</span>
                  <span>{formattedGeneration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Egg Groups:</span>
                  <span>
                    {speciesInfo.egg_groups
                      .map(
                        (group) =>
                          group.name.charAt(0).toUpperCase() +
                          group.name.slice(1),
                      )
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Pokédex Entries</h3>
            {englishEntries.length > 0 ? (
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="mb-4 grid h-auto grid-cols-3 flex-wrap">
                  {englishEntries.map((entry) => (
                    <TabsTrigger
                      key={entry.version}
                      value={entry.version}
                      className="text-xs capitalize"
                    >
                      {entry.version.replace(/-/g, " ")}
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
            ) : (
              <p className="text-sm italic">
                No Pokédex entries available in English.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
