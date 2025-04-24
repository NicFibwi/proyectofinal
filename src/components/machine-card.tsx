import { useQuery } from "@tanstack/react-query";
import type { MachineInfo, MachineItemInfo } from "~/types/types";
import { Card } from "./ui/card";
import Link from "next/link";

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
    data: machineItemInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["machineInfo", url],
    queryFn: () => getMachineItemInfo(url),
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: machineInfo,
    isLoading: isLoadingMachineInfo,
    isError: isErrorMachineInfo,
  } = useQuery({
    queryKey: ["machineItemInfo", machineItemInfo?.machines[0]?.machine.url],
    queryFn: () => {
      const machineUrl = machineItemInfo?.machines[0]?.machine.url;
      if (!machineUrl) {
        throw new Error("Machine URL is undefined");
      }
      return getMachineInfo(machineUrl);
    },
    enabled: !!machineItemInfo,
    staleTime: 1000 * 60 * 15,
  });

  if (isLoading) {
    return <Card className="p-4">Loading...</Card>;
  }

  if (isError || !machineInfo) {
    return <Card className="p-4">Failed to load machine info</Card>;
  }

  return (
    <Link href={`/docs/moves/${machineInfo.move.name}/`}>
      <Card className="flex h-15 cursor-pointer flex-row items-center justify-between p-4">
        <div className="flex w-1/3 justify-around">
          <span className="w-1/2">Machine:</span>
          <span className="w-1/2 capitalize">
            {machineItemInfo?.name.toUpperCase()}
          </span>
        </div>
        <div className="flex w-1/3 justify-around">
          <span className="w-1/2">Move:</span>
          <span className="w-1/2 capitalize">
            {machineInfo.move.name.replaceAll("-", " ")}
          </span>
        </div>
        <div className="flex w-1/3 justify-around">
          <span className="w-1/2">Generation:</span>
          <span className="w-1/2 capitalize">
            {machineInfo.version_group.name.replaceAll("-", " / ")}
          </span>
        </div>
      </Card>
    </Link>
  );
}
