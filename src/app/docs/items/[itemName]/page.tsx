import { use } from "react"; 
import React from "react";
import ItemDetailCard from "~/components/item-detail-card";


export default function ItemDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ itemName: string }>;
}) {
  const { itemName } = use(paramsPromise); 

  return <ItemDetailCard name={itemName} />;
}
