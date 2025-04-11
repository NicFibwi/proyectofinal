import StatModifiersTable from "./stat-modifier-table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function StatChangeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex h-auto w-full flex-row-reverse justify-between">
          <Button className="mr-4 h-6 w-auto text-xs">
            Learn about stat changes
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className="h-[75%] w-[90%] overflow-y-auto"
        style={{
          maxWidth: "90%",
          maxHeight: "75%",
        }}
      >
        <DialogTitle>Learn about stat changes</DialogTitle>
        <h2 className="mb-4 text-lg font-bold">Detailed Information</h2>
        <p>
          You may have seen around the site we use the terminology of stats
          being raised or lowered by &apos;stages&apos;. This is a reference to
          the stat growth table. When the five battle stats (Attack, Defense,
          Speed, Special Attack, and Special Defense) are modified, the amount
          by which they are modified conforms to a specific calculated
          multiplier.
        </p>
        <p className="mt-2">
          All unmodified stats begin at stage 0. When a stat modifier move is
          used, the stage is increased or decreased accordingly, and then the
          multiplier is applied to the stat. For example, Iron Defense raises
          Defense by two stages. If a Pokémon starts at stage 0 and uses Iron
          Defense, its Defense stat will double. Using Iron Defense again would
          increase the stage to 4, tripling the original stat.
        </p>
        <p className="mt-2">
          The upper limit is 6 stages (4x the original), and the lower limit is
          -6 stages (1/4 the original). Accuracy and Evasion operate on a
          similar but slightly different table, where the default value is 100%,
          and the calculation determines whether an attack hits.
        </p>
        <StatModifiersTable />
      </DialogContent>
    </Dialog>
  );
}
