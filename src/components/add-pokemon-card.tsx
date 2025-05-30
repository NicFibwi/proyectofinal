import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import AddPokemonDialog from "./add-pokemon-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function AddPokemonCard({ team_id }: { team_id: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:bg-accent flex h-70 cursor-pointer items-center justify-center transition">
          <Button variant="ghost" size="icon" className="rounded-full">
            <CirclePlus className="h-10 w-10" />
          </Button>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a Pokémon to your team</DialogTitle>
        </DialogHeader>
        <AddPokemonDialog team_id={team_id} />
      </DialogContent>
    </Dialog>
  );
}
