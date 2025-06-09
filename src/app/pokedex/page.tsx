"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import type { PokemonList } from "~/types/types";
import PokemonCard from "~/components/pokemoncard";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "~/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";

const pokemonTypes = [
  { value: "", label: "All" },
  { value: "normal", label: "Normal" },
  { value: "fire", label: "Fire" },
  { value: "water", label: "Water" },
  { value: "electric", label: "Electric" },
  { value: "grass", label: "Grass" },
  { value: "ice", label: "Ice" },
  { value: "fighting", label: "Fighting" },
  { value: "poison", label: "Poison" },
  { value: "ground", label: "Ground" },
  { value: "flying", label: "Flying" },
  { value: "psychic", label: "Psychic" },
  { value: "bug", label: "Bug" },
  { value: "rock", label: "Rock" },
  { value: "ghost", label: "Ghost" },
  { value: "dragon", label: "Dragon" },
  { value: "dark", label: "Dark" },
  { value: "steel", label: "Steel" },
  { value: "fairy", label: "Fairy" },
];

const pokemonGenerations = [
  { value: "1", label: "I" },
  { value: "2", label: "II" },
  { value: "3", label: "III" },
  { value: "4", label: "IV" },
  { value: "5", label: "V" },
  { value: "6", label: "VI" },
  { value: "7", label: "VII" },
  { value: "8", label: "VIII" },
  { value: "9", label: "IX" },
];

const getPokemonByGeneration = async (
  generation: string,
): Promise<PokemonList> => {
  const generationEndpoints: Record<string, string> = {
    "1": "https://pokeapi.co/api/v2/pokemon?offset=0&limit=151",
    "2": "https://pokeapi.co/api/v2/pokemon?offset=151&limit=100",
    "3": "https://pokeapi.co/api/v2/pokemon?offset=251&limit=135",
    "4": "https://pokeapi.co/api/v2/pokemon?offset=386&limit=107",
    "5": "https://pokeapi.co/api/v2/pokemon?offset=493&limit=156",
    "6": "https://pokeapi.co/api/v2/pokemon?offset=649&limit=72",
    "7": "https://pokeapi.co/api/v2/pokemon?offset=721&limit=88",
    "8": "https://pokeapi.co/api/v2/pokemon?offset=809&limit=96",
    "9": "https://pokeapi.co/api/v2/pokemon?offset=905&limit=120",
  };

  const endpoint = generationEndpoints[generation];
  if (!endpoint) {
    throw new Error(`Invalid generation: ${generation}`);
  }
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon by generation");
  }

  return (await response.json()) as PokemonList;
};

const getAllPokemon = async (): Promise<PokemonList> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
  );
  return (await response.json()) as PokemonList;
};

const getPokemonByType = async (type: string): Promise<PokemonList> => {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon by type");
  }

  const data = (await response.json()) as {
    pokemon: { pokemon: { name: string; url: string } }[];
  };
  return {
    count: data.pokemon.length,
    next: "",
    previous: null,
    results: data.pokemon.map((p) => p.pokemon),
  };
};

function PokedexPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get("search") ?? "");
  const [typeFilter, setTypeFilter] = useState<string[]>(
    searchParams?.get("type")?.split(",") ?? [],
  );
  const [generationFilter, setGenerationFilter] = useState<string[]>(
    searchParams?.get("generation")?.split(",") ?? [],
  );
  const [openType, setOpenType] = useState(false);
  const [openGeneration, setOpenGeneration] = useState(false);

  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemonlist", typeFilter, generationFilter],
    queryFn: async () => {
      let allPokemon: { name: string; url: string }[] = [];

      // Fetch Pokémon by generation if a generation filter is applied
      if (generationFilter.length > 0) {
        const generationPromises = generationFilter.map((gen) =>
          getPokemonByGeneration(gen),
        );
        const generationResults = await Promise.all(generationPromises);
        allPokemon = generationResults.flatMap((gen) => gen.results);
      } else {
        // Fetch all Pokémon if no generation filter is applied
        const allPokemonData = await getAllPokemon();
        allPokemon = allPokemonData.results;
      }

      // Apply type filtering if a type filter is applied
      if (typeFilter.length > 0) {
        const typePromises = typeFilter.map((type) => getPokemonByType(type));
        const typeResults = await Promise.all(typePromises);

        // Create a map of Pokémon names for each type
        const typeSets = typeResults.map(
          (type) => new Set(type.results.map((p) => p.name)),
        );

        // If two types are selected, filter Pokémon that have both types
        if (typeFilter.length === 2) {
          const [typeSet1, typeSet2] = typeSets;
          allPokemon = allPokemon.filter(
            (p) => typeSet1?.has(p.name) && typeSet2?.has(p.name),
          );
        } else {
          // If only one type is selected, filter Pokémon that have that type
          const [typeSet] = typeSets;
          allPokemon = allPokemon.filter((p) => typeSet?.has(p.name));
        }
      }

      return {
        count: allPokemon.length,
        next: null,
        previous: null,
        results: allPokemon,
      };
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (typeFilter.length > 0) {
      params.set("type", typeFilter.join(","));
    } else {
      params.delete("type");
    }

    if (generationFilter.length > 0) {
      params.set("generation", generationFilter.join(","));
    } else {
      params.delete("generation");
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/pokedex${newUrl}`, { scroll: false });
  }, [search, typeFilter, generationFilter, router, searchParams]);

  if (isError || !pokemonList) {
    return <div>Error loading Pokémon list.</div>;
  }

  const filteredPokemon = pokemonList.results.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
        <p className="text-muted-foreground">
          Database of essential information about Pokémon and their variants.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search Pokémon by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="pl-8"
        />

        {/* Type Filter */}
        <Popover open={openType} onOpenChange={setOpenType}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openType}
              className="justify-between"
            >
              {typeFilter.length > 0
                ? typeFilter
                    .map(
                      (type) =>
                        pokemonTypes.find((t) => t.value === type)?.label ??
                        type,
                    )
                    .join(", ")
                : "Select type..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search Pokémon type..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No Pokémon type found.</CommandEmpty>
                <CommandGroup>
                  {pokemonTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(currentValue) => {
                        setTypeFilter((prev) => {
                          if (prev.includes(currentValue)) {
                            return prev.filter((t) => t !== currentValue);
                          } else if (prev.length < 2) {
                            return [...prev, currentValue];
                          }
                          return prev;
                        });
                        setOpenType(false);
                      }}
                    >
                      {type.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          typeFilter.includes(type.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Generation Filter */}
        <Popover open={openGeneration} onOpenChange={setOpenGeneration}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openGeneration}
              className="justify-between"
            >
              {generationFilter.length > 0
                ? generationFilter
                    .map(
                      (gen) =>
                        pokemonGenerations.find((g) => g.value === gen)
                          ?.label ?? gen,
                    )
                    .join(", ")
                : "Select generation..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search Pokémon generation..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No Pokémon generation found.</CommandEmpty>
                <CommandGroup>
                  {pokemonGenerations.map((gen) => (
                    <CommandItem
                      key={gen.value}
                      value={gen.value}
                      onSelect={(currentValue) => {
                        setGenerationFilter((prev) => {
                          if (prev.includes(currentValue)) {
                            return prev.filter((g) => g !== currentValue);
                          } else {
                            return [...prev, currentValue];
                          }
                        });
                        setOpenGeneration(false);
                      }}
                    >
                      {gen.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          generationFilter.includes(gen.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))
          : filteredPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.name} url={pokemon.url} />
            ))}
      </div>
    </div>
  );
}

export default function PokedexPage() {
  return (
    <Suspense fallback={<Skeleton className="h-32" />}>
      <PokedexPageContent />
    </Suspense>
  );
}
