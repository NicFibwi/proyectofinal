"use client";

import type { AbilityInfo } from "~/types/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";

const getAbilityInfo = async (url: string): Promise<AbilityInfo> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch ability data");
  }
  return response.json() as Promise<AbilityInfo>;
};

export function AbilityCard({ abilityUrl }: { abilityUrl: string }) {
  const {
    data: abilityInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["abilityInfo", abilityUrl],
    queryFn: () => getAbilityInfo(abilityUrl),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <Link href={`/docs/abilities/${abilityInfo?.name ?? ""}/`}>
      {(abilityInfo?.effect_entries?.length ?? 0) > 0 && (
        <Card className="mb-2 h-17 w-full p-2">
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

          {abilityInfo && (
            <CardContent className="flex h-full w-full flex-row items-center justify-between">
              {/* Ability Name */}
              <div className="mr-0.5 text-lg font-bold capitalize">
                {abilityInfo.name.replaceAll("-", " ")}
              </div>

              {/* Short Description */}
              <div className="m:text-sm overflow-x-auto text-right text-xs text-gray-600">
                {abilityInfo.effect_entries.find(
                  (entry) => entry.language.name === "en",
                )?.short_effect ?? "Not a main game ability"}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </Link>
  );
}
