import React from "react";
import { cn } from "~/lib/utils";
import type { Type } from "~/types/types";

interface TypeBadgeProps {
  type: Type; // Use the Type interface from your types file
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-orange-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-gray-600",
  ghost: "bg-indigo-800",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <div
      className={cn(
        "flex h-6 w-18 items-center justify-center rounded-md px-2 py-1 text-xs font-bold text-white",
        typeColors[type.type.name] || "bg-gray-300", // Default color if type is unknown
      )}
    >
      {type.type.name.toLocaleUpperCase()}
    </div>
  );
}
