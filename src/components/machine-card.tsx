"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { MachineInfo } from "~/types/types";
import { Card } from "./ui/card";
import Link from "next/link";
import { formatGenerationName } from "~/lib/utils";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";

interface MachineCardProps {
  url?: string;
  machineInfo?: MachineInfo;
}

function MachineCard({ url, machineInfo }: MachineCardProps) {
  const debouncedUrl = useDebouncedValue(url, 300);

  const {
    data: fetchedMachineInfo,
    isLoading: isLoadingMachine,
    isError: isErrorMachine,
  } = useQuery<MachineInfo>({
    queryKey: ["machineInfo", debouncedUrl],
    queryFn: () => {
      if (!debouncedUrl) throw new Error("Machine URL is required");
      return fetch(debouncedUrl).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch machine info");
        return response.json();
      });
    },
    enabled: !!debouncedUrl && !machineInfo,
    staleTime: 1000 * 60 * 15,
  });

  const machine = machineInfo ?? fetchedMachineInfo;

  if ((isLoadingMachine && !machineInfo) || !machine) {
    return <Card className="p-4">Loading machine info...</Card>;
  }

  if (isErrorMachine) {
    return (
      <Card className="p-4">
        <div className="text-destructive flex h-10 items-center gap-2">
          <span>Error loading machine info</span>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/docs/moves/${machine.move.name}/`}>
      <Card className="hover:bg-accent/50 mb-2 flex h-auto cursor-pointer flex-row items-center justify-between p-4 transition-colors">
        <div className="flex w-full items-center justify-around sm:w-1/3">
          <span className="hidden w-1/2 sm:block">Machine:</span>
          <span className="w-1/2 font-semibold capitalize">
            {machine.item.name.replaceAll("-", " ").toLocaleUpperCase()}
          </span>
        </div>
        <div className="flex w-full items-center justify-around sm:w-1/3">
          <span className="hidden w-1/3 sm:block">Move:</span>
          <span className="w-2/3 font-semibold capitalize">
            {machine.move.name.replaceAll("-", " ")}
          </span>
        </div>
        <div className="text-muted-foreground flex w-full items-center justify-around sm:w-1/3">
          <span className="w-1/2 text-right">
            <span className="hidden sm:inline">Generation:</span>
            <span className="sm:hidden">Gen:</span>
          </span>
          <span className="w-1/2 text-right text-xs font-semibold capitalize md:text-lg">
            {formatGenerationName(machine.version_group.name)}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default React.memo(MachineCard);
