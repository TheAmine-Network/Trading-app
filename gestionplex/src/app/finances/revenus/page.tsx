"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Building2 } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { CATEGORIES_TRANSACTION_LABELS, ICONE_CATEGORIE } from "@/lib/constants";

export default function RevenusPage() {
  const { transactions, immeubles } = useAppData();
  const [immeubleFiltre, setImmeubleFiltre] = useState("tous");

  const revenus = transactions
    .filter(t => t.type === "REVENU")
    .filter(t => immeubleFiltre === "tous" || t.immeubleId === immeubleFiltre)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = revenus.reduce((s, t) => s + t.montant, 0);

  // Revenus par catégorie
  const parCategorie = revenus.reduce<Record<string, number>>((acc, t) => {
    acc[t.categorie] = (acc[t.categorie] ?? 0) + t.montant;
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="pb-24">
        {/* En-tête */}
        <div className="sticky top-0 z-40 border-b px-5 py-4 backdrop-blur-xl"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <div className="flex items-center gap-3">
            <Link href="/finances"
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "var(--bg-secondary)" }}>
              <ArrowLeft className="h-4 w-4" style={{ color: "var(--fg-muted)" }} />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
                Revenus
              </h1>
              <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                {revenus.length} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Total */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5" style={{ color: "var(--success)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>Total des revenus</span>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--success)", letterSpacing: "-0.03em" }}>
              {formatCAD(total)}
            </p>
          </motion.div>

          {/* Répartition par catégorie */}
          {Object.entries(parCategorie).length > 0 && (
            <div className="card p-4">
              <h2 className="section-title mb-3">Répartition</h2>
              <div className="space-y-2">
                {Object.entries(parCategorie)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, montant]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-base">{ICONE_CATEGORIE[cat] ?? "💰"}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium" style={{ color: "var(--fg)" }}>
                            {CATEGORIES_TRANSACTION_LABELS[cat] ?? cat}
                          </span>
                          <span className="text-xs font-bold" style={{ color: "var(--success)" }}>
                            {formatCAD(montant)}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "var(--bg-tertiary)" }}>
                          <div className="h-1.5 rounded-full" style={{
                            background: "var(--success)",
                            width: `${(montant / total) * 100}%`,
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Filtre immeuble */}
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <button onClick={() => setImmeubleFiltre("tous")}
              className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1"
              style={immeubleFiltre === "tous"
                ? { background: "var(--fg)", color: "var(--bg)" }
                : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
              <Building2 className="h-3 w-3" /> Tous
            </button>
            {immeubles.map(imm => (
              <button key={imm.id} onClick={() => setImmeubleFiltre(imm.id)}
                className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                style={immeubleFiltre === imm.id
                  ? { background: "var(--fg)", color: "var(--bg)" }
                  : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
                {imm.nom}
              </button>
            ))}
          </div>

          {/* Liste */}
          <div className="space-y-2">
            {revenus.map((tx, i) => {
              const immeuble = immeubles.find(im => im.id === tx.immeubleId);
              return (
                <motion.div key={tx.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="card flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ background: "var(--bg-secondary)" }}>
                    {ICONE_CATEGORIE[tx.categorie] ?? "💰"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>
                      {tx.description}
                    </p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {formatDate(tx.date)}{immeuble ? ` · ${immeuble.nom}` : ""}
                    </p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)", opacity: 0.8 }}>
                      {CATEGORIES_TRANSACTION_LABELS[tx.categorie] ?? tx.categorie}
                    </p>
                  </div>
                  <p className="flex-shrink-0 text-sm font-bold tabular-nums" style={{ color: "var(--success)" }}>
                    +{formatCAD(tx.montant)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {revenus.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <TrendingUp className="h-10 w-10" style={{ color: "var(--border)" }} />
              <p style={{ color: "var(--fg-muted)" }}>Aucun revenu pour ce filtre</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
