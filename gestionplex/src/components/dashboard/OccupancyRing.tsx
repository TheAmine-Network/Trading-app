"use client";

import { motion } from "framer-motion";

interface OccupancyRingProps {
  nbOccupes: number;
  nbTotal: number;
  taux: number;
}

export function OccupancyRing({ nbOccupes, nbTotal, taux }: OccupancyRingProps) {
  const rayon = 36;
  const circonference = 2 * Math.PI * rayon;
  const segment = (taux / 100) * circonference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88">
          {/* Fond */}
          <circle
            cx="44"
            cy="44"
            r={rayon}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100 dark:text-gray-800"
          />
          {/* Progression animée */}
          <motion.circle
            cx="44"
            cy="44"
            r={rayon}
            fill="none"
            stroke="#2563eb"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circonference}`}
            initial={{ strokeDashoffset: circonference }}
            animate={{ strokeDashoffset: circonference - segment }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
            {Math.round(taux)} %
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Taux d&apos;occupation</p>
        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {nbOccupes}/{nbTotal} logements
        </p>
        <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
          {nbOccupes === nbTotal ? "✓ Pleinement occupé" : `${nbTotal - nbOccupes} disponible(s)`}
        </p>
      </div>
    </div>
  );
}
