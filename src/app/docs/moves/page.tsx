"use client";
import { useQuery } from "@tanstack/react-query";
import type { MoveCategory } from "~/types/types";
import MoveCardList from "~/components/move-from-category-card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

const getMoveCategories = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/move-category/");
  if (!response.ok) {
    throw new Error("Failed to fetch move categories");
  }
  return response.json() as Promise<MoveCategory>;
};

function MovesTablePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter values from URL
  const nameFilter = searchParams?.get("name") ?? "";
  const categoryFilter = searchParams?.get("category") ?? "";

  // Local state for input fields
  const [nameInput, setNameInput] = useState(nameFilter);

  const {
    data: moveCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ["moveCategories"],
    queryFn: getMoveCategories,
    staleTime: 1000 * 60 * 15,
  });

  // Update URL with filters
  const updateFilters = useCallback(
    (name: string, category: string) => {
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (category) params.set("category", category);

      router.push(`/docs/moves?${params.toString()}`);
    },
    [router],
  );

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    const categoryValue = value === "all" ? "" : value;
    updateFilters(nameInput, categoryValue);
  };

  // Handle name filter
  const handleNameFilter = () => {
    updateFilters(nameInput, categoryFilter);
  };

  // Handle clearing filters
  const clearFilters = () => {
    setNameInput("");
    router.push("/docs/moves");
  };

  // Filter categories based on selected category
  const filteredCategories = categoryFilter
    ? moveCategories?.results.filter((cat) => cat.name === categoryFilter)
    : moveCategories?.results;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Moves</h1>
        <p className="text-muted-foreground">
          Detailed documentation on all moves
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-card grid gap-4 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="w-full space-y-2">
            <Label htmlFor="name-filter">Move Name</Label>
            <Input
              id="name-filter"
              placeholder="Enter move name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameFilter()}
              className="w-full"
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {moveCategories?.results.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={clearFilters}>
            Reset
          </Button>
          <Button onClick={handleNameFilter}>Apply Filters</Button>
        </div>
      </div>

      {/* Active filters display */}
      {filteredCategories && (
        <p className="text-muted-foreground mb-4">
          Showing {filteredCategories.length} categories
        </p>
      )}

      {/* Move categories */}
      {isLoadingCategories ? (
        <div className="flex h-32 items-center justify-center">
          Loading categories...
        </div>
      ) : isErrorCategories ? (
        <div className="flex h-32 items-center justify-center">
          Error loading categories.
        </div>
      ) : filteredCategories?.length === 0 ? (
        <div className="flex h-32 items-center justify-center">
          No categories match your filters.
        </div>
      ) : (
        filteredCategories?.map((category) => (
          <div key={category.name} className="mb-0 w-full">
            <MoveCardList categoryUrl={category.url} nameFilter={nameFilter} />
          </div>
        ))
      )}
    </div>
  );
}

export default function MovesTablePage() {
  return (
    <Suspense>
      <MovesTablePageContent />
    </Suspense>
  );
}
