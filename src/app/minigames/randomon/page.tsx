import RandomPokemon from "~/components/random-pokemon";

export default function RandomonPage() {
  return (
    <div className="h-full w-full space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Rando-Mon</h1>
        <p className="text-muted-foreground">
          Create a pokemon based on random pokemon&apos;s attributes. Choose each
          attribute in hopes of defeating the opponent.
        </p>
      </div>
      <RandomPokemon />
    </div>
  );
}
