"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import {
  Database,
  FileText,
  Bot,
  Users,
  Gamepad2,
  Home,
  Menu,
  CircleUserRound,
  Blocks,
  Settings,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

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
    name: "Pokémaster AI",
    href: "/assistant",
    icon: <Bot className="mr-2 h-4 w-4" />,
    description: "A Pokémon-trained AI assistant to answer questions",
  },
  {
    name: "Team Builder",
    href: "/team-builder",
    icon: <Blocks className="mr-2 h-4 w-4" />,
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
  const currentTheme = useTheme();
  const { isSignedIn, user } = useUser();

  // Check if user is admin (assuming role is stored in publicMetadata.role)
  const isAdmin =
    isSignedIn &&
    user?.publicMetadata &&
    (user.publicMetadata.role === "admin" ||
      (Array.isArray(user.publicMetadata.role) &&
        user.publicMetadata.role.includes("admin")));

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex size-full h-16 w-full items-center justify-between">
        {/* Left Section: Site Name */}
        <div className="ml-4 flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">PokéCompanion</span>
          </Link>
        </div>

        {/* Mid Section: Navigation */}
        <div className="hidden items-center gap-4 xl:flex">
          <NavigationMenu>
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
        </div>

        {/* Theme Toggle */}
        <div className="mr-4 flex flex-row items-center">
          {/* Admin Button (visible only to admins) */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="icon"
                className="transition-transform duration-200 hover:scale-110"
              >
                <Settings />
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <div className="space-around flex items-center">
            <SignedOut>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="h-8 w-20 border-2 p-2"
                  title="Sign In"
                >
                  <span>Sign in</span>
                  <CircleUserRound />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  baseTheme: currentTheme.theme === "dark" ? dark : undefined,
                }}
              />
            </SignedIn>
          </div>
          <div className="flex items-center gap-4 xl:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <span className="flex items-center">
                        {item.icon}
                        {item.name}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
