"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, DollarSign, Home,
  ChevronRight, Wrench, FileText, Hammer, User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  immeubles, logements, locataires, demandesEntretien,
} from "@/lib/mock-data";
import { travauxAnjou } from "@/lib/renovations";
import { RenovationTracker } from "./RenovationTracker";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const STATUT_LABELS: Record<string, string> = {
  OCCUPE: "Occupé",
  VACANT: "Vacant",
  EN_RENOVATION: "En rénovation",
};

const STATUT_VARIANTE: Record<string, "success" | "warning" | "info"> = {
  OCCUPE: "success",
  VACANT: "warning",
  EN_RENOVATION: "info",
};

const TYPE_LABELS: Record<string, string> = {
  TRIPLEX: "Triplex",
  DUPLEX: "Duplex",
  QUADRUPLEX: "Quadruplex",
  IMMEUBLE: "Immeuble",
  MAISON: "Maison",
  CONDO: "Condo",
};

type Onglet = "info" | "logements" | "renovations" | "entretien";

interface ImmeubleDetailProps {
  id: string;
}

export function ImmeubleDetail({ id }: ImmeubleDetailProps) {
  const immeuble = immeubles.find((i) => i.id === id);
  const [onglet, setOnglet] = useState<Onglet>("info");

  if (!immeuble) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <EmptyState
          titre="Immeuble introuvable"
          description="Cet immeuble n'existe pas ou a été supprimé."
        />
      </div>
    );
  }

  const logsImm = logements.filter((l) => l.immeubleId === id);
  const revenusMensuels = logsImm
    .filter((l) => l.statut === "OCCUPE")
    .reduce((sum, l) => sum + l.loyerMensuel, 0);

  const demandesImm = demandesEntretien.filter((d) =>
    logsImm.some((l) => l.id === d.logementId)
  );
  const demandesOuvertes = demandesImm.filter(
    (d) => d.statut !== "TERMINEE" && d.statut !== "ANNULEE"
  );

  const aRenovations = travauxAnjou.some(t => t.immeubleId === id);
  const nbRenovations = travauxAnjou.filter(t => t.immeubleId === id).length;

  const onglets: { id: Onglet; label: string; count?: number }[] = [
    { id: "info", label: "Infos" },
    { id: "logements", label: "Logements", count: logsImm.length },
    ...(aRenovations ? [{ id: "renovations" as Onglet, label: "Rénovations", count: nbRenovations }] : []),
    ...(demandesOuvertes.length > 0 ? [{ id: "entretien" as Onglet, label: "Entretien", count: demandesOuvertes.length }] : []),
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Hero avec photo ──────────────────────────────────────────── */}
      <div className="relative h-64 w-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
        {immeuble.photoUrl ? (
          <Image
            src={immeuble.photoUrl}
            alt={immeuble.nom}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Home className="h-16 w-16" style={{ color: "var(--fg-subtle)" }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Bouton retour */}
        <Link
          href="/immeubles"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Titre en overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <div className="mb-2 flex flex-wrap gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.9)", color: "#1c1c1e" }}
            >
              {TYPE_LABELS[immeuble.type] ?? immeuble.type}
            </span>
            {id === "imm_duplex_anjou" && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ background: "rgba(88,86,214,0.85)", color: "white" }}
              >
                Centris 10602915
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            {immeuble.nom}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
            <MapPin className="h-3.5 w-3.5" />
            {immeuble.adresse}, {immeuble.ville}
          </p>
        </div>
      </div>

      {/* ── Stats rapides ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        {[
          {
            label: "Revenus/mois",
            valeur: revenusMensuels > 0 ? formatCAD(revenusMensuels) : "—",
            icone: <DollarSign className="h-4 w-4" />,
            gradient: "linear-gradient(135deg, #34c759, #28a745)",
          },
          {
            label: "Logements",
            valeur: `${logsImm.filter((l) => l.statut === "OCCUPE").length}/${logsImm.length}`,
            icone: <Home className="h-4 w-4" />,
            gradient: "linear-gradient(135deg, #007aff, #5856d6)",
          },
          {
            label: "Entretien",
            valeur: demandesOuvertes.length.toString(),
            icone: <Wrench className="h-4 w-4" />,
            gradient: demandesOuvertes.length > 0
              ? "linear-gradient(135deg, #ff9f0a, #ff6b00)"
              : "linear-gradient(135deg, #8e8e93, #636366)",
          },
        ].map((info) => (
          <div
            key={info.label}
            className="card flex flex-col items-center py-3 text-center"
          >
            <div
              className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl text-white"
              style={{ background: info.gradient }}
            >
              {info.icone}
            </div>
            <p className="text-base font-bold tabular-nums" style={{ color: "var(--fg)" }}>
              {info.valeur}
            </p>
            <p className="text-[10px] font-medium" style={{ color: "var(--fg-muted)" }}>
              {info.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Onglets ──────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 flex gap-1 overflow-x-auto px-5 pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ background: "var(--bg)" }}
      >
        {onglets.map(o => (
          <button
            key={o.id}
            onClick={() => setOnglet(o.id)}
            className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={
              onglet === o.id
                ? { background: "var(--gradient-brand)", color: "white" }
                : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }
            }
          >
            {o.label}
            {o.count !== undefined && (
              <span
                className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]"
                style={
                  onglet === o.id
                    ? { background: "rgba(255,255,255,0.25)" }
                    : { background: "var(--border)", color: "var(--fg-muted)" }
                }
              >
                {o.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Contenu par onglet ───────────────────────────────────────── */}
      <div className="space-y-4 px-5 pb-8">

        {/* Infos */}
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
                <div
                  className="mt-4 rounded-xl px-3 py-3 text-sm"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg-secondary)", lineHeight: "1.6" }}
                >
                  {immeuble.notes}
                </div>
              )}
            </div>

            {/* Rentabilité pour Anjou */}
            {id === "imm_duplex_anjou" && (
              <div
                className="rounded-2xl p-4"
                style={{ background: "var(--gradient-brand-subtle)", border: "1px solid var(--accent-muted)" }}
              >
                <p className="section-title mb-3" style={{ color: "var(--accent)" }}>
                  Indicateurs de rentabilité
                </p>
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
                      <p className="mt-0.5 text-base font-bold tabular-nums" style={{ color: "var(--fg)", letterSpacing: "-0.01em" }}>
                        {m.valeur}
                      </p>
                      <p className="mt-0.5 text-[10px]" style={{ color: "var(--fg-subtle)" }}>{m.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Logements */}
        {onglet === "logements" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {logsImm.map((logement) => {
              const locataire = locataires.find((l) => l.logementId === logement.id);
              const isProprietaire = (logement as typeof logement & { proprietaireOccupant?: boolean }).proprietaireOccupant;

              return (
                <Link key={logement.id} href={`/immeubles/${id}/logements/${logement.id}`}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="card flex items-center gap-3 px-4 py-4"
                  >
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl"
                      style={{ background: isProprietaire ? "var(--gradient-warm)" : "var(--gradient-blue)" }}
                    >
                      {isProprietaire ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Home className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>
                          {logement.numero}
                        </p>
                        <Badge variante={STATUT_VARIANTE[logement.statut]}>
                          {STATUT_LABELS[logement.statut]}
                        </Badge>
                        {isProprietaire && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ background: "var(--warning-muted)", color: "var(--warning)" }}
                          >
                            Propriétaire occupant
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--fg-muted)" }}>
                        {locataire
                          ? `${locataire.prenom} ${locataire.nom}`
                          : isProprietaire ? "Amine (propriétaire)" : "Vacant"}
                        {logement.superficie ? ` · ${logement.superficie} pi²` : ""}
                        {logement.nbChambres ? ` · ${logement.nbChambres} ch.` : ""}
                        {logement.nbSallesBain ? ` · ${logement.nbSallesBain} sdb` : ""}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm font-bold" style={{ color: isProprietaire ? "var(--fg-muted)" : "var(--fg)" }}>
                        {isProprietaire ? "Uso proprio" : logement.loyerMensuel > 0 ? formatCAD(logement.loyerMensuel) : "Vacant"}
                      </p>
                      <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--fg-subtle)" }} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}

        {/* Rénovations */}
        {onglet === "renovations" && aRenovations && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RenovationTracker immeubleId={id} />
          </motion.div>
        )}

        {/* Entretien */}
        {onglet === "entretien" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {demandesOuvertes.length === 0 ? (
              <EmptyState titre="Aucune demande ouverte" description="Toutes les demandes d'entretien sont traitées." />
            ) : (
              demandesOuvertes.map((d) => {
                const log = logsImm.find((l) => l.id === d.logementId);
                return (
                  <Link key={d.id} href={`/entretien/${d.id}`}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="card flex items-center gap-3 px-4 py-3"
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "var(--warning-muted)" }}
                      >
                        <Wrench className="h-4 w-4" style={{ color: "var(--warning)" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: "var(--fg)" }}>
                          {d.titre}
                        </p>
                        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{log?.numero}</p>
                      </div>
                      <Badge
                        variante={d.priorite === "URGENTE" ? "danger" : d.priorite === "HAUTE" ? "warning" : "info"}
                        pulse={d.priorite === "URGENTE"}
                      >
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
