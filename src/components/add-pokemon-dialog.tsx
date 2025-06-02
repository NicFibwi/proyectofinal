/* eslint-disable */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type {
  ItemInfo,
  MoveInfo,
  Nature,
  Pokemon,
  PokemonList,
} from "~/types/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
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
  createAbility,
  createBasePokemon,
  createPokemonAbility,
  getPokemonAbilitiesByIds,
  getBasePokemonById,
  getAbilityById,
  createMove,
  getNatureById,
  createNature,
  getItemById,
  createItem,
  createCustomPokemon,
  getMovesByPokemonId,
  getCustomPokemonByTeamId,
  addPokemonMove,
  getMoveById,
  createEvSpread,
} from "~/lib/team-builder-actions";

interface EVStats {
  hp: number;
  attack: number;
  defense: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
}

export const getAllPokemon = async (): Promise<PokemonList> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
  );
  return (await response.json()) as PokemonList;
};

export const getPokemonData = async (pokemonName: string): Promise<Pokemon> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
  );

  return (await response.json()) as Pokemon;
};

export const getMoveData = async (moveName: string): Promise<MoveInfo> => {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);

  if (!response.ok) {
    throw new Error(`Move not found: ${moveName}`);
  }

  return (await response.json()) as MoveInfo;
};

export const getAbilityData = async (abilityName: string) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/ability/${abilityName}`,
  );

  if (!response.ok) {
    throw new Error(`Ability not found: ${abilityName}`);
  }

  return await response.json();
};

export const getAllNatures = async (): Promise<PokemonList> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/nature?limit=25&offset=0",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch natures");
  }

  return (await response.json()) as PokemonList;
};

export const getNatureData = async (natureName: string) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/nature/${natureName}`,
  );

  if (!response.ok) {
    throw new Error(`Nature not found: ${natureName}`);
  }

  return (await response.json()) as Nature;
};

export const getAllItems = async (): Promise<PokemonList> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/item?limit=2180&offset=0",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return (await response.json()) as PokemonList;
};

export const getItemData = async (itemName: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/item/${itemName}`);

  if (!response.ok) {
    throw new Error(`Item not found: ${itemName}`);
  }

  return (await response.json()) as ItemInfo;
};

const handleSubmit = async (
  pokemon: Pokemon,
  nickname: string,
  moves: string[],
  ability: string,
  item: string,
  nature: string,
  evs: EVStats,
  teamId: number,
) => {
  console.log("Submitting Pokemon:", {
    pokemon,
    nickname,
    moves,
    ability,
    item,
    nature,
    evs,
    teamId,
  });

  const getBaseStats = (pokemon: Pokemon): Record<string, number> => {
    const stats: Record<string, number> = {};
    pokemon.stats.forEach((stat) => {
      stats[stat.stat.name] = stat.base_stat;
    });
    return stats;
  };

  if (nickname.trim() === "") {
    nickname = pokemon.name.replaceAll("-", " ");
  }

  const abilityData = await getAbilityData(ability);
  const natureData = await getNatureData(nature);
  const itemData = await getItemData(item);

  if (pokemon) {
    //Check wether the base Pokemon already exists
    const existingBasePokemon = await getBasePokemonById(pokemon.id);
    if (!existingBasePokemon) {
      await createBasePokemon(
        pokemon.id,
        pokemon.name,
        pokemon.types[0]?.type?.name || "",
        pokemon.types[1]?.type.name || "",
        getBaseStats(pokemon),
      );
    }

    //Check wether the ability already exists
    const existingAbility = await getAbilityById(abilityData.id);
    if (!existingAbility) {
      await createAbility(abilityData);
    }

    //Check if the relation between the base Pokemon and ability already exists
    const existingPokemonAbility = await getPokemonAbilitiesByIds(
      pokemon.id,
      abilityData.id,
    );
    if (!existingPokemonAbility || existingPokemonAbility.length === 0) {
      const isHidden =
        pokemon.abilities.find((a) => a.ability.name === abilityData.name)
          ?.is_hidden ?? false;

      await createPokemonAbility(pokemon.id, abilityData.id, isHidden);
    }

    //Check wether the nature already exists
    const existingNature = await getNatureById(natureData.id);
    if (!existingNature) {
      await createNature(natureData);
    }

    //Check wether the item already exists
    if (itemData) {
      const existingItem = await getItemById(itemData.id);
      if (!existingItem) {
        await createItem(itemData);
      }
    } else {
      console.warn("Item data is null or undefined.");
    }

    // Check and create moves if they don't exist
    for (const moveName of moves) {
      const moveData = await getMoveData(moveName);
      const existingMove = await getMoveById(moveData.id);
      if (!existingMove) {
        await createMove(moveData);
      }
    }

    await createCustomPokemon(
      teamId,
      pokemon.id,
      nickname || pokemon.name, // Use the Pokémon's name if nickname is empty
      natureData.id,
      itemData.id,
    );

    // Get the actual customPokemon row (to get its autogenerated pokemon_id)
    // Fetch all customPokemon for the team
    const allCustomPokemon = await getCustomPokemonByTeamId(teamId);
    const customPokemon = allCustomPokemon.find(
      (cp) =>
        cp.pokedex_n === pokemon.id &&
        cp.nickname === nickname &&
        cp.item_id === itemData.id &&
        cp.nature_id === natureData.id,
    );
    if (!customPokemon) {
      throw new Error("Custom Pokémon not found after creation.");
    }

    // For each move, check if the relation exists, if not, create it
    for (let i = 0; i < moves.length; i++) {
      const moveName = moves[i];
      const moveData = await getMoveData(moveName!);
      const existingMove = await getMoveById(moveData.id);
      if (!existingMove) {
        await createMove(moveData);
      }
      // Now check if the move is already related to this customPokemon
      const existingRelations = await getMovesByPokemonId(
        customPokemon.pokemon_id,
        teamId,
      );
      const alreadyRelated = existingRelations.some(
        (rel) => rel.move_id === moveData.id,
      );
      if (!alreadyRelated) {
        await addPokemonMove(
          customPokemon.pokemon_id,
          teamId,
          moveData.id,
          i + 1, // slot (1-based)
        );
      }
    }

    // Create EV spread
    await createEvSpread(
      customPokemon.team_id,
      customPokemon.pokemon_id,
      evs.hp,
      evs.attack,
      evs.defense,
      evs["special-attack"],
      evs["special-defense"],
      evs.speed,
    );
  }
};

export default function AddPokemonDialog({ team_id }: { team_id: number }) {
  const [evs, setEvs] = useState<EVStats>({
    hp: 0,
    attack: 0,
    defense: 0,
    "special-attack": 0,
    "special-defense": 0,
    speed: 0,
  });
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [pokemonOpen, setPokemonOpen] = useState(false);
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [selectedAbility, setSelectedAbility] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedNature, setSelectedNature] = useState("");
  const [teamId, setTeamId] = useState(team_id);

  useEffect(() => {
    setTeamId(team_id);
  }, [team_id]);

  const { data: allPokemon } = useQuery({
    queryKey: ["allPokemon"],
    queryFn: getAllPokemon,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
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

    // Check if total EVs would exceed 510
    const totalEvs = Object.values(newEvs).reduce((sum, ev) => sum + ev, 0);
    if (totalEvs <= 510) {
      setEvs(newEvs);
    }
  };

  const getTotalEvs = () => Object.values(evs).reduce((sum, ev) => sum + ev, 0);

  const resetForm = () => {
    setSelectedPokemon(null);
    setSelectedMoves([]);
    setSelectedAbility("");
    setSelectedItem("");
    setSelectedNature("");
    setNickname("");
    setEvs({
      hp: 0,
      attack: 0,
      defense: 0,
      "special-attack": 0,
      "special-defense": 0,
      speed: 0,
    });
  };

  return (
    <div className="w-full">
      {/* pokemon selector */}
      <div className="mb-6">
        <Label className="mb-4">Select Pokemon</Label>
        <Popover open={pokemonOpen} onOpenChange={setPokemonOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={pokemonOpen}
              className="w-full justify-between"
            >
              {selectedPokemon ? selectedPokemon.name : "Select Pokemon..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search Pokemon..." />
              <CommandList>
                <CommandEmpty>No Pokemon found.</CommandEmpty>
                <CommandGroup>
                  {allPokemon?.results.map((pokemon) => (
                    <CommandItem
                      key={pokemon.name}
                      value={pokemon.name}
                      onSelect={(currentValue) => {
                        if (currentValue === selectedPokemon?.name) {
                          setSelectedPokemon(null);
                        } else {
                          // Close the popover first
                          setPokemonOpen(false);
                          // Then fetch the Pokemon data
                          getPokemonData(currentValue)
                            .then((pokemonData) => {
                              setSelectedPokemon(pokemonData);
                            })
                            .catch((error) => {
                              console.error(
                                "Failed to fetch Pokemon data:",
                                error,
                              );
                            });
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPokemon?.name === pokemon.name
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {pokemon.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedPokemon && (
        <div>
          {/* basic info */}
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

          {/* move selector */}
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

          {/* ability selector */}
          <div className="mb-6 space-y-2 border-b-2 pb-2">
            <Label className="mb-4">Ability</Label>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
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
                  className="w-full md:w-auto"
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

          {/* item selector */}
          <div className="mb-6 space-y-2 border-b-2 pb-2">
            <Label className="mb-4">Held Item</Label>
            <Popover>
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

          {/* nature selector */}
          <div className="mb-6 space-y-2 border-b-2 pb-2">
            <Label className="mb-4">Nature</Label>
            <Popover>
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

          {/* ev selector */}
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
            <Button onClick={resetForm}>Reset</Button>
            <Button
              onClick={() =>
                handleSubmit(
                  selectedPokemon,
                  nickname,
                  selectedMoves,
                  selectedAbility,
                  selectedItem,
                  selectedNature,
                  evs,
                  teamId,
                ).then(() => {
                  resetForm();
                  window.location.reload();
                })
              }
              disabled={
                selectedMoves.length === 0 ||
                !selectedAbility ||
                !selectedNature ||
                !selectedItem
              }
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
