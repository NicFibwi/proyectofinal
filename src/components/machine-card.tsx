"use client";

import { useQuery } from "@tanstack/react-query";
import type { MachineInfo, MachineItemInfo } from "~/types/types";
import { Card } from "./ui/card";
import Link from "next/link";
import { formatGenerationName } from "~/lib/utils";

const getMachineItemInfo = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch machine info from ${url}`);
  }
  return response.json() as Promise<MachineItemInfo>;
};

interface MachineCardProps {
  url?: string;
  machineInfo?: MachineInfo;
}

export default function MachineCard({ url, machineInfo }: MachineCardProps) {
  // If machineInfo is provided directly, use it
  // Otherwise fetch it using the URL
  const {
    data: fetchedMachineInfo,
    isLoading: isLoadingMachine,
    isError: isErrorMachine,
  } = useQuery<MachineInfo>({
    queryKey: ["machineInfo", url],
    queryFn: () => {
      if (!url) throw new Error("Machine URL is required");
      return fetch(url).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch machine info");
        return response.json();
      });
    },
    enabled: !!url && !machineInfo,
    staleTime: 1000 * 60 * 15,
  });

  // Use either the provided machineInfo or the fetched one
  const machine = machineInfo ?? fetchedMachineInfo;

  const {
    data: machineItemInfo,
    isLoading: isLoadingMachineInfo,
    isError: isErrorMachineInfo,
  } = useQuery({
    queryKey: ["machineItemInfo", machine?.item.url],
    queryFn: () => {
      const machineItemUrl = machine?.item.url;
      if (!machineItemUrl) {
        throw new Error("Machine URL is undefined");
      }
      return getMachineItemInfo(machineItemUrl);
    },
    enabled: !!machine,
    staleTime: 1000 * 60 * 15,
  });

  if ((isLoadingMachine && !machineInfo) || !machine) {
    return <Card className="p-4">Loading machine info</Card>;
  }

  if (isErrorMachine || isErrorMachineInfo) {
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
      <Card className="hover:bg-accent/50 mb-2 flex h-15 cursor-pointer flex-row items-center justify-between p-4 transition-colors">
        <div className="flex w-1/3 items-center justify-around">
          <span className="hidden w-1/2 sm:block">Machine:</span>
          <span className="w-1/2 font-semibold capitalize">
            {machine.item.name.replaceAll("-", " ").toLocaleUpperCase()}
          </span>
        </div>
        <div className="flex w-1/3 items-center justify-around">
          <span className="hidden w-1/3 sm:block">Move:</span>
          <span className="w-2/3 font-semibold capitalize">
            {machine.move.name.replaceAll("-", " ")}
          </span>
        </div>
        <div className="text-muted-foreground flex w-1/3 items-center justify-around">
          <span className="w-1/2 text-right">
            <span className="hidden sm:inline">Generation:</span>
            <span className="sm:hidden">Gen:</span>
          </span>
          <span className="w-1/2 text-right font-semibold capitalize text-xs md:text-lg">
            {formatGenerationName(machine.version_group.name)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
