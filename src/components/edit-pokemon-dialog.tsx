/* eslint-disable */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type {

  Pokemon,

} from "~/types/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { cn } from "~/lib/utils";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "./ui/button";
import { TypeBadge } from "./ui/typebadge";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  getCustomPokemonByTeamIdAndPokemonId,
  getBasePokemonById,
  getEvSpreadByTeamIdAndPokemonId,
  getMoveById,
  getAbilityById,
  getItemById,
  getNatureById,
  createMove,
  createAbility,
  createItem,
  createNature,
  updateCustomPokemon,
  updateEvSpread,
  deletePokemonMoves,
  addPokemonMove,
  getPokemonMovesFull,
} from "~/lib/team-builder-actions";
import {
  getMoveData,
  getAbilityData,
  getItemData,
  getNatureData,
  getAllItems,
  getAllNatures,
} from "./add-pokemon-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";

interface EVStats {
  hp: number;
  attack: number;
  defense: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
}

export default function EditPokemonDialog({
  teamId,
  pokemonId,
  onSaved,
}: {
  teamId: number;
  pokemonId: number;
  onSaved?: () => void;
}) {
  // State
  const [open, setOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [nickname, setNickname] = useState("");
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [selectedAbility, setSelectedAbility] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedNature, setSelectedNature] = useState("");

  const [evs, setEvs] = useState<EVStats>({
    hp: 0,
    attack: 0,
    defense: 0,
    "special-attack": 0,
    "special-defense": 0,
    speed: 0,
  });

  const { data: allItems } = useQuery({
    queryKey: ["allItems"],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  const { data: allNatures } = useQuery({
    queryKey: ["allNatures"],
    queryFn: getAllNatures,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  // Load all data on open
  useEffect(() => {
    if (!open) return;
    (async () => {
      // Get custom pokemon row
      const custom = await getCustomPokemonByTeamIdAndPokemonId(
        teamId,
        pokemonId,
      );
      if (!custom) return;
      setNickname(custom.nickname);

      // Get base pokemon info
      const base = await getBasePokemonById(custom.pokedex_n);
      // Fetch from pokeapi for moves/abilities/types
      const pokeApi = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${base!.name}`,
      ).then((r) => r.json());
      setSelectedPokemon(pokeApi);

      //   Moves
      const movesFull = await getPokemonMovesFull(pokemonId, teamId);
      setSelectedMoves(movesFull.map((m: any) => m.name));

      //   Abilities
      //   const abilities = await getAllAbilitiesForPokemon(custom.pokedex_n);
      //   // Try to find the selected ability by id

      //   setSelectedAbility(selectedAbilityObj?.name || abilities[0]?.name || "");

      // Item
      const item = await getItemById(custom.item_id);
      setSelectedItem(item?.name || "");

      // Nature
      const nature = await getNatureById(custom.nature_id);
      setSelectedNature(nature?.name || "");

      // EVs
      const ev = await getEvSpreadByTeamIdAndPokemonId(teamId, pokemonId);
      setEvs({
        hp: ev?.hp || 0,
        attack: ev?.attack || 0,
        defense: ev?.defense || 0,
        "special-attack": ev?.sp_attack || 0,
        "special-defense": ev?.sp_defense || 0,
        speed: ev?.speed || 0,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, teamId, pokemonId]);

  // Handlers
  const handleMoveToggle = (moveName: string) => {
    setSelectedMoves((prev) => {
      if (prev.includes(moveName)) {
        return prev.filter((move) => move !== moveName);
      } else if (prev.length < 4) {
        return [...prev, moveName];
      }
      return prev;
    });
  };

  const handleEVChange = (stat: keyof EVStats, value: number) => {
    const newValue = Math.max(0, Math.min(252, value));
    const newEvs = { ...evs, [stat]: newValue };
    const totalEvs = Object.values(newEvs).reduce((sum, ev) => sum + ev, 0);
    if (totalEvs <= 510) setEvs(newEvs);
  };

  const getTotalEvs = () => Object.values(evs).reduce((sum, ev) => sum + ev, 0);

  // Save handler
  const handleSave = async () => {
    if (!selectedPokemon) return;

    // --- Ensure all referenced data exists in DB ---
    // Moves
    for (const moveName of selectedMoves) {
      const moveData = await getMoveData(moveName);
      const existingMove = await getMoveById(moveData.id);
      if (!existingMove) await createMove(moveData);
    }
    // Ability
    const abilityData = await getAbilityData(selectedAbility);
    const existingAbility = await getAbilityById(abilityData.id);
    if (!existingAbility) await createAbility(abilityData);

    // Item
    const itemData = await getItemData(selectedItem);
    const existingItem = await getItemById(itemData.id);
    if (!existingItem) await createItem(itemData);

    // Nature
    const natureData = await getNatureData(selectedNature);
    const existingNature = await getNatureById(natureData.id);
    if (!existingNature) await createNature(natureData);

    // --- Update custom pokemon ---
    await updateCustomPokemon(
      teamId,
      pokemonId,
      selectedPokemon.id,
      nickname || selectedPokemon.name.replaceAll("-", " "),
      natureData.id,  
      itemData.id,
    );

    // --- Update EVs ---
    await updateEvSpread(
      teamId,
      pokemonId,
      evs.hp,
      evs.attack,
      evs.defense,
      evs["special-attack"],
      evs["special-defense"],
      evs.speed,
    );

    // --- Update Moves ---
    await deletePokemonMoves(teamId, pokemonId);
    for (let i = 0; i < selectedMoves.length; i++) {
      const moveName = selectedMoves[i];
      const moveData = await getMoveData(moveName!);
      await addPokemonMove(pokemonId, teamId, moveData.id, i + 1);
    }

    setOpen(false);
    if (onSaved) onSaved();
  };

  // UI
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 h-8 w-8 bg-blue-400">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pokémon</DialogTitle>
          <DialogDescription>
            Modify the details of your Pokémon.
          </DialogDescription>
        </DialogHeader>
        {selectedPokemon && (
          <div>
            {/* Basic info */}
            <div className="mb-6 flex flex-col items-center space-y-4 border-b-2 pb-2">
              <div className="relative">
                <img
                  src={
                    selectedPokemon?.sprites?.other?.["official-artwork"]
                      .front_default || selectedPokemon.sprites.front_default
                  }
                  alt={selectedPokemon.name}
                  className="h-48 w-48 cursor-pointer object-contain"
                  crossOrigin="anonymous"
                  onClick={() =>
                    window.open(`/pokedex/${selectedPokemon.name}`, "_blank")
                  }
                />
              </div>
              <div className="flex gap-2">
                {selectedPokemon.types.map((type) => (
                  <TypeBadge type={type} key={type.type.name} />
                ))}
              </div>
            </div>

            {/* Nickname */}
            <div className="mb-6 space-y-2 border-b-2 pb-2">
              <Label htmlFor="nickname" className="mb-4">
                Nickname
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={`Enter nickname for ${selectedPokemon.name}`}
              />
            </div>

            {/* Moves */}
            <div className="mb-6 space-y-2 border-b-2 pb-2">
              <Label className="mb-4">Moves ({selectedMoves.length}/4)</Label>
              <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2">
                {selectedPokemon?.moves.map((moveData) => (
                  <Button
                    key={moveData.move.name}
                    variant={
                      selectedMoves.includes(moveData.move.name)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleMoveToggle(moveData.move.name)}
                    disabled={
                      !selectedMoves.includes(moveData.move.name) &&
                      selectedMoves.length >= 4
                    }
                    className="justify-start text-xs"
                  >
                    {moveData.move.name.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ability */}
            <div className="mb-6 space-y-2 border-b-2 pb-2">
              <Label className="mb-4">Ability</Label>
              <div className="flex gap-2">
                {selectedPokemon.abilities.map((abilityData) => (
                  <Button
                    key={abilityData.ability.name}
                    variant={
                      selectedAbility === abilityData.ability.name
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedAbility(abilityData.ability.name)}
                  >
                    {abilityData.ability.name.replace("-", " ")}
                    {abilityData.is_hidden && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Hidden
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Item */}
            <div className="mb-6 space-y-2 border-b-2 pb-2">
              <Label className="mb-4">Held Item</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedItem || "Select item..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandList>
                      <CommandEmpty>No items found.</CommandEmpty>
                      <CommandGroup>
                        {allItems?.results.map((item) => (
                          <CommandItem
                            key={item.name + " " + item.url}
                            value={item.name}
                            onSelect={() => setSelectedItem(item.name)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedItem === item.name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {item.name.replace("-", " ")}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Nature */}
            <div className="mb-6 space-y-2 border-b-2 pb-2">
              <Label className="mb-4">Nature</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedNature || "Select nature..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search natures..." />
                    <CommandList>
                      <CommandEmpty>No natures found.</CommandEmpty>
                      <CommandGroup>
                        {allNatures?.results.map((nature) => (
                          <CommandItem
                            key={nature.name}
                            value={nature.name}
                            onSelect={() => setSelectedNature(nature.name)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedNature === nature.name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {nature.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* EVs */}
            <div className="mb-6 space-y-4 border-b-2 pb-2">
              <div className="flex items-center justify-between">
                <Label className="mb-4">EV Distribution</Label>
                <Badge
                  variant={getTotalEvs() > 510 ? "destructive" : "secondary"}
                >
                  {getTotalEvs()}/510 EVs
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(evs).map(([stat, value]) => (
                  <div key={stat} className="space-y-2">
                    <Label className="text-sm capitalize">
                      {stat.replace("-", " ")} ({value}/252)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="252"
                      value={value}
                      onChange={(e) =>
                        handleEVChange(
                          stat as keyof EVStats,
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await handleSave();
                  window.location.reload();
                }}
                disabled={
                  selectedMoves.length === 0 ||
                  !selectedAbility ||
                  !selectedNature ||
                  !selectedItem
                }
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
