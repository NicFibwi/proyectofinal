"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const pokemonTypes = [
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "fire",
    label: "Fire",
  },
  {
    value: "water",
    label: "Water",
  },
  {
    value: "electric",
    label: "Electric",
  },
  {
    value: "grass",
    label: "Grass",
  },
  {
    value: "ice",
    label: "Ice",
  },
  {
    value: "fighting",
    label: "Fighting",
  },
  {
    value: "poison",
    label: "Poison",
  },
  {
    value: "ground",
    label: "Ground",
  },
  {
    value: "flying",
    label: "Flying",
  },
  {
    value: "psychic",
    label: "Psychic",
  },
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "rock",
    label: "Rock",
  },
  {
    value: "ghost",
    label: "Ghost",
  },
  {
    value: "dragon",
    label: "Dragon",
  },
  {
    value: "dark",
    label: "Dark",
  },
  {
    value: "steel",
    label: "Steel",
  },
  {
    value: "fairy",
    label: "Fairy",
  },
];

export function PokemonTypeCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? pokemonTypes.find((type) => type.value === value)?.label
            : "Select Pokémon type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Pokémon type..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Pokémon type found.</CommandEmpty>
            <CommandGroup>
              {pokemonTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {type.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === type.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
