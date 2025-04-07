"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
// import { Skeleton } from "~/components/ui/skeleton"

interface Item {
  name: string;
  url: string;
}

interface ItemResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
}

const fetchItems = async (
  page: number,
  limit: number,
): Promise<ItemResponse> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/item?offset=${page * limit}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
};

export default function ItemsPage() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["items", page],
    queryFn: () => fetchItems(page, limit),
    staleTime: 1000,
  });

  const formatItemName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const extractItemId = (url: string) => {
    const matches = url.match(/\/item\/(\d+)\//);
    return matches ? matches[1] : "";
  };

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: (info) => (
        <div className="font-medium">
          {formatItemName(info.getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: "url",
      header: "Details",
      cell: (info) => {
        const url = info.getValue() as string;
        const itemId = extractItemId(url);
        return (
          <div className="flex justify-end">
            <Link href={`/docs/items/${info.row.original.name}`}>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                View <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Badge variant="destructive" className="mb-2">
                Error
              </Badge>
              <h3 className="text-lg font-semibold">Failed to load items</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                There was a problem fetching the Pokémon items. Please try again
                later.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold">Pokémon Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-4">Is loading...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="font-semibold">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="hover:bg-muted/50 transition-colors"
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={!data?.previous}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">Page {page + 1}</span>
                  <span className="text-muted-foreground">of</span>
                  <span className="font-medium">
                    {Math.ceil((data?.count || 0) / limit)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!data?.next}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
