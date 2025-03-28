"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import {
  Database,
  FileText,
  Bot,
  Users,
  Gamepad2,
  Home,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { useMobile } from "~/hooks/use-mobile";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    name: "Pokédex",
    href: "/pokedex",
    icon: <Database className="mr-2 h-4 w-4" />,
    description:
      "Database of essential information about Pokémon and game mechanics",
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: <FileText className="mr-2 h-4 w-4" />,
    description: "Detailed documentation to answer questions about the game",
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: <Bot className="mr-2 h-4 w-4" />,
    description: "A Pokémon-trained AI assistant to answer questions",
  },
  {
    name: "Team Builder",
    href: "/team-builder",
    icon: <Users className="mr-2 h-4 w-4" />,
    description: "Pokémon team creator and editor with advanced customization",
  },
  {
    name: "Community",
    href: "/community",
    icon: <Users className="mr-2 h-4 w-4" />,
    description:
      "Share teams with the community to improve competitive strategy",
  },
  {
    name: "Minigames",
    href: "/minigames",
    icon: <Gamepad2 className="mr-2 h-4 w-4" />,
    description: "Pokémon-based minigames with new activities every day",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Section: Site Name */}
        <div className="ml-4 flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">PokéCompanion</span>
          </Link>
        </div>

        {/* Mid Section: Navigation */}
        <div className="flex items-center gap-4">
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item, index) => (
                  <NavigationMenuItem
                    key={item.href}
                    className={`stagger-item stagger-delay-${index + 1}`}
                  >
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === item.href && "bg-accent",
                          "transition-all duration-200 hover:scale-105",
                        )}
                      >
                        <span className="flex items-center">
                          {item.icon}
                          {item.name}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <ThemeToggle />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Profile"
                  />
                  <AvatarFallback>TR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">Trainer</p>
                  <p className="text-muted-foreground text-xs leading-none">
                    trainer@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>My Teams</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* Right section: Auth */}
        <div></div>
      </div>
    </header>
  );
}
