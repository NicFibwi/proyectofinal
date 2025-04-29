"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect, Suspense } from "react";
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
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { ItemCategory, ItemInfo, Result } from "~/types/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { PromisePool } from "@supercharge/promise-pool";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const fetchItems = async (): Promise<ItemInfo[]> => {
  const categoryResponse = await fetch(
    `https://pokeapi.co/api/v2/item-category/?offset=0&limit=54`,
  );
  if (!categoryResponse.ok) {
    throw new Error("Failed to fetch item categories");
  }

  const categoryData = (await categoryResponse.json()) as ItemCategory;
  const categories = categoryData.results.filter(
    (category: Result) => !category.url.includes("/37/"),
  );

  const items: ItemInfo[] = [];

  // Fetch all categories in parallel
  const categoryPromises = categories.map(async (category) => {
    const categoryResponse = await fetch(category.url);
    if (!categoryResponse.ok) {
      console.log(`Failed to fetch items for category: ${category.name}`);
      return [];
    }

    const categoryItems = (await categoryResponse.json()) as {
      items: { name: string; url: string }[];
    };

    const { results } = await PromisePool.withConcurrency(20)
      .for(categoryItems.items)
      .process(async (item) => {
        const itemResponse = await fetch(item.url);
        if (!itemResponse.ok) {
          console.log(`Failed to fetch item data for: ${item.name}`);
          return null;
        }

        const itemData = (await itemResponse.json()) as ItemInfo;
        if (
          (itemData.effect_entries[0]?.short_effect?.length ?? 0 > 0) ||
          (itemData.effect_entries[0]?.effect?.length ?? 0 > 0)
        ) {
          return itemData;
        }
        return null;
      });

    const resolvedItems = results.filter((item) => item !== null);
    items.push(...resolvedItems);
  });

  await Promise.all(categoryPromises);

  return items;
};

function ItemsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isLoading, isError } = useQuery<ItemInfo[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 30,
  });

  // Get initial values from URL search params
  const initialPage = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page")!, 10)
    : 1;
  const initialNameFilter = searchParams.get("name") ?? "";
  const initialCategoryFilter = searchParams.get("category") ?? "";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [nameFilter, setNameFilter] = useState(initialNameFilter);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  // Update URL when filters or pagination change
  const updateSearchParams = (params: {
    page?: number;
    name?: string;
    category?: string;
  }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update or remove parameters based on their values
    if (params.page && params.page > 1) {
      newSearchParams.set("page", params.page.toString());
    } else if (params.page === 1) {
      newSearchParams.delete("page");
    }

    if (params.name && params.name.trim() !== "") {
      newSearchParams.set("name", params.name);
    } else if (params.name === "") {
      newSearchParams.delete("name");
    }

    if (params.category && params.category !== "") {
      newSearchParams.set("category", params.category);
    } else if (params.category === "") {
      newSearchParams.delete("category");
    }

    // Update the URL without refreshing the page
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (data) {
      const categories = [...new Set(data.map((item) => item.category.name))];
      setUniqueCategories(categories.sort());
    }
  }, [data]);

  const itemsPerPage = 20;

  const totalPages = useMemo(() => {
    if (!data) return 0;

    const filtered = data.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const categoryMatch = categoryFilter
        ? item.category.name === categoryFilter
        : true;
      return nameMatch && categoryMatch;
    });

    return Math.ceil(filtered.length / itemsPerPage);
  }, [data, nameFilter, categoryFilter]);

  // Memoize the sliced data
  const filteredAndPaginatedData = useMemo(() => {
    if (!data) return [];

    // Apply filters
    const filtered = data.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const categoryMatch = categoryFilter
        ? item.category.name === categoryFilter
        : true;
      return nameMatch && categoryMatch;
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [data, currentPage, nameFilter, categoryFilter]);

  const columns: ColumnDef<ItemInfo>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: (info) => (
        <div className="font-medium">
          {(info.getValue() as string)
            .replace("Sp-", "Sp")
            .replaceAll("-", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </div>
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
    data: filteredAndPaginatedData,
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
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Items</h1>
        <p className="text-muted-foreground">
          Database of essential information about in-game Pokémon items
        </p>
      </div>
      <Card className="border-none shadow-sm">
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search by item name..."
                value={nameFilter}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNameFilter(newValue);
                  setCurrentPage(1); // Reset to first page on filter change
                  updateSearchParams({ name: newValue, page: 1 });
                }}
                className="pl-8"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1); // Reset to first page on filter change
                updateSearchParams({ category: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                  onClick={() => {
                    const newPage = currentPage - 1;
                    setCurrentPage(newPage);
                    updateSearchParams({ page: newPage });
                  }}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => {
                    const newPage = currentPage + 1;
                    setCurrentPage(newPage);
                    updateSearchParams({ page: newPage });
                  }}
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

export default function ItemsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemsPageContent />
    </Suspense>
  );
}
