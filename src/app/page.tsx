import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Database, FileText, Bot, Users, Gamepad2, Blocks } from "lucide-react";
import { HoverCardEffect } from "~/components/hover-card-effect";

export default function Home() {
  const features = [
    {
      title: "Pokédex",
      description: "Database for all Pokémon",
      icon: <Database className="h-8 w-8" />,
      href: "/pokedex",
    },
    {
      title: "Pokémon data",
      description: "Data for moves, abilities, items and more",
      icon: <FileText className="h-8 w-8" />,
      href: "/docs",
    },
    {
      title: "Pokémaster",
      description:
        "A Pokémon-trained AI assistant to help you with your journey",
      icon: <Bot className="h-8 w-8" />,
      href: "/assistant",
    },
    {
      title: "Team Builder",
      description:
        "Pokémon team creator and editor with advanced customization",
      icon: <Blocks className="h-8 w-8" />,
      href: "/team-builder",
    },
    {
      title: "Community",
      description:
        "Share teams with the community to improve competitive strategy",
      icon: <Users className="h-8 w-8" />,
      href: "/community",
    },
    {
      title: "Minigames",
      description: "Pokémon-based minigames with new activities every day",
      icon: <Gamepad2 className="h-8 w-8" />,
      href: "/minigames",
    },
  ];

  return (
    <div className="space-y-8 py-6">
      <section className="animate-fade-in space-y-4 text-center">
        <h1 className="animate-pulse-slow text-4xl font-bold tracking-tight lg:text-5xl">
          Welcome to PokéCompanion
        </h1>
        <p className="text-muted-foreground mx-auto max-w-[800px] text-xl">
          Your ultimate companion for all things Pokémon - from team building to
          game mechanics
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <HoverCardEffect key={feature.title}>
            <Card
              className={`stagger-item transition-all duration-300 hover:shadow-md stagger-delay-${index + 1} hover:border-primary/20 border-2 border-transparent`}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="animate-float">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={feature.href} className="w-full">
                  <Button className="hover:bg-primary/90 w-full transition-all duration-200">
                    Explore
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </HoverCardEffect>
        ))}
      </section>
    </div>
  );
}
