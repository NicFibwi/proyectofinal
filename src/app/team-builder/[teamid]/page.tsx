"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  deleteCustomPokemon,
  deleteEvSpread,
  deletePokemonMoves,
  getTeamByIdAndUserId,
  getMoveById,
  getCustomPokemonByTeamId,
  getItemById,
  getNatureById,
  getMovesByPokemonId,
  getBasePokemonById,
  getEvSpreadByTeamIdAndPokemonId,
} from "~/lib/team-builder-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AddPokemonDialog from "~/components/add-pokemon-dialog";
import NavigationButtons from "~/components/navigation-buttons";
import { useCallback } from "react";

import EditPokemonDialog from "~/components/edit-pokemon-dialog";
import { TeamExport } from "~/components/team-export-import";

interface EVStats {
  hp: number;
  attack: number;
  defense: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
}

export default function TeamPage() {
  const { user } = useUser();
  const params = useParams();
  const teamId = Number(params!.teamid);
  const [openDialog, setOpenDialog] = useState(false);
  const [pokeDetails, setPokeDetails] = useState<any | null>(null);

  // Fetch details when a Pokémon is selected
  const handleImageClick = useCallback(async (poke: any) => {
    setOpenDialog(true);

    // Fetch all details in parallel
    const [base, item, nature, moves, evs] = await Promise.all([
      getBasePokemonById(poke.pokedex_n),
      getItemById(poke.item_id),
      getNatureById(poke.nature_id),
      getMovesByPokemonId(poke.pokemon_id, poke.team_id),
      getEvSpreadByTeamIdAndPokemonId(poke.team_id, poke.pokemon_id), // <-- fetch EVs
    ]);

    // Get move names
    const moveNames = await Promise.all(
      (moves || []).map(async (m: any) => {
        const move = await getMoveById(m.move_id);
        return move?.name || "Unknown";
      }),
    );

    setPokeDetails({
      baseName: base?.name || "Unknown",
      item: item?.name || "None",
      nature: nature?.name || "None",
      moves: moveNames,
      nickname: poke.nickname,
      evs: evs || null, // <-- add EVs to details
    });
  }, []);

  const [team, setTeam] = useState<{
    team_id: number;
    user_id: string;
    team_name: string;
  }>();
  const [customPokemon, setCustomPokemon] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !teamId) return;

    const fetchTeam = async () => {
      const fetchedTeam = await getTeamByIdAndUserId(teamId, user.id);
      setTeam(fetchedTeam);
      if (fetchedTeam) {
        const pokes = await getCustomPokemonByTeamId(fetchedTeam.team_id);
        setCustomPokemon(pokes);
      }
    };

    fetchTeam();
  }, [user, teamId]);

  if (!team) {
    return <div>Loading...</div>;
  }

  if (team.user_id !== user!.id || !user) {
    return <div>You do not have access to this team.</div>;
  }

  const id = team.team_id as number;

  return (
    <div>
      <NavigationButtons id={0} route={""} limit={0} />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-extrabold">
                {team.team_name}
              </CardTitle>
              <CardDescription>
                Create and manage your Pokémon team with ease. Add, edit, or
                remove Pokémon and customize their moves.
              </CardDescription>
            </div>
            <TeamExport
              teamId={teamId}
              userId={user.id}
              teamName={team.team_name}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2">
            {customPokemon.map((poke) => (
              <Card key={poke.pokemon_id}>
                <CardHeader>
                  <CardTitle className="flex flex-row items-center justify-center">
                    <div className="mt-2 font-bold capitalize">
                      {poke.nickname || "----"}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-center">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.pokedex_n}.png`}
                    alt={poke.nickname}
                    className="h-24 w-24 cursor-pointer object-contain"
                    onClick={() => handleImageClick(poke)}
                  />
                </CardContent>
                <CardFooter className="flex flex-row items-end justify-end">
                  <Button
                    className="h-8 w-8 bg-red-500"
                    onClick={async () => {
                      await deletePokemonMoves(teamId, poke.pokemon_id);
                      await deleteEvSpread(teamId, poke.pokemon_id);
                      await deleteCustomPokemon(teamId, poke.pokemon_id);
                      const updatedPokes =
                        await getCustomPokemonByTeamId(teamId);
                      setCustomPokemon(updatedPokes);
                    }}
                  >
                    <Trash2 />
                  </Button>
                  <EditPokemonDialog
                    teamId={teamId}
                    pokemonId={poke.pokemon_id}
                  />
                </CardFooter>
              </Card>
            ))}
            {customPokemon.length < 6 &&
              Array.from({ length: 6 - customPokemon.length }).map(
                (_, index) => (
                  <Card key={`empty-card-${index}`}>
                    <div className="flex h-full flex-col items-center justify-center">
                      <img
                        src="/icons/transparent_pokeball.png"
                        alt="Empty Slot"
                        className="mb-2 h-24 w-24 object-contain"
                      />
                      <span className="text-secondary-foreground text-sm">
                        No pokemon here yet!
                      </span>
                    </div>
                  </Card>
                ),
              )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pokeDetails?.nickname || "Pokémon Details"}
            </DialogTitle>
          </DialogHeader>
          {pokeDetails ? (
            <div className="space-y-2">
              <div>
                <strong>Base Pokémon:</strong> {pokeDetails.baseName}
              </div>
              <div>
                <strong>Item:</strong> {pokeDetails.item}
              </div>
              <div>
                <strong>Nature:</strong> {pokeDetails.nature}
              </div>
              <div>
                <strong>Moves:</strong>
                <ul className="list-inside list-disc">
                  {pokeDetails.moves.length > 0 ? (
                    pokeDetails.moves.map((move: string, idx: number) => (
                      <li key={idx}>{move}</li>
                    ))
                  ) : (
                    <li>No moves</li>
                  )}
                </ul>
              </div>
              {pokeDetails.evs && (
                <div>
                  <strong>EVs:</strong>
                  <ul className="list-inside list-disc">
                    <li>HP: {pokeDetails.evs.hp}</li>
                    <li>Attack: {pokeDetails.evs.attack}</li>
                    <li>Defense: {pokeDetails.evs.defense}</li>
                    <li>Special Attack: {pokeDetails.evs["sp_attack"]}</li>
                    <li>Special Defense: {pokeDetails.evs["sp_defense"]}</li>
                    <li>Speed: {pokeDetails.evs.speed}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold">
            Add a pokemon to {team.team_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full justify-center">
          <div className="flex w-2/3">
            <AddPokemonDialog team_id={id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
