//the table of pokemon that can learn the move

import type { MoveInfo } from "~/types/types";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
export default function MovePokemonList({ move }: { move: MoveInfo }) {
  return (
    <Card>
      <CardContent>
        <div className="h-auto w-full">
          <h3 className="text-lg font-bold text-center">
            Pokemon that can learn this move
          </h3>
          <div className="mt-2 space-y-2">
            {move.learned_by_pokemon.map((pokemon) => (
              <Link href={`/pokedex/${pokemon.name}/`} key={pokemon.name}>
                <div
                  key={pokemon.name}
                  className="flex justify-between border-b-1 capitalize"
                >
                  <span>{pokemon.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
