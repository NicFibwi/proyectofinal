import PokemonWordle from "~/components/pokemon-wordle";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Pokedle</h1>
        <p className="text-muted-foreground">
          Guess the Pokemon based on your own guesses.
        </p>
      </div>
      <PokemonWordle />
    </div>
  );
}
