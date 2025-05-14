import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { IndependantMoveCategory } from "~/types/types";
import { MoveCard } from "./move-card";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";

const getMoveListFromCategory = async (categoryUrl: string) => {
  const response = await fetch(categoryUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch move list");
  }
  return response.json() as Promise<IndependantMoveCategory>;
};

interface MoveCardListProps {
  categoryUrl: string;
  nameFilter?: string;
}

function MoveCardList({ categoryUrl, nameFilter = "" }: MoveCardListProps) {
  const queryClient = useQueryClient();
  const debouncedCategoryUrl = useDebouncedValue(categoryUrl, 300);

  // Prefetch data for the category URL
  React.useEffect(() => {
    if (categoryUrl) {
      void queryClient.prefetchQuery({
        queryKey: ["moveInfo", categoryUrl],
        queryFn: () => getMoveListFromCategory(categoryUrl),
      });
    }
  }, [categoryUrl, queryClient]);

  const {
    data: moveList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["moveInfo", debouncedCategoryUrl, nameFilter],
    queryFn: () => getMoveListFromCategory(debouncedCategoryUrl),
    enabled: !!debouncedCategoryUrl,
    staleTime: 1000 * 60 * 15,
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
        move.name
          .toLowerCase()
          .replaceAll("-", " ")
          .includes(nameFilter.toLowerCase().replaceAll("-", " ")),
      )
    : moveList.moves;

  // if (filteredMoves.length === 0) {
  //   return (
  //     <div className="container h-auto w-full">
  //       <div className="text-muted-foreground py-4 text-sm">
  //         No moves found in this category matching &quot;{nameFilter}&quot;.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container h-auto w-full">
      {filteredMoves.map((move) => (
        <MoveCard key={move.name} moveUrl={move.url} />
      ))}
    </div>
  );
}

export default React.memo(MoveCardList);
