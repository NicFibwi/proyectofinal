"use client";

import type React from "react";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useTheme } from "next-themes";

export default function PokemasterChat({
  initialMessage,
}: {
  initialMessage?: string;
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat", // Using the correct API endpoint
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [initialMessageSent, setInitialMessageSent] = useState(false);

  // Set mounted to true after the component has mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add this ref declaration near the top of the component, after other hooks
  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Replace the existing useEffect for initialMessage with this updated version
  // Automatically set the input and submit the form if an initialMessage is provided
  useEffect(() => {
    if (initialMessage && !initialMessageSent && mounted) {
      // Set a flag to prevent multiple submissions
      setInitialMessageSent(true);

      // Create a synthetic event to update the input
      const event = {
        target: { value: initialMessage },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(event);

      // Use setTimeout to ensure the input is set before submitting
      setTimeout(() => {
        // Create a custom submit event
        const submitEvent = new Event("submit", {
          cancelable: true,
        }) as unknown as React.FormEvent<HTMLFormElement>;
        handleSubmit(submitEvent);
      }, 800);
    }
  }, [
    initialMessage,
    handleInputChange,
    handleSubmit,
    initialMessageSent,
    mounted,
  ]);

  const isDarkMode = theme === "dark";

  if (!mounted) {
    return null; // Or a loading spinner if preferred
  }

  return (
    <div className={`flex min-h-screen flex-col`}>
      <div className="container mx-auto flex max-w-4xl flex-1 flex-col p-4">
        <Card
          className={`flex flex-1 flex-col border-none shadow-xl backdrop-blur-sm`}
        >
          <CardHeader className={"rounded-t-lg"}>
            <CardTitle className="flex items-center gap-2">
              {isLoading && (
                <img
                  src="/icons/transparent_pokeball.png"
                  alt=""
                  className={`h-6 w-6 animate-pulse rounded-full bg-amber-400`}
                />
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="max-h-160 flex-1 space-y-4 overflow-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="max-w-md space-y-4">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full`}
                  >
                    <img
                      src="/icons/transparent_pokeball.png"
                      alt=""
                      className={`h-16 w-16 animate-pulse`}
                    />
                  </div>
                  <h3 className={`text-xl font-medium`}>
                    Welcome to Pokémaster!
                  </h3>
                  <p>
                    Ask me anything about Pokémon - from game strategies to
                    lore, and I&apos;ll do my best to help you out!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-blue-600" : ""}`}
                  >
                    {/* Format the message content with line breaks and styling */}
                    <div className="whitespace-pre-wrap">
                      {message.content
                        .split("**")
                        .map((part, i) =>
                          i % 2 === 0 ? part : <strong key={i}>{part}</strong>,
                        )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`max-w-[80%] rounded-2xl rounded-tl-none px-4 py-3`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 animate-bounce rounded-full`}
                    ></div>
                    <div
                      className={`h-2 w-2 animate-bounce rounded-full`}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className={`h-2 w-2 animate-bounce rounded-full`}
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          {/* <style jsx>{`
            .max-h-160 {
              max-height: 40rem;
              overflow-y: auto;
            }
          `}</style> */}

          <CardFooter className={`border-t p-4`}>
            {/* Update the form element to include the ref */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex w-full gap-2"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about anything Pokémon."
                className={`flex-1`}
                disabled={isLoading}
              />
              <Button
                ref={submitButtonRef}
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
