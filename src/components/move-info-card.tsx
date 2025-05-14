import type { MoveInfo } from "~/types/types";
import { Card, CardContent, CardTitle } from "./ui/card";
import { TypeBadge } from "./ui/typebadge";
import Image from "next/image";
export default function MoveInfoCard({ move }: { move: MoveInfo }) {
  return (
    <Card className="mb-6 flex h-auto w-full flex-col items-center justify-center">
      <CardTitle className="text-lg font-bold capitalize">
        <h3>Move ID: {move.id}</h3>
      </CardTitle>
      <CardContent className="w-full space-y-4">
        {/* Combat Info */}
        <div className="h-auto w-full">
          <h3 className="text-lg font-bold">Combat Info</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between border-b-1">
              <span>Type:</span>
              <span className="flex flex-row">
                <TypeBadge
                  type={{
                    slot: 1,
                    type: {
                      name: move.type.name.toLowerCase(),
                      url: "#",
                    },
                  }}
                />
              </span>
            </div>
            <div className="flex justify-between border-b-1">
              <span>Power:</span>
              <span>{move.power ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b-1">
              <span>Accuracy:</span>
              <span>{move.accuracy ? `${move.accuracy}%` : "—"}</span>
            </div>
            <div className="flex justify-between border-b-1">
              <span>PP:</span>
              <span>{move.pp ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b-1">
              <span>Priority:</span>
              <span>{move.priority}</span>
            </div>
            {move.effect_chance && (
              <div className="flex justify-between border-b-1">
                <span>Effect Chance:</span>
                <span>{move.effect_chance}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="h-auto w-full">
          <h3 className="text-lg font-bold">Additional Information</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between border-b-1">
              <span>Damage Class:</span>
              <span className="flex flex-row capitalize">
                {move?.damage_class?.name}
                {move?.damage_class?.name && (
                  <Image
                    src={`/icons/${
                      move.damage_class.name === "status"
                        ? "status_move_icon"
                        : move.damage_class.name === "physical"
                          ? "physical_move_icon"
                          : "special_move_icon"
                    }.png`}
                    alt={`${move.damage_class.name} icon`}
                    loading="lazy"
                    height={6}
                    width={6}
                  />
                )}
              </span>
            </div>
            {move.meta && (
              <>
                <div className="flex justify-between border-b-1">
                  <span>Critical Rate:</span>
                  <span>
                    {(() => {
                      const critRateStages = [6.25, 12.5, 25, 33.33, 50];
                      return `${critRateStages[move.meta.crit_rate]}%`;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Healing:</span>
                  <span>{move.meta.healing}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Drain:</span>
                  <span>
                    {move.meta.drain >= 0
                      ? `${move.meta.drain}% (HP Drain)`
                      : `${Math.abs(move.meta.drain)}% (Recoil)`}
                  </span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Flinch Chance:</span>
                  <span>{move.meta.flinch_chance ?? "—"}%</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Stat Chance:</span>
                  <span>{move.meta.stat_chance ?? "—"}%</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Ailment:</span>
                  <span className="capitalize">
                    {move.meta.ailment?.name ?? "None"}
                  </span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Ailment Chance:</span>
                  <span>{move.meta.ailment_chance ?? "—"}%</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Min Hits:</span>
                  <span>{move.meta.min_hits ?? "—"}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Max Hits:</span>
                  <span>{move.meta.max_hits ?? "—"}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Min Turns:</span>
                  <span>{move.meta.min_turns ?? "—"}</span>
                </div>
                <div className="flex justify-between border-b-1">
                  <span>Max Turns:</span>
                  <span>{move.meta.max_turns ?? "—"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
