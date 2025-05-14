"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavigationButtons({
  id,
  limit,
}: {
  id: number;
  route: string;
  limit: number;
}) {
  const router = useRouter();

  return (
    <div className="bg-background/80 sticky top-0 z-10 flex w-full items-center justify-between px-4 py-3 backdrop-blur-sm">
      {/* Left side - Back button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="hover:bg-muted flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Right side - Previous/Next buttons */}
      <div className="flex items-center justify-end gap-2">
        {id > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const prevId = id - 1;
              router.push(`${prevId}`);
            }}
            title="Previous entry"
            className="hover:bg-muted flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-medium">#{id - 1}</span>
          </Button>
        )}

        {id < limit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const nextId = id + 1;
              router.push(`${nextId}`);
            }}
            title="Next entry"
            className="hover:bg-muted flex items-center gap-1 transition-colors"
          >
            <span className="font-medium">#{id + 1}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
