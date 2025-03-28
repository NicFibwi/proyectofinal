import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">Share teams with the community to improve competitive strategy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Sharing</CardTitle>
          <CardDescription>Share your teams and discover teams from other trainers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">Team sharing interface will be implemented here</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Discussions</CardTitle>
          <CardDescription>Discuss competitive strategies with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Strategy discussion forum will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

