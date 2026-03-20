"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Home,
  ChevronRight, Wrench, FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  immeubles, logements, locataires, demandesEntretien, transactions
} from "@/lib/mock-data";
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

interface ImmeubleDetailProps {
  id: string;
}

export function ImmeubleDetail({ id }: ImmeubleDetailProps) {
  const immeuble = immeubles.find((i) => i.id === id);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero avec photo */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
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
            <Home className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Bouton retour */}
        <Link
          href="/immeubles"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Titre en overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <Badge variante="default" className="mb-2 bg-white/90 text-gray-800">
            {immeuble.type === "TRIPLEX" ? "Triplex" : "Duplex"}
          </Badge>
          <h1 className="text-2xl font-bold text-white">{immeuble.nom}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
            <MapPin className="h-3.5 w-3.5" />
            {immeuble.adresse}, {immeuble.ville}
          </p>
        </div>
      </div>

      <div className="space-y-6 px-5 py-5">
        {/* Infos clés */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Revenus/mois",
              valeur: formatCAD(revenusMensuels),
              icone: <DollarSign className="h-4 w-4 text-green-600" />,
              couleur: "bg-green-50 dark:bg-green-900/20",
            },
            {
              label: "Logements",
              valeur: `${logsImm.filter((l) => l.statut === "OCCUPE").length}/${logsImm.length}`,
              icone: <Home className="h-4 w-4 text-blue-600" />,
              couleur: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
              label: "Entretien",
              valeur: demandesOuvertes.length.toString(),
              icone: <Wrench className="h-4 w-4 text-orange-600" />,
              couleur: "bg-orange-50 dark:bg-orange-900/20",
            },
          ].map((info) => (
            <div
              key={info.label}
              className={`rounded-xl ${info.couleur} border border-gray-200/50 px-3 py-3 text-center dark:border-gray-700/50`}
            >
              <div className="mb-1 flex justify-center">{info.icone}</div>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                {info.valeur}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{info.label}</p>
            </div>
          ))}
        </div>

        {/* Détails de l'immeuble */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Informations
          </h2>
          <div className="space-y-2.5">
            {immeuble.anneeConstruct && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Année de construction</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {immeuble.anneeConstruct}
                </span>
              </div>
            )}
            {immeuble.dateAchat && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Date d&apos;achat</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(immeuble.dateAchat)}
                </span>
              </div>
            )}
            {immeuble.prixAchat && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Prix d&apos;achat</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCAD(immeuble.prixAchat)}
                </span>
              </div>
            )}
            {immeuble.valeurMunicipale && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Valeur municipale</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCAD(immeuble.valeurMunicipale)}
                </span>
              </div>
            )}
            {immeuble.codePostal && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Code postal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {immeuble.codePostal}
                </span>
              </div>
            )}
            {immeuble.numeroLot && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Numéro de lot</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {immeuble.numeroLot}
                </span>
              </div>
            )}
          </div>
          {immeuble.notes && (
            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {immeuble.notes}
            </div>
          )}
        </div>

        {/* Logements */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Logements ({logsImm.length})
          </h2>
          <div className="space-y-2">
            {logsImm.map((logement) => {
              const locataire = locataires.find((l) => l.logementId === logement.id);
              return (
                <Link
                  key={logement.id}
                  href={`/immeubles/${id}/logements/${logement.id}`}
                >
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                      <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {logement.numero}
                        </p>
                        <Badge variante={STATUT_VARIANTE[logement.statut]}>
                          {STATUT_LABELS[logement.statut]}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {locataire
                          ? `${locataire.prenom} ${locataire.nom}`
                          : "Vacant"}
                        {logement.superficie && ` · ${logement.superficie} pi²`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCAD(logement.loyerMensuel)}
                      </p>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Demandes d'entretien */}
        {demandesOuvertes.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Entretien en cours ({demandesOuvertes.length})
              </h2>
              <Link href="/entretien" className="text-xs text-blue-600 dark:text-blue-400">
                Voir tout
              </Link>
            </div>
            <div className="space-y-2">
              {demandesOuvertes.map((d) => {
                const log = logsImm.find((l) => l.id === d.logementId);
                return (
                  <Link key={d.id} href={`/entretien/${d.id}`}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <Wrench className="h-4 w-4 flex-shrink-0 text-orange-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {d.titre}
                        </p>
                        <p className="text-xs text-gray-500">{log?.numero}</p>
                      </div>
                      <Badge variante={d.priorite === "URGENTE" ? "danger" : d.priorite === "HAUTE" ? "warning" : "info"} pulse={d.priorite === "URGENTE"}>
                        {d.priorite === "URGENTE" ? "Urgent" : d.priorite === "HAUTE" ? "Haute" : "Normal"}
                      </Badge>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
