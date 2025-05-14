"use client";

import type { MoveInfo } from "~/types/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "~/components/ui/card";
import { TypeBadge } from "./ui/typebadge";
import Link from "next/link";
import { typeColors } from "./ui/typebadge"; // Import typeColors from TypeBadge
import Image from "next/image";

const getMoveInfo = async (moveUrl: string) => {
  const response = await fetch(moveUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch move info");
  }
  return response.json() as Promise<MoveInfo>;
};

export function MoveCard({ moveUrl }: { moveUrl: string }) {
  const {
    data: moveInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["moveInfo", moveUrl],
    queryFn: () => getMoveInfo(moveUrl),
  });

  return (
    <Link href={`/docs/moves/${moveInfo?.name}/`}>
      <Card className="mb-2 h-15 w-full">
        {isLoading && (
          <div className="text-muted-foreground flex h-10 items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading move info...</span>
          </div>
        )}

        {isError && (
          <div className="text-destructive flex h-10 items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading move info</span>
          </div>
        )}

        {moveInfo && (
          <div className="flex h-full w-full items-center justify-around">
            <div className="flex w-1/6 items-center justify-center gap-1">
              <h4
                className={`min-w-28 rounded-md px-2 py-1 text-base font-semibold capitalize ${
                  typeColors[moveInfo.type.name.toLowerCase()] &&
                  "sm:bg-gray-300 sm:text-black"
                } ${
                  typeColors[moveInfo.type.name.toLowerCase()] ?? "bg-gray-300"
                }`}
              >
                {moveInfo.name
                  .replace("-", " ")
                  .replace("--special", "")
                  .replace("--physical", "")}
              </h4>
            </div>

            <div className="hidden w-1/6 items-center justify-center gap-1 sm:flex">
              <TypeBadge
                type={{
                  slot: 0,
                  type: {
                    name: moveInfo.type.name.toLowerCase(),
                    url: "#",
                  },
                }}
              />
            </div>

            <div className="flex w-1/6 items-center justify-center gap-1">
              <span className="text-sm font-medium tabular-nums">
                <span
                  className={`${
                    moveInfo.damage_class.name === "special"
                      ? "text-blue-500"
                      : moveInfo.damage_class.name === "physical"
                        ? "text-orange-500"
                        : ""
                  }`}
                >
                  {`Power: ${moveInfo.power ?? "—"}`}
                </span>
              </span>
            </div>

            <div className="flex w-1/6 items-center justify-center gap-1">
              <span className="text-sm font-medium tabular-nums">
                {`Accuracy: ${moveInfo.accuracy ?? "—"}`}
              </span>
            </div>

            <div className="hidden w-1/6 items-center justify-center gap-1 sm:flex">
              <span className="text-sm font-medium tabular-nums">
                PP: {moveInfo.pp ?? "—"}
              </span>
            </div>

            <div className="hidden w-1/6 items-center justify-center gap-1 sm:flex">
              {moveInfo?.damage_class?.name && (
                <Image
                  src={`/icons/${
                    moveInfo.damage_class.name === "status"
                      ? "status_move_icon"
                      : moveInfo.damage_class.name === "physical"
                        ? "physical_move_icon"
                        : "special_move_icon"
                  }.png`}
                  alt={`${moveInfo.damage_class.name} icon`}
                  loading="lazy"
                  height={12}
                  width={12}
                />
              )}
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
