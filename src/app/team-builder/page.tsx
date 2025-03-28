import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function TeamBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Team Builder</h1>
        <p className="text-muted-foreground">Pokémon team creator and editor with advanced customization</p>
      </div>

      <Card className="stagger-item stagger-delay-1 transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Create and Edit Teams</CardTitle>
          <CardDescription>Build and customize your Pokémon teams with advanced options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Team builder interface will be implemented here with options for:
            <ul className="list-disc list-inside mt-4 text-left space-y-2">
              {[
                "Pokémon name",
                "Ability and Secret Ability",
                "Nature",
                "Equipped Item",
                "Attacks",
                "EVs (Effort Values) and IVs (Individual Values)",
              ].map((item, index) => (
                <li
                  key={item}
                  className={`transition-all duration-300 hover:translate-x-2 stagger-item stagger-delay-${index + 1}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="stagger-item stagger-delay-2 transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle>Import and Export</CardTitle>
          <CardDescription>Import and export teams in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Import and export functionality will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

