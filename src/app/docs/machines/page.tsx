"use client";

import PromisePool from "@supercharge/promise-pool";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import MachineCard from "~/components/machine-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { formatGenerationName } from "~/lib/utils";
import type { AllMachines, MachineInfo } from "~/types/types";

const fetchAllMachines = async (): Promise<AllMachines> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/machine/?offset=0&limit=2102`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch all machines");
  }
  return response.json() as Promise<AllMachines>;
};

const fetchMachineInfo = async (url: string): Promise<MachineInfo> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch machine info from ${url}`);
  }
  return response.json() as Promise<MachineInfo>;
};

function MachinePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter values from URL
  const generationFilter = searchParams?.get("generation") ?? "";
  const machineFilter = searchParams?.get("machine") ?? "";
  const moveFilter = searchParams?.get("move") ?? "";

  // Local state for form inputs
  const [generation, setGeneration] = useState(generationFilter);
  const [machineName, setMachineName] = useState(machineFilter);
  const [moveName, setMoveName] = useState(moveFilter);

  // Fetch all machines
  const {
    data: allMachines,
    isLoading: isLoadingMachines,
    isError: isErrorMachines,
  } = useQuery({
    queryKey: ["allMachines"],
    queryFn: fetchAllMachines,
    staleTime: 1000 * 60 * 15,
  });

  // Fetch machine details for each machine
  const {
    data: machineDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useQuery({
    queryKey: ["machineDetails", allMachines?.results],
    queryFn: async () => {
      if (!allMachines?.results) return [];

      const { results } = await PromisePool.withConcurrency(50) // Set concurrency limit
        .for(allMachines.results)
        .process(async (machine) => {
          try {
            return await fetchMachineInfo(machine.url);
          } catch (error) {
            console.error(
              `Failed to fetch machine info for ${machine.url}`,
              error,
            );
            return null; // Return null if a fetch fails
          }
        });

      return results.filter((machine) => machine !== null); // Filter out null results
    },
    enabled: !!allMachines?.results,
    staleTime: 1000 * 60 * 15,
  });

  // Apply filters
  const filteredMachines = machineDetails?.filter((machine) => {
    const matchesGeneration =
      !generationFilter ||
      machine.version_group.name.includes(generationFilter.toLowerCase());

    const matchesMachine =
      !machineFilter ||
      machine.item.name
        .toLowerCase()
        .replaceAll("-", " ")
        .includes(machineFilter.toLowerCase());

    const matchesMove =
      !moveFilter ||
      machine.move.name
        .toLowerCase()
        .replaceAll("-", " ")
        .includes(moveFilter.toLowerCase());

    return matchesGeneration && matchesMachine && matchesMove;
  });

  // Update URL with filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (generation) params.set("generation", generation);
    if (machineName) params.set("machine", machineName);
    if (moveName) params.set("move", moveName);

    router.push(`/docs/machines?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setGeneration("");
    setMachineName("");
    setMoveName("");
    router.push("/docs/machines");
  };

  // Get unique generations for the select dropdown
  const generations = machineDetails
    ? [...new Set(machineDetails.map((m) => m.version_group.name))]
        .sort()
        .map((gen) => ({ value: gen, label: formatGenerationName(gen) }))
    : [];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
        <p className="text-muted-foreground">
          Detailed documentation on all HMs, TMs and TRs
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-card grid gap-4 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="generation">Generation</Label>
            <Select value={generation} onValueChange={setGeneration}>
              <SelectTrigger id="generation">
                <SelectValue placeholder="Select generation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null as unknown as string}>
                  All Generations
                </SelectItem>
                {generations.map((gen) => (
                  <SelectItem key={gen.value} value={gen.value}>
                    {gen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="machine-name">Machine Name</Label>
            <Input
              id="machine-name"
              placeholder="TM01, HM05, etc."
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="move-name">Move Name</Label>
            <Input
              id="move-name"
              placeholder="Surf, Cut, etc."
              value={moveName}
              onChange={(e) => setMoveName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {(isLoadingMachines || isLoadingDetails) && (
        <div className="flex justify-center p-8">
          <p>Loading machines...</p>
        </div>
      )}

      {(isErrorMachines || isErrorDetails) && (
        <div className="text-destructive p-8">
          <p>Error loading machines</p>
        </div>
      )}

      {/* Results */}
      {filteredMachines && (
        <div>
          <p className="text-muted-foreground mb-4">
            Showing {filteredMachines.length} machines
          </p>
          <div className="space-y-2">
            {filteredMachines.map((machine) => {
              console.log(machine.version_group.name);
              return (
                <MachineCard
                  key={`${machine.id}-${machine.version_group.name}`}
                  machineInfo={machine}
                />
              );
            })}
          </div>

          {filteredMachines.length === 0 && (
            <div className="rounded-lg border p-8 text-center">
              <p>No machines found matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MachinePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MachinePageContent />
    </Suspense>
  );
}
