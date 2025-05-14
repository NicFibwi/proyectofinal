"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"

export default function CommunityPage() {
  return (
    <div className="space-y-4 px-3 py-4 sm:space-y-5 md:space-y-6 md:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-2xl md:text-3xl">Community</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Share teams with the community to improve competitive strategy
        </p>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-4 md:px-6">
          <CardTitle className="text-xl md:text-2xl">Community posts</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Check out what information valuable members of the Pokémon community are sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-4 md:px-6">
          <Tabs defaultValue="pokemon">
            <TabsList className="mb-4 flex w-full flex-wrap gap-2">
              <TabsTrigger value="pokemon" className="flex-1 text-sm sm:text-base">
                Pokemon X
              </TabsTrigger>
              <TabsTrigger value="leaks" className="flex-1 text-sm sm:text-base">
                Pokemon Leaks
              </TabsTrigger>
              <TabsTrigger value="tiempo" className="flex-1 text-sm sm:text-base">
                Poke Tiempo
              </TabsTrigger>
            </TabsList>
            <div className="rounded-lg border">
              <TabsContent value="pokemon">
                <iframe
                  src="https://widgets.sociablekit.com/twitter-feed/iframe/25556800"
                  width="100%"
                  height="500"
                  className="h-[400px] rounded-lg sm:h-[500px] md:h-[600px] lg:h-[800px]"
                  title="Pokemon X Twitter Feed"
                ></iframe>
              </TabsContent>
              <TabsContent value="leaks">
                <iframe
                  src="https://widgets.sociablekit.com/twitter-feed/iframe/25556835"
                  width="100%"
                  height="500"
                  className="h-[400px] rounded-lg sm:h-[500px] md:h-[600px] lg:h-[800px]"
                  title="Pokemon Leaks Twitter Feed"
                ></iframe>
              </TabsContent>
              <TabsContent value="tiempo">
                <iframe
                  src="https://widgets.sociablekit.com/twitter-feed/iframe/25556839"
                  width="100%"
                  height="500"
                  className="h-[400px] rounded-lg sm:h-[500px] md:h-[600px] lg:h-[800px]"
                  title="Poke Tiempo Twitter Feed"
                ></iframe>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
