"use client";

import type { MoveInfo } from "~/types/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, Zap, Target, Repeat } from "lucide-react";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { TypeBadge } from "./ui/typebadge";

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
    <Card className="mb-2 w-full p-0">
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
        <div className="flex items-center justify-around">
          <div className="flex items-center gap-1">
            <h3 className="min-w-28 text-base font-semibold capitalize">
              {moveInfo.name.replace("-", " ")}
            </h3>
          </div>

          <div className="flex items-center gap-1">
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

          <div className="flex items-center gap-1">
            {moveInfo?.damage_class?.name && (
              <img
                src={`/icons/${
                  moveInfo.damage_class.name === "status"
                    ? "status_move_icon"
                    : moveInfo.damage_class.name === "physical"
                      ? "physical_move_icon"
                      : "special_move_icon"
                }.png`}
                alt={`${moveInfo.damage_class.name} icon`}
                className="h-12 w-12"
                loading="lazy"
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium tabular-nums">
              Power: {moveInfo.power ?? "—"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium tabular-nums">
              {" "}
              Accuracy: {moveInfo.accuracy ? `${moveInfo.accuracy}%` : "—"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium tabular-nums">
              PP: {moveInfo.pp ?? "—"}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
