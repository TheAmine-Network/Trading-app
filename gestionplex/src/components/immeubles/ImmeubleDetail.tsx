"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, DollarSign, Home,
  ChevronRight, Wrench, User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { travauxAnjou, travauxLaval } from "@/lib/renovations";
import { RenovationTracker } from "./RenovationTracker";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { InlineStatut } from "@/components/ui/InlineStatut";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppData } from "@/lib/DataContext";

const TRAVAUX_MAP: Record<string, { length: number }> = {
  imm_duplex_anjou: travauxAnjou,
  imm_triplex_laval: travauxLaval,
};

const STATUT_LABELS: Record<string, string> = {
  OCCUPE: "Occupé", VACANT: "Vacant", EN_RENOVATION: "En rénovation",
};
const STATUT_VARIANTE: Record<string, "success" | "warning" | "info"> = {
  OCCUPE: "success", VACANT: "warning", EN_RENOVATION: "info",
};
const TYPE_LABELS: Record<string, string> = {
  TRIPLEX: "Triplex", DUPLEX: "Duplex", QUADRUPLEX: "Quadruplex",
  IMMEUBLE: "Immeuble", MAISON: "Maison", CONDO: "Condo",
};

const STATUT_LOGEMENT_OPTIONS = [
  { value: "OCCUPE",        label: "Occupé",        bg: "var(--success)" },
  { value: "VACANT",        label: "Vacant",        bg: "var(--fg-muted)" },
  { value: "EN_RENOVATION", label: "En rénovation", bg: "var(--warning)" },
];

type Onglet = "info" | "logements" | "renovations" | "entretien";

interface ImmeubleDetailProps { id: string }

export function ImmeubleDetail({ id }: ImmeubleDetailProps) {
  const { immeubles, logements, locataires, demandesEntretien, refresh } = useAppData();
  const [onglet, setOnglet] = useState<Onglet>("info");

  const immeuble = immeubles.find(i => i.id === id);

  if (!immeuble) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <EmptyState titre="Immeuble introuvable" description="Cet immeuble n'existe pas ou a été supprimé." />
      </div>
    );
  }

  const logsImm = logements.filter(l => l.immeubleId === id);
  const revenusMensuels = logsImm.filter(l => l.statut === "OCCUPE").reduce((s, l) => s + l.loyerMensuel, 0);
  const demandesImm = demandesEntretien.filter(d => logsImm.some(l => l.id === d.logementId));
  const demandesOuvertes = demandesImm.filter(d => !["TERMINEE","ANNULEE"].includes(d.statut));
  const travaux = TRAVAUX_MAP[id] ?? { length: 0 };
  const aRenovations = travaux.length > 0;

  const onglets: { id: Onglet; label: string; count?: number }[] = [
    { id: "info", label: "Infos" },
    { id: "logements", label: "Logements", count: logsImm.length },
    ...(aRenovations ? [{ id: "renovations" as Onglet, label: "Rénovations", count: travaux.length }] : []),
    ...(demandesOuvertes.length > 0 ? [{ id: "entretien" as Onglet, label: "Entretien", count: demandesOuvertes.length }] : []),
  ];

  async function updateLoyer(logementId: string, val: string) {
    await fetch(`/api/logements/${logementId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loyerMensuel: Number(val) }),
    });
    refresh();
  }

  async function updateStatut(logementId: string, statut: string) {
    await fetch(`/api/logements/${logementId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    refresh();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
        {immeuble.photoUrl ? (
          <Image src={immeuble.photoUrl} alt={immeuble.nom} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Home className="h-16 w-16" style={{ color: "var(--fg-subtle)" }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link href="/immeubles"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.85)", color: "#1c1c1e" }}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="absolute bottom-4 left-5 right-5">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "rgba(255,255,255,0.9)", color: "#1c1c1e" }}>
              {TYPE_LABELS[immeuble.type] ?? immeuble.type}
            </span>
            {id === "imm_duplex_anjou" && (
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "rgba(91,91,214,0.85)", color: "white" }}>
                Centris 10602915
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{immeuble.nom}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
            <MapPin className="h-3.5 w-3.5" />{immeuble.adresse}, {immeuble.ville}
          </p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        {[
          { label: "Revenus/mois", valeur: revenusMensuels > 0 ? formatCAD(revenusMensuels) : "—", icone: <DollarSign className="h-4 w-4" />, gradient: "linear-gradient(135deg, #16a34a, #15803d)" },
          { label: "Logements", valeur: `${logsImm.filter(l => l.statut === "OCCUPE").length}/${logsImm.length}`, icone: <Home className="h-4 w-4" />, gradient: "linear-gradient(135deg, #0284c7, #5b5bd6)" },
          { label: "Entretien", valeur: demandesOuvertes.length.toString(), icone: <Wrench className="h-4 w-4" />, gradient: demandesOuvertes.length > 0 ? "linear-gradient(135deg, #d97706, #b45309)" : "linear-gradient(135deg, #6b7280, #4b5563)" },
        ].map(info => (
          <div key={info.label} className="card flex flex-col items-center py-3 text-center">
            <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl text-white" style={{ background: info.gradient }}>
              {info.icone}
            </div>
            <p className="text-base font-bold tabular-nums" style={{ color: "var(--fg)" }}>{info.valeur}</p>
            <p className="text-[10px] font-medium" style={{ color: "var(--fg-muted)" }}>{info.label}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="sticky top-0 z-20 flex gap-1 overflow-x-auto px-5 pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ background: "var(--bg)" }}>
        {onglets.map(o => (
          <button key={o.id} onClick={() => setOnglet(o.id)}
            className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={onglet === o.id
              ? { background: "var(--gradient-brand)", color: "white" }
              : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
            {o.label}
            {o.count !== undefined && (
              <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]"
                style={onglet === o.id ? { background: "rgba(255,255,255,0.25)" } : { background: "var(--border)", color: "var(--fg-muted)" }}>
                {o.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="space-y-4 px-5 pb-8">

        {/* ── Infos ── */}
        {onglet === "info" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card p-5">
              <p className="section-title mb-3">Informations</p>
              <div className="space-y-2.5">
                {[
                  { label: "Année de construction", valeur: immeuble.anneeConstruct?.toString() },
                  { label: "Date d'achat", valeur: immeuble.dateAchat ? formatDate(immeuble.dateAchat) : undefined },
                  { label: "Prix d'achat", valeur: immeuble.prixAchat ? formatCAD(immeuble.prixAchat) : undefined },
                  { label: "Valeur municipale", valeur: immeuble.valeurMunicipale ? formatCAD(immeuble.valeurMunicipale) : undefined },
                  { label: "Code postal", valeur: immeuble.codePostal || undefined },
                  { label: "Numéro de cadastre / lot", valeur: immeuble.numeroLot || undefined },
                ].filter(r => r.valeur).map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--fg-muted)" }}>{row.label}</span>
                    <span className="font-semibold tabular-nums" style={{ color: "var(--fg)" }}>{row.valeur}</span>
                  </div>
                ))}
              </div>
              {immeuble.notes && (
                <div className="mt-4 rounded-xl px-3 py-3 text-sm"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg-secondary)", lineHeight: "1.6" }}>
                  {immeuble.notes}
                </div>
              )}
            </div>

            {id === "imm_triplex_laval" && (
              <div className="rounded-2xl p-4"
                style={{ background: "var(--gradient-brand-subtle)", border: "1px solid var(--accent-muted)" }}>
                <p className="section-title mb-3" style={{ color: "var(--accent)" }}>Indicateurs financiers — BatiXpert 2023</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Revenus bruts/an", valeur: "39 600 $", note: "3 300 $/mois" },
                    { label: "Taxes totales 2023", valeur: "5 531 $", note: "mun. 5 043 + scol. 488" },
                    { label: "RNO", valeur: "34 069 $/an", note: "Revenu net opérationnel" },
                    { label: "MRB", valeur: "18,91", note: "Cible ≤ 15 = bon achat" },
                    { label: "Prix / porte", valeur: "249 667 $", note: "749k / 3 logements" },
                    { label: "Éval. 2025 (RE/MAX)", valeur: "849 000 $", note: "+100k depuis achat" },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                      <p className="section-title">{m.label}</p>
                      <p className="mt-0.5 text-base font-bold tabular-nums" style={{ color: "var(--fg)", letterSpacing: "-0.01em" }}>{m.valeur}</p>
                      <p className="mt-0.5 text-[10px]" style={{ color: "var(--fg-subtle)" }}>{m.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {id === "imm_duplex_anjou" && (
              <div className="rounded-2xl p-4"
                style={{ background: "var(--gradient-brand-subtle)", border: "1px solid var(--accent-muted)" }}>
                <p className="section-title mb-3" style={{ color: "var(--accent)" }}>Indicateurs de rentabilité</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Revenus potentiels", valeur: "60 000 $/an", note: "Centris (2 unités)" },
                    { label: "Revenus réels (haut)", valeur: "2 750 $/mois", note: "Unité vacante" },
                    { label: "Propriétaire bas", valeur: "0 $ loyer", note: "Usage personnel" },
                    { label: "Assurance", valeur: "160 $/mois", note: "1 920 $/an" },
                    { label: "Valeur/prix", valeur: "107,11 %", note: "774k / 829k" },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                      <p className="section-title">{m.label}</p>
                      <p className="mt-0.5 text-base font-bold tabular-nums" style={{ color: "var(--fg)", letterSpacing: "-0.01em" }}>{m.valeur}</p>
                      <p className="mt-0.5 text-[10px]" style={{ color: "var(--fg-subtle)" }}>{m.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Logements ── */}
        {onglet === "logements" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <p className="text-xs px-1 mb-2" style={{ color: "var(--fg-muted)" }}>
              Cliquez sur le loyer ou le statut pour modifier directement.
            </p>
            {logsImm.map(logement => {
              const locataire = locataires.find(l => l.logementId === logement.id);
              const isProprietaire = (logement as typeof logement & { proprietaireOccupant?: boolean }).proprietaireOccupant;

              return (
                <div key={logement.id} className="card flex items-center gap-3 px-4 py-3.5">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: isProprietaire ? "var(--gradient-warm)" : "var(--gradient-blue)" }}>
                    {isProprietaire ? <User className="h-5 w-5 text-white" /> : <Home className="h-5 w-5 text-white" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>{logement.numero}</p>
                      {isProprietaire && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: "var(--warning-muted)", color: "var(--warning)" }}>
                          Propriétaire
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {locataire ? `${locataire.prenom} ${locataire.nom}` : isProprietaire ? "Amine" : "Vacant"}
                      {logement.superficie ? ` · ${logement.superficie} pi²` : ""}
                      {logement.nbChambres ? ` · ${logement.nbChambres} ch.` : ""}
                    </p>
                  </div>

                  {/* Loyer + statut éditables */}
                  <div className="flex flex-col items-end gap-1.5">
                    {!isProprietaire && (
                      <InlineEdit
                        value={logement.loyerMensuel}
                        type="number"
                        formatDisplay={v => formatCAD(Number(v))}
                        className="text-sm font-bold"
                        onSave={val => updateLoyer(logement.id, val)}
                      />
                    )}
                    {isProprietaire ? (
                      <span className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>Uso proprio</span>
                    ) : (
                      <InlineStatut
                        value={logement.statut}
                        options={STATUT_LOGEMENT_OPTIONS}
                        onSave={val => updateStatut(logement.id, val)}
                        renderBadge={v => (
                          <Badge variante={STATUT_VARIANTE[v] ?? "muted"}>{STATUT_LABELS[v] ?? v}</Badge>
                        )}
                      />
                    )}
                  </div>

                  <Link href={`/immeubles/${id}/logements/${logement.id}`} onClick={e => e.stopPropagation()}>
                    <ChevronRight className="h-4 w-4 ml-1" style={{ color: "var(--fg-subtle)" }} />
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── Rénovations ── */}
        {onglet === "renovations" && aRenovations && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RenovationTracker immeubleId={id} />
          </motion.div>
        )}

        {/* ── Entretien ── */}
        {onglet === "entretien" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {demandesOuvertes.length === 0 ? (
              <EmptyState titre="Aucune demande ouverte" description="Toutes les demandes d'entretien sont traitées." />
            ) : (
              demandesOuvertes.map(d => {
                const log = logsImm.find(l => l.id === d.logementId);
                return (
                  <Link key={d.id} href={`/entretien/${d.id}`}>
                    <motion.div whileHover={{ x: 3 }} className="card flex items-center gap-3 px-4 py-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--warning-muted)" }}>
                        <Wrench className="h-4 w-4" style={{ color: "var(--warning)" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: "var(--fg)" }}>{d.titre}</p>
                        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{log?.numero}</p>
                      </div>
                      <Badge variante={d.priorite === "URGENTE" ? "danger" : d.priorite === "HAUTE" ? "warning" : "info"} pulse={d.priorite === "URGENTE"}>
                        {d.priorite === "URGENTE" ? "Urgent" : d.priorite === "HAUTE" ? "Haute" : "Normal"}
                      </Badge>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
