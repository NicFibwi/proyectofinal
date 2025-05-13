  "use client";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

  export default function CommunityPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Share teams with the community to improve competitive strategy
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Team Sharing</CardTitle>
            <CardDescription>
              Share your teams and discover teams from other trainers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pokemon">
              <TabsList>
                <TabsTrigger value="pokemon">Pokemon X</TabsTrigger>
                <TabsTrigger value="discover">Discover Teams</TabsTrigger>
              </TabsList>
              <TabsContent value="pokemon">
                <div className="flex justify-center p-4"></div>
              </TabsContent>
              <TabsContent value="discover">
                <div className="text-muted-foreground p-8 text-center">
                  Discover teams from other trainers will be implemented here
                </div>
              </TabsContent>
            </Tabs>
            ;
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Strategy Discussions</CardTitle>
            <CardDescription>Discuss competitive strategies with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-muted-foreground">
              Strategy discussion forum will be implemented here
            </div>
          </CardContent>
        </Card> */}
      </div>
    );
  }
