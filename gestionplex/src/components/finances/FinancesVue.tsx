"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Home,
  Plus, X, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { InlineStatut } from "@/components/ui/InlineStatut";
import { CATEGORIES_TRANSACTION_LABELS } from "@/lib/constants";

type Periode = "mois" | "3mois" | "6mois" | "annee";

const COULEURS_DONUT = [
  "#6366f1", "#ef4444", "#f59e0b", "#10b981",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const ICONE_CATEGORIE: Record<string, string> = {
  LOYER: "🏠", STATIONNEMENT: "🚗", BUANDERIE: "🧺", REPARATION: "🔧",
  ASSURANCE: "🛡️", TAXES_MUNICIPALES: "🏛️", TAXES_SCOLAIRES: "🏫",
  HYPOTHEQUE: "🏦", DENEIGEMENT: "❄️", ENTRETIEN: "🔨",
  RENOVATION: "🏗️", ELECTRICITE: "⚡", GAZ: "🔥", AUTRE: "📋",
};

const CATEGORIE_OPTIONS = Object.entries(CATEGORIES_TRANSACTION_LABELS).map(([value, label]) => ({
  value, label,
  bg: "var(--accent)",
}));

const TYPE_OPTIONS = [
  { value: "REVENU",  label: "Revenu",  bg: "var(--success)" },
  { value: "DEPENSE", label: "Dépense", bg: "var(--danger)" },
];

function getDateDebut(periode: Periode): Date {
  const n = new Date();
  switch (periode) {
    case "mois":   return new Date(n.getFullYear(), n.getMonth(), 1);
    case "3mois":  return new Date(n.getFullYear(), n.getMonth() - 2, 1);
    case "6mois":  return new Date(n.getFullYear(), n.getMonth() - 5, 1);
    case "annee":  return new Date(n.getFullYear(), 0, 1);
  }
}

export function FinancesVue() {
  const { transactions, immeubles, getTauxOccupation, refresh } = useAppData();
  const [periode, setPeriode] = useState<Periode>("annee");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  // Form state
  const [fType,        setFType]        = useState<"REVENU" | "DEPENSE">("REVENU");
  const [fDescription, setFDescription] = useState("");
  const [fMontant,     setFMontant]     = useState("");
  const [fCategorie,   setFCategorie]   = useState("LOYER");
  const [fImmeubleId,  setFImmeubleId]  = useState(immeubles[0]?.id ?? "");
  const [fSaving,      setFSaving]      = useState(false);

  const maintenant = new Date();
  const anneeActuelle = maintenant.getFullYear();
  const dateDebut = getDateDebut(periode);

  const txPeriode = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= dateDebut && d <= maintenant;
  });

  const revenus  = txPeriode.filter(t => t.type === "REVENU").reduce((s, t) => s + t.montant, 0);
  const depenses = txPeriode.filter(t => t.type === "DEPENSE").reduce((s, t) => s + t.montant, 0);
  const profit   = revenus - depenses;
  const { taux } = getTauxOccupation();

  const depensesParCat = txPeriode
    .filter(t => t.type === "DEPENSE")
    .reduce<Record<string, number>>((acc, t) => { acc[t.categorie] = (acc[t.categorie] ?? 0) + t.montant; return acc; }, {});
  const donutData = Object.entries(depensesParCat)
    .map(([cat, montant]) => ({ name: CATEGORIES_TRANSACTION_LABELS[cat] ?? cat, value: montant }))
    .sort((a, b) => b.value - a.value);

  const dernieresTx = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12);

  async function updateMontant(txId: string, val: string) {
    await fetch(`/api/transactions/${txId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant: Number(val) }),
    });
    refresh();
  }

  async function updateDescription(txId: string, val: string) {
    await fetch(`/api/transactions/${txId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: val }),
    });
    refresh();
  }

  async function updateCategorie(txId: string, categorie: string) {
    await fetch(`/api/transactions/${txId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categorie }),
    });
    refresh();
  }

  async function updateType(txId: string, type: string) {
    await fetch(`/api/transactions/${txId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    refresh();
  }

  async function ajouterTransaction() {
    if (!fDescription || !fMontant) return;
    setFSaving(true);
    await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: fType,
        description: fDescription,
        montant: Number(fMontant),
        categorie: fCategorie,
        immeubleId: fImmeubleId,
        date: new Date().toISOString(),
      }),
    });
    setFSaving(false);
    setFormulaireOuvert(false);
    setFDescription(""); setFMontant(""); setFCategorie("LOYER");
    refresh();
  }

  const periodes: { val: Periode; label: string }[] = [
    { val: "mois",   label: "Ce mois" },
    { val: "3mois",  label: "3 mois" },
    { val: "6mois",  label: "6 mois" },
    { val: "annee",  label: String(anneeActuelle) },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b px-5 py-4 backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
          Finances
        </h1>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{anneeActuelle}</p>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Filtre période */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {periodes.map(p => (
            <button key={p.val} onClick={() => setPeriode(p.val)}
              className="flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
              style={periode === p.val
                ? { background: "var(--gradient-brand)", color: "white" }
                : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Cartes résumé */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Revenus",   valeur: formatCAD(revenus),  icone: <TrendingUp className="h-4 w-4" />,   color: "var(--success)", bg: "var(--success-muted)" },
            { label: "Dépenses",  valeur: formatCAD(depenses), icone: <TrendingDown className="h-4 w-4" />, color: "var(--danger)",  bg: "var(--danger-muted)" },
            { label: "Profit net",valeur: (profit >= 0 ? "+" : "−") + formatCAD(Math.abs(profit)), icone: <DollarSign className="h-4 w-4" />, color: profit >= 0 ? "var(--success)" : "var(--danger)", bg: profit >= 0 ? "var(--success-muted)" : "var(--danger-muted)" },
            { label: "Occupation",valeur: `${taux.toFixed(0)} %`, icone: <Home className="h-4 w-4" />, color: "var(--accent)", bg: "var(--accent-muted)" },
          ].map((c, i) => (
            <motion.div key={c.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: c.bg, color: c.color }}>
                  {c.icone}
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>{c.label}</span>
              </div>
              <p className="text-xl font-bold tabular-nums" style={{ color: c.color, letterSpacing: "-0.02em" }}>
                {c.valeur}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Donut dépenses */}
        {donutData.length > 0 && (
          <div className="card p-5">
            <h2 className="section-title mb-4">Dépenses par catégorie</h2>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COULEURS_DONUT[i % COULEURS_DONUT.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => [formatCAD(Number(v)), ""]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 12, color: "var(--fg)" }} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Transactions — ÉDITABLES */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Transactions récentes</h2>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Cliquez pour modifier →</span>
          </div>
          <div className="space-y-2">
            {dernieresTx.map(tx => {
              const immeuble = immeubles.find(i => i.id === tx.immeubleId);
              const estRevenu = tx.type === "REVENU";
              return (
                <div key={tx.id} className="card flex items-center gap-3 px-4 py-3">
                  {/* Icône catégorie cliquable */}
                  <InlineStatut
                    value={tx.categorie}
                    options={CATEGORIE_OPTIONS}
                    onSave={val => updateCategorie(tx.id, val)}
                    renderBadge={v => (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                        style={{ background: "var(--bg-secondary)" }}>
                        {ICONE_CATEGORIE[v] ?? "📋"}
                      </div>
                    )}
                  />

                  <div className="min-w-0 flex-1">
                    {/* Description éditable */}
                    <InlineEdit
                      value={tx.description}
                      type="text"
                      className="text-sm font-medium w-full"
                      onSave={val => updateDescription(tx.id, val)}
                    />
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {formatDate(tx.date)}{immeuble ? ` · ${immeuble.nom}` : ""}
                      </span>
                      {/* Type éditable */}
                      <InlineStatut
                        value={tx.type}
                        options={TYPE_OPTIONS}
                        onSave={val => updateType(tx.id, val)}
                        renderBadge={v => (
                          <span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                            style={{ background: v === "REVENU" ? "var(--success-muted)" : "var(--danger-muted)", color: v === "REVENU" ? "var(--success)" : "var(--danger)" }}>
                            {v === "REVENU" ? "Revenu" : "Dépense"}
                          </span>
                        )}
                      />
                    </div>
                  </div>

                  {/* Montant éditable */}
                  <InlineEdit
                    value={tx.montant}
                    type="number"
                    prefix={estRevenu ? "+" : "−"}
                    formatDisplay={v => formatCAD(Number(v))}
                    className={`flex-shrink-0 text-sm font-bold tabular-nums`}
                    onSave={val => updateMontant(tx.id, val)}
                  />
                </div>
              );
            })}
          </div>

          {/* Liens voir tout */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/finances/revenus">
              <div className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "var(--success-muted)", border: "1px solid var(--success-muted)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>Tous les revenus</span>
                <ChevronRight className="h-4 w-4" style={{ color: "var(--success)" }} />
              </div>
            </Link>
            <Link href="/finances/depenses">
              <div className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "var(--danger-muted)", border: "1px solid var(--danger-muted)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Toutes les dépenses</span>
                <ChevronRight className="h-4 w-4" style={{ color: "var(--danger)" }} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* FAB Ajouter */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setFormulaireOuvert(true)}
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-accent)" }}>
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      {/* Sheet — Ajouter une transaction */}
      <AnimatePresence>
        {formulaireOuvert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFormulaireOuvert(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pb-10 pt-6"
              style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)" }}>

              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
                  Nouvelle transaction
                </h2>
                <button onClick={() => setFormulaireOuvert(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type */}
                <div className="grid grid-cols-2 gap-2">
                  {(["REVENU", "DEPENSE"] as const).map(t => (
                    <button key={t} onClick={() => setFType(t)}
                      className="rounded-xl py-2.5 text-sm font-semibold transition-all"
                      style={fType === t
                        ? { background: t === "REVENU" ? "var(--success)" : "var(--danger)", color: "white" }
                        : { background: "var(--bg-secondary)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                      {t === "REVENU" ? "Revenu" : "Dépense"}
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>Description</label>
                  <input value={fDescription} onChange={e => setFDescription(e.target.value)}
                    type="text" placeholder="Ex: Loyer janvier"
                    className="h-11 w-full rounded-xl px-4 text-sm focus:outline-none"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)", color: "var(--fg)" }}
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>

                {/* Montant */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>Montant ($)</label>
                  <input value={fMontant} onChange={e => setFMontant(e.target.value)}
                    type="number" placeholder="0.00"
                    className="h-11 w-full rounded-xl px-4 text-sm focus:outline-none"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)", color: "var(--fg)" }}
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>Catégorie</label>
                  <select value={fCategorie} onChange={e => setFCategorie(e.target.value)}
                    className="h-11 w-full rounded-xl px-4 text-sm focus:outline-none"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)", color: "var(--fg)" }}>
                    {Object.entries(CATEGORIES_TRANSACTION_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Immeuble */}
                {immeubles.length > 1 && (
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>Immeuble</label>
                    <select value={fImmeubleId} onChange={e => setFImmeubleId(e.target.value)}
                      className="h-11 w-full rounded-xl px-4 text-sm focus:outline-none"
                      style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)", color: "var(--fg)" }}>
                      {immeubles.map(i => <option key={i.id} value={i.id}>{i.nom}</option>)}
                    </select>
                  </div>
                )}

                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={ajouterTransaction}
                  disabled={!fDescription || !fMontant || fSaving}
                  className="btn-primary w-full justify-center rounded-xl py-3 text-sm"
                  style={{ opacity: !fDescription || !fMontant ? 0.5 : 1 }}>
                  {fSaving ? "Enregistrement…" : "Enregistrer"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
