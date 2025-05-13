"use client";

import { useState, useEffect, useRef } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
} from "~/components/ui/command";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2, RefreshCw, Trophy } from "lucide-react";
import type { Result, Pokemon, PokemonList } from "~/types/types";
import { dark } from "@clerk/themes";

const queryClient = new QueryClient();
function PokemonGameContent() {
  const [randomPokemonId, setRandomPokemonId] = useState<number>(
    Math.floor(Math.random() * 1025) + 1,
  );
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [openCommandMenu, setOpenCommandMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [revealedName, setRevealedName] = useState<string>("");
  const [tries, setTries] = useState(0); // New state for counting tries

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch all Pokemon names for autocomplete
  const { data: pokemonList } = useQuery({
    queryKey: ["pokemonList"],
    queryFn: async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025",
      );
      const json = (await response.json()) as PokemonList;
      const data: PokemonList = json;
      return data.results;
    },
  });

  // Fetch the current random Pokemon
  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemon", randomPokemonId],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`,
      );
      const data: Pokemon = (await response.json()) as Pokemon;
      return data;
    },
  });

  // Draw the silhouette when the Pokemon data is loaded
  useEffect(() => {
    if (pokemon?.sprites?.other?.["official-artwork"]?.front_default) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = pokemon.sprites.other["official-artwork"].front_default;

      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Create silhouette effect
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
    }
  }, [pokemon]);

  // Filter Pokemon names based on user input
  useEffect(() => {
    if (pokemonList && guess.length > 0) {
      const filtered = pokemonList.filter((p: Result) =>
        p.name.toLowerCase().includes(guess.toLowerCase()),
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [guess, pokemonList]);

  useEffect(() => {
    if (pokemon) {
      setRevealedName(""); // Start with no letter revealed
    }
  }, [pokemon]);

  const handleGuess = (pokemonName: string) => {
    setGuess(pokemonName);
    setOpenCommandMenu(false);

    setTries(tries + 1); // Increment tries on each guess

    if (pokemon && pokemonName.toLowerCase() === pokemon.name.toLowerCase()) {
      setScore(score + 1);
      setIsCorrect(true);
      setShowAnswer(true);
    } else {
      setIsCorrect(false);
      setShowAnswer(false);

      // Reveal the next letter of the Pokémon's name
      if (pokemon) {
        const nextLetterIndex = revealedName.length;
        if (nextLetterIndex < pokemon.name.length) {
          setRevealedName(pokemon.name.slice(0, nextLetterIndex + 1));
        }
      }
    }
  };

  const handleNextPokemon = () => {
    setRandomPokemonId(Math.floor(Math.random() * 1025) + 1);
    setGuess("");
    setShowAnswer(false);
    setIsCorrect(false);
    setOpenCommandMenu(false);
    setRevealedName(""); // Reset the revealed name
    setTries(0); // Reset tries counter
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="mt-4 text-lg">Loading Pokémon...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p- flex h-64 flex-col items-center justify-center">
          <p className="text-destructive">
            Error loading Pokémon. Please try again.
          </p>
          <Button onClick={handleNextPokemon} className="mt-4">
            Try Another Pokémon
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Who&apos;s That Pokémon?</CardTitle>
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5" />
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="text-muted-foreground text-center text-sm">
          Tries: {tries} {/* Display the tries counter */}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative flex w-full justify-center">
          {/* Silhouette canvas */}
          <div
            className={`transition-opacity duration-300 ${showAnswer ? "opacity-0" : "opacity-100"}`}
          >
            <canvas ref={canvasRef} className="h-auto max-h-64 max-w-full" />
          </div>

          {/* Reveal image */}
          {showAnswer && pokemon && (
            <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300">
              <img
                src={
                  pokemon.sprites.other?.["official-artwork"]?.front_default ??
                  "/placeholder.svg"
                }
                alt={pokemon.name}
                className="h-auto max-h-64 max-w-full"
              />
            </div>
          )}
        </div>

        <div className="w-full text-center">
          {!showAnswer && (
            <div className="text-muted-foreground text-lg font-bold">
              {revealedName +
                "_".repeat(pokemon!.name.length - revealedName.length)}
            </div>
          )}
        </div>

        {!showAnswer ? (
          <div className="w-full space-y-4">
            <div className="relative flex items-center justify-center">
              <Command className="w-full sm:w-2/3">
                <CommandInput
                  placeholder="Type a Pokémon name..."
                  value={guess}
                  onValueChange={(value) => setGuess(value)}
                  onFocus={() => setOpenCommandMenu(true)}
                />
                {openCommandMenu && (
                  <CommandList>
                    <CommandGroup>
                      <div className="max-h-40 overflow-y-auto">
                        {pokemonList
                          ?.filter((p: Result) =>
                            p.name.toLowerCase().includes(guess.toLowerCase()),
                          )
                          .map((pokemon: Result) => (
                            <CommandItem
                              key={pokemon.name}
                              onSelect={() => handleGuess(pokemon.name)}
                            >
                              {pokemon.name.charAt(0).toUpperCase() +
                                pokemon.name.slice(1)}
                            </CommandItem>
                          ))}
                      </div>
                    </CommandGroup>
                    <CommandEmpty>No Pokémon found.</CommandEmpty>
                  </CommandList>
                )}
              </Command>
            </div>
          </div>
        ) : (
          <div className="w-full text-center">
            <div
              className={`text-xl font-bold ${isCorrect ? "text-green-600" : "text-destructive"}`}
            >
              {isCorrect
                ? "Correct! The pokemon is: " +
                  pokemon!.name.charAt(0).toUpperCase() +
                  pokemon?.name.slice(1)
                : `It's ${pokemon!.name.charAt(0).toUpperCase() + pokemon?.name.slice(1)}!`}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center gap-2">
        {!showAnswer ? (
          <>
            <Button onClick={() => handleGuess(guess)} disabled={!guess}>
              Guess
            </Button>
            <Button onClick={handleReveal} variant="outline">
              Reveal
            </Button>
          </>
        ) : (
          <Button onClick={handleNextPokemon}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Next Pokémon
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function PokemonGame() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonGameContent />
    </QueryClientProvider>
  );
}
