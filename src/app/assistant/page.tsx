"use client";

import { useSearchParams } from "next/navigation";
import PokemasterChat from "~/components/pokemaster-ai-chat";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";

function AssistantPageContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pokémaster AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask questions about Pokémon, strategies, game mechainics, and anything
          pertaining to the Pokémon universe.
        </p>
      </div>

      <SignedOut>
        <div className="flex h-auto w-full items-center justify-center">
          <Card className="h-auto w-65 shadow-xl">
            <CardHeader>
              <CardTitle className="text-md font-bold">
                Pokémaster AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                To access the Pokémaster AI Assistant, please sign in to your
                account.
              </div>
              <div>
                If you don&apos;t have an account, you can create one for free.
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </CardFooter>
          </Card>
        </div>
      </SignedOut>
      <SignedIn>
        <PokemasterChat
          initialMessage={message ? decodeURIComponent(message) : undefined}
        />
      </SignedIn>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense>
      <AssistantPageContent />
    </Suspense>
  );
}
