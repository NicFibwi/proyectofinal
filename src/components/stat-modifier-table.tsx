"use client";

import { Card, CardContent, CardTitle } from "./ui/card";

export default function StatModifiersTable() {
  const statGrowthTable = [
    { stage: -6, multiplier: "2 / 8", percentage: "25%" },
    { stage: -5, multiplier: "2 / 7", percentage: "29%" },
    { stage: -4, multiplier: "2 / 6", percentage: "33%" },
    { stage: -3, multiplier: "2 / 5", percentage: "40%" },
    { stage: -2, multiplier: "2 / 4", percentage: "50%" },
    { stage: -1, multiplier: "2 / 3", percentage: "67%" },
    { stage: 0, multiplier: "2 / 2", percentage: "100%" },
    { stage: 1, multiplier: "3 / 2", percentage: "150%" },
    { stage: 2, multiplier: "4 / 2", percentage: "200%" },
    { stage: 3, multiplier: "5 / 2", percentage: "250%" },
    { stage: 4, multiplier: "6 / 2", percentage: "300%" },
    { stage: 5, multiplier: "7 / 2", percentage: "350%" },
    { stage: 6, multiplier: "8 / 2", percentage: "400%" },
  ];

  const accuracyEvasionTable = [
    { stage: -6, multiplier: "9 / 3", percentage: "300%" },
    { stage: -5, multiplier: "8 / 3", percentage: "267%" },
    { stage: -4, multiplier: "7 / 3", percentage: "233%" },
    { stage: -3, multiplier: "6 / 3", percentage: "200%" },
    { stage: -2, multiplier: "5 / 3", percentage: "167%" },
    { stage: -1, multiplier: "4 / 3", percentage: "133%" },
    { stage: 0, multiplier: "3 / 3", percentage: "100%" },
    { stage: 1, multiplier: "3 / 4", percentage: "75%" },
    { stage: 2, multiplier: "3 / 5", percentage: "60%" },
    { stage: 3, multiplier: "3 / 6", percentage: "50%" },
    { stage: 4, multiplier: "3 / 7", percentage: "43%" },
    { stage: 5, multiplier: "3 / 8", percentage: "38%" },
    { stage: 6, multiplier: "3 / 9", percentage: "33%" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="p-4 text-lg font-bold">
          Stat Growth Table
        </CardTitle>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Stage</th>
                <th className="border border-gray-300 p-2">Multiplier</th>
                <th className="border border-gray-300 p-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {statGrowthTable.map((row) => (
                <tr key={row.stage}>
                  <td className="border border-gray-300 p-2 text-center">
                    {row.stage}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {row.multiplier}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {row.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardTitle className="p-4 text-lg font-bold">
          Accuracy and Evasion Table
        </CardTitle>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Stage</th>
                <th className="border border-gray-300 p-2">Multiplier</th>
                <th className="border border-gray-300 p-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {accuracyEvasionTable.map((row) => (
                <tr key={row.stage}>
                  <td className="border border-gray-300 p-2 text-center">
                    {row.stage}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {row.multiplier}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {row.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Learn More</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Detailed Information</DialogTitle>
          <h2 className="mb-4 text-lg font-bold">Detailed Information</h2>
          <p>
            You may have seen around the site we use the terminology of stats
            being raised or lowered by 'stages'. This is a reference to the stat
            growth table. When the five battle stats (Attack, Defense, Speed,
            Special Attack, and Special Defense) are modified, the amount by
            which they are modified conforms to a specific calculated
            multiplier.
          </p>
          <p className="mt-2">
            All unmodified stats begin at stage 0. When a stat modifier move is
            used, the stage is increased or decreased accordingly, and then the
            multiplier is applied to the stat. For example, Iron Defense raises
            Defense by two stages. If a Pokémon starts at stage 0 and uses Iron
            Defense, its Defense stat will double. Using Iron Defense again
            would increase the stage to 4, tripling the original stat.
          </p>
          <p className="mt-2">
            The upper limit is 6 stages (4x the original), and the lower limit
            is -6 stages (1/4 the original). Accuracy and Evasion operate on a
            similar but slightly different table, where the default value is
            100%, and the calculation determines whether an attack hits.
          </p>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
