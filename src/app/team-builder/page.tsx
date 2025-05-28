import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function TeamBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Team Builder</h1>
        <p className="text-muted-foreground">Pokémon team creator and editor with advanced customization</p>
      </div>

      <Card className="stagger-item stagger-delay-1 transition-all duration-300 hover:shadow-md">
        <SignedOut>
          Please sign in to use the Team Builder.
          
          </SignedOut>
        <SignedIn>
          </SignedIn>
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

