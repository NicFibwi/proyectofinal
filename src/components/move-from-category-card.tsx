import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { IndependantMoveCategory, MoveInfo } from "~/types/types";
import { MoveCard } from "./move-card";

const getMoveListFromCategory = async (categoryUrl: string) => {
  const response = await fetch(categoryUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch move list");
  }
  return response.json() as Promise<IndependantMoveCategory>;
};

const getMoveInfo = async (moveUrl: string) => {
  const response = await fetch(moveUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch move info");
  }
  return response.json() as Promise<MoveInfo>;
};

export default function MoveCardList({ categoryUrl }: { categoryUrl: string }) {
  const {
    data: moveList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["moveInfo", categoryUrl],
    queryFn: () => getMoveListFromCategory(categoryUrl),
  });

  //   const {
  //     data: moveInfo,
  //     isLoading,
  //     isError,
  //   } = useQuery({
  //     queryKey: ["moveInfo", m],
  //     queryFn: () => getMoveInfo(moveList?.moves[0].url),
  //   });

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">Loading...</div>
    );
  }

  if (isError || !moveList) {
    return (
      <div className="flex h-32 items-center justify-center">
        Error loading move info.
      </div>
    );
  }

  return (
    <div className="container h-auto w-full">
      {moveList.moves.map((move) => (
        <MoveCard key={move.name} moveUrl={move.url} />
      ))}
    </div>
  );
}
