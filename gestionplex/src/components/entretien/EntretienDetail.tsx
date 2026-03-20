"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wrench,
  Building2,
  User,
  Calendar,
  DollarSign,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  demandesEntretien,
  logements,
  immeubles,
  locataires,
} from "@/lib/mock-data";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import {
  PRIORITE_LABELS,
  PRIORITE_COLORS,
  STATUT_ENTRETIEN_LABELS,
  CATEGORIE_ENTRETIEN_LABELS,
} from "@/lib/constants";

const STATUTS_ORDRE = [
  "NOUVELLE",
  "EN_COURS",
  "EN_ATTENTE_PIECE",
  "TERMINEE",
] as const;

function getStatutIndex(statut: string) {
  return STATUTS_ORDRE.indexOf(statut as (typeof STATUTS_ORDRE)[number]);
}

export function EntretienDetail({ id }: { id: string }) {
  const demande = demandesEntretien.find((d) => d.id === id);

  if (!demande) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <div className="text-center">
          <Wrench className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Demande introuvable
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Cette demande d&apos;entretien n&apos;existe pas.
          </p>
          <Link
            href="/entretien"
            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;entretien
          </Link>
        </div>
      </div>
    );
  }

  const logement = logements.find((l) => l.id === demande.logementId);
  const immeuble = immeubles.find((i) => i.id === logement?.immeubleId);
  const locataire = demande.locataireId
    ? locataires.find((l) => l.id === demande.locataireId)
    : null;

  const prioriteColor = PRIORITE_COLORS[demande.priorite] as
    | "danger"
    | "warning"
    | "info"
    | "muted";

  const statutActuelIndex = getStatutIndex(demande.statut);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="flex items-center gap-3">
          <Link
            href="/entretien"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-gray-900 dark:text-gray-100">
              {demande.titre}
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Titre + badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variante={prioriteColor} pulse={demande.priorite === "URGENTE"}>
              {demande.priorite === "URGENTE" && (
                <AlertTriangle className="h-3 w-3" />
              )}
              {PRIORITE_LABELS[demande.priorite]}
            </Badge>
            <Badge
              variante={
                demande.statut === "TERMINEE"
                  ? "success"
                  : demande.statut === "NOUVELLE"
                  ? "muted"
                  : demande.statut === "EN_ATTENTE_PIECE"
                  ? "warning"
                  : "info"
              }
            >
              {STATUT_ENTRETIEN_LABELS[demande.statut]}
            </Badge>
            {demande.categorie && (
              <Badge variante="outline">
                {CATEGORIE_ENTRETIEN_LABELS[demande.categorie] ?? demande.categorie}
              </Badge>
            )}
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {demande.titre}
          </h2>
          {demande.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {demande.description}
            </p>
          )}
        </motion.div>

        {/* Timeline statuts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 className="mb-4 text-sm font-semibold text-gray-500">
            Progression
          </h3>
          <div className="space-y-0">
            {STATUTS_ORDRE.map((statut, index) => {
              const estPasse = index <= statutActuelIndex;
              const estActuel = index === statutActuelIndex;
              const estDernier = index === STATUTS_ORDRE.length - 1;

              return (
                <div key={statut} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                        estPasse
                          ? estActuel
                            ? "bg-blue-600 text-white"
                            : "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                      }`}
                    >
                      {estPasse && !estActuel ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : estActuel ? (
                        <Clock className="h-3.5 w-3.5" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" />
                      )}
                    </div>
                    {!estDernier && (
                      <div
                        className={`my-1 h-6 w-0.5 ${
                          index < statutActuelIndex
                            ? "bg-green-400"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-4 pt-0.5">
                    <p
                      className={`text-sm font-medium ${
                        estActuel
                          ? "text-blue-600 dark:text-blue-400"
                          : estPasse
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {STATUT_ENTRETIEN_LABELS[statut]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bâtiment + logement */}
        {(logement || immeuble) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-500">
              Emplacement
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                {immeuble && (
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {immeuble.nom}
                  </p>
                )}
                {logement && (
                  <p className="text-sm text-gray-500">{logement.numero}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Locataire */}
        {locataire && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-500">
              Locataire
            </h3>
            <Link href={`/locataires/${locataire.id}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold dark:bg-purple-900/30 dark:text-purple-400">
                  {locataire.prenom[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {locataire.prenom} {locataire.nom}
                  </p>
                  {locataire.telephone && (
                    <p className="text-sm text-gray-500">
                      {locataire.telephone}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Dates + coût + fournisseur */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-500">Détails</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Date d&apos;ouverture</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(demande.dateOuverture)}
              </span>
            </div>

            {demande.dateFermeture && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Date de fermeture</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(demande.dateFermeture)}
                </span>
              </div>
            )}

            {demande.cout !== undefined && demande.cout > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span>Coût</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  {formatCAD(demande.cout)}
                </span>
              </div>
            )}

            {demande.fournisseurAssigne && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Fournisseur</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right max-w-[180px]">
                  {demande.fournisseurAssigne}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notes */}
        {demande.notes && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20"
          >
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Notes
            </p>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-300">
              {demande.notes}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
