"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "~/app/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PostHogProvider>
        <QueryClientProvider client={new QueryClient()}>
          <ClerkProvider>{children}</ClerkProvider>
        </QueryClientProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}
