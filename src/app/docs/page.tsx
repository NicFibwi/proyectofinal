import Link from "next/link";
import { HoverCardEffect } from "~/components/hover-card-effect";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Detailed documentation for your items, moves and abilities
        </p>
      </div>
      <HoverCardEffect key="items">
        <Card
          className={`stagger-item hover:border-primary/20 border-2 border-transparent transition-all duration-300 hover:shadow-md`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {/* <div className="animate-float">{feature.icon}</div> */}
              <CardTitle>Items</CardTitle>
            </div>
            <CardDescription>List of all pokémon items</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/docs/items" className="w-full">
              <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                Explore
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </HoverCardEffect>

      <HoverCardEffect key="machines">
        <Card
          className={`stagger-item hover:border-primary/20 border-2 border-transparent transition-all duration-300 hover:shadow-md`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {/* <div className="animate-float">{feature.icon}</div> */}
              <CardTitle>Machines</CardTitle>
            </div>
            <CardDescription>List of all TMs and HMs</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/docs/machines" className="w-full">
              <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                Explore
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </HoverCardEffect>

      <HoverCardEffect key="moves">
        <Card
          className={`stagger-item hover:border-primary/20 border-2 border-transparent transition-all duration-300 hover:shadow-md`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {/* <div className="animate-float">{feature.icon}</div> */}
              <CardTitle>Moves</CardTitle>
            </div>
            <CardDescription>List of all pokémon moves</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/docs/moves" className="w-full">
              <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                Explore
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </HoverCardEffect>

      <HoverCardEffect key="abilities">
        <Card
          className={`stagger-item hover:border-primary/20 border-2 border-transparent transition-all duration-300 hover:shadow-md`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {/* <div className="animate-float">{feature.icon}</div> */}
              <CardTitle>Abilities</CardTitle>
            </div>
            <CardDescription>List of all pokémon abilities</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/docs/abilities" className="w-full">
              <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                Explore
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </HoverCardEffect>
    </div>
  );
}
