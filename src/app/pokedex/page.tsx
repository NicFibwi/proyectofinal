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
  {
    value: "",
    label: "All",
  },
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "fire",
    label: "Fire",
  },
  {
    value: "water",
    label: "Water",
  },
  {
    value: "electric",
    label: "Electric",
  },
  {
    value: "grass",
    label: "Grass",
  },
  {
    value: "ice",
    label: "Ice",
  },
  {
    value: "fighting",
    label: "Fighting",
  },
  {
    value: "poison",
    label: "Poison",
  },
  {
    value: "ground",
    label: "Ground",
  },
  {
    value: "flying",
    label: "Flying",
  },
  {
    value: "psychic",
    label: "Psychic",
  },
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "rock",
    label: "Rock",
  },
  {
    value: "ghost",
    label: "Ghost",
  },
  {
    value: "dragon",
    label: "Dragon",
  },
  {
    value: "dark",
    label: "Dark",
  },
  {
    value: "steel",
    label: "Steel",
  },
  {
    value: "fairy",
    label: "Fairy",
  },
];

const getAllPokemon = async (): Promise<PokemonList> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
  );

  return (await response.json()) as PokemonList;
};

interface Result {
  name: string;
  url: string;
}

const getPokemonByType = async (type: string): Promise<PokemonList> => {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon by type");
  }

  const data = (await response.json()) as { pokemon: { pokemon: Result }[] };
  return {
    count: 1025,
    next: "",
    previous: null,
    results: data.pokemon.map((p: { pokemon: Result }) => p.pokemon),
  };
};

function PokedexPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") ?? "");
  const [open, setOpen] = useState(false);

  const {
    data: pokemonList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemonlist", typeFilter],
    queryFn: async () => {
      if (typeFilter) {
        return getPokemonByType(typeFilter);
      }
      return getAllPokemon();
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (typeFilter) {
      params.set("type", typeFilter);
    } else {
      params.delete("type");
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/pokedex${newUrl}`, { scroll: false });
  }, [search, typeFilter, router, searchParams]);

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
          Database of essential information about Pokémon and game mechanics
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

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {typeFilter
                ? pokemonTypes.find((type) => type.value === typeFilter)?.label
                : "Select Pokémon type..."}
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
                        setTypeFilter(
                          currentValue === typeFilter ? "" : currentValue,
                        );
                        setOpen(false);
                      }}
                    >
                      {type.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          typeFilter === type.value
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
