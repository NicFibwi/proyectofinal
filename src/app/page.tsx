import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { Database, FileText, Bot, Users, Gamepad2 } from "lucide-react"
import { HoverCardEffect } from "~/components/hover-card-effect"

export default function Home() {
  const features = [
    {
      title: "Pokédex",
      description: "Database of essential information about Pokémon and game mechanics",
      icon: <Database className="h-8 w-8" />,
      href: "/pokedex",
    },
    {
      title: "Documentation",
      description: "Detailed documentation to answer questions about the game",
      icon: <FileText className="h-8 w-8" />,
      href: "/docs",
    },
    {
      title: "AI Assistant",
      description: "A Pokémon-trained AI assistant to answer questions",
      icon: <Bot className="h-8 w-8" />,
      href: "/assistant",
    },
    {
      title: "Team Builder",
      description: "Pokémon team creator and editor with advanced customization",
      icon: <Users className="h-8 w-8" />,
      href: "/team-builder",
    },
    {
      title: "Community",
      description: "Share teams with the community to improve competitive strategy",
      icon: <Users className="h-8 w-8" />,
      href: "/community",
    },
    {
      title: "Minigames",
      description: "Pokémon-based minigames with new activities every day",
      icon: <Gamepad2 className="h-8 w-8" />,
      href: "/minigames",
    },
  ]

  return (
    <div className="space-y-8 py-6">
      <section className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl animate-pulse-slow">Welcome to PokéCompanion</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          Your ultimate companion for all things Pokémon - from team building to game mechanics
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {features.map((feature, index) => (
          <HoverCardEffect key={feature.title}>
            <Card
              className={`transition-all duration-300 hover:shadow-md stagger-item stagger-delay-${index + 1} border-2 border-transparent hover:border-primary/20`}
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
                  <Button className="w-full transition-all duration-200 hover:bg-primary/90">Explore</Button>
                </Link>
              </CardFooter>
            </Card>
          </HoverCardEffect>
        ))}
      </section>
    </div>
  )
}

