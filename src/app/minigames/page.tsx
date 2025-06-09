"use client";
import { CircleHelp, Keyboard, Shuffle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function MinigamesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minigames</h1>
        <p className="text-muted-foreground">
          Play Pokémon-based minigames to pass the time!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unlimited minigames</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:justify-evenly">
            <Card className="h-45 max-w-sm flex-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="animate-float">
                    <Keyboard />
                  </div>
                  <CardTitle>Pokedle</CardTitle>
                </div>
                <CardDescription>
                  Guess a random pokemon based with info from your own guesses.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/minigames/pokedle" className="w-full">
                  <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="h-45 max-w-sm flex-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="animate-float">
                    <CircleHelp />
                  </div>
                  <CardTitle>Who&apos;s That Pokémon?</CardTitle>
                </div>
                <CardDescription>
                  Test your knowledge by guessing the Pokémon silhouette.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/minigames/whosthatpokemon" className="w-full">
                  <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="h-45 max-w-sm flex-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="animate-float">
                    <Shuffle />
                  </div>
                  <CardTitle>Rando-Mon</CardTitle>
                </div>
                <CardDescription>
                  Create a pokemon based on random pokemon&apos;s attributes,
                  and defeat a random opponent.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/minigames/randomon" className="w-full">
                  <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily minigames</CardTitle>
          <CardDescription>COMING SOON</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:justify-evenly">
            <Card className="h-45 max-w-sm flex-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="animate-float">
                    <Keyboard />
                  </div>
                  <CardTitle>Daily Pokedle</CardTitle>
                </div>
              </CardHeader>
              <CardFooter>
                <Link href="" className="w-full cursor-not-allowed">
                  <Button
                    className="hover:bg-primary/90 w-full cursor-not-allowed transition-all duration-200"
                    disabled
                  >
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="h-45 max-w-sm flex-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="animate-float">
                    <CircleHelp />
                  </div>
                  <CardTitle>Daily Who&apos;s That Pokémon?</CardTitle>
                </div>
              </CardHeader>
              <CardFooter>
                <Link href="" className="w-full cursor-not-allowed">
                  <Button
                    className="hover:bg-primary/90 w-full cursor-not-allowed transition-all duration-200"
                    disabled
                  >
                    Play
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
