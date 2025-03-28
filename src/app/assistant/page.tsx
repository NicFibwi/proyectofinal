import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">A Pokémon-trained AI assistant to answer questions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pokémon Assistant</CardTitle>
          <CardDescription>Ask questions about Pokémon, strategies, and game mechanics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">AI assistant interface will be implemented here</div>
        </CardContent>
      </Card>
    </div>
  )
}

