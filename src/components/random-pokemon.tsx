"use client";
import type { Pokemon, PokemonSpecies, Type } from "~/types/types";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { TypeBadge } from "./ui/typebadge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Check,
  ChevronsUpDown,
  RefreshCw,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "~/lib/utils";
import Link from "next/link";
import RandomLegendary from "./random-legendary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";

const getPokemonData = async (name: string): Promise<Pokemon> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }
  return response.json() as Promise<Pokemon>;
};

const getPokemonSpeciesData = async (url: string): Promise<PokemonSpecies> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon species data");
  }
  return response.json() as Promise<PokemonSpecies>;
};

// const getPokemonForms = async (url: string): Promise<Pokemon[]> => {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Failed to fetch Pokémon forms");
//   }
//   const data = await response.json();
//   return data.forms as Pokemon[];
// };

const getRandomPokemon = async (): Promise<Pokemon> => {
  const randomId = Math.floor(Math.random() * 1025) + 1;

  const speciesData = await getPokemonSpeciesData(
    "https://pokeapi.co/api/v2/pokemon-species/" + randomId,
  );

  let pokemon: Pokemon | null = null;

  if (speciesData.varieties.length > 1) {
    const randomForm = Math.floor(Math.random() * speciesData.varieties.length);
    pokemon = speciesData.varieties[randomForm]?.pokemon?.name
      ? await getPokemonData(speciesData.varieties[randomForm].pokemon.name)
      : null;
  } else {
    pokemon = await getPokemonData(randomId.toString());
  }

  if (!pokemon) {
    throw new Error("Failed to fetch a valid Pokémon");
  }

  return pokemon;
};

export default function RandomPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [types, setTypes] = useState<Type[]>([]);
  const [ability, setAbility] = useState<string>("");
  const [moveset, setMoveset] = useState<string[]>([]);
  const [hp, setHp] = useState<number>();
  const [attack, setAttack] = useState<number>();
  const [defense, setDefense] = useState<number>();
  const [specialAttack, setSpecialAttack] = useState<number>();
  const [specialDefense, setSpecialDefense] = useState<number>();
  const [speed, setSpeed] = useState<number>();
  const [open, setOpen] = useState(false);
  const [openMove, setopenMove] = useState(false);
  const [value, setValue] = useState("");
  const [isMovesetTurn, setIsMovesetTurn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [legendaryName, setLegendaryName] = useState<string | null>(null);

  // const [dialogShown, setDialogShown] = useState(false);
  const isAllAttributesDefined =
    hp !== undefined &&
    attack !== undefined &&
    defense !== undefined &&
    specialAttack !== undefined &&
    specialDefense !== undefined &&
    speed !== undefined &&
    ability !== "" &&
    moveset.length > 0 &&
    !isMovesetTurn &&
    types.length > 0;

  useEffect(() => {
    if (isAllAttributesDefined) {
      setDialogOpen(true);
    }
  }, [isAllAttributesDefined]);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    if (pokemon) {
      const isAllAttributesDefined =
        hp !== undefined &&
        attack !== undefined &&
        defense !== undefined &&
        specialAttack !== undefined &&
        specialDefense !== undefined &&
        speed !== undefined &&
        ability !== "" &&
        moveset.length > 0 &&
        !isMovesetTurn;

      const gameState = {
        pokemon,
        isAvailable,
        types,
        ability,
        moveset,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        isAllAttributesDefined,
      };
      localStorage.setItem("randomPokemonGameState", JSON.stringify(gameState));
    }
  }, [
    pokemon,
    isAvailable,
    types,
    ability,
    moveset,
    hp,
    attack,
    defense,
    specialAttack,
    specialDefense,
    speed,
    isMovesetTurn,
  ]);

  // Load progress from localStorage when the component mounts
  useEffect(() => {
    const savedState = localStorage.getItem("randomPokemonGameState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as {
          pokemon: Pokemon;
          isAvailable: boolean;
          types: Type[];
          ability: string;
          moveset: string[];
          hp: number | undefined;
          attack: number | undefined;
          defense: number | undefined;
          specialAttack: number | undefined;
          specialDefense: number | undefined;
          speed: number | undefined;
          isAllAttributesDefined: boolean;
        };

        // Only set states if the Pokemon object exists and has required properties
        if (parsedState.pokemon?.name) {
          setPokemon(parsedState.pokemon);
          setIsAvailable(parsedState.isAvailable);
          setTypes(parsedState.types || []);
          setAbility(parsedState.ability || "");
          setMoveset(parsedState.moveset || []);
          setHp(parsedState.hp);
          setAttack(parsedState.attack);
          setDefense(parsedState.defense);
          setSpecialAttack(parsedState.specialAttack);
          setSpecialDefense(parsedState.specialDefense);
          setSpeed(parsedState.speed);

          // Set dialog shown state to prevent dialog from appearing on reload
          // if (parsedState.isAllAttributesDefined) {
          //   setDialogShown(true);
          // }
        }
      } catch (error) {
        console.error("Error parsing saved game state:", error);
        localStorage.removeItem("randomPokemonGameState");
      }
    }
  }, []);

  const resetStates = () => {
    setDialogOpen(false);
    setPokemon(null);
    setIsAvailable(true);
    setTypes([]);
    setAbility("");
    setMoveset([]);
    setHp(undefined);
    setAttack(undefined);
    setDefense(undefined);
    setSpecialAttack(undefined);
    setSpecialDefense(undefined);
    setSpeed(undefined);
    setValue("");
    setIsMovesetTurn(false);
    setValue(""); // Reset the selected ability value
    void getRandomPokemon().then((randomPokemon) => setPokemon(randomPokemon));
    localStorage.removeItem("randomPokemonGameState"); // Clear saved state
    localStorage.removeItem("randomLegendaryState"); // Also clear legendary state
  };

  // console.log("----------------------------------------------------");
  // console.log("AVAILABLE:" + isAvailable);
  // console.log("----------------------------------------------------");
  // console.log("Custom hp:" + hp);
  // console.log("Custom attack:" + attack);
  // console.log("Custom defense:" + defense);
  // console.log("Custom special attack:" + specialAttack);
  // console.log("Custom special defense:" + specialDefense);
  // console.log("Custom speed:" + speed);
  // console.log("Ability:" + ability);
  const router = useRouter();
  return (
    <div className="space-y-6">
      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle>All attributes set!</DialogTitle>
            <DialogDescription className="flex flex-col items-center">
              All attributes have been successfully set!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="flex h-full w-full flex-col justify-around space-y-2 sm:flex-row">
              <Button onClick={() => router.push("/minigames/whosthatpokemon")}>
                Play Whos That Pokémon
              </Button>

              <Button onClick={() => router.push("/minigames/pokedle")}>
                Play Pokedle
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to reset?")) {
                    resetStates();
                  }
                }}
              >
                Play again
              </Button>
              {/* <Button
                onClick={async () => {
                  const message = `Give a verdict on who would win: ${legendaryName} or a custom pokemon with these stats HP: ${hp}, ATTK: ${attack}, DEF: ${defense}, SPATT: ${specialAttack}, SPDEF: ${specialDefense}, SPEED: ${speed}, ABILITY: ${ability}, Moveset: ${moveset.join(", ")}, TYPES: ${types.map((type) => type.type.name).join(", ")}. You have to appoint a winner.`;
                  try {
                    const response = await fetch("/api/chat/", {
                      // Updated endpoint
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        messages: [{ role: "user", content: message }],
                      }), // Adjusted payload
                    });
                    const result = await response.json();
                    alert(
                      `Pokemaster's verdict: ${result.verdict || result.content}`,
                    ); // Adjusted to handle response content
                  } catch (error) {
                    console.error(
                      "Error sending message to Pokemaster:",
                      error,
                    );
                    alert("Failed to get a verdict from Pokemaster.");
                  }
                }}
              >
                Ask Pokemaster who won!
              </Button> */}
              <Button
                onClick={() => {
                  const message = `Give a verdict on who would win: ${legendaryName} or a custom pokemon with these stats HP: ${hp}, ATTK: ${attack}, DEF: ${defense}, SPATT: ${specialAttack}, SPDEF: ${specialDefense}, SPEED: ${speed}, ABILITY: ${ability}, Moveset: ${moveset.join(", ")}, TYPES: ${types.map((type) => type.type.name).join(", ")}. You have to appoint a winner without doubt.`;
                  const encodedMessage = encodeURIComponent(message);
                  router.push(`/assistant/?message=${encodedMessage}`);
                }}
              >
                Ask Pokemaster who won!
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!pokemon && (
        <div className="flex h-auto w-full items-center justify-center">
          <Button
            onClick={async () => {
              const randomPokemon = await getRandomPokemon();
              setPokemon(randomPokemon);
              setIsAvailable(true);
              setIsMovesetTurn(false);
            }}
            className={`w-full ${!isAvailable ? "animate-pulse bg-yellow-500" : ""}`}
          >
            Start playing!
          </Button>
        </div>
      )}

      {pokemon && (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <RandomLegendary
            onLegendarySelected={(legendary_name: string) =>
              setLegendaryName(legendary_name)
            }
          />
          <div className="flex h-full w-full flex-col md:flex-row">
            {/* img name generate new button */}
            <div className="mb-2 h-full w-full justify-between md:w-1/3">
              <Card className="mb-2 w-full items-center justify-center">
                <CardHeader className="flex h-auto w-full items-center justify-center md:hidden">
                  <h1 className="text-muted-foreground font-bold">
                    YOUR POKEMON:
                  </h1>
                </CardHeader>

                <h1 className="text-lg font-bold">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h1>
              </Card>

              <Card className="mb-2 flex w-full items-center justify-center">
                <Link
                  href={`/pokedex/${pokemon.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-full w-full"
                >
                  <img
                    src={pokemon.sprites.front_default || "/placeholder.svg"}
                    alt={pokemon.name}
                    className="h-100 w-100 md:h-full md:w-full"
                    style={{ imageRendering: "pixelated" }}
                  />
                </Link>
              </Card>

              <Button
                onClick={async () => {
                  const randomPokemon = await getRandomPokemon();
                  setPokemon(randomPokemon);
                  setIsAvailable(true);
                  setIsMovesetTurn(false);
                  setValue("");
                }}
                className={`w-full ${!isAvailable || (isMovesetTurn && moveset.length > 0) ? "animate-pulse bg-yellow-500" : ""}`}
              >
                {" "}
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate random Pokémon
              </Button>
            </div>
            {/* typing bst */}
            <div className="md: mb-2 h-full w-full justify-between sm:ml-2 md:mr-2 md:w-1/3">
              {/* TYPES */}
              <Card className="mb-2 h-full w-full">
                <CardHeader>
                  <h3 className="text-lg font-bold">Types</h3>
                </CardHeader>
                <CardContent className="flex h-full w-auto flex-col">
                  {!isAvailable || types.length > 0 || isMovesetTurn ? (
                    <Button className="flex h-full cursor-not-allowed flex-row justify-around opacity-50">
                      {types.length > 0
                        ? types.map((type) => (
                            <TypeBadge
                              type={type}
                              key={pokemon.name + type.type.name}
                            />
                          ))
                        : pokemon.types.map((type) => (
                            <TypeBadge
                              type={type}
                              key={pokemon.name + type.type.name}
                            />
                          ))}
                    </Button>
                  ) : (
                    <Button
                      onClick={async () => {
                        const newTypes = pokemon.types;
                        setTypes(newTypes);
                        setIsAvailable(false);
                      }}
                      className="flex flex-row justify-around"
                    >
                      {pokemon.types.map((type) => (
                        <TypeBadge
                          type={type}
                          key={pokemon.name + type.type.name}
                        />
                      ))}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* STATS */}
              <Card className="flex h-full w-full flex-col">
                <CardHeader className="flex flex-row justify-between">
                  <h3 className="text-lg font-bold">Stats</h3>
                </CardHeader>
                <CardContent className="flex h-full w-auto flex-col">
                  <div className="m-2 flex flex-row justify-between border-b-2">
                    <span>HP:</span>
                    <span>
                      {!isMovesetTurn && isAvailable && hp === undefined ? (
                        <Button
                          onClick={() => {
                            const newHp = pokemon.stats[0]?.base_stat;
                            setHp(newHp);
                            setIsAvailable(false);
                          }}
                          className="w-20"
                        >
                          {pokemon.stats[0]?.base_stat}
                        </Button>
                      ) : (
                        <Button className="w-20 cursor-not-allowed opacity-50">
                          {hp ?? pokemon.stats[0]?.base_stat}
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="m-2 flex flex-row justify-between border-b-2">
                    <span>ATTACK:</span>
                    <span>
                      {!isMovesetTurn && isAvailable && attack === undefined ? (
                        <Button
                          onClick={() => {
                            const newAttack = pokemon.stats[1]?.base_stat;
                            setAttack(newAttack);
                            setIsAvailable(false);
                          }}
                          className="w-20"
                        >
                          {pokemon.stats[1]?.base_stat}
                        </Button>
                      ) : (
                        <Button className="w-20 cursor-not-allowed opacity-50">
                          {attack ?? pokemon.stats[1]?.base_stat}
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="m-2 flex flex-row justify-between border-b-2">
                    <span>DEFENSE:</span>
                    <span>
                      {!isMovesetTurn &&
                      isAvailable &&
                      defense === undefined ? (
                        <Button
                          onClick={() => {
                            const newDefense = pokemon.stats[2]?.base_stat;
                            setDefense(newDefense);
                            setIsAvailable(false);
                          }}
                          className="w-20"
                        >
                          {pokemon.stats[2]?.base_stat}
                        </Button>
                      ) : (
                        <Button className="w-20 cursor-not-allowed opacity-50">
                          {defense ?? pokemon.stats[2]?.base_stat}
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="m-2 flex flex-row justify-between border-b-2">
                    <span>SP. ATTK:</span>
                    <span>
                      {!isMovesetTurn &&
                      isAvailable &&
                      specialAttack === undefined ? (
                        <Button
                          onClick={() => {
                            const newSpecialAttack =
                              pokemon.stats[3]?.base_stat;
                            setSpecialAttack(newSpecialAttack);
                            setIsAvailable(false);
                          }}
                          className="w-20"
                        >
                          {pokemon.stats[3]?.base_stat}
                        </Button>
                      ) : (
                        <Button className="w-20 cursor-not-allowed opacity-50">
                          {specialAttack ?? pokemon.stats[3]?.base_stat}
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="m-2 flex flex-row justify-between border-b-2">
                    <span>SP. DEF:</span>
                    <span>
                      {!isMovesetTurn &&
                      isAvailable &&
                      specialDefense === undefined ? (
                        <Button
                          onClick={() => {
                            const newSpecialDefense =
                              pokemon.stats[4]?.base_stat;
                            setSpecialDefense(newSpecialDefense);
                            setIsAvailable(false);
                          }}
                          className="w-20"
                        >
                          {pokemon.stats[4]?.base_stat}
                        </Button>
                      ) : (
                        <Button className="w-20 cursor-not-allowed opacity-50">
                          {specialDefense ?? pokemon.stats[4]?.base_stat}
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="m-2 flex flex-row justify-between border-b-2">
                    <span>SPEED:</span>
                    <span>
                      {!isMovesetTurn && isAvailable && speed === undefined ? (
                        <Button
                          onClick={() => {
                            const newSpeed = pokemon.stats[5]?.base_stat;
                            setSpeed(newSpeed);
                            setIsAvailable(false);
                          }}
                          className="w-20"
                        >
                          {pokemon.stats[5]?.base_stat}
                        </Button>
                      ) : (
                        <Button className="w-20 cursor-not-allowed opacity-50">
                          {speed ?? pokemon.stats[5]?.base_stat}{" "}
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="mt-6 font-bold">
                    Current BST:{" "}
                    {(hp ?? 0) +
                      (attack ?? 0) +
                      (defense ?? 0) +
                      (specialAttack ?? 0) +
                      (specialDefense ?? 0) +
                      (speed ?? 0)}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* ability moveset */}
            <div className="mb-2 flex h-full w-full flex-col justify-between md:w-1/3">
              {/* abilities */}
              <Card className="mb-2 h-full">
                <CardHeader>
                  <h3 className="text-lg font-bold">Abilities</h3>
                </CardHeader>
                <CardContent className="flex w-auto flex-row items-center justify-between md:flex-col lg:flex-row">
                  <Button
                    onClick={() => {
                      if (value) {
                        setAbility(value);
                        setIsAvailable(false);
                      }
                    }}
                    className={`ml-2 ${
                      !isAvailable || ability || isMovesetTurn
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    } md:w-full lg:w-auto`}
                    disabled={!isAvailable || ability !== ""}
                  >
                    Set Ability
                  </Button>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`w-[200px] justify-between ${
                          !isAvailable || ability
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={
                          isMovesetTurn || !isAvailable || ability !== ""
                        }
                      >
                        {value || ability || "Select ability..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search abilities..." />
                        <CommandList>
                          <CommandEmpty>No ability found.</CommandEmpty>
                          <CommandGroup>
                            {pokemon.abilities.map((abilityItem) => (
                              <CommandItem
                                key={abilityItem.ability.name}
                                value={abilityItem.ability.name
                                  .replaceAll("-", " ")
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase(),
                                  )}
                                onSelect={(currentValue) => {
                                  setValue(currentValue);
                                  setOpen(false);
                                }}
                              >
                                {abilityItem.ability.name
                                  .replaceAll("-", " ")
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase(),
                                  )}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === abilityItem.ability.name
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <Link
                                  href={`/docs/abilities/${abilityItem.ability.name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <SquareArrowOutUpRight />
                                </Link>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* moves */}
              <Card className="mb-2 h-full">
                <CardHeader>
                  <h3 className="text-lg font-bold">Moves</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <Popover open={openMove} onOpenChange={setopenMove}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openMove}
                          className={`w-[200px] justify-between ${
                            !isAvailable || moveset.length >= 4
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          disabled={!isMovesetTurn && moveset.length >= 1}
                        >
                          Select move...
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search moves..." />
                          <CommandList>
                            <CommandEmpty>No move found.</CommandEmpty>
                            <CommandGroup>
                              {pokemon.moves.map((moveItem) => (
                                <CommandItem
                                  key={moveItem.move.name}
                                  value={moveItem.move.name
                                    .replaceAll("-", " ")
                                    .replace(/\b\w/g, (char) =>
                                      char.toUpperCase(),
                                    )}
                                  onSelect={(currentValue) => {
                                    if (
                                      !moveset.includes(currentValue) &&
                                      moveset.length < 4
                                    ) {
                                      setMoveset((prev) => [
                                        ...prev,
                                        currentValue,
                                      ]);
                                      setIsMovesetTurn(true);
                                    }
                                    setopenMove(false);
                                  }}
                                >
                                  {moveItem.move.name
                                    .replaceAll("-", " ")
                                    .replace(/\b\w/g, (char) =>
                                      char.toUpperCase(),
                                    )}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      moveset.includes(moveItem.move.name)
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <Link
                                    href={`/docs/moves/${moveItem.move.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <SquareArrowOutUpRight />
                                  </Link>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div>
                      <div className="mb-4 flex flex-row justify-between">
                        <span className="font-bold">Selected Moves:</span>
                        <span className="text-muted-foreground">
                          ( {moveset.length}/
                          {pokemon.moves.length > 3 ? 4 : pokemon.moves.length}{" "}
                          )
                        </span>
                      </div>

                      <ul>
                        {moveset.map((move, index) => (
                          <li key={index} className="mb-2 flex justify-between">
                            <Link
                              href={`/docs/moves/${move.toLowerCase().replaceAll(" ", "-")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {move}
                            </Link>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                if (isMovesetTurn || moveset.length === 0) {
                                  setMoveset((prev) => {
                                    const updatedMoveset = prev.filter(
                                      (m) => m !== move,
                                    );
                                    if (updatedMoveset.length === 0) {
                                      setIsAvailable(true);
                                      setIsMovesetTurn(false);
                                    }
                                    return updatedMoveset;
                                  });
                                }
                              }}
                              disabled={!isMovesetTurn || moveset.length === 0}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* reset */}
          <div className="flex w-full flex-row justify-end">
            {isAllAttributesDefined && !dialogOpen && (
              <Button onClick={() => setDialogOpen(true)} className="mr-2 w-40">
                All attributes set
              </Button>
            )}

            <Button
              onClick={() => {
                if (confirm("Are you sure you want to reset?")) {
                  resetStates();
                }
              }}
              className="w-20 bg-red-500 text-white hover:bg-red-600"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
