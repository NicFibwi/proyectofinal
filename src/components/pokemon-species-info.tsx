"use client";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useMemo, useState } from "react";
import type { PokemonSpecies, Pokemon } from "../types/types";
import { Progress } from "./ui/progress";
import { TypeBadge } from "./ui/typebadge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { formatGenerationName } from "~/lib/utils";

interface PokemonSpeciesCardProps {
  speciesInfo: PokemonSpecies;
  pokemonInfo: Pokemon;
}

const GenTextColors: Record<string, string> = {
  emerald: "!text-emerald-500",
  red: "!text-red-600",
  blue: "!text-sky-500",
  yellow: "!text-yellow-500",
  gold: "!text-amber-500",
  silver: "!text-slate-500",
  crystal: "!text-cyan-500",
  ruby: "!text-red-500",
  sapphire: "!text-blue-500",
  firered: "!text-red-700",
  leafgreen: "!text-green-500",
  diamond: "!text-teal-500",
  pearl: "!text-pink-500",
  platinum: "!text-blue-500",
  heartgold: "!text-amber-500",
  soulsilver: "!text-slate-500",
  black: "text-black dark:text-gray-400",
  white: "text-gray-500 dark:text-white",
  "black-2": "text-black dark:text-gray-400",
  "white-2": "text-gray-500 dark:text-white",
  x: "!text-blue-500",
  y: "!text-rose-500",
  "omega-ruby": "!text-red-500",
  "alpha-sapphire": "!text-blue-500",
  "lets-go-pikachu": "!text-yellow-500",
  "lets-go-eevee": "!text-amber-700",
  sword: "!text-blue-500",
  shield: "!text-purple-500",
  "legends-arceus": "!text-amber-500",
  scarlet: "!text-red-500",
  violet: "!text-purple-500",
  "brilliant-diamond": "!text-blue-500",
  "shining-pearl": "!text-pink-500",
  "ultra-sun": "!text-yellow-600",
  "ultra-moon": "!text-purple-700",
  sun: "!text-yellow-300",
  moon: "!text-purple-300",
};

export default function PokemonSpeciesCard({
  speciesInfo,
  pokemonInfo,
}: PokemonSpeciesCardProps) {
  const router = useRouter(); // Initialize the router
  const [open, setOpen] = useState(false); // State for Combobox open/close
  const [selectedVariety, setSelectedVariety] = useState(""); // State for selected variety

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
      .replace("generation-", " ")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.toUpperCase())
      .join(" ");
  }, [speciesInfo.generation.name]);

  // Get the first tab to use as default
  const defaultTab =
    englishEntries.length > 0 ? englishEntries[0]?.version : "";

  const handleVarietySelect = (variety: string) => {
    setSelectedVariety(variety);
    setOpen(false);
    router.push(`/pokedex/${variety}`);
  };

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardTitle className="flex items-center justify-evenly gap-3 text-2xl">
        Pokémon with National ID - {speciesInfo.id}
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
              <h3 className="text-lg font-bold">Varieties</h3>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {selectedVariety
                      ? speciesInfo.varieties.find(
                          (variety) => variety.pokemon.name === selectedVariety,
                        )?.pokemon.name
                      : "Select variety..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search variety..." />
                    <CommandList>
                      <CommandEmpty>No variety found.</CommandEmpty>
                      <CommandGroup>
                        {speciesInfo.varieties.map((variety) => (
                          <CommandItem
                            key={variety.pokemon.name}
                            value={variety.pokemon.name}
                            onSelect={() =>
                              handleVarietySelect(variety.pokemon.name)
                            }
                          >
                            {variety.pokemon.name}
                            {/* <Check
                              className={cn(
                                "ml-auto",
                                selectedVariety === variety.pokemon.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            /> */}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <h3 className="text-lg font-bold">Combat Info</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between border-b-1">
                  <span>Types:</span>
                  <span className="flex flex-row">
                    {pokemonInfo.types.map((type, index) => (
                      <TypeBadge
                        key={index}
                        type={{
                          slot: index + 1,
                          type: {
                            name: type.type.name.toLowerCase(),
                            url: "#",
                          },
                        }}
                      />
                    ))}
                  </span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Egg Groups:</span>
                  <span className="felx gap-2">
                    {speciesInfo.egg_groups
                      .map(
                        (group) =>
                          group.name.charAt(0).toUpperCase() +
                          group.name.slice(1),
                      )
                      .join(", ")}
                  </span>
                </div>

                <div className="flex justify-between border-b-1">
                  <span>Abilities:</span>
                  <ul className="flex flex-col">
                    {pokemonInfo.abilities.map((ability, index) => (
                      <li
                        key={index}
                        className={`${
                          ability.is_hidden ? "text-gray-500" : ""
                        } list-disc`}
                      >
                        <a
                          href={`/docs/abilities/${ability.ability.name}`}
                          className="hover:underline"
                        >
                          {ability.is_hidden
                            ? `${
                                ability.ability.name.charAt(0).toUpperCase() +
                                ability.ability.name.slice(1)
                              }`
                            : ability.ability.name.charAt(0).toUpperCase() +
                              ability.ability.name.slice(1)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between border-b-1">
                <span>Effort Values:</span>
                <ul className="flex flex-col">
                  {pokemonInfo.stats.map((stat, index) => {
                    if (stat.effort > 0) {
                      return (
                        <li key={index} className="list-disc">
                          {stat.effort} {stat.stat.name}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold">Basic Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between border-b-1">
                  <span>Capture Rate:</span>
                  <span>{speciesInfo.capture_rate}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Base Happiness:</span>
                  <span>{speciesInfo.base_happiness}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Growth Rate:</span>
                  <span className="capitalize">
                    {speciesInfo.growth_rate.name}
                  </span>
                </div>
                <div className="flex justify-between border-b-1">
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
                <div className="flex justify-between border-b-1">
                  <span>Generation:</span>
                  <span>{formattedGeneration}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Egg Groups:</span>
                  <span className="felx gap-2">
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

            <div>
              <h3 className="text-lg font-bold">Other</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between border-b-1">
                  <span>Weight:</span>
                  <span>{(pokemonInfo.weight / 10).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Height:</span>
                  <span>{(pokemonInfo.height / 10).toFixed(2)} m</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Cries:</span>
                  <span className="flex gap-2">
                    <button
                      className="flex h-6 w-18 items-center justify-center rounded-md bg-amber-500 text-xs font-bold text-white hover:bg-red-200"
                      onClick={async () => {
                        try {
                          const audio = new Audio(pokemonInfo.cries.legacy);
                          await audio.play(); // Await the promise to handle it properly
                        } catch (error) {
                          console.error("Failed to play legacy cry:", error);
                        }
                      }}
                    >
                      Legacy
                    </button>
                    <button
                      className="flex h-6 w-18 items-center justify-center rounded-md bg-yellow-500 text-xs font-bold text-white hover:bg-red-200"
                      onClick={async () => {
                        try {
                          const audio = new Audio(pokemonInfo.cries.latest);
                          await audio.play(); // Await the promise to handle it properly
                        } catch (error) {
                          console.error("Failed to play latest cry:", error);
                        }
                      }}
                    >
                      Latest
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Pokédex Entries</h3>
            {englishEntries.length > 0 ? (
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="mb-4 grid h-auto w-full grid-cols-3 flex-wrap">
                  {englishEntries.map((entry) => {
                    const color = GenTextColors[entry.version.toLowerCase()];
                    if (!color) {
                      console.log(
                        `No color mapping found for version: ${entry.version}`,
                      );
                    }
                    console.log(entry.version.toLowerCase());
                    return (
                      <TabsTrigger
                        key={entry.version}
                        value={entry.version}
                        className={cn(
                          "text-xs capitalize hover:bg-gray-500",
                          color,
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
                        <p className="">{entry.text}</p>
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
