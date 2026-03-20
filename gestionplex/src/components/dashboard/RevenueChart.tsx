"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCAD } from "@/lib/formatters";

interface DonneesMois {
  mois: string;
  revenus: number;
  depenses: number;
}

interface RevenueChartProps {
  donnees: DonneesMois[];
}

function TooltipPersonnalisé({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: p.fill }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {p.dataKey === "revenus" ? "Revenus" : "Dépenses"}:
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCAD(p.value)}
            </span>
          </div>
        ))}
        <div className="mt-2 border-t border-gray-100 pt-2 text-xs dark:border-gray-800">
          <span className="text-gray-500">Profit net: </span>
          <span
            className={
              payload[0].value - (payload[1]?.value || 0) >= 0
                ? "font-semibold text-green-600"
                : "font-semibold text-red-500"
            }
          >
            {formatCAD(payload[0].value - (payload[1]?.value || 0))}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function RevenueChart({ donnees }: RevenueChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={donnees}
          barGap={4}
          barSize={20}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,0,0,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="mois"
            tick={{ fontSize: 11, fill: "#6e6e73" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6e6e73" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip content={<TooltipPersonnalisé />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="revenus" fill="#2563eb" radius={[6, 6, 0, 0]} />
          <Bar dataKey="depenses" fill="#f87171" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
