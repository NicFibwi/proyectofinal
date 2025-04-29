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

export const GenTextColors: Record<string, string> = {
  red: "!text-red-600",
  blue: "!text-sky-500",
  yellow: "!text-yellow-500",
  gold: "!text-amber-500",
  silver: "!text-slate-500",
  crystal: "!text-cyan-500",
  ruby: "!text-red-500",
  sapphire: "!text-blue-500",
  emerald: "!text-emerald-500",
  firered: "!text-red-700",
  leafgreen: "!text-green-500",
  diamond: "!text-teal-500",
  pearl: "!text-pink-500",
  platinum: "!text-blue-500",
  heartgold: "!text-amber-500",
  soulsilver: "!text-slate-500",
  black: "text-black dark:text-gray-400",
  white: "text-gray-500 dark:text-white",
  colosseum: "!text-gray-700",
  xd: "!text-gray-600",
  "black-2": "text-black dark:text-gray-400",
  "white-2": "text-gray-500 dark:text-white",
  x: "!text-blue-500",
  y: "!text-rose-500",
  "omega-ruby": "!text-red-500",
  "alpha-sapphire": "!text-blue-500",
  sun: "!text-yellow-300",
  moon: "!text-purple-300",
  "ultra-sun": "!text-yellow-600",
  "ultra-moon": "!text-purple-700",
  "lets-go-pikachu": "!text-yellow-500",
  "lets-go-eevee": "!text-amber-700",
  sword: "!text-blue-500",
  shield: "!text-purple-500",
  "the-isle-of-armor": "!text-green-500",
  "the-crown-tundra": "!text-blue-700",
  "brilliant-diamond": "!text-blue-500",
  "shining-pearl": "!text-pink-500",
  "legends-arceus": "!text-amber-500",
  scarlet: "!text-red-500",
  violet: "!text-purple-500",
  "the-teal-mask": "!text-teal-500",
  "the-indigo-disk": "!text-indigo-500",
  "red-japan": "!text-red-600",
  "green-japan": "!text-green-500",
  "blue-japan": "!text-sky-500",
  "red-blue": "!text-red-600",
  "gold-silver": "!text-amber-500",
  "firered-leafgreen": "!text-green-500",
  "diamond-pearl": "!text-teal-500",
  "heartgold-soulsilver": "!text-amber-500",
  "black-white": "text-black dark:text-gray-400",
  "black-2-white-2": "text-gray-500 dark:text-white",
  "x-y": "!text-blue-500",
  "omega-ruby-alpha-sapphire": "!text-red-500",
  "sun-moon": "!text-yellow-300",
  "ultra-sun-ultra-moon": "!text-yellow-600",
  "lets-go-pikachu-lets-go-eevee": "!text-yellow-500",
  "sword-shield": "!text-blue-500",
  "brilliant-diamond-and-shining-pearl": "!text-blue-500",
  "scarlet-violet": "!text-red-500",
  "red-green-japan": "!text-red-600",
  "ruby-sapphire": "!text-red-500",
};
