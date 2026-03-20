"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/animations/CountUp";
import { cn } from "@/lib/utils";

interface StatCardProps {
  titre: string;
  valeur: number;
  enCAD?: boolean;
  suffixe?: string;
  tendance?: number; // pourcentage de changement
  icone: React.ReactNode;
  couleurIcone?: string;
  delay?: number;
}

export function StatCard({
  titre,
  valeur,
  enCAD = false,
  suffixe = "",
  tendance,
  icone,
  couleurIcone = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", couleurIcone)}>
          {icone}
        </div>
        {tendance !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              tendance >= 0
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {tendance >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(tendance).toFixed(1)} %
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{titre}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
          <CountUp valeur={valeur} enCAD={enCAD} suffixe={suffixe} />
        </p>
      </div>
    </motion.div>
  );
}
