"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
import type { ItemCategory, ItemInfo, Result } from "~/types/types";
import { useState } from "react";

const fetchItems = async (): Promise<ItemInfo[]> => {
  const categoryResponse = await fetch(
    `https://pokeapi.co/api/v2/item-category/?offset=0&limit=54`,
  );
  if (!categoryResponse.ok) {
    throw new Error("Failed to fetch item categories");
  }

  const categoryData = (await categoryResponse.json()) as ItemCategory;
  const categories = categoryData.results.filter(
    (category: Result) => !category.url.includes("/37/"), // Skip "all-machines" category
  );

  const items: ItemInfo[] = [];
  for (const category of categories) {
    const categoryResponse = await fetch(category.url);
    if (!categoryResponse.ok) {
      throw new Error(`Failed to fetch items for category: ${category.name}`);
    }

    const categoryItems = (await categoryResponse.json()) as {
      items: ItemInfo[];
    };
    items.push(...categoryItems.items);
  }

  return items;
};

export default function ItemsPage() {
  const { data, isLoading, isError } = useQuery<ItemInfo[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 15,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

  // Memoize the sliced data
  const paginatedData = useMemo(() => {
    if (!data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const columns: ColumnDef<ItemInfo>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: "url",
      header: "Details",
      cell: (info) => (
        <div className="flex justify-end">
          <Link href={`/docs/items/${info.row.original.name}`}>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              View <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: paginatedData, // Use memoized paginated data
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
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
