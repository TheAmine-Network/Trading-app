"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Home, Plus, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { CATEGORIES_TRANSACTION_LABELS } from "@/lib/constants";

type Periode = "mois" | "3mois" | "6mois" | "annee";

const COULEURS_DONUT = [
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

const ICONE_CATEGORIE: Record<string, string> = {
  LOYER: "🏠",
  STATIONNEMENT: "🚗",
  BUANDERIE: "🧺",
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

function getDateDebutPeriode(periode: Periode): Date {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const mois = maintenant.getMonth();

  switch (periode) {
    case "mois":
      return new Date(annee, mois, 1);
    case "3mois":
      return new Date(annee, mois - 2, 1);
    case "6mois":
      return new Date(annee, mois - 5, 1);
    case "annee":
      return new Date(annee, 0, 1);
  }
}

export function FinancesVue() {
  const { transactions, immeubles, getTauxOccupation } = useAppData();
  const [periode, setPeriode] = useState<Periode>("annee");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const maintenant = new Date();
  const anneeActuelle = maintenant.getFullYear();
  const dateDebut = getDateDebutPeriode(periode);
  const dateFin = maintenant;

  const txPeriode = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= dateDebut && d <= dateFin;
  });

  const revenus = txPeriode
    .filter((t) => t.type === "REVENU")
    .reduce((sum, t) => sum + t.montant, 0);

  const depenses = txPeriode
    .filter((t) => t.type === "DEPENSE")
    .reduce((sum, t) => sum + t.montant, 0);

  const profit = revenus - depenses;
  const { taux } = getTauxOccupation();

  // Données pour le donut
  const depensesParCategorie = txPeriode
    .filter((t) => t.type === "DEPENSE")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.categorie] = (acc[t.categorie] ?? 0) + t.montant;
      return acc;
    }, {});

  const donutData = Object.entries(depensesParCategorie)
    .map(([cat, montant]) => ({
      name: CATEGORIES_TRANSACTION_LABELS[cat] ?? cat,
      value: montant,
    }))
    .sort((a, b) => b.value - a.value);

  // Dernières transactions
  const dernieresTx = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const periodes: { val: Periode; label: string }[] = [
    { val: "mois", label: "Ce mois" },
    { val: "3mois", label: "3 mois" },
    { val: "6mois", label: "6 mois" },
    { val: "annee", label: anneeActuelle.toString() },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Finances
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{anneeActuelle}</p>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Filtre période */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {periodes.map((p) => (
            <button
              key={p.val}
              onClick={() => setPeriode(p.val)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                periode === p.val
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Cartes résumé */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Revenus</span>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatCAD(revenus)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2 text-red-500">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Dépenses</span>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatCAD(depenses)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2 text-blue-600">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Profit net</span>
            </div>
            <p
              className={`mt-2 text-xl font-bold ${
                profit >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {profit >= 0 ? "+" : ""}
              {formatCAD(profit)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2 text-purple-600">
              <Home className="h-4 w-4" />
              <span className="text-xs font-medium">Occupation</span>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {taux.toFixed(0)} %
            </p>
          </motion.div>
        </div>

        {/* Donut dépenses */}
        {donutData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="mb-4 text-sm font-semibold text-gray-500">
              Dépenses par catégorie
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COULEURS_DONUT[index % COULEURS_DONUT.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCAD(Number(value)), ""]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "#6b7280" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Transactions récentes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500">
              Transactions récentes
            </h2>
          </div>
          <div className="space-y-2">
            {dernieresTx.map((tx) => {
              const immeuble = immeubles.find((i) => i.id === tx.immeubleId);
              const estRevenu = tx.type === "REVENU";
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-lg dark:bg-gray-800">
                    {ICONE_CATEGORIE[tx.categorie] ?? "📋"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(tx.date)}
                      {immeuble ? ` · ${immeuble.nom}` : ""}
                    </p>
                  </div>
                  <p
                    className={`flex-shrink-0 text-sm font-semibold ${
                      estRevenu ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {estRevenu ? "+" : "-"}
                    {formatCAD(tx.montant)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Liens voir tout */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/finances/revenus">
              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800/50 dark:bg-green-900/20">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Tous les revenus
                </span>
                <ChevronRight className="h-4 w-4 text-green-600" />
              </div>
            </Link>
            <Link href="/finances/depenses">
              <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/50 dark:bg-red-900/20">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Toutes les dépenses
                </span>
                <ChevronRight className="h-4 w-4 text-red-500" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bouton flottant Ajouter */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setFormulaireOuvert(true)}
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30"
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      {/* Formulaire ajout transaction */}
      <AnimatePresence>
        {formulaireOuvert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormulaireOuvert(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-5 pb-10 pt-6 dark:bg-gray-950"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Ajouter une transaction
                </h2>
                <button
                  onClick={() => setFormulaireOuvert(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="rounded-xl border-2 border-green-500 bg-green-50 py-2.5 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Revenu
                    </button>
                    <button className="rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 dark:border-gray-700">
                      Dépense
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Loyer janvier"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Montant ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFormulaireOuvert(false)}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
                >
                  Enregistrer
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
