"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft, Home, User, FileText, Wrench, Thermometer,
  Zap, Droplets, Car, Package, Check, X, Phone, Mail as MailIcon
} from "lucide-react";
import Link from "next/link";
import {
  logements, locataires, baux, demandesEntretien, transactions, immeubles
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

interface LogementDetailProps {
  immeubleId: string;
  logementId: string;
}

export function LogementDetail({ immeubleId, logementId }: LogementDetailProps) {
  const logement = logements.find((l) => l.id === logementId);
  const immeuble = immeubles.find((i) => i.id === immeubleId);

  if (!logement || !immeuble) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <EmptyState titre="Logement introuvable" description="Ce logement n'existe pas." />
      </div>
    );
  }

  const locataire = locataires.find((l) => l.logementId === logementId);
  const bailActif = baux.find(
    (b) => b.logementId === logementId && b.statut === "ACTIF"
  );
  const demandesLog = demandesEntretien.filter((d) => d.logementId === logementId);
  const txLog = transactions
    .filter((t) => t.logementId === logementId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const inclusions = [
    { label: "Chauffage", actif: logement.inclChauffage, icone: <Thermometer className="h-3.5 w-3.5" /> },
    { label: "Eau chaude", actif: logement.inclEauChaude, icone: <Droplets className="h-3.5 w-3.5" /> },
    { label: "Électricité", actif: logement.inclElectricite, icone: <Zap className="h-3.5 w-3.5" /> },
    { label: "Stationnement", actif: logement.inclStationnement, icone: <Car className="h-3.5 w-3.5" /> },
    { label: "Rangement", actif: logement.inclRangement, icone: <Package className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="flex items-center gap-3">
          <Link
            href={`/immeubles/${immeubleId}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {logement.numero}
            </h1>
            <p className="text-xs text-gray-500">{immeuble.nom}</p>
          </div>
          <div className="ml-auto">
            <Badge variante={STATUT_VARIANTE[logement.statut]}>
              {STATUT_LABELS[logement.statut]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Stats loyer */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200/80 bg-white px-3 py-3 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCAD(logement.loyerMensuel)}
            </p>
            <p className="text-xs text-gray-500">/mois</p>
          </div>
          <div className="rounded-xl border border-gray-200/80 bg-white px-3 py-3 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {logement.nbChambres}
            </p>
            <p className="text-xs text-gray-500">chambres</p>
          </div>
          <div className="rounded-xl border border-gray-200/80 bg-white px-3 py-3 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {logement.superficie ?? "—"}
            </p>
            <p className="text-xs text-gray-500">pi²</p>
          </div>
        </div>

        {/* Inclusions */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Inclusions</h2>
          <div className="grid grid-cols-5 gap-2">
            {inclusions.map((incl) => (
              <div
                key={incl.label}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center ${
                  incl.actif
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-50 text-gray-400 dark:bg-gray-800"
                }`}
              >
                {incl.icone}
                <span className="text-[9px] font-medium leading-tight">{incl.label}</span>
                {incl.actif ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <X className="h-2.5 w-2.5 opacity-40" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Locataire actuel */}
        {locataire ? (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 text-sm font-semibold text-gray-500">Locataire actuel</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-lg font-bold dark:bg-blue-900/30 dark:text-blue-400">
                {locataire.prenom[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {locataire.prenom} {locataire.nom}
                </p>
                {locataire.email && (
                  <p className="text-xs text-gray-500">{locataire.email}</p>
                )}
              </div>
              <Link href={`/locataires/${locataire.id}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </Link>
            </div>
            {locataire.telephone && (
              <div className="mt-3 flex gap-2">
                <a
                  href={`tel:${locataire.telephone}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 py-2 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
                {locataire.email && (
                  <a
                    href={`mailto:${locataire.email}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    <MailIcon className="h-4 w-4" />
                    Courriel
                  </a>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-900">
            <User className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">Aucun locataire actuellement</p>
          </div>
        )}

        {/* Bail actif */}
        {bailActif && (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500">Bail actif</h2>
              <Badge variante="success">Actif</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Début</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(bailActif.dateDebut)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fin</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(bailActif.dateFin)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loyer</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatCAD(bailActif.loyerMensuel)}/mois</span>
              </div>
              {bailActif.augmentationAnnuelle && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Augmentation annuelle</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{bailActif.augmentationAnnuelle} %</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historique transactions */}
        {txLog.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">
              Transactions récentes
            </h2>
            <div className="space-y-2">
              {txLog.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      tx.type === "REVENU"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {tx.type === "REVENU" ? "+" : "-"}
                    {formatCAD(tx.montant)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {logement.notes && (
          <div className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Notes</p>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-300">{logement.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
