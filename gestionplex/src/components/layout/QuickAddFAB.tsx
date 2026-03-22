"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useAppData } from "@/lib/DataContext";
import { CATEGORIES_PAR_TYPE, CATEGORIES_TRANSACTION_LABELS } from "@/lib/constants";

const TYPES_RAPIDES = [
  { value: "REVENU",               label: "Revenu",   icone: <TrendingUp  className="h-4 w-4" />, bg: "var(--success)", defaultCat: "LOYER" },
  { value: "DEPENSE_EXPLOITATION", label: "Dépense",  icone: <TrendingDown className="h-4 w-4" />, bg: "var(--danger)",  defaultCat: "REPARATION" },
];

export function QuickAddFAB() {
  const pathname = usePathname();
  const { immeubles, refresh } = useAppData();

  const [open, setOpen]         = useState(false);
  const [type, setType]         = useState("DEPENSE_EXPLOITATION");
  const [montant, setMontant]   = useState("");
  const [desc, setDesc]         = useState("");
  const [cat, setCat]           = useState("REPARATION");
  const [immId, setImmId]       = useState(immeubles[0]?.id ?? "");
  const [saving, setSaving]     = useState(false);

  // Ne pas afficher sur /finances (le FAB natif est déjà là) ni sur connexion
  if (pathname === "/finances" || pathname?.startsWith("/connexion")) return null;

  function handleTypeChange(t: string) {
    setType(t);
    const config = TYPES_RAPIDES.find(x => x.value === t);
    setCat(config?.defaultCat ?? "AUTRE");
  }

  function reset() {
    setType("DEPENSE_EXPLOITATION");
    setMontant("");
    setDesc("");
    setCat("REPARATION");
    setImmId(immeubles[0]?.id ?? "");
  }

  async function sauvegarder() {
    if (!montant || !desc) return;
    setSaving(true);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        immeubleId: immId,
        type,
        categorie: cat,
        montant: Number(montant),
        description: desc,
        date: new Date().toISOString(),
        recurrent: false,
      }),
    });
    setSaving(false);
    setOpen(false);
    reset();
    refresh();
  }

  const catOptions = CATEGORIES_PAR_TYPE[type] ?? ["AUTRE"];

  return (
    <>
      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg md:bottom-8"
        style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-accent)" }}>
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      {/* Overlay + bottom-sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setOpen(false); reset(); }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pb-10 pt-6 md:left-auto md:right-8 md:bottom-8 md:w-[380px] md:rounded-2xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>

              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
                  Ajout rapide
                </h2>
                <button onClick={() => { setOpen(false); reset(); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type — 2 boutons */}
                <div className="grid grid-cols-2 gap-2">
                  {TYPES_RAPIDES.map(t => (
                    <button key={t.value} onClick={() => handleTypeChange(t.value)}
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
                      style={type === t.value
                        ? { background: t.bg, color: "white" }
                        : { background: "var(--bg-secondary)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                      {t.icone}{t.label}
                    </button>
                  ))}
                </div>

                {/* Montant */}
                <div>
                  <label className="field-label">Montant ($)</label>
                  <input
                    type="number" inputMode="decimal" placeholder="0.00"
                    value={montant} onChange={e => setMontant(e.target.value)}
                    className="input-field text-lg font-bold"
                    style={{ color: type === "REVENU" ? "var(--success)" : "var(--danger)" }}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="field-label">Description</label>
                  <input type="text" placeholder="Ex : Plombier salle de bain"
                    value={desc} onChange={e => setDesc(e.target.value)}
                    className="input-field"
                    onKeyDown={e => { if (e.key === "Enter") sauvegarder(); }}
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="field-label">Catégorie</label>
                  <select value={cat} onChange={e => setCat(e.target.value)} className="input-field">
                    {catOptions.map(c => (
                      <option key={c} value={c}>{CATEGORIES_TRANSACTION_LABELS[c] ?? c}</option>
                    ))}
                  </select>
                </div>

                {/* Immeuble (si plusieurs) */}
                {immeubles.length > 1 && (
                  <div>
                    <label className="field-label">Immeuble</label>
                    <select value={immId} onChange={e => setImmId(e.target.value)} className="input-field">
                      {immeubles.map(i => <option key={i.id} value={i.id}>{i.nom}</option>)}
                    </select>
                  </div>
                )}

                {/* Bouton sauvegarder */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={sauvegarder}
                  disabled={saving || !montant || !desc}
                  className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity disabled:opacity-50"
                  style={{ background: "var(--gradient-brand)" }}>
                  {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Enregistrer"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
