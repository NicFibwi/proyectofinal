"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "http";
import MachineCard from "~/components/machine-card";
import type { AllMachines } from "~/types/types";

const fetchAllMachines = async (): Promise<AllMachines> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/item-category/all-machines`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch all machines");
  }
  return response.json() as Promise<AllMachines>;
};

export default function MachinePage() {
  const {
    data: allMachines,
    isLoading: isLoadingMachines,
    isError: isErrorMachines,
  } = useQuery({
    queryKey: ["allMachines"],
    queryFn: fetchAllMachines,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
        <p className="text-muted-foreground">
          Detailed documentation on all HMs, TMs and TRs
        </p>
      </div>
      {isLoadingMachines && <p>Loading...</p>}
      {isErrorMachines && <p>Error loading machines</p>}
      {allMachines && (
        <div>
          {allMachines.items.map((machine) => (
            <MachineCard url={machine.url} key={machine.url} />
          ))}
        </div>
      )}
    </div>
  );
}
