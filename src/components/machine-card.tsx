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

const getMachineInfo = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch machine info from ${url}`);
  }
  return response.json() as Promise<MachineInfo>;
};

export default function MachineCard({ url }: { url: string }) {
  const {
    data: machineInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["machineInfo", url],
    queryFn: () => getMachineInfo(url),
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: machineItemInfo,
    isLoading: isLoadingMachineInfo,
    isError: isErrorMachineInfo,
  } = useQuery({
    queryKey: ["machineItemInfo", machineInfo?.item.url],
    queryFn: () => {
      const machineItemUrl = machineInfo?.item.url;
      if (!machineItemUrl) {
        throw new Error("Machine URL is undefined");
      }
      return getMachineItemInfo(machineItemUrl);
    },
    enabled: !!machineInfo,
    staleTime: 1000 * 60 * 15,
  });

  if (isLoading || !machineInfo) {
    return <Card className="p-4">Loading machine info</Card>;
  }

  if (isError || isErrorMachineInfo) {
    return (
      <Card className="p-4">
        <div className="text-destructive flex h-10 items-center gap-2">
          <span>Error loading machine info</span>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/docs/moves/${machineInfo.move.name}/`}>
      <Card className="mb-2 flex h-15 cursor-pointer flex-row items-center justify-between p-4">
        <div className="flex w-1/3 items-center justify-around">
          <span className="hidden w-1/2 sm:block">Machine:</span>
          <span className="w-1/2 font-semibold capitalize">
            {machineInfo.item.name.replaceAll("-", " ").toLocaleUpperCase()}
          </span>
        </div>
        <div className="flex w-1/3 items-center justify-around">
          <span className="hidden w-1/3 sm:block">Move:</span>
          <span className="w-2/3 font-semibold capitalize">
            {machineInfo.move.name.replaceAll("-", " ")}
          </span>
        </div>
        <div className="text-muted-foreground flex w-1/3 items-center justify-around">
          <span className="w-1/2 text-right">
            <span className="hidden sm:inline">Generation:</span>
            <span className="sm:hidden">Gen:</span>
          </span>
          <span className="w-1/2 text-right font-semibold capitalize">
            {formatGenerationName(machineInfo.version_group.name)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
