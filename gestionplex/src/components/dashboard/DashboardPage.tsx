"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  AlertCircle,
  ChevronRight,
  Bell,
  Mail,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Check,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "./StatCard";
import { OccupancyRing } from "./OccupancyRing";
import { RevenueChart } from "./RevenueChart";
import { QuickActions } from "./QuickActions";
import { Badge } from "@/components/ui/badge";
import { formatCAD, formatDateRelative, formatDate } from "@/lib/formatters";
import { PRIORITE_LABELS } from "@/lib/constants";
import { useAppData } from "@/lib/DataContext";
import type { Transaction } from "@/types";

const COULEURS_PRIORITE: Record<string, "danger" | "warning" | "info" | "muted"> = {
  URGENTE: "danger",
  HAUTE: "warning",
  NORMALE: "info",
  BASSE: "muted",
};

// ─── Helpers stats (calcul dynamique) ─────────────────────────────────────────

function statsFinancieresMois(txs: Transaction[], annee: number, mois: number) {
  const debut = new Date(annee, mois, 1);
  const fin = new Date(annee, mois + 1, 0);
  const txMois = txs.filter(t => { const d = new Date(t.date); return d >= debut && d <= fin; });
  const revenus = txMois.filter(t => t.type === "REVENU").reduce((s, t) => s + t.montant, 0);
  const depenses = txMois.filter(t => t.type === "DEPENSE").reduce((s, t) => s + t.montant, 0);
  return { revenus, depenses, profit: revenus - depenses };
}

function statsParMois(txs: Transaction[], nbMois = 6) {
  const maintenant = new Date();
  return Array.from({ length: nbMois }, (_, i) => {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - (nbMois - 1 - i), 1);
    const stats = statsFinancieresMois(txs, date.getFullYear(), date.getMonth());
    return { mois: date.toLocaleDateString("fr-CA", { month: "short" }), ...stats };
  });
}

// ─── Gmail card ─────────────────────────────────────────────────────────────

interface EmailCard {
  id: string;
  type: "LOYER" | "ENTRETIEN" | "BAIL" | "FACTURE" | "ASSURANCE";
  titre: string;
  expediteur: string;
  montant?: number;
  date: Date;
  actionLabel?: string;
}

const DEMO_EMAILS: EmailCard[] = [
  { id: "e1", type: "LOYER", titre: "Paiement loyer mars", expediteur: "Sophie Tremblay", montant: 1450, date: new Date(Date.now() - 86400000), actionLabel: "Enregistrer" },
  { id: "e2", type: "ENTRETIEN", titre: "Fuite d'eau — URGENT", expediteur: "Jean-Marc Dubois", date: new Date(), actionLabel: "Créer demande" },
  { id: "e3", type: "BAIL", titre: "Renouvellement bail 2025", expediteur: "Marie Côté", date: new Date(Date.now() - 3 * 86400000), actionLabel: "Voir bail" },
];

const EMAIL_CONFIG = {
  LOYER:     { couleur: "#34c759", bg: "rgba(52,199,89,0.1)",    icone: "💰" },
  ENTRETIEN: { couleur: "#ff3b30", bg: "rgba(255,59,48,0.1)",    icone: "🔧" },
  BAIL:      { couleur: "#5856d6", bg: "rgba(88,86,214,0.1)",    icone: "📄" },
  FACTURE:   { couleur: "#ff9f0a", bg: "rgba(255,159,10,0.1)",   icone: "🧾" },
  ASSURANCE: { couleur: "#007aff", bg: "rgba(0,122,255,0.1)",    icone: "🛡️" },
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { transactions, demandesEntretien, rappels, logements, immeubles, baux, locataires, getTauxOccupation, refresh } = useAppData();
  const [gmailVisible, setGmailVisible] = useState(true);
  const [emailsTraites, setEmailsTraites] = useState<Set<string>>(new Set());
  const [gmailSyncing, setGmailSyncing] = useState(false);
  const [generatingLoyers, setGeneratingLoyers] = useState(false);
  const [loyersGeneres, setLoyersGeneres] = useState(false);

  const maintenant = new Date();
  const statsActuels = statsFinancieresMois(transactions, maintenant.getFullYear(), maintenant.getMonth());
  const statsMoisPrec = statsFinancieresMois(transactions, maintenant.getFullYear(), maintenant.getMonth() - 1);
  const donneesMois = statsParMois(transactions, 6);
  const { nbOccupes, nbTotal, taux } = getTauxOccupation();

  // ── Loyers manquants ce mois ────────────────────────────────────────────────
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  const finMois   = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0);
  const logementIdsAvecLoyer = new Set(
    transactions
      .filter(t => t.type === "REVENU" && t.categorie === "LOYER" &&
        new Date(t.date) >= debutMois && new Date(t.date) <= finMois)
      .map(t => t.logementId)
      .filter(Boolean)
  );
  const loyersManquants = baux
    .filter(b => b.statut === "ACTIF" && !logementIdsAvecLoyer.has(b.logementId))
    .map(b => ({
      bail: b,
      logement: logements.find(l => l.id === b.logementId),
      locataire: locataires.find(l => l.id === b.locataireId),
      immeuble: immeubles.find(i => i.id === logements.find(l => l.id === b.logementId)?.immeubleId),
    }))
    .filter(e => e.logement?.statut === "OCCUPE");
  const totalLoyersManquants = loyersManquants.reduce((s, e) => s + e.bail.loyerMensuel, 0);

  async function genererTousLesLoyers() {
    setGeneratingLoyers(true);
    const nomMois = debutMois.toLocaleDateString("fr-CA", { month: "long", year: "numeric" });
    await Promise.all(
      loyersManquants.map(({ bail, logement, locataire, immeuble }) =>
        fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            immeubleId: immeuble?.id ?? logement?.immeubleId,
            logementId: logement?.id,
            type: "REVENU",
            categorie: "LOYER",
            montant: bail.loyerMensuel,
            date: debutMois.toISOString(),
            description: `Loyer ${nomMois} — ${locataire?.prenom ?? ""} ${locataire?.nom ?? ""}${logement ? ` (${logement.numero})` : ""}`.trim(),
            methodePaiement: "VIREMENT",
            recurrent: true,
          }),
        })
      )
    );
    setGeneratingLoyers(false);
    setLoyersGeneres(true);
    refresh();
  }

  const tendanceRevenus = statsMoisPrec.revenus > 0
    ? ((statsActuels.revenus - statsMoisPrec.revenus) / statsMoisPrec.revenus) * 100 : 0;
  const tendanceDepenses = statsMoisPrec.depenses > 0
    ? ((statsActuels.depenses - statsMoisPrec.depenses) / statsMoisPrec.depenses) * 100 : 0;

  const demandesOuvertes = demandesEntretien.filter(d => d.statut !== "TERMINEE" && d.statut !== "ANNULEE");
  const rappelsActifs = rappels.filter(r => r.statut === "ACTIF").slice(0, 3);

  const jourSemaine = maintenant.toLocaleDateString("fr-CA", { weekday: "long" });
  const dateAujourd = maintenant.toLocaleDateString("fr-CA", { day: "numeric", month: "long" });
  const emailsRestants = DEMO_EMAILS.filter(e => !emailsTraites.has(e.id));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-5 pb-8 pt-5" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #5856d6 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-8 left-10 h-48 w-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #af52de 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #007aff 0%, transparent 60%)" }} />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm capitalize" style={{ color: "rgba(255,255,255,0.55)" }}>
              {jourSemaine} · {dateAujourd}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="mt-0.5 text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
              Bonjour, Amine 👋
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {nbOccupes}/{nbTotal} logements occupés · {formatCAD(statsActuels.revenus)} ce mois
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.88 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <Bell className="h-5 w-5 text-white" />
              {demandesOuvertes.filter(d => d.priorite === "URGENTE").length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              )}
            </motion.button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{ background: "var(--gradient-brand)" }}>A</div>
          </div>
        </div>

        {/* Profit hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-5 flex items-center gap-3 rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
              PROFIT NET — CE MOIS
            </p>
            <p className="mt-0.5 text-3xl font-bold tabular-nums text-white" style={{ letterSpacing: "-0.03em" }}>
              {formatCAD(statsActuels.profit)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
              style={tendanceRevenus >= 0
                ? { background: "rgba(52,199,89,0.25)", color: "#4ade80" }
                : { background: "rgba(255,59,48,0.25)", color: "#f87171" }}>
              {tendanceRevenus >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(tendanceRevenus).toFixed(1)}%
            </span>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>vs mois précédent</p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6 px-5 py-6">

        {/* ── Gmail ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {gmailVisible && emailsRestants.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: "rgba(234,67,53,0.12)" }}>
                    <Mail className="h-3.5 w-3.5" style={{ color: "#ea4335" }} />
                  </div>
                  <h2 className="section-title">Gmail — {emailsRestants.length} à traiter</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setGmailSyncing(true); setTimeout(() => setGmailSyncing(false), 1500); }}
                    className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                    <RefreshCw className={`h-3 w-3 ${gmailSyncing ? "animate-spin" : ""}`} />Sync
                  </button>
                  <button onClick={() => setGmailVisible(false)} className="text-xs" style={{ color: "var(--fg-muted)" }}>Masquer</button>
                </div>
              </div>
              <div className="space-y-2">
                {emailsRestants.map((email, i) => {
                  const config = EMAIL_CONFIG[email.type];
                  return (
                    <motion.div key={email.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }} transition={{ delay: i * 0.06 }}
                      className="card flex items-center gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg" style={{ background: config.bg }}>
                        {config.icone}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: "var(--fg)" }}>{email.titre}</p>
                        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                          {email.expediteur}{email.montant ? ` · ${formatCAD(email.montant)}` : ""}{" · "}{formatDateRelative(email.date)}
                        </p>
                      </div>
                      {email.actionLabel && (
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEmailsTraites(p => new Set([...p, email.id]))}
                          className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                          style={{ background: config.couleur }}>
                          {email.actionLabel}
                        </motion.button>
                      )}
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEmailsTraites(p => new Set([...p, email.id]))}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--bg-tertiary)" }}>
                        <Check className="h-3.5 w-3.5" style={{ color: "var(--fg-muted)" }} />
                      </motion.button>
                    </motion.div>
                  );
                })}
                <Link href="/api/gmail/auth" className="flex items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-medium"
                  style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                  <Sparkles className="h-4 w-4" />Connecter Gmail<ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="section-title mb-3">Ce mois-ci</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard titre="Revenus" valeur={statsActuels.revenus} enCAD tendance={tendanceRevenus}
              icone={<TrendingUp className="h-5 w-5" />} gradient="linear-gradient(135deg, #34c759 0%, #30b84f 100%)" delay={0.05} />
            <StatCard titre="Dépenses" valeur={statsActuels.depenses} enCAD tendance={tendanceDepenses}
              icone={<TrendingDown className="h-5 w-5" />} gradient="linear-gradient(135deg, #ff3b30 0%, #ff2d55 100%)" delay={0.1} />
            <StatCard titre="Profit net" valeur={statsActuels.profit} enCAD
              icone={<Wallet className="h-5 w-5" />} gradient="linear-gradient(135deg, #5856d6 0%, #af52de 100%)" delay={0.15} />
            <div className="card p-4">
              <OccupancyRing nbOccupes={nbOccupes} nbTotal={nbTotal} taux={taux} />
            </div>
          </div>
        </motion.section>

        {/* ── Banner loyers manquants ───────────────────────────────────── */}
        <AnimatePresence>
          {!loyersGeneres && loyersManquants.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, rgba(52,199,89,0.15) 0%, rgba(48,219,91,0.08) 100%)", border: "1px solid rgba(52,199,89,0.3)" }}>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(52,199,89,0.2)" }}>
                  <Zap className="h-4.5 w-4.5" style={{ color: "var(--success)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: "var(--success)" }}>
                    {loyersManquants.length} loyer{loyersManquants.length > 1 ? "s" : ""} non enregistré{loyersManquants.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                    {maintenant.toLocaleDateString("fr-CA", { month: "long" })} · {formatCAD(totalLoyersManquants)} à encaisser
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--fg-subtle)" }}>
                    {loyersManquants.map(e => `${e.locataire?.prenom ?? "?"} (${e.logement?.numero ?? "?"})`).join(", ")}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={genererTousLesLoyers}
                  disabled={generatingLoyers}
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  style={{ background: generatingLoyers ? "var(--fg-muted)" : "var(--success)" }}>
                  {generatingLoyers
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Zap className="h-3.5 w-3.5" />}
                  {generatingLoyers ? "…" : "Générer tout"}
                </motion.button>
              </div>
            </motion.section>
          )}
          {loyersGeneres && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{ background: "rgba(52,199,89,0.12)", border: "1px solid rgba(52,199,89,0.25)" }}>
              <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>
                {loyersManquants.length === 0 ? "Loyers déjà enregistrés" : `${loyersManquants.length} loyer${loyersManquants.length > 1 ? "s" : ""} enregistré${loyersManquants.length > 1 ? "s" : ""} — ${formatCAD(totalLoyersManquants)}`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Actions rapides ───────────────────────────────────────────── */}
        <section>
          <h2 className="section-title mb-3">Actions rapides</h2>
          <QuickActions />
        </section>

        {/* ── Rappels ──────────────────────────────────────────────────── */}
        {rappelsActifs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Prochains rappels</h2>
              <Link href="/parametres" className="text-xs font-medium" style={{ color: "var(--accent)" }}>Voir tout</Link>
            </div>
            <div className="space-y-2">
              {rappelsActifs.map(rappel => (
                <motion.div key={rappel.id} whileHover={{ x: 3 }} className="card flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--warning-muted)" }}>
                    <Bell className="h-4 w-4" style={{ color: "var(--warning)" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--fg)" }}>{rappel.titre}</p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{formatDate(rappel.date)}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: new Date(rappel.date) <= new Date() ? "var(--danger)" : "var(--fg-muted)" }}>
                    {formatDateRelative(rappel.date)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Entretien ────────────────────────────────────────────────── */}
        {demandesOuvertes.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="section-title">Entretien en cours</h2>
                {demandesOuvertes.filter(d => d.priorite === "URGENTE").length > 0 && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "var(--danger)" }}>
                    {demandesOuvertes.filter(d => d.priorite === "URGENTE").length} urgent
                  </span>
                )}
              </div>
              <Link href="/entretien" className="text-xs font-medium" style={{ color: "var(--accent)" }}>Voir tout</Link>
            </div>
            <div className="space-y-2">
              {demandesOuvertes.slice(0, 3).map(demande => {
                const logement = logements.find(l => l.id === demande.logementId);
                const immeuble = immeubles.find(i => i.id === logement?.immeubleId);
                return (
                  <Link key={demande.id} href={`/entretien/${demande.id}`}>
                    <motion.div whileHover={{ x: 3 }} className="card flex items-center gap-3 px-4 py-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--warning-muted)" }}>
                        <AlertCircle className="h-4 w-4" style={{ color: "var(--warning)" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: "var(--fg)" }}>{demande.titre}</p>
                        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{immeuble?.nom} · {logement?.numero}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variante={COULEURS_PRIORITE[demande.priorite]} pulse={demande.priorite === "URGENTE"}>
                          {PRIORITE_LABELS[demande.priorite]}
                        </Badge>
                        <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--fg-subtle)" }} />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── Graphique ────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Revenus vs dépenses</h2>
            <Link href="/finances" className="text-xs font-medium" style={{ color: "var(--accent)" }}>Détail</Link>
          </div>
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--accent)" }} />
                <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Revenus</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--danger)" }} />
                <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Dépenses</span>
              </div>
            </div>
            <RevenueChart donnees={donneesMois} />
          </div>
        </motion.section>

        {/* ── Immeubles ────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Mes immeubles</h2>
            <Link href="/immeubles" className="text-xs font-medium" style={{ color: "var(--accent)" }}>Voir tout</Link>
          </div>
          <div className="space-y-2">
            {immeubles.map(immeuble => {
              const logsImm = logements.filter(l => l.immeubleId === immeuble.id);
              const nbOcc = logsImm.filter(l => l.statut === "OCCUPE").length;
              const revenusMensuels = logsImm.filter(l => l.statut === "OCCUPE").reduce((s, l) => s + l.loyerMensuel, 0);
              const tauxOcc = Math.round((nbOcc / logsImm.length) * 100);
              return (
                <Link key={immeuble.id} href={`/immeubles/${immeuble.id}`}>
                  <motion.div whileHover={{ x: 3 }} className="card flex items-center gap-4 px-4 py-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-blue)" }}>
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>{immeuble.nom}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ background: "var(--bg-tertiary)" }}>
                          <div className="h-full rounded-full" style={{ width: `${tauxOcc}%`, background: tauxOcc === 100 ? "var(--success)" : tauxOcc >= 75 ? "var(--accent)" : "var(--warning)" }} />
                        </div>
                        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{nbOcc}/{logsImm.length} logements</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>{formatCAD(revenusMensuels)}</p>
                      <p className="text-xs" style={{ color: "var(--fg-muted)" }}>/mois</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
