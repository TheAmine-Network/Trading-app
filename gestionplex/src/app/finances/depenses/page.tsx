"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { transactions, immeubles } from "@/lib/mock-data";
import { formatCAD, formatDate } from "@/lib/formatters";
import { CATEGORIES_TRANSACTION_LABELS } from "@/lib/constants";

const ICONE_CATEGORIE: Record<string, string> = {
  REPARATION: "🔧",
  ASSURANCE: "🛡️",
  TAXES_MUNICIPALES: "🏛️",
  TAXES_SCOLAIRES: "🏫",
  HYPOTHEQUE: "🏦",
  DENEIGEMENT: "❄️",
  ENTRETIEN: "🔨",
  RENOVATION: "🏗️",
  ELECTRICITE: "⚡",
  GAZ: "🔥",
  AUTRE: "📋",
};

export default function DepensesPage() {
  const [immeubleFiltre, setImmeubleFiltre] = useState<string>("tous");

  const depenses = transactions
    .filter((t) => t.type === "DEPENSE")
    .filter((t) => immeubleFiltre === "tous" || t.immeubleId === immeubleFiltre)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = depenses.reduce((sum, t) => sum + t.montant, 0);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <div className="min-h-screen">
          {/* En-tête */}
          <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
            <div className="flex items-center gap-3">
              <Link
                href="/finances"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Dépenses
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {depenses.length} transactions
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5">
            {/* Total */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800/50 dark:bg-red-900/20"
            >
              <div className="flex items-center gap-2 text-red-500">
                <TrendingDown className="h-5 w-5" />
                <span className="text-sm font-medium">Total des dépenses</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCAD(total)}
              </p>
            </motion.div>

            {/* Filtre immeuble */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setImmeubleFiltre("tous")}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  immeubleFiltre === "tous"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                Tous
              </button>
              {immeubles.map((imm) => (
                <button
                  key={imm.id}
                  onClick={() => setImmeubleFiltre(imm.id)}
                  className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    immeubleFiltre === imm.id
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {imm.nom}
                </button>
              ))}
            </div>

            {/* Liste */}
            <div className="space-y-2">
              {depenses.map((tx, i) => {
                const immeuble = immeubles.find((im) => im.id === tx.immeubleId);
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-lg dark:bg-gray-800">
                      {ICONE_CATEGORIE[tx.categorie] ?? "💸"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(tx.date)}
                        {immeuble ? ` · ${immeuble.nom}` : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {CATEGORIES_TRANSACTION_LABELS[tx.categorie] ?? tx.categorie}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-sm font-semibold text-red-500">
                      -{formatCAD(tx.montant)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {depenses.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <TrendingDown className="h-10 w-10 text-gray-300" />
                <p className="text-gray-500">Aucune dépense pour ce filtre</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
