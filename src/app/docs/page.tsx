import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">Detailed documentation to answer questions about the game</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Guides</CardTitle>
          <CardDescription>Comprehensive guides for beginners and advanced players</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">Game guides will be implemented here</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Terms and Concepts</CardTitle>
          <CardDescription>Detailed explanations of key terms and concepts in the Pokémon world</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">Key terms and concepts will be implemented here</div>
        </CardContent>
      </Card>
    </div>
  )
}

