import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function PokedexPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
        <p className="text-muted-foreground">Database of essential information about Pokémon and game mechanics</p>
      </div>

      <Card className="stagger-item stagger-delay-1 transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Pokémon Database</CardTitle>
          <CardDescription>Browse and search for detailed information on all Pokémon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Pokémon database interface will be implemented here
          </div>
        </CardContent>
      </Card>

      <Card className="stagger-item stagger-delay-2 transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Game Mechanics</CardTitle>
          <CardDescription>Learn about types, abilities, moves, and other game mechanics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Game mechanics information will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

