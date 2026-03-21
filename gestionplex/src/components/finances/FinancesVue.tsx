"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Home,
  Plus, X, ChevronRight, Info, Building2,
} from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { InlineStatut } from "@/components/ui/InlineStatut";
import {
  CATEGORIES_TRANSACTION_LABELS,
  CATEGORIES_PAR_TYPE,
  ICONE_CATEGORIE,
  TYPE_TRANSACTION_LABELS,
  TYPE_TRANSACTION_COLOR,
  TYPE_TRANSACTION_BG,
  TYPE_TRANSACTION_ICONE,
  isDepenseExploitation,
  isServiceDette,
  isDepenseCapital,
} from "@/lib/constants";

type Periode = "mois" | "3mois" | "6mois" | "annee";

const COULEURS_DONUT = [
  "#6366f1", "#ef4444", "#f59e0b", "#10b981",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const TYPES_OPTIONS = [
  { value: "REVENU",                  label: "Revenu",             bg: "var(--success)" },
  { value: "DEPENSE_EXPLOITATION",    label: "Dépense exploit.",   bg: "var(--danger)" },
  { value: "DEPENSE_CAPITAL",         label: "Dépense capital",    bg: "var(--warning)" },
  { value: "REMBOURSEMENT_HYPOTHEQUE",label: "Remb. hypothèque",   bg: "var(--accent)" },
  { value: "ACQUISITION",             label: "Acquisition",        bg: "var(--info)" },
  { value: "TRANSFERT",               label: "Transfert",          bg: "var(--fg-muted)" },
  { value: "DEPOT_CAUTION",           label: "Dépôt caution",      bg: "var(--purple)" },
];

// Options pour InlineStatut — tous types
const ALL_TYPES_INLINE = TYPES_OPTIONS.map(o => ({ value: o.value, label: o.label, bg: o.bg }));

function getDateDebut(periode: Periode): Date {
  const n = new Date();
  switch (periode) {
    case "mois":  return new Date(n.getFullYear(), n.getMonth(), 1);
    case "3mois": return new Date(n.getFullYear(), n.getMonth() - 2, 1);
    case "6mois": return new Date(n.getFullYear(), n.getMonth() - 5, 1);
    case "annee": return new Date(n.getFullYear(), 0, 1);
  }
}

/** Formater un montant selon le type (signe + couleur) */
function signeMontant(type: string): "+" | "−" {
  return type === "REVENU" ? "+" : "−";
}

export function FinancesVue() {
  const { transactions, immeubles, getTauxOccupation, refresh } = useAppData();
  const [periode, setPeriode] = useState<Periode>("annee");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  // Formulaire
  const [fType,           setFType]           = useState("REVENU");
  const [fDescription,    setFDescription]    = useState("");
  const [fMontant,        setFMontant]        = useState("");
  const [fCategorie,      setFCategorie]      = useState("LOYER");
  const [fImmeubleId,     setFImmeubleId]     = useState(immeubles[0]?.id ?? "");
  const [fDate,           setFDate]           = useState(new Date().toISOString().slice(0, 10));
  // Champs spéciaux
  const [fPortionInteret, setFPortionInteret] = useState("");
  const [fPortionCapital, setFPortionCapital] = useState("");
  const [fDureeUtile,     setFDureeUtile]     = useState("27");
  const [fMiseDesFonds,   setFMiseDesFonds]   = useState("");
  const [fMontantHyp,     setFMontantHyp]     = useState("");
  const [fFraisClosing,   setFFraisClosing]   = useState("");
  const [fSaving,         setFSaving]         = useState(false);
  const [showTooltipNOI,  setShowTooltipNOI]  = useState(false);

  const maintenant = new Date();
  const anneeActuelle = maintenant.getFullYear();
  const dateDebut = getDateDebut(periode);

  const txPeriode = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= dateDebut && d <= maintenant;
  });

  // ── Calculs financiers industry-standard ────────────────────────────────
  const revenus = txPeriode
    .filter(t => t.type === "REVENU")
    .reduce((s, t) => s + t.montant, 0);

  // Charges exploitation (hors service de dette)
  const depensesExploitation = txPeriode
    .filter(t => isDepenseExploitation(t.type, t.categorie))
    .reduce((s, t) => s + t.montant, 0);

  // Service de dette (hypothèque — intérêts + capital legacy)
  const serviceDette = txPeriode
    .filter(t => isServiceDette(t.type, t.categorie))
    .reduce((s, t) => s + t.montant, 0);

  // Immobilisations (CapEx)
  const depensesCapital = txPeriode
    .filter(t => isDepenseCapital(t.type))
    .reduce((s, t) => s + t.montant, 0);

  // NOI = Revenus − Charges exploitation (standard industrie : hors hypothèque et CapEx)
  const noi = revenus - depensesExploitation;

  // Flux trésorerie = NOI − service dette − CapEx
  const fluxTresorerie = noi - serviceDette - depensesCapital;

  const { taux } = getTauxOccupation();

  // Cap Rate (si valeur municipale disponible pour le premier immeuble)
  const valeurParcImm = immeubles.reduce((s, i) => s + (i.valeurMunicipale ?? 0), 0);
  const tauxCapRate = valeurParcImm > 0 ? (noi / valeurParcImm) * 100 : null;

  // Donut — dépenses exploitation par catégorie
  const depensesParCat = txPeriode
    .filter(t => isDepenseExploitation(t.type, t.categorie) || isServiceDette(t.type, t.categorie))
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.categorie] = (acc[t.categorie] ?? 0) + t.montant;
      return acc;
    }, {});
  const donutData = Object.entries(depensesParCat)
    .map(([cat, montant]) => ({ name: CATEGORIES_TRANSACTION_LABELS[cat] ?? cat, value: montant }))
    .sort((a, b) => b.value - a.value);

  const dernieresTx = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);

  // ── Actions inline ───────────────────────────────────────────────────────
  async function patchTx(id: string, body: object) {
    await fetch(`/api/transactions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    refresh();
  }

  // ── Formulaire ───────────────────────────────────────────────────────────
  function resetForm() {
    setFType("REVENU"); setFDescription(""); setFMontant(""); setFCategorie("LOYER");
    setFPortionInteret(""); setFPortionCapital(""); setFDureeUtile("27");
    setFMiseDesFonds(""); setFMontantHyp(""); setFFraisClosing("");
    setFDate(new Date().toISOString().slice(0, 10));
  }

  function handleTypeChange(type: string) {
    setFType(type);
    const cats = CATEGORIES_PAR_TYPE[type] ?? ["AUTRE"];
    setFCategorie(cats[0]);
  }

  async function ajouterTransaction() {
    if (!fDescription || !fMontant) return;
    setFSaving(true);

    const body: Record<string, unknown> = {
      type: fType,
      description: fDescription,
      montant: Number(fMontant),
      categorie: fCategorie,
      immeubleId: fImmeubleId,
      date: fDate,
    };

    if (fType === "REMBOURSEMENT_HYPOTHEQUE") {
      body.portionInteret = fPortionInteret ? Number(fPortionInteret) : undefined;
      body.portionCapital = fPortionCapital ? Number(fPortionCapital) : undefined;
    }
    if (fType === "DEPENSE_CAPITAL") {
      body.dureeUtileAns = Number(fDureeUtile);
      body.dateMiseEnService = fDate;
    }
    if (fType === "ACQUISITION") {
      body.miseDesFonds = fMiseDesFonds ? Number(fMiseDesFonds) : undefined;
      body.montantHypotheque = fMontantHyp ? Number(fMontantHyp) : undefined;
      body.fraisClosing = fFraisClosing ? Number(fFraisClosing) : undefined;
    }

    await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setFSaving(false);
    setFormulaireOuvert(false);
    resetForm();
    refresh();
  }

  const periodes: { val: Periode; label: string }[] = [
    { val: "mois",  label: "Ce mois" },
    { val: "3mois", label: "3 mois" },
    { val: "6mois", label: "6 mois" },
    { val: "annee", label: String(anneeActuelle) },
  ];

  const catOptions = (CATEGORIES_PAR_TYPE[fType] ?? ["AUTRE"]).map(c => ({
    value: c, label: CATEGORIES_TRANSACTION_LABELS[c] ?? c, bg: "var(--accent)",
  }));

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

        {/* ── Métriques principales ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Revenus */}
          <MetriqueCard icone={<TrendingUp className="h-4 w-4" />} label="Revenus locatifs"
            valeur={formatCAD(revenus)} color="var(--success)" bg="var(--success-muted)" delay={0} />

          {/* Charges exploitation */}
          <MetriqueCard icone={<TrendingDown className="h-4 w-4" />} label="Charges exploit."
            valeur={formatCAD(depensesExploitation)} color="var(--danger)" bg="var(--danger-muted)" delay={0.05} />

          {/* RNO / NOI */}
          <div style={{ gridColumn: "1 / -1" }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>
                    RNO (Revenu Net d'Exploitation)
                  </span>
                </div>
                <button onClick={() => setShowTooltipNOI(!showTooltipNOI)}
                  style={{ color: "var(--fg-muted)" }}>
                  <Info className="h-4 w-4" />
                </button>
              </div>
              <AnimatePresence>
                {showTooltipNOI && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs mb-2 px-1" style={{ color: "var(--fg-muted)" }}>
                    Standard industrie : Revenus − Charges d'exploitation (hors hypothèque et CapEx).
                    Permet de comparer les propriétés indépendamment de leur financement.
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-2xl font-bold tabular-nums" style={{ letterSpacing: "-0.03em",
                color: noi >= 0 ? "var(--success)" : "var(--danger)" }}>
                {noi >= 0 ? "+" : "−"}{formatCAD(Math.abs(noi))}
              </p>
              {/* Flux trésorerie en dessous */}
              <div className="mt-3 pt-3 flex items-center justify-between"
                style={{ borderTop: "1px solid var(--border)" }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>
                    Flux trésorerie
                  </p>
                  <p className="text-xs" style={{ color: "var(--fg-muted)", opacity: 0.7 }}>
                    RNO − service dette ({formatCAD(serviceDette)}) − CapEx ({formatCAD(depensesCapital)})
                  </p>
                </div>
                <p className="text-base font-bold tabular-nums" style={{
                  color: fluxTresorerie >= 0 ? "var(--success)" : "var(--danger)" }}>
                  {fluxTresorerie >= 0 ? "+" : "−"}{formatCAD(Math.abs(fluxTresorerie))}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Taux occupation */}
          <MetriqueCard icone={<Home className="h-4 w-4" />} label="Occupation"
            valeur={`${taux.toFixed(0)} %`} color="var(--accent)" bg="var(--accent-muted)" delay={0.15} />

          {/* Cap rate */}
          <MetriqueCard
            icone={<Building2 className="h-4 w-4" />}
            label="Taux capitalisation"
            valeur={tauxCapRate !== null ? `${tauxCapRate.toFixed(2)} %` : "—"}
            sub={tauxCapRate !== null ? "RNO ÷ valeur mun." : "Valeur mun. manquante"}
            color="var(--purple, #8b5cf6)" bg="var(--purple-muted, #ede9fe)"
            delay={0.2} />
        </div>

        {/* Donut dépenses */}
        {donutData.length > 0 && (
          <div className="card p-5">
            <h2 className="section-title mb-1">Charges par catégorie</h2>
            <p className="text-xs mb-4" style={{ color: "var(--fg-muted)" }}>
              Exploitation + service de dette · hors CapEx
            </p>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COULEURS_DONUT[i % COULEURS_DONUT.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => [formatCAD(Number(v)), ""]}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 12, color: "var(--fg)" }} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Transactions récentes — éditables */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Transactions récentes</h2>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Cliquez pour modifier</span>
          </div>
          <div className="space-y-2">
            {dernieresTx.map(tx => {
              const immeuble = immeubles.find(i => i.id === tx.immeubleId);
              const typeColor = TYPE_TRANSACTION_COLOR[tx.type] ?? "var(--fg)";
              const typeBg    = TYPE_TRANSACTION_BG[tx.type] ?? "var(--bg-secondary)";
              const typeLabel = TYPE_TRANSACTION_LABELS[tx.type] ?? tx.type;
              const icone = ICONE_CATEGORIE[tx.categorie] ?? TYPE_TRANSACTION_ICONE[tx.type] ?? "📋";
              const estRevenu = tx.type === "REVENU";

              return (
                <div key={tx.id} className="card flex items-start gap-3 px-4 py-3">
                  {/* Icône / catégorie */}
                  <InlineStatut value={tx.categorie}
                    options={(CATEGORIES_PAR_TYPE[tx.type] ?? ["AUTRE"]).map(c => ({
                      value: c, label: CATEGORIES_TRANSACTION_LABELS[c] ?? c, bg: "var(--accent)",
                    }))}
                    onSave={val => patchTx(tx.id, { categorie: val })}
                    renderBadge={v => (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                        style={{ background: "var(--bg-secondary)" }}>
                        {ICONE_CATEGORIE[v] ?? "📋"}
                      </div>
                    )}
                  />

                  <div className="min-w-0 flex-1">
                    {/* Description éditable */}
                    <InlineEdit value={tx.description} type="text" className="text-sm font-medium w-full"
                      onSave={val => patchTx(tx.id, { description: val })} />

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {formatDate(tx.date)}{immeuble ? ` · ${immeuble.nom}` : ""}
                      </span>
                      {/* Badge type — éditable */}
                      <InlineStatut value={tx.type} options={ALL_TYPES_INLINE}
                        onSave={val => patchTx(tx.id, { type: val })}
                        renderBadge={v => (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: TYPE_TRANSACTION_BG[v] ?? typeBg, color: TYPE_TRANSACTION_COLOR[v] ?? typeColor }}>
                            {TYPE_TRANSACTION_LABELS[v] ?? v}
                          </span>
                        )}
                      />
                    </div>

                    {/* Scission hypothèque si applicable */}
                    {tx.type === "REMBOURSEMENT_HYPOTHEQUE" && (tx.portionInteret || tx.portionCapital) && (
                      <div className="flex gap-3 mt-1.5 text-xs" style={{ color: "var(--fg-muted)" }}>
                        {tx.portionInteret ? <span>🏦 Intérêts : {formatCAD(tx.portionInteret)}</span> : null}
                        {tx.portionCapital ? <span>📉 Capital : {formatCAD(tx.portionCapital)}</span> : null}
                      </div>
                    )}
                    {/* Info CapEx */}
                    {tx.type === "DEPENSE_CAPITAL" && tx.dureeUtileAns && (
                      <p className="text-xs mt-1" style={{ color: "var(--warning)" }}>
                        🏗️ Amortie sur {tx.dureeUtileAns} ans
                      </p>
                    )}
                    {/* Info acquisition */}
                    {tx.type === "ACQUISITION" && (
                      <div className="flex gap-3 mt-1.5 text-xs" style={{ color: "var(--info)" }}>
                        {tx.miseDesFonds ? <span>💵 Mise de fonds : {formatCAD(tx.miseDesFonds)}</span> : null}
                        {tx.montantHypotheque ? <span>🏦 Hyp. : {formatCAD(tx.montantHypotheque)}</span> : null}
                      </div>
                    )}
                  </div>

                  {/* Montant éditable */}
                  <InlineEdit value={tx.montant} type="number"
                    prefix={estRevenu ? "+" : "−"}
                    formatDisplay={v => formatCAD(Number(v))}
                    className="flex-shrink-0 text-sm font-bold tabular-nums"
                    onSave={val => patchTx(tx.id, { montant: Number(val) })}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/finances/revenus">
              <div className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "var(--success-muted)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>Tous les revenus</span>
                <ChevronRight className="h-4 w-4" style={{ color: "var(--success)" }} />
              </div>
            </Link>
            <Link href="/finances/depenses">
              <div className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "var(--danger-muted)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Toutes les charges</span>
                <ChevronRight className="h-4 w-4" style={{ color: "var(--danger)" }} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* FAB */}
      <motion.button whileTap={{ scale: 0.9 }}
        onClick={() => setFormulaireOuvert(true)}
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-accent)" }}>
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      {/* Sheet — Nouvelle transaction */}
      <AnimatePresence>
        {formulaireOuvert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFormulaireOuvert(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pb-10 pt-6 overflow-y-auto max-h-[90vh]"
              style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)" }}>

              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
                  Nouvelle transaction
                </h2>
                <button onClick={() => { setFormulaireOuvert(false); resetForm(); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type — grille 2×3 */}
                <div>
                  <label className="field-label">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPES_OPTIONS.map(t => (
                      <button key={t.value} onClick={() => handleTypeChange(t.value)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all text-left"
                        style={fType === t.value
                          ? { background: t.bg, color: "white" }
                          : { background: "var(--bg-secondary)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                        <span>{TYPE_TRANSACTION_ICONE[t.value]}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explication contextuelle */}
                {fType === "ACQUISITION" && (
                  <div className="rounded-xl p-3 text-xs" style={{ background: "var(--info-muted)", color: "var(--info)" }}>
                    🔑 L'achat d'un immeuble est une transaction bilancielle : ni revenu ni dépense d'exploitation.
                    Le prix d'achat crée un actif, la mise de fonds réduit l'encaisse, et l'hypothèque crée un passif.
                  </div>
                )}
                {fType === "REMBOURSEMENT_HYPOTHEQUE" && (
                  <div className="rounded-xl p-3 text-xs" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                    🏦 Seuls les <strong>intérêts</strong> sont une charge déductible.
                    Le remboursement en <strong>capital</strong> réduit votre passif et bâtit votre équité.
                  </div>
                )}
                {fType === "DEPENSE_CAPITAL" && (
                  <div className="rounded-xl p-3 text-xs" style={{ background: "var(--warning-muted)", color: "var(--warning)" }}>
                    🏗️ Une dépense en capital est amortie sur plusieurs années (ex. toiture : 27 ans, HVAC : 15 ans, appareils : 7 ans).
                    Elle n'est <strong>pas</strong> une dépense d'exploitation.
                  </div>
                )}

                {/* Immeuble */}
                {immeubles.length > 1 && (
                  <div>
                    <label className="field-label">Immeuble</label>
                    <FormSelect value={fImmeubleId} onChange={setFImmeubleId}
                      options={immeubles.map(i => ({ value: i.id, label: i.nom }))} />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="field-label">Description</label>
                  <FormInput value={fDescription} onChange={setFDescription}
                    placeholder={
                      fType === "ACQUISITION" ? "Ex: Achat Triplex 123 rue Principale" :
                      fType === "REMBOURSEMENT_HYPOTHEQUE" ? "Ex: Hypothèque First National — mars 2025" :
                      fType === "DEPENSE_CAPITAL" ? "Ex: Remplacement toiture" :
                      "Ex: Loyer janvier"
                    } />
                </div>

                {/* Montant principal */}
                <div>
                  <label className="field-label">
                    {fType === "ACQUISITION" ? "Prix d'achat ($)"
                    : fType === "REMBOURSEMENT_HYPOTHEQUE" ? "Paiement total ($)"
                    : "Montant ($)"}
                  </label>
                  <FormInput value={fMontant} onChange={setFMontant} type="number" placeholder="0.00" />
                </div>

                {/* Scission hypothèque */}
                {fType === "REMBOURSEMENT_HYPOTHEQUE" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="field-label">Portion intérêts ($)</label>
                      <FormInput value={fPortionInteret} onChange={setFPortionInteret} type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="field-label">Portion capital ($)</label>
                      <FormInput value={fPortionCapital} onChange={setFPortionCapital} type="number" placeholder="0.00" />
                    </div>
                  </div>
                )}

                {/* Champs Acquisition */}
                {fType === "ACQUISITION" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="field-label">Mise de fonds ($)</label>
                        <FormInput value={fMiseDesFonds} onChange={setFMiseDesFonds} type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="field-label">Hypothèque ($)</label>
                        <FormInput value={fMontantHyp} onChange={setFMontantHyp} type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Frais de clôture ($)</label>
                      <FormInput value={fFraisClosing} onChange={setFFraisClosing} type="number" placeholder="0.00" />
                    </div>
                  </>
                )}

                {/* Durée utile CapEx */}
                {fType === "DEPENSE_CAPITAL" && (
                  <div>
                    <label className="field-label">Durée d'amortissement (ans)</label>
                    <FormSelect value={fDureeUtile} onChange={setFDureeUtile}
                      options={[
                        { value: "5",  label: "5 ans — Appareils / équipements" },
                        { value: "7",  label: "7 ans — Électroménagers" },
                        { value: "15", label: "15 ans — HVAC / toiture plate" },
                        { value: "20", label: "20 ans — Fenêtres / portes" },
                        { value: "27", label: "27 ans — Bâtiment résidentiel" },
                        { value: "40", label: "40 ans — Structure / fondation" },
                      ]} />
                  </div>
                )}

                {/* Catégorie (masquée pour acquisition/transfert/caution) */}
                {!["ACQUISITION", "TRANSFERT", "DEPOT_CAUTION", "REMBOURSEMENT_HYPOTHEQUE"].includes(fType) && (
                  <div>
                    <label className="field-label">Catégorie</label>
                    <FormSelect value={fCategorie} onChange={setFCategorie} options={catOptions} />
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="field-label">Date</label>
                  <FormInput value={fDate} onChange={setFDate} type="date" />
                </div>

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

// ── Sous-composants ──────────────────────────────────────────────────────────

function MetriqueCard({ icone, label, valeur, sub, color, bg, delay }: {
  icone: React.ReactNode; label: string; valeur: string; sub?: string;
  color: string; bg: string; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }} className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: bg, color }}>
          {icone}
        </div>
        <span className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums" style={{ color, letterSpacing: "-0.02em" }}>{valeur}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>{sub}</p>}
    </motion.div>
  );
}

function FormInput({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)}
      type={type} placeholder={placeholder}
      className="h-11 w-full rounded-xl px-4 text-sm focus:outline-none"
      style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)", color: "var(--fg)" }}
      onFocus={e => (e.target.style.borderColor = "var(--accent)")}
      onBlur={e => (e.target.style.borderColor = "var(--border)")} />
  );
}

function FormSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="h-11 w-full rounded-xl px-4 text-sm focus:outline-none"
      style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)", color: "var(--fg)" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
