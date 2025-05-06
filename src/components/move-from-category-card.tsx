import { useQuery } from "@tanstack/react-query";
import type { IndependantMoveCategory } from "~/types/types";
import { MoveCard } from "./move-card";

const getMoveListFromCategory = async (categoryUrl: string) => {
  const response = await fetch(categoryUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch move list");
  }
  return response.json() as Promise<IndependantMoveCategory>;
};

export default function MoveCardList({
  categoryUrl,
  nameFilter = "",
}: {
  categoryUrl: string;
  nameFilter?: string;
}) {
  const {
    data: moveList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["moveInfo", categoryUrl, nameFilter],
    queryFn: () => getMoveListFromCategory(categoryUrl),
  });

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

  // Filter moves by name if nameFilter is provided
  const filteredMoves = nameFilter
    ? moveList.moves.filter((move) =>
        move.name.toLowerCase().includes(nameFilter.toLowerCase()),
      )
    : moveList.moves;

  if (filteredMoves.length === 0) {
    return (
      <div className="container h-auto w-full">
        <div className="text-muted-foreground py-4 text-sm">
          No moves found in this category matching &quot;{nameFilter}&quot;.
        </div>
      </div>
    );
  }

  return (
    <div className="container h-auto w-full">
      {filteredMoves.map((move) => (
        <MoveCard key={move.name} moveUrl={move.url} />
      ))}
    </div>
  );
}
