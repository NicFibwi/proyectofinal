"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function MinigamesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minigames</h1>
        <p className="text-muted-foreground">
          Pokémon-based minigames with new activities every day
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Challenges</CardTitle>
          <CardDescription>
            New Pokémon-based activities every day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground p-8 text-center">
            Daily challenges interface will be implemented here
          </div>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/minigames/pokedle")}
          >
            Play Pokedle
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share Results</CardTitle>
          <CardDescription>
            Share your minigame results with friends and the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground p-8 text-center">
            Results sharing functionality will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
