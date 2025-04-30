"use client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { AbilityCard } from "~/components/ability-card";
import type { Ability, AbilityInfo } from "~/types/types";

const getAllAbilities = async (): Promise<Ability> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/ability/?offset=0&limit=367",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch abilities");
  }
  return response.json() as Promise<Ability>;
};

export default function AbilitiesListPage() {
  const {
    data: abilityList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["abilityInfo"],
    queryFn: () => getAllAbilities(),
  });

  console.log(abilityList?.results.length);
  return (
    <div className="container h-full w-full">
       <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Abilities</h1>
        <p className="text-muted-foreground">
          Detailed documentation on all pokemon abilities
        </p>
      </div>
      <div className="container w-full">
        {isLoading && (
          <div className="text-muted-foreground flex h-10 items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading ability info...</span>
          </div>
        )}
        {isError && (
          <div className="text-destructive flex h-10 items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading ability info</span>
          </div>
        )}
        {abilityList?.results.map((ability) => (
          <AbilityCard key={ability.name} abilityUrl={ability.url} />
        ))}
      </div>
    </div>
  );
}
