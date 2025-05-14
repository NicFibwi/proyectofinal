//the table of pokemon that can learn the move
import type { AbilityInfo } from "~/types/types";
import { Card, CardContent} from "./ui/card";
import Link from "next/link";
export default function AbilityPokemonList({
  ability,
}: {
  ability: AbilityInfo;
}) {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="h-auto w-full">
          <h3 className="text-center text-lg font-bold">
            Pokemon that learn this ability
          </h3>
          <div className="mt-2 space-y-2">
            {ability.pokemon.map((pokemon) => (
              <Link
                href={`/pokedex/${pokemon.pokemon.name}/`}
                key={pokemon.pokemon.name}
              >
                <div
                  key={pokemon.pokemon.name}
                  className="flex justify-between border-b-1 capitalize"
                >
                  <span>{pokemon.pokemon.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
