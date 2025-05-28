"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";

import { TypeBadge } from "./ui/typebadge";
import { cn } from "~/lib/utils";

// Type effectiveness chart (all keys lowercase for consistency)
const typeEffectivenessChart: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    grass: 2,
    ice: 2,
    bug: 2,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    rock: 0.5,
    dragon: 0.5,
  },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, ground: 0 },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    grass: 2,
    ground: 2,
    flying: 2,
    dragon: 2,
    fire: 0.5,
    water: 0.5,
    ice: 0.5,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: {
    grass: 2,
    fairy: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
  },
  ground: {
    fire: 2,
    electric: 2,
    poison: 2,
    rock: 2,
    steel: 2,
    grass: 0.5,
    bug: 0.5,
    flying: 0,
  },
  flying: {
    grass: 2,
    fighting: 2,
    bug: 2,
    electric: 0.5,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: {
    grass: 2,
    psychic: 2,
    dark: 2,
    fire: 0.5,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    flying: 2,
    bug: 2,
    fighting: 0.5,
    ground: 0.5,
    steel: 0.5,
  },
  ghost: { psychic: 2, ghost: 2, normal: 0, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: {
    ice: 2,
    rock: 2,
    fairy: 2,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    steel: 0.5,
  },
  fairy: {
    fighting: 2,
    dragon: 2,
    dark: 2,
    fire: 0.5,
    poison: 0.5,
    steel: 0.5,
  },
};

const allTypes = Object.keys(typeEffectivenessChart);
interface TypeEffectivenessTableProps {
  pokemonTypes: string[];
}

interface EffectivenessGroup {
  label: string;
  value: number;
  description: string;
  bgClass: string;
  textClass: string;
  types: string[];
}

const TypeEffectivenessTable: React.FC<TypeEffectivenessTableProps> = ({
  pokemonTypes,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const calculateEffectiveness = (attackingType: string): number => {
    const attackingTypeLower = attackingType.toLowerCase();

    // First check for any immunities (0× damage)
    for (const pokemonType of pokemonTypes) {
      const typeEffectiveness =
        typeEffectivenessChart[attackingTypeLower]?.[
          pokemonType.toLowerCase()
        ] ?? 1;
      if (typeEffectiveness === 0) { 
        return 0;
      }
    }

    // If no immunities, calculate the combined effectiveness normally
    return pokemonTypes.reduce((effectiveness, pokemonType) => {
      const typeEffectiveness =
        typeEffectivenessChart[attackingTypeLower]?.[
          pokemonType.toLowerCase()
        ] ?? 1;
      return effectiveness * typeEffectiveness;
    }, 1);
  };

  const effectivenessGroups = useMemo(() => {
    // Calculate effectiveness for all types
    const typeEffectiveness = allTypes.map((type) => ({
      type,
      effectiveness: calculateEffectiveness(type),
    }));

    // Define our effectiveness groups with theme-aware colors
    const groups: EffectivenessGroup[] = [
      {
        label: "Super Effective",
        value: 4,
        description: "4× damage",
        bgClass: "bg-emerald-800",
        textClass: "text-white",
        types: typeEffectiveness
          .filter((t) => t.effectiveness === 4)
          .map((t) => t.type),
      },
      {
        label: "Effective",
        value: 2,
        description: "2× damage",
        bgClass: "bg-green-400",
        textClass: "text-white",
        types: typeEffectiveness
          .filter((t) => t.effectiveness === 2)
          .map((t) => t.type),
      },
      {
        label: "Normal",
        value: 1,
        description: "1× damage",
        bgClass: isDark ? "bg-slate-700" : "bg-slate-200",
        textClass: isDark ? "text-white" : "text-slate-700",
        types: typeEffectiveness
          .filter((t) => t.effectiveness === 1)
          .map((t) => t.type),
      },
      {
        label: "Not Very Effective",
        value: 0.5,
        description: "0.5× damage",
        bgClass: "bg-orange-700",
        textClass: "text-white",
        types: typeEffectiveness
          .filter((t) => t.effectiveness === 0.5)
          .map((t) => t.type),
      },
      {
        label: "Barely Effective",
        value: 0.25,
        description: "0.25× damage",
        bgClass: "bg-red-800",
        textClass: "text-white",
        types: typeEffectiveness
          .filter((t) => t.effectiveness === 0.25)
          .map((t) => t.type),
      },
      {
        label: "No Effect",
        value: 0,
        description: "0× damage",
        bgClass: "bg-slate-900",
        textClass: "text-white",
        types: typeEffectiveness
          .filter((t) => t.effectiveness === 0)
          .map((t) => t.type),
      },
    ];

    return groups;
  }, [isDark, calculateEffectiveness]);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl overflow-hidden rounded-lg bg-transparent shadow-none",
      )}
    >
      <div>
        <div className="p-4">
          <div className="flex gap-2">
            <h3 className="text-lg font-bold">Type Effectiveness against :</h3>
            {pokemonTypes.map((type, index) => (
              <TypeBadge
                key={index}
                type={{
                  slot: index + 1,
                  type: { name: type.toLowerCase(), url: "#" },
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Effectiveness groups */}
      <div
        className={cn(
          "divide-y",
          isDark ? "divide-slate-700" : "divide-gray-200",
        )}
      >
        {effectivenessGroups.map(
          (group) =>
            group.types.length > 0 && (
              <div key={group.value} className="p-4">
                <div
                  className={cn(
                    "mb-4 flex items-center gap-3 rounded-lg p-3",
                    group.bgClass,
                  )}
                >
                  <div className={cn("rounded-full p-1.5")}></div>
                  <div>
                    <h4 className={cn("font-bold", group.textClass)}>
                      {group.label}
                    </h4>
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-opacity-80 text-white" : group.textClass,
                      )}
                    >
                      {" "}
                      {group.description}{" "}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.types.map((type) => (
                        <div key={type} className="flex flex-col items-center">
                          <TypeBadge
                            type={{
                              slot: 1,
                              type: { name: type.toLowerCase(), url: "#" },
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ),
        )}
        <div className="flex flex-row items-center justify-center gap-2 p-4 text-sm text-gray-500">
          <p>
            Effectiveness may change depending on the abilities the Pokemon has.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypeEffectivenessTable;
