"use client";
import { useQuery } from "@tanstack/react-query";
import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

import type {
  Pokemon,
  PokemonSpecies,
  SpeciesEvolutionChain,
} from "~/types/types";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";

// Cache for evolution data to reduce API calls
const evolutionCache = new Map<
  string,
  { stage: number; isFinalEvo: boolean }
>();

// Analyze evolution chain and return stage and final evolution status
const analyzeEvolution = async (url: string, pokemonName: string) => {
  // Check cache first
  const cacheKey = `${url}:${pokemonName}`;
  if (evolutionCache.has(cacheKey)) {
    return evolutionCache.get(cacheKey)!;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch evolution chain");
  }

  const evoChain = (await response.json()) as SpeciesEvolutionChain;
  let stage = 0;
  let isFinalEvo = false;

  // First stage check
  if (evoChain.chain.species.name === pokemonName) {
    stage = 1;
    isFinalEvo = evoChain.chain.evolves_to.length === 0;
  } else {
    // Second stage check
    for (const evo of evoChain.chain.evolves_to) {
      if (evo.species.name === pokemonName) {
        stage = 2;
        isFinalEvo = evo.evolves_to.length === 0;
        break;
      }

      // Third stage check
      for (const evo2 of evo.evolves_to) {
        if (evo2.species.name === pokemonName) {
          stage = 3;
          isFinalEvo = true; // Third stage is always final
          break;
        }
      }

      if (stage > 0) break; // Exit if we found the Pokémon
    }
  }

  // If we couldn't determine the stage, default to 1
  if (stage === 0) {
    console.warn(
      `Could not determine evolution stage for ${pokemonName}, defaulting to 1`,
    );
    stage = 1;
  }

  // Cache the result
  const result = { stage, isFinalEvo };
  evolutionCache.set(cacheKey, result);
  return result;
};

// API functions
const api = {
  async getPokemonList(): Promise<Pokemon[]> {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1025",
    );
    if (!response.ok) throw new Error("Failed to fetch Pokémon list");
    const data = (await response.json()) as { results: Pokemon[] };
    return data.results;
  },

  async getPokemonData(nameOrId: string): Promise<Pokemon> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nameOrId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch Pokémon data");
    return response.json() as Promise<Pokemon>;
  },

  async getPokemonSpeciesData(url: string): Promise<PokemonSpecies> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Pokémon species data");
    return response.json() as Promise<PokemonSpecies>;
  },

  async getRandomPokemon(): Promise<Pokemon> {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    return this.getPokemonData(randomId.toString());
  },
};

// Helper functions
const helpers = {
  romanToArabic(roman: string): number {
    const romanMap: Record<string, number> = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
      X: 10,
      XI: 11,
      XII: 12,
      XIII: 13,
      XIV: 14,
      XV: 15,
    };
    return romanMap[roman.toUpperCase()] ?? 0;
  },

  // Map for Pokémon with form suffixes
  suffixMap: {
    thundurus: "-Incarnate",
    landorus: "-Incarnate",
    tornadus: "-Incarnate",
    darmanitan: "-Standard",
    giratina: "-Altered",
    shaymin: "-Land",
    wormadam: "-Plant",
    deoxys: "-Normal",
    squawkabilly: "-Green-Plumage",
    dudunsparce: "-Two-Segment",
    tatsugiri: "-Curly",
    palafin: "-Zero",
    maushold: "-Family-Of-Four",
    meowstic: "-Male",
    indeedee: "-Male",
    basculegion: "-Male",
    oinkologne: "-Male",
    urshifu: "-Single-Strike",
    morpeko: "-Full-Belly",
    eiscue: "-Ice",
    toxtricity: "-Amped",
    mimikyu: "-Disguised",
    minior: "-Red-Meteor",
    wishiwashi: "-Solo",
    lycanroc: "-Midday",
    oricorio: "-Baile",
    zygarde: "-50",
    pumpkaboo: "-Average",
    gourgeist: "-Average",
    aegislash: "-Shield",
    meloetta: "-Aria",
    keldeo: "-Ordinary",
    basculin: "-White-Striped",
  } as Record<string, string>,

  // Get full name with form suffix if needed
  getFullPokemonName(name: string): string {
    const baseName = name.toLowerCase();
    return this.suffixMap[baseName]
      ? `${baseName}${this.suffixMap[baseName]}`
      : baseName;
  },

  // Get display name without form suffix
  getDisplayPokemonName(name: string): string {
    const baseName = Object.keys(this.suffixMap).find((key) =>
      name.toLowerCase().startsWith(key),
    );
    return baseName ?? name;
  },

  // Extract generation number from generation name
  getGenerationNumber(generationName: string): number {
    return this.romanToArabic(
      generationName.replace("generation-", "").toUpperCase(),
    );
  },

  // Format generation name for display
  formatGenerationName(generationName: string): string {
    return generationName
      .split("-")
      .map((word, index) =>
        index === 1
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ");
  },
};

// Type for a guessed Pokémon with all its data
type GuessedPokemon = {
  pokemon: Pokemon;
  species: PokemonSpecies;
  evoStage: number;
  isFinalEvo: boolean;
};

// Type for game state to be stored in localStorage
type GameState = {
  guesses: GuessedPokemon[];
  isCorrect: boolean;
  targetPokemon: Pokemon | null;
  targetPokemonSpecies: PokemonSpecies | null;
  targetPokemonEvoStage: number | null;
  targetPokemonIsFinalEvo: boolean | null;
};

export default function PokemonWordle() {
  // Fetch Pokémon list for autocomplete
  const { data: pokemonList } = useQuery({
    queryKey: ["pokemonList"],
    queryFn: () => api.getPokemonList(),
  });

  // Game state
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessedPokemon[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [targetPokemon, setTargetPokemon] = useState<Pokemon | null>(null);
  const [targetPokemonSpecies, setTargetPokemonSpecies] =
    useState<PokemonSpecies | null>(null);
  const [targetPokemonEvoStage, setTargetPokemonEvoStage] = useState<
    number | null
  >(null);
  const [targetPokemonIsFinalEvo, setTargetPokemonIsFinalEvo] = useState<
    boolean | null
  >(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isGivenUp, setIsGivenUp] = useState(false);
  const router = useRouter();

  // Set hasMounted to true after the component mounts
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    if (!hasMounted) return;

    const gameState: GameState = {
      guesses,
      isCorrect,
      targetPokemon,
      targetPokemonSpecies,
      targetPokemonEvoStage,
      targetPokemonIsFinalEvo,
    };

    Object.entries(gameState).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        localStorage.setItem(
          `pokemonWordle${key.charAt(0).toUpperCase() + key.slice(1)}`,
          JSON.stringify(value),
        );
      }
    });
  }, [
    hasMounted,
    guesses,
    isCorrect,
    targetPokemon,
    targetPokemonSpecies,
    targetPokemonEvoStage,
    targetPokemonIsFinalEvo,
  ]);

  // Load game state from localStorage
  const loadGameState = useCallback(() => {
    if (!hasMounted) return false;

    try {
      const guessesStr = localStorage.getItem("pokemonWordleGuesses");
      const isCorrectStr = localStorage.getItem("pokemonWordleIsCorrect");
      const targetStr = localStorage.getItem("pokemonWordleTarget");
      const speciesStr = localStorage.getItem("pokemonWordleTargetSpecies");
      const evoStageStr = localStorage.getItem("pokemonWordleTargetEvoStage");
      const isFinalEvoStr = localStorage.getItem(
        "pokemonWordleTargetIsFinalEvo",
      );

      let stateLoaded = false;

      if (guessesStr) {
        setGuesses(JSON.parse(guessesStr) as GuessedPokemon[]);
        stateLoaded = true;
      }

      if (isCorrectStr) {
        setIsCorrect(JSON.parse(isCorrectStr) as boolean);
        stateLoaded = true;
      }

      if (targetStr) {
        setTargetPokemon(JSON.parse(targetStr) as Pokemon);
        stateLoaded = true;
      }

      if (speciesStr) {
        setTargetPokemonSpecies(JSON.parse(speciesStr) as PokemonSpecies);
        stateLoaded = true;
      }

      if (evoStageStr) {
        const stage: number = JSON.parse(evoStageStr) as number;
        console.log(`Loaded evolution stage: ${stage}`);
        setTargetPokemonEvoStage(stage);
        stateLoaded = true;
      }

      if (isFinalEvoStr) {
        setTargetPokemonIsFinalEvo(JSON.parse(isFinalEvoStr) as boolean);
        stateLoaded = true;
      }

      return stateLoaded;
    } catch (error) {
      console.error("Error loading game state from localStorage:", error);
      return false;
    }
  }, [hasMounted]);

  // Load data from localStorage after component has mounted
  useEffect(() => {
    if (hasMounted) {
      const stateLoaded = loadGameState();
      if (!stateLoaded) {
        void fetchNewRandomPokemon();
      }
    }
  }, [hasMounted, loadGameState]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveGameState();
  }, [
    guesses,
    isCorrect,
    targetPokemon,
    targetPokemonSpecies,
    targetPokemonEvoStage,
    targetPokemonIsFinalEvo,
    saveGameState,
  ]);

  // Fetch a new random Pokémon
  const fetchNewRandomPokemon = async () => {
    try {
      const newPokemon = await api.getRandomPokemon();
      const speciesData = await api.getPokemonSpeciesData(
        newPokemon.species.url,
      );

      // Get evolution data in a single call
      const { stage, isFinalEvo } = await analyzeEvolution(
        speciesData.evolution_chain.url,
        newPokemon.name,
      );

      console.log(
        `New Pokémon: ${newPokemon.name}, Stage: ${stage}, Final Evo: ${isFinalEvo}`,
      );

      // Update state with new Pokémon
      setTargetPokemon(newPokemon);
      setTargetPokemonSpecies(speciesData);
      setTargetPokemonEvoStage(stage);
      setTargetPokemonIsFinalEvo(isFinalEvo);
      setGuesses([]);
      setIsCorrect(false);
      setIsGivenUp(false);
      setIsOpen(false); // Close the dialog if it's open

      // Clear localStorage for guesses when starting a new game
      if (hasMounted) {
        localStorage.removeItem("pokemonWordleGuesses");

        // Explicitly save the new values to localStorage
        localStorage.setItem("pokemonWordleTarget", JSON.stringify(newPokemon));
        localStorage.setItem(
          "pokemonWordleTargetSpecies",
          JSON.stringify(speciesData),
        );
        localStorage.setItem(
          "pokemonWordleTargetEvoStage",
          JSON.stringify(stage),
        );
        localStorage.setItem(
          "pokemonWordleTargetIsFinalEvo",
          JSON.stringify(isFinalEvo),
        );
        localStorage.setItem("pokemonWordleIsCorrect", JSON.stringify(false));
      }
    } catch (error) {
      console.error("Failed to fetch new random Pokémon:", error);
    }
  };

  // Add a handler for submit button and enter key
  const handleGuessSubmit = async () => {
    if (guess.trim() === "") return;
    const fullName = helpers.getFullPokemonName(guess.trim());

    // Check if already guessed
    if (
      guesses.some(
        (g) => g.pokemon.name.toLowerCase() === fullName.toLowerCase(),
      )
    ) {
      return;
    }

    try {
      // Fetch Pokémon data
      const guessedPokemon = await api.getPokemonData(fullName);
      const speciesData = await api.getPokemonSpeciesData(
        guessedPokemon.species.url,
      );

      // Get evolution data
      const { stage, isFinalEvo } = await analyzeEvolution(
        speciesData.evolution_chain.url,
        guessedPokemon.name,
      );

      // Add to guesses
      setGuesses((prevGuesses) => [
        ...prevGuesses,
        {
          pokemon: guessedPokemon,
          species: speciesData,
          evoStage: stage,
          isFinalEvo,
        },
      ]);

      // Check if correct
      if (
        guessedPokemon.name.toLowerCase() === targetPokemon?.name.toLowerCase()
      ) {
        setIsCorrect(true);
        setIsOpen(true); // Automatically open the dialog
      }
    } catch (error) {
      console.error("Failed to fetch Pokémon data for the guess:", error);
    }

    setGuess("");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleGuessSubmit();
    }
  };

  const renderComparisonIndicator = (
    guessValue: number | undefined,
    targetValue: number | undefined,
  ) => {
    if (guessValue === targetValue) return null;
    if (targetValue === undefined || guessValue === undefined) return null;

    return targetValue > guessValue ? (
      <ChevronUp className="ml-1" />
    ) : (
      <ChevronDown className="ml-1" />
    );
  };

  // Generate the shareable result string
  const generateShareableResult = () => {
    const resultHeader = `Pokemon Wordle - Guesses: ${isCorrect ? guesses.length : "X"}`;
    const resultBody =
      guesses
        .map((guess) => {
          const targetGenNum = helpers.getGenerationNumber(
            targetPokemonSpecies?.generation.name ?? "",
          );
          const guessGenNum = helpers.getGenerationNumber(
            guess.species.generation.name,
          );

          // Generate row of emojis for the guess
          return [
            targetGenNum === guessGenNum ? "🟩" : "🟥",
            guess.evoStage === targetPokemonEvoStage ? "🟩" : "🟥",
            guess.pokemon.types[0]?.type?.name ===
            targetPokemon?.types[0]?.type?.name
              ? "🟩"
              : guess.pokemon.types[0]?.type?.name ===
                  targetPokemon?.types[1]?.type?.name
                ? "🟨"
                : "🟥", // Type 1
            !targetPokemon?.types[1]
              ? !guess.pokemon.types[1]
                ? "🟩"
                : "🟥"
              : guess.pokemon.types[1]?.type?.name ===
                  targetPokemon?.types[1]?.type?.name
                ? "🟩"
                : guess.pokemon.types[1]?.type?.name ===
                    targetPokemon?.types[0]?.type?.name
                  ? "🟨"
                  : "🟥", // Type 2
            targetPokemon?.weight === guess.pokemon.weight ? "🟩" : "🟥",
            targetPokemon?.height === guess.pokemon.height ? "🟩" : "🟥",
            guess.isFinalEvo === targetPokemonIsFinalEvo ? "🟩" : "🟥",
          ].join("");
        })
        .join("\n") +
      "\n\n" +
      "Play at: pokecompanion.xyz";

    return `${resultHeader}\n\n${resultBody}`;
  };

  const handleShare = () => {
    const result = generateShareableResult();
    navigator.clipboard
      .writeText(result)
      .then(() => {
        setShareMessage("Results copied to clipboard!");
        setTimeout(() => setShareMessage(null), 2000); // Clear message after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy results to clipboard:", error);
      });
  };

  if (!hasMounted) {
    return (
      <div className="flex w-full justify-center p-8">
        Loading Pokémon Wordle...
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* {targetPokemon && (
        <div className="text-muted-foreground mb-4 text-sm">
          Debug - Target: {targetPokemon.name}, Stage: {targetPokemonEvoStage},
          Final: {targetPokemonIsFinalEvo ? "Yes" : "No"} 
        </div>
      )} */}

      <div className="mb-4 flex w-full max-w-3xl flex-row justify-around">
        <Input
          id="guess-pokemon-name"
          placeholder={
            isCorrect || isGivenUp
              ? `Its ${targetPokemon?.name}`
              : "Guess the Pokémon"
          }
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          list="pokemon-suggestions"
          className="mr-2 mb-2"
          disabled={isCorrect || isGivenUp}
        />

        {guess.trim() !== "" && (
          <datalist id="pokemon-suggestions">
            {pokemonList
              ?.filter((pokemon) =>
                helpers
                  .getDisplayPokemonName(pokemon.name)
                  .toLowerCase()
                  .startsWith(guess.toLowerCase()),
              )
              .slice(0, 10)
              .map((pokemon) => (
                <option
                  key={pokemon.name}
                  value={helpers.getDisplayPokemonName(pokemon.name)}
                />
              ))}
          </datalist>
        )}
        <Button
          onClick={handleGuessSubmit}
          className="mb-2"
          disabled={isCorrect || isGivenUp || guess.trim() === ""}
          variant="default"
        >
          Submit
        </Button>
        {/* Removed the New/Give Up button from here */}
      </div>

      <Dialog
        open={isOpen} // Ensure the dialog is controlled by the isOpen state
        onOpenChange={(open) => setIsOpen(open)} // Update state when dialog is closed
      >
        <DialogTrigger asChild>
          <Button className="hidden">Open Modal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle>
              {isCorrect ? (
                <>
                  Correct! The pokemon was {targetPokemon?.name.toUpperCase()}
                </>
              ) : (
                <span className="text-red-500">
                  The pokemon was {targetPokemon?.name.toUpperCase()}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center">
              <span># Tries: {guesses.length}</span>
              <img
                src={
                  targetPokemon?.sprites.other?.["official-artwork"]
                    .front_default ?? "/placeholder.svg"
                }
                alt="pokemon-picture"
                className="mt-4 flex h-60 w-60 items-center justify-center rounded-lg"
              />

              <Button
                onClick={handleShare}
                className="w-full rounded-lg border border-green-400 bg-emerald-600"
              >
                Share
              </Button>
              {shareMessage && (
                <span className="mt-2 text-center text-sm text-green-500">
                  {shareMessage}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col space-y-2 sm:flex-row">
              <Button onClick={() => router.push("/minigames/whosthatpokemon")}>
                Play Whos That Pokémon
              </Button>

              <Button onClick={() => router.push("/minigames/randomon")}>
                Play Rando-Mon
              </Button>
              <Button onClick={fetchNewRandomPokemon}>Play again</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isCorrect && guesses.length > 0 && (
        <div className="mb-4 text-sm text-red-600">
          Incorrect, you have guessed {guesses.length} times.
        </div>
      )}

      <div className="mt-4 w-full max-w-4xl space-y-3">
        {[...guesses].reverse().map((guess, index) => {
          const targetGenNum = helpers.getGenerationNumber(
            targetPokemonSpecies?.generation.name ?? "",
          );
          const guessGenNum = helpers.getGenerationNumber(
            guess.species.generation.name,
          );

          return (
            <Card
              key={index}
              className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <Link
                href={`/pokedex/${guess?.pokemon.name ?? ""}/`}
                target="_blank"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      guess.pokemon.sprites.front_default || "/placeholder.svg"
                    }
                    alt={guess.pokemon.name}
                    className="h-16 w-16"
                  />
                  <div className="flex flex-col capitalize">
                    <span className="font-semibold">{guess.pokemon.name}</span>
                    <span className="text-muted-foreground text-sm">
                      ID: {guess.pokemon.id}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Guess #{guesses.length - index}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                {/* Generation */}
                <div
                  className={`flex items-center justify-between rounded p-2 text-sm ${
                    targetGenNum === guessGenNum
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {helpers.formatGenerationName(
                      guess.species.generation.name,
                    )}
                    {renderComparisonIndicator(guessGenNum, targetGenNum)}
                  </div>
                </div>

                {/* Evolution Stage */}
                <div
                  className={`flex items-center justify-between rounded p-2 text-sm ${
                    guess.evoStage === targetPokemonEvoStage
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <span>Evo Stage</span>
                  <div className="flex items-center">
                    {guess.evoStage}
                    {renderComparisonIndicator(
                      guess.evoStage,
                      targetPokemonEvoStage ?? undefined,
                    )}
                  </div>
                </div>

                {/* Type 1 */}
                <div
                  className={`flex items-center justify-between rounded p-2 text-sm capitalize ${
                    guess.pokemon.types[0]?.type?.name ===
                    targetPokemon?.types[0]?.type?.name
                      ? "bg-green-500 text-white"
                      : guess.pokemon.types[0]?.type?.name ===
                          targetPokemon?.types[1]?.type?.name
                        ? "bg-orange-500 text-white"
                        : "bg-red-500 text-white"
                  }`}
                >
                  <span>Type 1</span>
                  <span>{guess.pokemon.types[0]?.type.name}</span>
                </div>

                {/* Type 2 */}
                <div
                  className={`flex items-center justify-between rounded p-2 text-sm capitalize ${
                    !targetPokemon?.types[1]
                      ? !guess.pokemon.types[1]
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : guess.pokemon.types[1]?.type?.name ===
                          targetPokemon?.types[1]?.type?.name
                        ? "bg-green-500 text-white"
                        : guess.pokemon.types[1]?.type?.name ===
                            targetPokemon?.types[0]?.type?.name
                          ? "bg-orange-500 text-white"
                          : "bg-red-500 text-white"
                  }`}
                >
                  <span>Type 2</span>
                  <span>{guess.pokemon.types[1]?.type.name ?? "none"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Weight */}
                <div
                  className={`flex items-center justify-between rounded p-2 text-sm ${
                    targetPokemon?.weight === guess.pokemon.weight
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <span>Kg</span>
                  <div className="flex items-center">
                    {(guess.pokemon.weight / 10).toFixed(2)}
                    {renderComparisonIndicator(
                      guess.pokemon.weight,
                      targetPokemon?.weight,
                    )}
                  </div>
                </div>

                {/* Height */}
                <div
                  className={`flex items-center justify-between rounded p-2 text-sm ${
                    targetPokemon?.height === guess.pokemon.height
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <span>Meter</span>
                  <div className="flex items-center">
                    {(guess.pokemon.height / 10).toFixed(2)}
                    {renderComparisonIndicator(
                      guess.pokemon.height,
                      targetPokemon?.height,
                    )}
                  </div>
                </div>

                {/* Is Final Evolution */}
                <div
                  className={`col-span-2 flex items-center justify-between rounded p-2 text-sm ${
                    guess.isFinalEvo === targetPokemonIsFinalEvo
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <span>Final Evolution</span>
                  <span>{guess.isFinalEvo ? "Yes" : "No"}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Move the New Pokémon / Give Up button here for better UX */}
      <div className="mt-6 flex w-full max-w-3xl flex-row justify-center"></div>
      {(isCorrect || isGivenUp) && (
        <Button onClick={() => setIsOpen(true)} className="mt-4">
          Show modal
        </Button>
      )}
      <Button
        onClick={() => {
          if (!isCorrect && guesses.length > 0) {
            setIsGivenUp(true);
            setIsOpen(true);
          } else {
            void fetchNewRandomPokemon();
          }
        }}
        variant="default"
        className="mt-4"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {!isCorrect && guesses.length > 0 ? "Give Up" : "New Pokémon"}
      </Button>
    </div>
  );
}
