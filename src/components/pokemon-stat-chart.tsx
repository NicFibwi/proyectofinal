"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { ResponsiveContainer } from "recharts";
import { useMemo } from "react";

interface PokemonStat {
  name: string;
  base_stat: number;
  color: string;
}

interface PokemonStatsChartProps {
  stats: PokemonStat[];
  id: number;
  name: string;
}

const statNames = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp.Atk",
  "special-defense": "Sp.Def",
  speed: "Speed",
};

const getStatColor = (value: number) => {
  if (value <= 50) {
    // Transition from dark red (rgb(139, 0, 0)) to yellow (rgb(255, 255, 0))
    const percentage = value / 50;
    const red = Math.round(139 + (255 - 139) * percentage); // Increase red
    const green = Math.round(0 + 255 * percentage); // Increase green
    return `rgb(${red}, ${green}, 0)`;
  } else if (value <= 155) {
    // Transition from yellow (rgb(255, 255, 0)) to green (rgb(0, 255, 0))
    const percentage = (value - 50) / (155 - 50);
    const red = Math.round(255 * (1 - percentage)); // Decrease red
    const green = Math.round(255); // Green stays at max
    return `rgb(${red}, ${green}, 0)`;
  } else {
    // Transition from green (rgb(0, 255, 0)) to blue (rgb(0, 255, 255))
    const percentage = (value - 155) / (255 - 155);
    const green = Math.round(255 * (1 - percentage)); // Decrease green
    const blue = Math.round(255 * percentage); // Increase blue
    return `rgb(0, ${green}, ${blue})`;
  }
};

const scaleStatValue = (value: number) => {
  return value;
};

export function PokemonStatsChart({ stats, id, name }: PokemonStatsChartProps) {
  const baseStatTotal = stats.reduce(
    (total, stat) => total + stat.base_stat,
    0,
  );

  const chartData = useMemo(() => {
    return stats.map((stat, index) => ({
      id: `${id}-${stat.name}-${index}`, // Unique identifier
      stat: `${statNames[stat.name as keyof typeof statNames] || stat.name} (${stat.base_stat})`,
      value: scaleStatValue(stat.base_stat),
      color: getStatColor(stat.base_stat),
    }));
  }, [stats, id]);

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle className="capitalize">
            Base Stats - {baseStatTotal}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="flex h-auto items-center justify-start"
          config={{}}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="flex items-center justify-start"
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 50,
              }}
              barCategoryGap={100}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <YAxis
                type="category"
                dataKey="stat"
                axisLine={false}
                tickLine={false}
                tickMargin={0}
                width={15}
                // tick={{ fontSize: 9 }}
              />
              <XAxis
                type="number"
                domain={[0, 255]}
                axisLine={false}
                tickLine={false}
                tickCount={6}
              />
              {/* Use Cell components instead of fill property on Bar */}
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={15}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${id}-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label: string) => `${label}`}
                    formatter={(value: ValueType) => [
                      `${value as number}/255`,
                      "Base Stat",
                    ]}
                  />
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
