import { use } from "react";
import MoveDetailCard from "~/components/move-detail-card";

export default function MovePage({
  params: paramsPromise,
}: {
  params: Promise<{ moveName: string }>;
}) {
  const { moveName } = use(paramsPromise); // Re
  console.log(moveName);

  return <MoveDetailCard name={moveName} />;
}
