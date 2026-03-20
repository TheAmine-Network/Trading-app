"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hammer,
  Zap,
  Thermometer,
  UtensilsCrossed,
  Bath,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Info,
} from "lucide-react";
import {
  travauxAnjou,
  travauxLaval,
  getBudgetTotal,
  getTravauxParCategorie,
  type TravailRenovation,
  type CategorieTravail,
  type StatutTravail,
  type Subvention,
} from "@/lib/renovations";

// Catalogue global par immeuble
const TRAVAUX_PAR_IMMEUBLE: Record<string, TravailRenovation[]> = {
  imm_duplex_anjou: travauxAnjou,
  imm_triplex_laval: travauxLaval,
};
import { cn } from "@/lib/utils";

// ─── Config visuelle par catégorie ───────────────────────────────────────────

const CAT_CONFIG: Record<CategorieTravail, { label: string; icone: React.ElementType; couleur: string; gradient: string }> = {
  PLANCHERS: {
    label: "Planchers",
    icone: Layers,
    couleur: "#8e6bdf",
    gradient: "linear-gradient(135deg, #8e6bdf 0%, #af52de 100%)",
  },
  SALLE_DE_BAIN: {
    label: "Salles de bain",
    icone: Bath,
    couleur: "#30b0c7",
    gradient: "linear-gradient(135deg, #30b0c7 0%, #007aff 100%)",
  },
  CUISINE: {
    label: "Cuisines",
    icone: UtensilsCrossed,
    couleur: "#ff9f0a",
    gradient: "linear-gradient(135deg, #ff9f0a 0%, #ff6b00 100%)",
  },
  ELECTRICITE: {
    label: "Électricité",
    icone: Zap,
    couleur: "#ffd60a",
    gradient: "linear-gradient(135deg, #ffd60a 0%, #ff9f0a 100%)",
  },
  CHAUFFAGE: {
    label: "Chauffage",
    icone: Thermometer,
    couleur: "#ff3b30",
    gradient: "linear-gradient(135deg, #ff3b30 0%, #ff6b00 100%)",
  },
  PLOMBERIE: {
    label: "Plomberie",
    icone: Hammer,
    couleur: "#007aff",
    gradient: "linear-gradient(135deg, #007aff 0%, #5856d6 100%)",
  },
  STRUCTURE: {
    label: "Structure / Fondation",
    icone: Hammer,
    couleur: "#ff6b00",
    gradient: "linear-gradient(135deg, #ff6b00 0%, #ff3b30 100%)",
  },
  EXTERIEUR: {
    label: "Extérieur",
    icone: Hammer,
    couleur: "#34c759",
    gradient: "linear-gradient(135deg, #34c759 0%, #30d158 100%)",
  },
  AUTRE: {
    label: "Autre",
    icone: Hammer,
    couleur: "#8e8e93",
    gradient: "linear-gradient(135deg, #8e8e93 0%, #636366 100%)",
  },
};

const STATUT_CONFIG: Record<StatutTravail, { label: string; couleur: string; bg: string }> = {
  PLANIFIE: { label: "Planifié", couleur: "#8e8e93", bg: "rgba(142,142,147,0.12)" },
  EN_COURS: { label: "En cours", couleur: "#007aff", bg: "rgba(0,122,255,0.12)" },
  DEVIS_RECU: { label: "Devis reçu", couleur: "#ff9f0a", bg: "rgba(255,159,10,0.12)" },
  COMMANDE: { label: "Commandé", couleur: "#af52de", bg: "rgba(175,82,222,0.12)" },
  TERMINE: { label: "Terminé", couleur: "#34c759", bg: "rgba(52,199,89,0.12)" },
  ANNULE: { label: "Annulé", couleur: "#ff3b30", bg: "rgba(255,59,48,0.12)" },
};

const PRIORITE_CONFIG = {
  1: { label: "Urgent", couleur: "#ff3b30" },
  2: { label: "Important", couleur: "#ff9f0a" },
  3: { label: "Souhaitable", couleur: "#8e8e93" },
};

// ─── Composant principal ──────────────────────────────────────────────────────

interface RenovationTrackerProps {
  immeubleId: string;
}

export function RenovationTracker({ immeubleId }: RenovationTrackerProps) {
  const travaux = TRAVAUX_PAR_IMMEUBLE[immeubleId] ?? [];
  const [categorieOuverte, setCategorieOuverte] = useState<CategorieTravail | null>(null);
  const [travailOuvert, setTravailOuvert] = useState<string | null>(null);
  const [onglet, setOnglet] = useState<"travaux" | "subventions">("travaux");

  const budget = getBudgetTotal(travaux);
  const parCategorie = getTravauxParCategorie(travaux);

  const subventionsTotales = travaux
    .flatMap(t => t.subventionsDisponibles ?? [])
    .filter(s => s.eligible);

  if (travaux.length === 0) return null;

  return (
    <div className="space-y-5">

      {/* ── En-tête budget ──────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: "var(--gradient-hero)", position: "relative", overflow: "hidden" }}
      >
        {/* Orbs */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #5856d6, transparent)" }} />
        <div className="pointer-events-none absolute -bottom-6 left-8 h-24 w-24 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #af52de, transparent)" }} />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">
            Budget total estimé
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums" style={{ letterSpacing: "-0.03em" }}>
            {fmt(budget.min)} – {fmt(budget.max)}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <BudgetPill label="Médiane" valeur={fmt(budget.median)} />
            <BudgetPill label="Subventions" valeur={`–${fmt(budget.subventions)}`} highlight />
            <BudgetPill label="Après aides" valeur={fmt(budget.apresSubventions)} />
          </div>

          <p className="mt-3 text-xs opacity-50">
            {travaux.length} postes de travaux · Estimations indicatives, obtenir soumissions
          </p>
        </div>
      </div>

      {/* ── Onglets ─────────────────────────────────────────────────── */}
      <div
        className="flex gap-1 rounded-2xl p-1"
        style={{ background: "var(--bg-tertiary)" }}
      >
        {(["travaux", "subventions"] as const).map(o => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
            style={
              onglet === o
                ? { background: "var(--card-solid)", color: "var(--fg)", boxShadow: "var(--shadow-sm)" }
                : { color: "var(--fg-muted)" }
            }
          >
            {o === "travaux" ? `Travaux (${travaux.length})` : `Subventions (${subventionsTotales.length})`}
          </button>
        ))}
      </div>

      {/* ── Onglet Travaux ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {onglet === "travaux" && (
          <motion.div
            key="travaux"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {parCategorie.map(({ categorie, travaux: tvx, budgetMin, budgetMax }) => {
              const cfg = CAT_CONFIG[categorie];
              const Icone = cfg.icone;
              const ouvert = categorieOuverte === categorie;

              return (
                <div key={categorie} className="card overflow-hidden">
                  {/* Header catégorie */}
                  <button
                    onClick={() => setCategorieOuverte(ouvert ? null : categorie)}
                    className="flex w-full items-center gap-3 p-4"
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ background: cfg.gradient }}
                    >
                      <Icone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>
                        {cfg.label}
                      </p>
                      <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {tvx.length} poste{tvx.length > 1 ? "s" : ""} · {fmt(budgetMin)} – {fmt(budgetMax)}
                      </p>
                    </div>
                    <motion.div animate={{ rotate: ouvert ? 180 : 0 }}>
                      <ChevronDown className="h-4 w-4" style={{ color: "var(--fg-muted)" }} />
                    </motion.div>
                  </button>

                  {/* Liste des travaux */}
                  <AnimatePresence>
                    {ouvert && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="space-y-2 px-4 pb-4"
                          style={{ borderTop: "1px solid var(--border)" }}
                        >
                          {tvx.map(travail => (
                            <TravailCard
                              key={travail.id}
                              travail={travail}
                              ouvert={travailOuvert === travail.id}
                              onToggle={() => setTravailOuvert(
                                travailOuvert === travail.id ? null : travail.id
                              )}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── Onglet Subventions ─────────────────────────────────────── */}
        {onglet === "subventions" && (
          <motion.div
            key="subventions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {/* Récap */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "var(--success-muted)", border: "1px solid rgba(52,199,89,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" style={{ color: "var(--success)" }} />
                <p className="text-sm font-bold" style={{ color: "var(--success)" }}>
                  Jusqu'à {fmt(budget.subventions)} en aides financières
                </p>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--fg-muted)" }}>
                Estimation cumulée des programmes auxquels vous êtes éligible. Les montants peuvent se cumuler.
              </p>
            </div>

            {subventionsTotales.map((sub, i) => (
              <SubventionCard key={i} subvention={sub} />
            ))}

            {/* Conseil */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-muted)" }}
            >
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                    Conseil : commencez par Éconologis
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--fg-muted)" }}>
                    L'évaluation gratuite vous orientera vers les meilleures subventions
                    et maximisera vos droits. À faire AVANT de signer un contrat d'entrepreneur.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── TravailCard ──────────────────────────────────────────────────────────────

function TravailCard({
  travail,
  ouvert,
  onToggle,
}: {
  travail: TravailRenovation;
  ouvert: boolean;
  onToggle: () => void;
}) {
  const statutCfg = STATUT_CONFIG[travail.statut];
  const prioriteCfg = PRIORITE_CONFIG[travail.priorite];

  return (
    <div className="mt-2 overflow-hidden rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
      <button onClick={onToggle} className="flex w-full items-start gap-3 p-3 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
              {travail.titre}
            </p>
            {travail.priorite === 1 && (
              <span className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ background: "rgba(255,59,48,0.15)", color: "#ff3b30" }}>
                <AlertTriangle className="h-2.5 w-2.5" />
                Urgent
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: statutCfg.bg, color: statutCfg.couleur }}
            >
              {statutCfg.label}
            </span>
            <span className="text-xs tabular-nums" style={{ color: "var(--fg-muted)" }}>
              {fmt(travail.coutMin)} – {fmt(travail.coutMax)}
            </span>
            {travail.logementId && (
              <span className="text-[10px]" style={{ color: "var(--fg-subtle)" }}>
                {travail.logementId.includes("haut") ? "8452" : "8450"}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: ouvert ? 180 : 0 }}
          className="mt-0.5 flex-shrink-0"
        >
          <ChevronDown className="h-4 w-4" style={{ color: "var(--fg-muted)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-3 pb-3" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="pt-3 text-sm" style={{ color: "var(--fg-secondary)", lineHeight: "1.6" }}>
                {travail.description}
              </p>

              {travail.notes && (
                <div className="rounded-xl p-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>Notes</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--fg-secondary)", lineHeight: "1.5" }}>
                    {travail.notes}
                  </p>
                </div>
              )}

              {travail.subventionsDisponibles && travail.subventionsDisponibles.length > 0 && (
                <div className="rounded-xl p-3"
                  style={{ background: "var(--success-muted)", border: "1px solid rgba(52,199,89,0.2)" }}>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
                    <p className="text-xs font-bold" style={{ color: "var(--success)" }}>
                      {travail.subventionsDisponibles.length} subvention{travail.subventionsDisponibles.length > 1 ? "s" : ""} disponible{travail.subventionsDisponibles.length > 1 ? "s" : ""}
                      {" "}— jusqu'à {fmt(travail.subventionsDisponibles.reduce((s, sub) => s + (sub.montantEstime ?? 0), 0))}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[10px]" style={{ color: "var(--fg-muted)" }}>
                    Voir l'onglet Subventions pour les détails
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SubventionCard ───────────────────────────────────────────────────────────

function SubventionCard({ subvention }: { subvention: Subvention }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOuvert(o => !o)} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: "var(--success-muted)" }}>
          <Sparkles className="h-4 w-4" style={{ color: "var(--success)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>
            {subvention.programme}
          </p>
          <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
            {subvention.organisme}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-sm font-bold tabular-nums" style={{ color: "var(--success)" }}>
            ~{fmt(subvention.montantEstime ?? 0)}
          </p>
          <p className="text-[10px]" style={{ color: "var(--fg-subtle)" }}>
            max {fmt(subvention.montantMax)}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="pt-3 text-sm" style={{ color: "var(--fg-secondary)", lineHeight: "1.6" }}>
                {subvention.description}
              </p>
              <div className="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>Conditions d'éligibilité</p>
                <p className="mt-1 text-xs" style={{ color: "var(--fg-secondary)", lineHeight: "1.5" }}>
                  {subvention.conditions}
                </p>
              </div>
              <a
                href={subvention.urlInfo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "var(--accent)" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Plus d'informations
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(montant: number): string {
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(montant);
}

function BudgetPill({ label, valeur, highlight }: { label: string; valeur: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl px-3 py-2" style={{ background: highlight ? "rgba(52,199,89,0.2)" : "rgba(255,255,255,0.1)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{label}</p>
      <p className="text-sm font-bold tabular-nums" style={{ color: highlight ? "#4ade80" : "white" }}>
        {valeur}
      </p>
    </div>
  );
}
