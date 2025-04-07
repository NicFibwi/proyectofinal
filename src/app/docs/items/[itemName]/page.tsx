import { use } from "react"; // Import the `use` hook to handle promises
import React from "react";
import ItemDetailCard from "~/components/item-detail-card";
import { Card } from "~/components/ui/card";
import type { ItemInfo } from "~/types/types";

export default function ItemDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ itemName: string }>;
}) {
  const { itemName } = use(paramsPromise); // Resolve the promise using `use`

  return <ItemDetailCard name={itemName} />;
}
