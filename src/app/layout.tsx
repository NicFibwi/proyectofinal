import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "~/components/navbar";
import PageTransition from "~/components/page-transition";
import { Providers } from "~/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokéCompanion",
  description: "Your ultimate Pokémon companion app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="container mx-auto flex-1 px-4 py-6">
              <PageTransition>{children}</PageTransition>
            </main>
            <footer className="border-t py-4">
              <div className="text-muted-foreground container mx-auto text-center text-sm">
                Proyecto Final {new Date().getFullYear()} - Nicolai Marlon
                Schirmer.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
