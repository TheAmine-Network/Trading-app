"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Wrench, Building2, User, Calendar, DollarSign,
  CheckCircle2, Circle, Clock, AlertTriangle, PlayCircle, XCircle,
} from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { PRIORITE_LABELS, PRIORITE_COLORS, STATUT_ENTRETIEN_LABELS, CATEGORIE_ENTRETIEN_LABELS } from "@/lib/constants";

const STATUTS_ORDRE = ["NOUVELLE", "EN_COURS", "EN_ATTENTE_PIECE", "TERMINEE"] as const;

export function EntretienDetail({ id }: { id: string }) {
  const { demandesEntretien, logements, immeubles, locataires, refresh } = useAppData();
  const [loading, setLoading] = useState<string | null>(null);

  const demande = demandesEntretien.find(d => d.id === id);

  if (!demande) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <div className="text-center">
          <Wrench className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-semibold" style={{ color: "var(--fg)" }}>Demande introuvable</p>
          <Link href="/entretien" className="mt-4 inline-flex items-center gap-2 text-sm" style={{ color: "var(--accent)" }}>
            <ArrowLeft className="h-4 w-4" />Retour à l&apos;entretien
          </Link>
        </div>
      </div>
    );
  }

  const logement = logements.find(l => l.id === demande.logementId);
  const immeuble = immeubles.find(i => i.id === logement?.immeubleId);
  const locataire = demande.locataireId ? locataires.find(l => l.id === demande.locataireId) : null;
  const statutActuelIndex = STATUTS_ORDRE.indexOf(demande.statut as (typeof STATUTS_ORDRE)[number]);
  const estTerminee = demande.statut === "TERMINEE" || demande.statut === "ANNULEE";

  async function changerStatut(statut: string) {
    setLoading(statut);
    await fetch(`/api/entretien/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    refresh();
    setLoading(null);
  }

  const prioriteColor = PRIORITE_COLORS[demande.priorite] as "danger" | "warning" | "info" | "muted";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* En-tête */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b px-5 py-4 backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "rgba(var(--bg-elevated), 0.85)" }}>
        <Link href="/entretien" className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--bg-tertiary)" }}>
          <ArrowLeft className="h-4 w-4" style={{ color: "var(--fg-muted)" }} />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold" style={{ color: "var(--fg)" }}>{demande.titre}</h1>
      </div>

      <div className="space-y-4 px-5 py-5">

        {/* Titre + badges */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variante={prioriteColor} pulse={demande.priorite === "URGENTE"}>
              {demande.priorite === "URGENTE" && <AlertTriangle className="h-3 w-3" />}
              {PRIORITE_LABELS[demande.priorite]}
            </Badge>
            <Badge variante={demande.statut === "TERMINEE" ? "success" : demande.statut === "NOUVELLE" ? "muted" : demande.statut === "EN_ATTENTE_PIECE" ? "warning" : "info"}>
              {STATUT_ENTRETIEN_LABELS[demande.statut]}
            </Badge>
            {demande.categorie && (
              <Badge variante="outline">{CATEGORIE_ENTRETIEN_LABELS[demande.categorie] ?? demande.categorie}</Badge>
            )}
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--fg)" }}>{demande.titre}</h2>
          {demande.description && <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>{demande.description}</p>}
        </motion.div>

        {/* ── Boutons d'action ──────────────────────────────────────────── */}
        {!estTerminee && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="card p-4">
            <p className="section-title mb-3">Actions</p>
            <div className="flex flex-wrap gap-2">
              {demande.statut === "NOUVELLE" && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => changerStatut("EN_COURS")}
                  disabled={loading !== null}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-blue)", opacity: loading ? 0.7 : 1 }}>
                  <PlayCircle className="h-4 w-4" />
                  {loading === "EN_COURS" ? "En cours..." : "Démarrer"}
                </motion.button>
              )}
              {demande.statut === "EN_COURS" && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => changerStatut("EN_ATTENTE_PIECE")}
                  disabled={loading !== null}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-warm)", opacity: loading ? 0.7 : 1 }}>
                  <Clock className="h-4 w-4" />
                  {loading === "EN_ATTENTE_PIECE" ? "..." : "En attente pièce"}
                </motion.button>
              )}
              {(demande.statut === "EN_COURS" || demande.statut === "EN_ATTENTE_PIECE") && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => changerStatut("TERMINEE")}
                  disabled={loading !== null}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-success)", opacity: loading ? 0.7 : 1 }}>
                  <CheckCircle2 className="h-4 w-4" />
                  {loading === "TERMINEE" ? "Sauvegarde..." : "Terminer"}
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => changerStatut("ANNULEE")}
                disabled={loading !== null}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{ background: "var(--danger-muted)", color: "var(--danger)", opacity: loading ? 0.7 : 1 }}>
                <XCircle className="h-4 w-4" />
                {loading === "ANNULEE" ? "..." : "Annuler"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="section-title mb-4">Progression</h3>
          <div className="space-y-0">
            {STATUTS_ORDRE.map((statut, index) => {
              const estPasse = index <= statutActuelIndex;
              const estActuel = index === statutActuelIndex;
              const estDernier = index === STATUTS_ORDRE.length - 1;
              return (
                <div key={statut} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                      style={{
                        background: estActuel ? "var(--accent)" : estPasse ? "var(--success)" : "var(--bg-tertiary)",
                        color: estPasse ? "white" : "var(--fg-muted)",
                      }}>
                      {estPasse && !estActuel ? <CheckCircle2 className="h-4 w-4" /> : estActuel ? <Clock className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    </div>
                    {!estDernier && (
                      <div className="my-1 h-6 w-0.5" style={{ background: index < statutActuelIndex ? "var(--success)" : "var(--border)" }} />
                    )}
                  </div>
                  <div className="pb-4 pt-0.5">
                    <p className="text-sm font-medium" style={{
                      color: estActuel ? "var(--accent)" : estPasse ? "var(--success)" : "var(--fg-subtle)"
                    }}>
                      {STATUT_ENTRETIEN_LABELS[statut]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Emplacement */}
        {(logement || immeuble) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
            <h3 className="section-title mb-3">Emplacement</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--info-muted)" }}>
                <Building2 className="h-5 w-5" style={{ color: "var(--info)" }} />
              </div>
              <div>
                {immeuble && <p className="font-medium" style={{ color: "var(--fg)" }}>{immeuble.nom}</p>}
                {logement && <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{logement.numero}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Locataire */}
        {locataire && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
            <h3 className="section-title mb-3">Locataire</h3>
            <Link href={`/locataires/${locataire.id}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
                  {locataire.prenom[0]}
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--fg)" }}>{locataire.prenom} {locataire.nom}</p>
                  {locataire.telephone && <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{locataire.telephone}</p>}
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Détails */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
          <h3 className="section-title mb-3">Détails</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                <Calendar className="h-4 w-4" /><span>Ouverture</span>
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>{formatDate(demande.dateOuverture)}</span>
            </div>
            {demande.dateFermeture && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                  <CheckCircle2 className="h-4 w-4" /><span>Fermeture</span>
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>{formatDate(demande.dateFermeture)}</span>
              </div>
            )}
            {demande.cout !== undefined && demande.cout > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                  <DollarSign className="h-4 w-4" /><span>Coût</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--danger)" }}>{formatCAD(demande.cout)}</span>
              </div>
            )}
            {demande.fournisseurAssigne && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                  <User className="h-4 w-4" /><span>Fournisseur</span>
                </div>
                <span className="text-sm font-medium text-right max-w-[180px]" style={{ color: "var(--fg)" }}>{demande.fournisseurAssigne}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notes */}
        {demande.notes && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl px-4 py-3" style={{ background: "var(--warning-muted)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--warning)" }}>Notes</p>
            <p className="mt-1 text-sm" style={{ color: "var(--fg)" }}>{demande.notes}</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
