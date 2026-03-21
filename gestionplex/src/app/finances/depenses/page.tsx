"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown, Building2 } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import {
  CATEGORIES_TRANSACTION_LABELS,
  ICONE_CATEGORIE,
  TYPE_TRANSACTION_LABELS,
  TYPE_TRANSACTION_COLOR,
  TYPE_TRANSACTION_BG,
  isDepenseExploitation,
  isServiceDette,
  isDepenseCapital,
} from "@/lib/constants";

// Types affichés dans cette page (tout ce qui n'est pas un revenu pur)
const TYPES_CHARGES = [
  "DEPENSE_EXPLOITATION", "DEPENSE", "DEPENSE_CAPITAL",
  "REMBOURSEMENT_HYPOTHEQUE", "TRANSFERT", "DEPOT_CAUTION",
];

type Vue = "tout" | "exploitation" | "capital" | "hypotheque";

const VUES: { val: Vue; label: string }[] = [
  { val: "tout",        label: "Tout" },
  { val: "exploitation",label: "Exploitation" },
  { val: "capital",     label: "CapEx" },
  { val: "hypotheque",  label: "Hypothèque" },
];

export default function DepensesPage() {
  const { transactions, immeubles } = useAppData();
  const [immeubleFiltre, setImmeubleFiltre] = useState("tous");
  const [vue, setVue] = useState<Vue>("tout");

  const charges = transactions
    .filter(t => TYPES_CHARGES.includes(t.type))
    .filter(t => immeubleFiltre === "tous" || t.immeubleId === immeubleFiltre)
    .filter(t => {
      if (vue === "exploitation") return isDepenseExploitation(t.type, t.categorie);
      if (vue === "capital")      return isDepenseCapital(t.type);
      if (vue === "hypotheque")   return isServiceDette(t.type, t.categorie);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExploitation = charges.filter(t => isDepenseExploitation(t.type, t.categorie)).reduce((s, t) => s + t.montant, 0);
  const totalCapex        = charges.filter(t => isDepenseCapital(t.type)).reduce((s, t) => s + t.montant, 0);
  const totalDette        = charges.filter(t => isServiceDette(t.type, t.categorie)).reduce((s, t) => s + t.montant, 0);
  const totalAffiche      = charges.reduce((s, t) => s + t.montant, 0);

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
                Charges
              </h1>
              <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                {charges.length} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Résumé 3 colonnes */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Exploitation", montant: totalExploitation, color: "var(--danger)",  bg: "var(--danger-muted)" },
              { label: "CapEx",        montant: totalCapex,        color: "var(--warning)", bg: "var(--warning-muted)" },
              { label: "Hypothèque",   montant: totalDette,        color: "var(--accent)",  bg: "var(--accent-muted)" },
            ].map(c => (
              <div key={c.label} className="card p-3">
                <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--fg-muted)" }}>{c.label}</p>
                <p className="text-sm font-bold tabular-nums" style={{ color: c.color }}>{formatCAD(c.montant)}</p>
              </div>
            ))}
          </div>

          {/* Total affiché */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-5 w-5" style={{ color: "var(--danger)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>
                Total {vue === "tout" ? "des charges" : VUES.find(v2 => v2.val === vue)?.label}
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--danger)", letterSpacing: "-0.03em" }}>
              {formatCAD(totalAffiche)}
            </p>
          </motion.div>

          {/* Filtres vue */}
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {VUES.map(v2 => (
              <button key={v2.val} onClick={() => setVue(v2.val)}
                className="flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
                style={vue === v2.val
                  ? { background: "var(--gradient-brand)", color: "white" }
                  : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
                {v2.label}
              </button>
            ))}
          </div>

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
            {charges.map((tx, i) => {
              const immeuble = immeubles.find(im => im.id === tx.immeubleId);
              const typeLabel = TYPE_TRANSACTION_LABELS[tx.type] ?? tx.type;
              const typeColor = TYPE_TRANSACTION_COLOR[tx.type] ?? "var(--danger)";
              const typeBg    = TYPE_TRANSACTION_BG[tx.type] ?? "var(--danger-muted)";

              return (
                <motion.div key={tx.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="card flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ background: "var(--bg-secondary)" }}>
                    {ICONE_CATEGORIE[tx.categorie] ?? "💸"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>
                      {tx.description}
                    </p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {formatDate(tx.date)}{immeuble ? ` · ${immeuble.nom}` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {CATEGORIES_TRANSACTION_LABELS[tx.categorie] ?? tx.categorie}
                      </span>
                      <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ background: typeBg, color: typeColor }}>
                        {typeLabel}
                      </span>
                    </div>
                    {/* Scission hypothèque */}
                    {tx.type === "REMBOURSEMENT_HYPOTHEQUE" && (tx.portionInteret || tx.portionCapital) && (
                      <div className="flex gap-3 mt-1 text-xs" style={{ color: "var(--fg-muted)" }}>
                        {tx.portionInteret ? <span>🏦 Intérêts : {formatCAD(tx.portionInteret)}</span> : null}
                        {tx.portionCapital ? <span>📉 Capital : {formatCAD(tx.portionCapital)}</span> : null}
                      </div>
                    )}
                    {/* Amortissement CapEx */}
                    {tx.type === "DEPENSE_CAPITAL" && tx.dureeUtileAns && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--warning)" }}>
                        🏗️ Amortissement : {tx.dureeUtileAns} ans
                        {" · "}{formatCAD(tx.montant / tx.dureeUtileAns)}/an
                      </p>
                    )}
                  </div>
                  <p className="flex-shrink-0 text-sm font-bold tabular-nums" style={{ color: typeColor }}>
                    −{formatCAD(tx.montant)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {charges.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <TrendingDown className="h-10 w-10" style={{ color: "var(--border)" }} />
              <p style={{ color: "var(--fg-muted)" }}>Aucune charge pour ce filtre</p>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
