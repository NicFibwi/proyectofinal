import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGenerationName(gen: string) {
  const formattedGen = gen
    .replace("generation-", " ")
    .replace(/-/g, " ")
    .replace(/Lets Go\s*/gi, "LG ")
    .replace(/Ultra\s*/gi, "U ")
    .replace(/Omega\s*/gi, "O ")
    .replace(/Alpha\s*/gi, "A ");

  return formattedGen;
}
