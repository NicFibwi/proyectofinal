import { use } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";

export default function NavigationButtons({
  id,
  route,
  limit,
}: {
  id: number;
  route: string;
  limit: number;
}) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-row items-center justify-between">
      <div className="ml-6 flex flex-row items-center lg:w-1/5">
        <Button onClick={() => router.back()}>Back</Button>
      </div>
      <div className="flex flex-row items-center justify-around lg:w-1/5">
        {id > 1 && (
          <Button
            onClick={() => {
              const prevId = id - 1;
              router.push(`${prevId}`);
            }}
            title="Previous entry"
          >
            <SquareChevronLeft />#{id - 1}
          </Button>
        )}

        {id < limit && (
          <Button
            onClick={() => {
              const nextId = id + 1;
              router.push(`${nextId}`);
            }}
            title="Next entry"
          >
            #{id + 1}
            <SquareChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}
