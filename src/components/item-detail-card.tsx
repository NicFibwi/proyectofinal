"use client";
import type { ItemInfo } from "~/types/types";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const getItemData = async (name: string): Promise<ItemInfo> => {
  const response = await fetch("https://pokeapi.co/api/v2/item/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch item data");
  }
  return response.json() as Promise<ItemInfo>;
};

export default function ItemDetailCard({ name }: { name: string }) {
  const router = useRouter();

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["itemdata", name],
    queryFn: () => getItemData(name),
  });

  // Filter English flavor text entries
  const englishEntries = useMemo(() => {
    return (
      item?.flavor_text_entries
        ?.filter((entry) => entry.language.name === "en")
        .map((entry) => ({
          version: entry.version_group.name,
          text: entry.text.replace(/\f/g, " "),
        })) ?? []
    );
  }, [item?.flavor_text_entries]);

  // Get the first tab to use as default
  const defaultTab =
    englishEntries.length > 0 ? englishEntries[0]?.version : "";

  if (isLoading) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">Loading...</div>
      </Card>
    );
  }

  if (isError || !item) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center">
          Error loading item.
        </div>
      </Card>
    );
  }

  return (
    <div className="container h-full w-full">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="ml-6 flex flex-row items-center lg:w-1/5">
          <Button onClick={() => router.push("/docs/items/")}>Back</Button>
        </div>
        <div className="flex flex-row items-center justify-around lg:w-1/5">
          <Button
            onClick={() => {
              const prevItemId = item.id - 1;
              router.push(`${prevItemId}`);
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              const nextItemId = item.id + 1;
              router.push(`${nextItemId}`);
            }}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="container flex flex-col items-start lg:flex-row">
        {/* Sidebar Content */}
        <div className="flex w-full flex-col items-center justify-center sm:m-6 lg:w-1/3">
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <h5 className="text-lg font-bold capitalize">{item.name}</h5>
          </Card>
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <img
              src={item.sprites.default}
              alt={item.name}
              className="h-90 w-90"
            />
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col sm:m-6 md:w-full lg:w-2/3">
          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <p className="p-4">{item.effect_entries[0]?.effect}</p>
            <p className="text-sm italic">
              {item.effect_entries[0]?.short_effect}
            </p>
          </Card>

          <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
            <Tabs defaultValue={defaultTab} className="h-full w-full p-4">
              <TabsList className="mb-4 grid h-auto w-full grid-cols-3 flex-wrap">
                {englishEntries.map((entry) => (
                  <TabsTrigger
                    key={entry.version}
                    value={entry.version}
                    className="text-xs capitalize hover:bg-gray-500"
                  >
                    {entry.version
                      .replace(/-/g, " ")
                      .replace(/Lets Go\s*/gi, "LG ")
                      .replace(/Ultra\s*/gi, "U ")}
                  </TabsTrigger>
                ))}
              </TabsList>
              {englishEntries.map((entry) => (
                <TabsContent
                  key={entry.version}
                  value={entry.version}
                  className="mt-0"
                >
                  <Card className="w-full border-none bg-transparent shadow-none">
                    <CardContent className="p-4">
                      <p className="">{entry.text}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
