"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { TypeBadge } from "./ui/typebadge";
import { type Pokemon } from "../types/types";
import { type MoveInfo } from "../types/types";

const getMoveInfo = async (moveName: string): Promise<MoveInfo> => {
  const response = await fetch("https://pokeapi.co/api/v2/move/" + moveName);
  if (!response.ok) {
    throw new Error("Failed to fetch move data");
  }
  return response.json() as Promise<MoveInfo>;
};

interface PokemonMovesTableProps {
  pokemon: Pokemon;
}

export default function PokemonMovesTable({ pokemon }: PokemonMovesTableProps) {
  const [moveData, setMoveData] = useState<Record<string, MoveInfo | null>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchMoveData = async () => {
      const data: Record<string, MoveInfo | null> = {};
      for (const move of pokemon.moves) {
        try {
          const moveInfo = await getMoveInfo(move.move.name);
          data[move.move.name] = moveInfo;
        } catch {
          data[move.move.name] = null; // Handle failed fetch
        }
      }
      setMoveData(data);
    };

    fetchMoveData();
  }, [pokemon.moves]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedMoves = [...pokemon.moves].sort((a, b) => {
    const moveA = moveData[a.move.name];
    const moveB = moveData[b.move.name];

    if (!moveA || !moveB) return 0;

    let valueA: string | number | null = null;
    let valueB: string | number | null = null;

    switch (sortColumn) {
      case "name":
        valueA = a.move.name;
        valueB = b.move.name;
        break;
      case "type":
        valueA = moveA.type?.name ?? "";
        valueB = moveB.type?.name ?? "";
        break;
      case "accuracy":
        valueA = moveA.accuracy ?? 0;
        valueB = moveB.accuracy ?? 0;
        break;
      case "damage":
        valueA = moveA.power ?? 0;
        valueB = moveB.power ?? 0;
        break;
      case "damage_class":
        valueA = moveA.damage_class?.name ?? ""; // Handle undefined or null
        valueB = moveB.damage_class?.name ?? ""; // Handle undefined or null
        break;
      case "learnMethod":
        valueA = a.version_group_details[0]?.move_learn_method?.name ?? "";
        valueB = b.version_group_details[0]?.move_learn_method?.name ?? "";
        break;
      default:
        return 0;
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Move Name
            </TableHead>
            <TableHead
              onClick={() => handleSort("type")}
              className="cursor-pointer"
            >
              Type
            </TableHead>
            <TableHead
              onClick={() => handleSort("damage_class")}
              className="cursor-pointer"
            >
              Class
            </TableHead>
            <TableHead
              onClick={() => handleSort("accuracy")}
              className="cursor-pointer"
            >
              Accuracy
            </TableHead>
            <TableHead
              onClick={() => handleSort("damage")}
              className="cursor-pointer"
            >
              Damage
            </TableHead>
            <TableHead
              onClick={() => handleSort("learnMethod")}
              className="cursor-pointer"
            >
              Learn Method
            </TableHead>
            <TableHead className="cursor-pointer">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMoves.map((move, index) => {
            const moveInfo = moveData[move.move.name];
            return (
              <TableRow key={index}>
                {/* Move Name */}
                <TableCell className="font-medium capitalize">
                  {move.move.name.replace(/-/g, " ")}
                </TableCell>

                {/* Move Type */}
                <TableCell>
                  {moveInfo?.type && (
                    <TypeBadge
                      type={{
                        slot: 0,
                        type: {
                          name: moveInfo.type.name.toLowerCase(),
                          url: "#",
                        },
                      }}
                    />
                  )}
                </TableCell>

                {/* Class */}
                <TableCell>
                  {moveInfo?.damage_class?.name && (
                    <img
                      src={`/icons/${
                        moveInfo.damage_class.name === "status"
                          ? "status_move_icon"
                          : moveInfo.damage_class.name === "physical"
                            ? "physical_move_icon"
                            : "special_move_icon"
                      }.png`}
                      alt={`${moveInfo.damage_class.name} icon`}
                      className="h-6 w-6"
                    />
                  )}
                </TableCell>

                {/* Accuracy */}
                <TableCell>{moveInfo?.accuracy ?? "N/A"}</TableCell>

                {/* Damage */}
                <TableCell>{moveInfo?.power ?? "N/A"}</TableCell>

                {/* Learn Method */}
                <TableCell>
                  {move.version_group_details[0]?.move_learn_method?.name
                    ? move.version_group_details[0].move_learn_method.name ===
                      "level-up"
                      ? `Level ${move.version_group_details[0].level_learned_at}`
                      : move.version_group_details[0].move_learn_method.name
                          .charAt(0)
                          .toUpperCase() +
                        move.version_group_details[0].move_learn_method.name.slice(
                          1,
                        )
                    : "N/A"}
                </TableCell>

                {/* Description */}
                <TableCell>
                  {moveInfo?.effect_entries[0]?.short_effect ?? "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
