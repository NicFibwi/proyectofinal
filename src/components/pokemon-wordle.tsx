"use client";
import { useQuery } from "@tanstack/react-query";
import type { Pokemon, PokemonSpecies } from "~/types/types";
import { Input } from "./ui/input";
import { useState } from "react";
import { Card } from "./ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TypeBadge } from "./ui/typebadge";

const getPokemonList = async (): Promise<Pokemon[]> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }
  const data = await response.json() as { results: Pokemon[] }; // Parse the response as JSON
  return data.results; // Return the 'results' array
};

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

const getRandomPokemon = async (): Promise<Pokemon> => {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  return getPokemonData(randomId.toString());
};

const romanToArabic = (roman: string): number => {
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
};

export default function PokemonWordle() {
  const {
    data: pokemonList,
    isLoading: isLoadingPokemonList,
    isError: isErrorPokemonList,
  } = useQuery({
    queryKey: ["pokemonList"],
    queryFn: () => getPokemonList(),
  });

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<
    { pokemon: Pokemon; species: PokemonSpecies }[]
  >([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [targetPokemon, setTargetPokemon] = useState<Pokemon | null>(null);
  const [targetPokemonSpecies, setTargetPokemonSpecies] =
    useState<PokemonSpecies | null>(null);

  const fetchNewRandomPokemon = async () => {
    try {
      const newPokemon = await getRandomPokemon();
      const speciesData = await getPokemonSpeciesData(newPokemon.species.url);

      setTargetPokemon(newPokemon);
      setTargetPokemonSpecies(speciesData);
      setGuesses([]);
      setIsCorrect(false);
    } catch (error) {
      console.error("Failed to fetch new random Pokémon:", error);
    }
  };

  const suffixMap: Record<string, string> = {
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
  };

  // Function to get the full name of a Pokémon
  const getFullPokemonName = (name: string): string => {
    const baseName = name.toLowerCase();
    return suffixMap[baseName] ? `${baseName}${suffixMap[baseName]}` : baseName;
  };

  // Function to get the display name of a Pokémon
  const getDisplayPokemonName = (name: string): string => {
    const baseName = Object.keys(suffixMap).find((key) =>
      name.toLowerCase().startsWith(key),
    );
    return baseName ?? name;
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && guess.trim() !== "") {
      // Check if the Pokémon has already been guessed
      if (
        guesses.some(
          (g) =>
            g.pokemon.name.toLowerCase() ===
            getFullPokemonName(guess.trim()).toLowerCase(),
        )
      ) {
        alert("You have already guessed this Pokémon!");
        return;
      }

      try {
        // Convert the user's input to the full Pokémon name
        const fullName = getFullPokemonName(guess);

        // Fetch Pokémon data for the entered guess
        const guessedPokemon = await getPokemonData(fullName);

        // Fetch Pokémon species data
        const speciesData = await getPokemonSpeciesData(
          guessedPokemon.species.url,
        );

        // Add both Pokémon and species data to the list of guesses
        setGuesses((prevGuesses) => [
          ...prevGuesses,
          { pokemon: guessedPokemon, species: speciesData },
        ]);

        // Check if the guess is correct
        if (
          guessedPokemon.name.toLowerCase() ===
          targetPokemon?.name.toLowerCase()
        ) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      } catch (error) {
        console.error("Failed to fetch Pokémon data for the guess:", error);
      }

      // Clear the input field
      setGuess("");
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <button
        onClick={fetchNewRandomPokemon}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Create New Random Pokémon
      </button>

      {targetPokemon && <p>{targetPokemon.id}</p>}

      <Input
        id="guess-pokemon-name"
        placeholder="Enter Pokémon name"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={handleKeyDown}
        list="pokemon-suggestions"
      />
      {guess.trim() !== "" && (
        <datalist
          id="pokemon-suggestions"
          style={{
            maxHeight: "50px",
            overflowY: "auto",
          }}
        >
          {pokemonList
            ?.filter((pokemon) =>
              getDisplayPokemonName(pokemon.name)
                .toLowerCase()
                .startsWith(guess.toLowerCase()),
            )
            .map((pokemon) => (
              <option
                key={pokemon.name}
                value={getDisplayPokemonName(pokemon.name)}
              />
            ))}
        </datalist>
      )}

      {isCorrect ? (
        <p className="text-green-500">
          Correct! The Pokémon is {targetPokemon?.name}.
        </p>
      ) : guesses.length > 0 ? (
        <p className="text-red-500">Incorrect! Try again.</p>
      ) : null}

      <div className="mt-4 w-full">
        {guesses.map((pokemon, index) => (
          <Card
            key={index}
            className="mb-2 flex w-full flex-row items-center justify-between p-4"
          >
            <div>
              <img
                src={pokemon.pokemon.sprites.front_default}
                alt={pokemon.pokemon.name}
                className="h-16 w-16"
              />
            </div>
            <div className="flex flex-col items-start rounded p-1">
              <span>ID: {pokemon.pokemon.id}</span>
              <span>Name: {pokemon.pokemon.name}</span>
              <span>Guess: #{guesses.indexOf(pokemon) + 1}</span>
            </div>

            <div
              className={`flex flex-row items-center rounded p-1 ${
                romanToArabic(
                  (targetPokemonSpecies?.generation.name ?? "")
                    .replace("generation-", "")
                    .toUpperCase(),
                ) ===
                romanToArabic(
                  pokemon.species.generation.name
                    .replace("generation-", "")
                    .toUpperCase(),
                )
                  ? "bg-green-500"
                  : romanToArabic(
                        (targetPokemonSpecies?.generation.name ?? "")
                          .replace("generation-", "")
                          .toUpperCase(),
                      ) >
                      romanToArabic(
                        pokemon.species.generation.name
                          .replace("generation-", "")
                          .toUpperCase(),
                      )
                    ? "bg-red-500"
                    : "bg-red-500"
              }`}
            >
              {pokemon.species.generation.name
                .replace("generation-", "Generation ")
                .replace(/\b(\w)/g, (char) => char.toUpperCase())}
              {romanToArabic(
                (targetPokemonSpecies?.generation.name ?? "")
                  .replace("generation-", "")
                  .toUpperCase(),
              ) !==
                romanToArabic(
                  pokemon.species.generation.name
                    .replace("generation-", "")
                    .toUpperCase(),
                ) &&
                (romanToArabic(
                  (targetPokemonSpecies?.generation.name ?? "")
                    .replace("generation-", "")
                    .toUpperCase(),
                ) >
                romanToArabic(
                  pokemon.species.generation.name
                    .replace("generation-", "")
                    .toUpperCase(),
                ) ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                ))}
            </div>

            <div
              className={`flex flex-row items-center rounded p-1 ${
                pokemon?.pokemon.types[0]?.type?.name ===
                targetPokemon?.types[0]?.type?.name
                  ? "bg-green-500"
                  : pokemon?.pokemon.types[0]?.type?.name ===
                      targetPokemon?.types[1]?.type?.name
                    ? "bg-orange-500"
                    : "bg-red-500"
              }`}
            >
              Type 1:
              {" " + pokemon.pokemon.types[0]?.type.name?.toLowerCase()}
            </div>

            <div
              className={`flex flex-row items-center rounded p-1 ${
                !targetPokemon?.types[1]
                  ? !pokemon?.pokemon.types[1]
                    ? "bg-green-500"
                    : pokemon?.pokemon.types[1]?.type?.name ===
                        targetPokemon?.types[0]?.type?.name
                      ? "bg-orange-500"
                      : "bg-red-500"
                  : pokemon?.pokemon.types[1]?.type?.name ===
                      targetPokemon?.types[1]?.type?.name
                    ? "bg-green-500"
                    : pokemon?.pokemon.types[1]?.type?.name ===
                        targetPokemon?.types[0]?.type?.name
                      ? "bg-orange-500"
                      : "bg-red-500"
              }`}
            >
              Type 2:
              {" " +
                (pokemon.pokemon.types[1]?.type.name?.toLowerCase() ?? "none")}
            </div>

            <div
              className={`flex flex-row items-center rounded p-1 ${
                targetPokemon?.weight === pokemon.pokemon.weight
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              Weight:
              {(pokemon.pokemon.weight / 10).toFixed(2)} kg
              {targetPokemon?.weight !== pokemon.pokemon.weight &&
                (targetPokemon?.weight !== undefined && targetPokemon.weight > pokemon.pokemon.weight ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                ))}
            </div>

            <div
              className={`flex flex-row items-center rounded p-1 ${
                targetPokemon?.height === pokemon.pokemon.height
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              Height:
              {(pokemon.pokemon.height / 10).toFixed(2)} m
              {targetPokemon?.height !== pokemon.pokemon.height &&
                (targetPokemon?.height !== undefined && targetPokemon.height > pokemon.pokemon.height ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
