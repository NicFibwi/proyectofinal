import { use } from "react";
import AbilityDetailCard from "~/components/ability-detail-card";

export default function AbilityPage({
  params: paramsPromise,
}: {
  params: Promise<{ abilityName: string }>;
}) {
  const { abilityName } = use(paramsPromise); // Re

  return <AbilityDetailCard name={abilityName} />;
}
