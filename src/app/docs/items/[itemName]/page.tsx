import { useQuery } from "@tanstack/react-query";
import React from "react";
import ItemDetailCard from "~/components/item-detail-card";
import { Card } from "~/components/ui/card";
import type { ItemInfo } from "~/types/types";

export default function ItemDetailPage({
  params,
}: {
  params: { itemName: string };
}) {
  const { itemName } = params; // Access the itemName directly from params

  return <ItemDetailCard name={itemName} />;
}
