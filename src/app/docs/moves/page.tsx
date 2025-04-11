"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MoveCategory } from "~/types/types";
import MoveCardList from "~/components/move-from-category-card";

const getMoveCategories = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/move-category/");
  if (!response.ok) {
    throw new Error("Failed to fetch move categories");
  }
  return response.json() as Promise<MoveCategory>;
};

export default function MovesTablePage() {
  const {
    data: moveCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ["moveCategories"],
    queryFn: getMoveCategories,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? moveCategories?.results.filter(
        (category) => category.name === selectedCategory,
      )
    : moveCategories?.results;

  const filteredByType = selectedType
    ? filteredCategories?.filter((category) =>
        category.name.toLowerCase().includes(selectedType.toLowerCase()),
      )
    : filteredCategories;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
        <p className="text-muted-foreground">
          Database of essential information about Pokémon and game mechanics
        </p>
      </div>

      {/* Filter by Category */}
      <div className="mb-4">
        <label
          htmlFor="category-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by Category:
        </label>
        <select
          id="category-filter"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
        >
          <option value="">All Categories</option>
          {moveCategories?.results.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredByType?.map((category) => (
        <div key={category.name} className="mb-0 w-full">
          <MoveCardList categoryUrl={category.url} />
        </div>
      ))}
    </div>
  );
}
